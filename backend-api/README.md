<details>
<summary><strong>🇰🇷 한국어 설명 (Korean Description)</strong></summary>

# NotebookLM-like-app 백엔드 API

NotebookLM에서 영감을 받은 간단한 백엔드 API로, PDF 및 마크다운 문서를 처리하고 해당 내용을 바탕으로 질문에 답변하는 기능을 제공합니다. 구글의 Gemini API를 사용합니다.

## 주요 기능

- **문서 업로드:** PDF (`.pdf`) 및 마크다운 (`.md`, `.markdown`) 파일을 지원합니다.
- **문맥 기반 채팅:** 업로드된 문서의 내용에 근거해서만 답변을 제공합니다.
- **근거 제시:** 답변을 뒷받침하는 문서 내의 인용구 또는 요약을 함께 제공합니다.
- **Gemini 연동:** 구글의 최신 Gemini 모델을 사용하여 지능적인 답변을 생성합니다.
- **견고한 에러 처리:** API 호출 빈도 제한(Rate Limit)에 대한 재시도 로직과 통일된 JSON 에러 응답 형식을 포함합니다.

## 필수 조건

- Node.js (v18 이상 권장)
- Google Gemini API 키

## 설치 및 설정

1.  **저장소를 복제**하고 `backend-api` 디렉토리로 이동합니다.
2.  **의존성 패키지 설치:**
    ```bash
    npm install
    ```
3.  **환경 변수 설정:**
    루트 디렉토리에 `.env` 파일을 생성하고 Gemini API 키를 입력합니다:
    ```env
    GEMINI_API_KEY=여기에_API_키_입력
    SVR_PORT=3001
    ```

## 사용 방법

### 1. 서버 실행
```bash
npm start
# 또는 개발 모드 (자동 재시작):
npm run dev
```
서버는 3001번 포트(또는 `.env`에 설정된 포트)에서 실행됩니다.

### 2. API 엔드포인트

#### 문서 업로드
- **URL:** `/api/upload`
- **Method:** `POST`
- **Body:** `form-data` 형식, `file` 키에 문서 파일을 첨부.
- **응답 (성공 시):**
  ```json
  {
    "success": true,
    "message": "File processed successfully",
    "fileName": "example.pdf"
  }
  ```

#### 문서와 채팅하기
- **URL:** `/api/chat`
- **Method:** `POST`
- **Body:** JSON
  ```json
  {
    "message": "이 문서의 주요 주제가 뭐야?"
  }
  ```
- **응답 (성공 시):**
  ```json
  {
    "success": true,
    "message": "Success",
    "reply": "**Answer:** ... **Evidence:** ..."
  }
  ```
  
</details>

---

# NotebookLM-like Backend API

A simple backend API inspired by NotebookLM, capable of processing PDF and Markdown documents and answering questions based on their content using Google's Gemini API.

## Features

- **Document Upload:** Supports PDF (`.pdf`) and Markdown (`.md`, `.markdown`) files.
- **Context-Aware Chat:** Answers questions strictly based on the uploaded document's content.
- **Evidence Citation:** Provides verbatim quotes or summaries from the document to support answers.
- **Gemini Integration:** Utilizes Google's Gemini models for intelligent text generation.
- **Robust Error Handling:** Includes retry logic for rate limits and standardized JSON error responses.

## Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

## Setup

1.  **Clone the repository** and navigate to the `backend-api` directory.
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    SVR_PORT=3001
    ```

## Usage

### 1. Start the Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```
The server will start on port 3001 (or the port specified in `.env`).

### 2. API Endpoints

#### Upload Document
- **URL:** `/api/upload`
- **Method:** `POST`
- **Body:** `form-data` with a key `file` containing the document.
- **Response:**
  ```json
  {
    "success": true,
    "message": "File processed successfully",
    "fileName": "example.pdf"
  }
  ```

#### Chat with Document
- **URL:** `/api/chat`
- **Method:** `POST`
- **Body:** JSON
  ```json
  {
    "message": "What is the main topic of the document?"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Success",
    "reply": "**Answer:** ... **Evidence:** ..."
  }
  ```

