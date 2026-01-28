import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const allowedExtensions = ['pdf', 'md', 'markdown'];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile);
      } else {
        showNotification("Only PDF and Markdown files are allowed.", "error");
        e.target.value = null;
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file first.", "error");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFileName(data.fileName);
        showNotification(data.message || "File uploaded and processed successfully!", "success");
        setChatHistory(prev => [...prev, { type: 'bot', text: `I've read "${data.fileName}". Ask me anything about it!` }]);
      } else {
        showNotification(data.message || "Failed to upload file.", "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification("Error connecting to server.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setChatHistory(prev => [...prev, { type: 'user', text: userMessage }]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatHistory(prev => [...prev, { type: 'bot', text: data.reply }]);
      } else {
        let errorMessage = data.message || "Something went wrong.";
        
        // Handle specific 429/Quota errors if they appear in the message
        if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
          errorMessage = "Usage quota exceeded. Please try again later.";
        }

        setChatHistory(prev => [...prev, { type: 'bot', text: `Error: ${errorMessage}` }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prev => [...prev, { type: 'bot', text: "Error connecting to server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>NotebookLM Clone</h1>
      </header>
      
      <div className="main-content">
        <div className="sidebar">
          <div className="upload-section">
            <h3>Sources</h3>
            <input type="file" accept=".pdf,.md,.markdown" onChange={handleFileChange} className="file-input" />
            <button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="upload-btn"
            >
              {uploading ? "Uploading..." : "Upload PDF or MD"}
            </button>
            {fileName && <div className="file-badge">📄 {fileName}</div>}
          </div>
        </div>

        <div className="chat-area">
          <div className="messages-list">
            {chatHistory.length === 0 && (
              <div className="empty-state">
                <p>Upload a PDF or MD file to get started.</p>
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.type === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              </div>
            ))}
            {isTyping && <div className="message bot"><div className="message-content">Thinking...</div></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your source..."
              disabled={isTyping}
            />
            <button onClick={handleSend} disabled={!message.trim() || isTyping}>
              ➤
            </button>
          </div>
        </div>
      </div>
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;