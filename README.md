# NotebookLM-like Application

<details>
<summary>🇰🇷 한국어 설명 (Korean Description)</summary>

## 프로젝트 개요
이 프로젝트는 구글의 **NotebookLM**과 유사한 기능을 제공하는 웹 애플리케이션입니다. 사용자는 **PDF** 또는 **Markdown** 파일을 업로드할 수 있으며, 업로드된 문서의 내용을 바탕으로 AI와 대화하며 질문에 대한 답변을 받을 수 있습니다.

## 주요 기능
- **문서 업로드**: PDF 및 Markdown (.md) 파일을 지원합니다.
- **문맥 기반 채팅**: 업로드된 문서의 내용을 문맥으로 사용하여 정확한 답변을 제공합니다.
- **근거 제시**: 답변과 함께 문서 내의 근거(Evidence)를 제시합니다.

## 설치 및 실행 방법

### 1. 사전 요구 사항
- Node.js 및 npm이 설치되어 있어야 합니다.
- [Google AI Studio](https://aistudio.google.com/)에서 발급받은 **Gemini API Key**가 필요합니다.

### 2. 백엔드 설정 (backend-api)
터미널을 열고 `backend-api` 디렉토리로 이동하여 다음을 수행합니다.

```bash
cd backend-api
npm install
```

`.env` 파일을 생성하고 다음과 같이 API 키를 설정합니다 (예시: `.env.example` 참고).
```env
GEMINI_API_KEY=your_google_api_key_here
SVR_PORT=3001
```

서버 실행:
```bash
npm start
# 또는 개발 모드: npm run dev
```

### 3. 프론트엔드 설정 (nblm-like-app)
새 터미널을 열고 `nblm-like-app` 디렉토리로 이동하여 다음을 수행합니다.

```bash
cd nblm-like-app
npm install
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 사용합니다.

</details>

---

## Overview

This is a web application inspired by **Google's NotebookLM**. It allows users to upload **PDF** or **Markdown** documents and interact with an intelligent assistant. The AI answers questions strictly based on the content of the uploaded files, citing evidence for its responses.

## Features

-   **Document Support**: Upload PDF documents or Markdown files.
-   **RAG (Retrieval-Augmented Generation)**: Answers are generated using only the provided document context.
-   **Citation**: The AI provides specific quotes or summaries ("Evidence") from the document to support its answers.
-   **Modern UI**: Clean and responsive React-based interface.

## Project Structure

-   `backend-api/`: Node.js/Express server. Handles file parsing (using `pdf-parse`) and communicates with the Google Gemini API.
-   `nblm-like-app/`: React frontend. Manages file uploads and the chat interface.

## Prerequisites

-   **Node.js** (v14+ recommended)
-   **npm**
-   A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/))

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend-api
```

Install dependencies:

```bash
npm install
```

**Configuration:**
Create a `.env` file in the `backend-api` directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
SVR_PORT=3001
```
*(You can rename `.env.example` to `.env` if provided)*

Start the server:

```bash
npm start
# Runs on http://localhost:3001
```

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd nblm-like-app
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

The app should automatically open in your browser at `http://localhost:3000`.

## Usage

1.  Ensure both the backend server (port 3001) and frontend dev server (port 3000) are running.
2.  Open the web interface.
3.  Click "Upload PDF or MD" to select a source document.
4.  Once processed, type your question in the chat box.
5.  Receive an answer with supporting evidence from the document.

## Tech Stack

-   **Frontend**: React, React Markdown
-   **Backend**: Node.js, Express, Multer
-   **AI Model**: Google Gemini (`gemini-3-flash-preview` or similar) via `@google/genai` SDK
