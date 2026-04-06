import { useEffect, useRef, useState } from 'react';
import RagChat from '../../components/RagChat/RagChat';
import { RAG_API_URL } from '../../lib/api';
import './RagDemo.css';

export default function RagDemo() {
  const [systemStatus, setSystemStatus] = useState({
    status: 'loading',
    ready: false,
    embedding_model: null,
    source_count: 0,
    chunks_indexed: 0,
    sources: [],
    suggested_questions: [],
  });
  const [uploadStatus, setUploadStatus] = useState(
    'Load the bundled corpus or upload your own markdown, text, or PDF files.',
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const fileInputRef = useRef(null);

  async function refreshStatus() {
    try {
      const response = await fetch(`${RAG_API_URL}/health`);
      const payload = await response.json();
      setSystemStatus(payload);
    } catch {
      setSystemStatus({
        status: 'offline',
        ready: false,
        embedding_model: null,
        source_count: 0,
        chunks_indexed: 0,
        sources: [],
        suggested_questions: [],
      });
    }
  }

  async function uploadFiles(filesToUpload) {
    if (!filesToUpload.length) {
      setUploadStatus('Choose one or more `.md`, `.txt`, or `.pdf` files before indexing.');
      return;
    }

    setBusy(true);
    setSelectedFiles(filesToUpload);
    setUploadStatus('Uploading files and rebuilding the vector index...');

    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`${RAG_API_URL}/ingest`, {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Ingest failed.');
      }

      setUploadStatus(`Indexed ${payload.ingested_files.length} file(s) across ${payload.chunks_indexed} chunks.`);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await refreshStatus();
    } catch (error) {
      setUploadStatus(error.message || 'Ingest failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLoadDemo() {
    setBusy(true);
    setUploadStatus('Loading demo corpus and rebuilding the vector index...');

    try {
      const response = await fetch(`${RAG_API_URL}/load_demo`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Demo corpus failed to load.');
      }

      setUploadStatus(`Loaded ${payload.ingested_files.length} demo files and indexed ${payload.chunks_indexed} chunks.`);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await refreshStatus();
    } catch (error) {
      setUploadStatus(error.message || 'Demo corpus failed to load.');
    } finally {
      setBusy(false);
    }
  }

  async function handleResetRag() {
    setBusy(true);
    setUploadStatus('Resetting corpus, prompts, and conversation...');

    try {
      const response = await fetch(`${RAG_API_URL}/reset`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Reset failed.');
      }

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setResetVersion((current) => current + 1);
      setUploadStatus('Corpus cleared. Upload a file or load the demo corpus to begin again.');
      await refreshStatus();
    } catch (error) {
      setUploadStatus(error.message || 'Reset failed.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  return (
    <div className="rag-demo-page">
      <section className="rag-demo-hero">
        <div className="rag-demo-hero-copy">
          <h2 className="project-title gradient-text">Interactive RAG Assistant</h2>
          <div className="section-underline"></div>
          <p className="rag-demo-subtitle">
            A recruiter-friendly full-stack RAG demo with upload flows, retrieval diagnostics, grounded citations, and
            a Python API that can swap between local embeddings and an optional hosted LLM answer layer.
          </p>
        </div>

        <div className="rag-hero-status-card">
          <div className="rag-status-row">
            <span>Backend</span>
            <strong className={systemStatus.status === 'ok' ? 'rag-pill online' : 'rag-pill offline'}>
              {systemStatus.status === 'ok' ? 'Connected' : 'Offline'}
            </strong>
          </div>
          <div className="rag-status-row">
            <span>Embedding model</span>
            <strong>{systemStatus.embedding_model || 'Waiting for API'}</strong>
          </div>
          <div className="rag-status-row">
            <span>Vector backend</span>
            <strong>{systemStatus.vector_backend || 'Unknown'}</strong>
          </div>
          <div className="rag-status-grid">
            <div>
              <p>Indexed chunks</p>
              <strong>{systemStatus.chunks_indexed}</strong>
            </div>
            <div>
              <p>Sources</p>
              <strong>{systemStatus.source_count}</strong>
            </div>
          </div>

          <input
            ref={fileInputRef}
            className="rag-hidden-file-input"
            type="file"
            accept=".md,.markdown,.txt,.pdf,application/pdf"
            multiple
            onChange={(event) => uploadFiles(Array.from(event.target.files || []))}
          />

          <div className="rag-upload-actions rag-hero-actions">
            <button type="button" className="rag-primary-button" onClick={handleLoadDemo} disabled={busy}>
              {busy ? 'Working...' : 'Load Demo Corpus'}
            </button>
            <button
              type="button"
              className="rag-secondary-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              Index Uploads
            </button>
          </div>

          <div className="rag-upload-meta rag-hero-upload-meta">
            <p className="rag-upload-status">{uploadStatus}</p>
            {selectedFiles.length > 0 && (
              <div className="rag-selected-files">
                {selectedFiles.map((file) => (
                  <span key={`${file.name}-${file.size}`} className="rag-source-chip">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rag-workbench rag-workbench--full">
        <section className="rag-chat-shell rag-chat-shell--scrollable">
          <RagChat
            apiUrl={RAG_API_URL}
            systemStatus={systemStatus}
            suggestedQuestions={systemStatus.suggested_questions || []}
            onReset={handleResetRag}
            resetVersion={resetVersion}
            resetDisabled={busy}
          />
        </section>
      </section>
    </div>
  );
}
