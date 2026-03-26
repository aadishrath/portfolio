import './RagUploader.css';
import { useRef, useState } from 'react';

export default function RagUploader({ apiUrl, onIngested }) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('Load the bundled corpus or upload your own markdown, text, or PDF files.');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  async function uploadFiles(selectedFiles) {
    if (!selectedFiles.length) {
      setStatus('Choose one or more `.md`, `.txt`, or `.pdf` files before indexing.');
      return;
    }

    setBusy(true);
    setFiles(selectedFiles);
    setStatus('Uploading files and rebuilding the vector index...');

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`${apiUrl}/ingest`, {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Ingest failed.');
      }

      setStatus(`Indexed ${payload.ingested_files.length} file(s) across ${payload.chunks_indexed} chunks.`);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onIngested?.();
    } catch (error) {
      setStatus(error.message || 'Ingest failed.');
    } finally {
      setBusy(false);
    }
  }

  async function onFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    await uploadFiles(selectedFiles);
  }

  async function handleLoadDemo() {
    setBusy(true);
    setStatus('Loading demo corpus and rebuilding the vector index...');

    try {
      const response = await fetch(`${apiUrl}/load_demo`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Demo corpus failed to load.');
      }

      setStatus(`Loaded ${payload.ingested_files.length} demo files and indexed ${payload.chunks_indexed} chunks.`);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onIngested?.();
    } catch (error) {
      setStatus(error.message || 'Demo corpus failed to load.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rag-panel rag-upload-panel">
      <div className="rag-panel-header">
        <div>
          <h3>Corpus ingestion</h3>
          <p>Use the packaged knowledge base or upload your own markdown, text, and PDF files for retrieval.</p>
        </div>
      </div>

      <div className="rag-upload-actions">
        <button type="button" className="rag-primary-button" onClick={handleLoadDemo} disabled={busy}>
          {busy ? 'Working...' : 'Load Demo Corpus'}
        </button>

        <input
          ref={fileInputRef}
          className="rag-hidden-file-input"
          type="file"
          accept=".md,.markdown,.txt,.pdf,application/pdf"
          multiple
          onChange={onFileChange}
        />
        <button
          type="button"
          className="rag-secondary-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          Index Uploads
        </button>
      </div>

      <div className="rag-upload-meta">
        <p className="rag-upload-status">{status}</p>
        {files.length > 0 && (
          <div className="rag-selected-files">
            {files.map((file) => (
              <span key={`${file.name}-${file.size}`} className="rag-source-chip">
                {file.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
