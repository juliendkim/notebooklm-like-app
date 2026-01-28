<details>
<summary><strong>🇰🇷 한국어 설명 (Korean Description)</strong></summary>

# NotebookLM 클론

Google NotebookLM의 핵심 기능을 모방한 React 기반 웹 애플리케이션입니다. 사용자가 PDF나 Markdown 파일을 업로드하고, 백엔드 LLM과 연동된 채팅 인터페이스를 통해 문서 내용에 대해 질문할 수 있습니다.

## 주요 기능

-   **소스 업로드**: `.pdf` 및 `.md` (마크다운) 파일 업로드 지원.
-   **채팅 인터페이스**: 업로드된 소스에 대해 질문할 수 있는 대화형 채팅.
-   **마크다운 지원**: 봇의 응답이 풍부한 마크다운 형식(리스트, 코드 블록, 표 등)으로 렌더링됩니다.
-   **알림 시스템**: 업로드 성공/실패, 에러, 시스템 메시지를 위한 토스트 알림 기능.
-   **에러 처리**: API 사용량 초과 및 서버 에러에 대한 견고한 처리.

## 기술 스택

-   **프론트엔드**: React.js, CSS3
-   **라이브러리**: 응답 렌더링을 위한 `react-markdown`.
-   **백엔드**: (`http://localhost:3001`에서 실행 중이라고 가정)

## 시작하기

1.  **의존성 설치**:
    ```bash
    npm install
    ```

2.  **앱 실행**:
    ```bash
    npm start
    ```

3.  **업로드 및 채팅**:
    -   사이드바에서 PDF 또는 Markdown 파일을 선택하세요.
    -   "Upload" 버튼을 클릭하세요.
    -   문서와 대화를 시작해보세요!


</details>

---

# NotebookLM Clone

A React-based web application that mimics the core functionality of Google's NotebookLM. It allows users to upload PDF or Markdown sources and interact with them via a chat interface powered by a backend LLM.

## Features

-   **Source Upload**: Supports uploading `.pdf` and `.md` (Markdown) files.
-   **Chat Interface**: Interactive chat to ask questions about the uploaded sources.
-   **Markdown Support**: Bot responses are rendered in rich Markdown (lists, code blocks, tables).
-   **Notifications**: Toast notifications for uploads, errors, and system messages.
-   **Error Handling**: Robust handling of API errors, including quota limits and server issues.

## Tech Stack

-   **Frontend**: React.js, CSS3
-   **Libraries**: `react-markdown` for rendering responses.
-   **Backend**: (Assumed to be running on `http://localhost:3001`)

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Application**:
    ```bash
    npm start
    ```

3.  **Upload & Chat**:
    -   Select a PDF or Markdown file from the sidebar.
    -   Click "Upload".
    -   Start chatting with your document!

---

