import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.SVR_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for the latest uploaded document content (PDF or Markdown)
// In a production app, this should be a database or vector store
let documentContext = "";
let sourceFileName = "";

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Gemini Client Setup
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Endpoint: Upload Document (PDF or Markdown)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();
    let textContent = "";

    if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
      const buffer = req.file.buffer;
      const pdfParser = new PDFParse({ data: buffer });
      const data = await pdfParser.getText();
      textContent = data.text;
    } else if (
      mimeType === 'text/markdown' || 
      mimeType === 'text/x-markdown' || 
      mimeType === 'text/plain' ||
      originalName.endsWith('.md') || 
      originalName.endsWith('.markdown')
    ) {
      textContent = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ success: false, message: "Unsupported file type. Please upload a PDF or Markdown file." });
    }
    
    documentContext = textContent;
    sourceFileName = req.file.originalname;

    console.log(`Loaded File: ${sourceFileName}, Length: ${documentContext.length}`);
    
    res.json({ success: true, message: "File processed successfully", fileName: sourceFileName });
  } catch (error) {
    console.error("Error processing file:", error);
    let errorMessage = error.message || String(error);
    try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error && parsed.error.message) {
            errorMessage = parsed.error.message;
        }
    } catch (e) {
        // Not a JSON string, keep original message
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Endpoint: Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (!documentContext) {
      return res.status(400).json({ success: false, message: "No document context loaded. Please upload a file first." });
    }

    // Construct the prompt
    const prompt = `
You are an intelligent assistant capable of answering questions based on the provided text.
Your goal is to answer the user's question accurately using ONLY the context provided below.
If the answer is not contained in the context, explicitly state that you cannot answer based on the provided document.

After providing the answer, you MUST provide the "Evidence" or "Basis" for your answer. 
Extract verbatim quotes or summarize the specific section that supports your answer.

Format your response as follows:
**Answer:**
[Your Answer Here]

**Evidence:**
- [Quote 1]
- [Quote 2]

Context:
${documentContext}

Question:
${message}
`;

    // Retry logic for 429 errors
    let retries = 0;
    const maxRetries = 3;
    let result;
    let lastError = null;

    while (retries < maxRetries) {
      try {
        result = await genAI.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        break; // Success, exit loop
      } catch (err) {
        lastError = err;
        if (err.status === 429) {
          retries++;
          console.log(`Rate limit hit. Retrying in ${retries * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retries * 2000));
        } else {
          throw err; // Re-throw other errors
        }
      }
    }

    if (!result) {
        const errorMessage = lastError ? (lastError.message || JSON.stringify(lastError)) : "Unknown error";
        return res.status(429).json({ success: false, message: `Rate limit hit: ${errorMessage}` });
    }

    let text = "No response generated.";
    if (result && result.response && typeof result.response.text === 'function') {
        text = result.response.text();
    } else if (result && result.candidates && result.candidates.length > 0) {
        text = result.candidates[0].content?.parts?.[0]?.text || text;
    }

    res.json({ success: true, message: "Success", reply: text });

  } catch (error) {
    console.error("Error generating response:", error);
    let errorMessage = error.message || String(error);
    try {
      const parsed = JSON.parse(errorMessage);
      if (parsed.error && parsed.error.message) {
        errorMessage = parsed.error.message;
      }
    } catch (e) {
      // Not a JSON string, keep original message
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
