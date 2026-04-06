import './RagChat.css';
import { startTransition, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { iconsMap } from '../../assets/iconsMap';

export default function RagChat({
  apiUrl,
  systemStatus,
  suggestedQuestions = [],
  onReset,
  resetVersion = 0,
  resetDisabled = false,
}) {
  const promptOptions = systemStatus.ready ? suggestedQuestions : [];
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('dark') ? 'dark' : 'light',
  );

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const body = document.body;
    const observer = new MutationObserver(() => {
      setTheme(body.classList.contains('dark') ? 'dark' : 'light');
    });

    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!systemStatus.ready) {
      setQuery('');
      return;
    }

    if (promptOptions.length) {
      setQuery(promptOptions[0]);
    }
  }, [promptOptions]);

  useEffect(() => {
    setMessages([]);
    setError('');
    setLoading(false);
    setQuery('');
  }, [resetVersion]);

  async function handleAsk(nextQuery = query) {
    const question = nextQuery.trim();
    if (!question) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question, top_k: 4 }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Query failed.');
      }

      startTransition(() => {
        setMessages((currentMessages) => [
          {
            id: `${question}-${Date.now()}`,
            query: question,
            ...payload,
          },
          ...currentMessages,
        ]);
      });
      setQuery('');
    } catch (requestError) {
      setError(requestError.message || 'Query failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rag-panel rag-chat-panel">
      <div className="rag-panel-header">
        <div className="rag-chat-title-row">
          <h3>Ask the corpus</h3>
          <button
            type="button"
            className="rag-icon-button"
            onClick={onReset}
            disabled={resetDisabled}
            aria-label="Reset corpus and conversation"
            title="Reset corpus and conversation"
          >
            <img
              src={theme === 'dark' ? iconsMap.syncDark : iconsMap.syncLight}
              alt=""
              className="rag-icon-button__image"
            />
          </button>
        </div>
        <div className="rag-chat-meta">
          <span>{systemStatus.ready ? `${promptOptions.length} dynamic prompts` : 'Waiting for corpus'}</span>
        </div>
      </div>

      <div>
        <p>
          {systemStatus.ready
            ? 'The assistant scans the indexed document set to suggest grounded questions, and each answer includes chunk-level attribution.'
            : 'Load a demo corpus or upload a file first. Once the corpus is ready, this panel will suggest document-specific questions.'}
        </p>
      </div>

      {systemStatus.ready && promptOptions.length > 0 && (
        <div className="rag-prompt-row">
          {promptOptions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rag-prompt-chip"
              onClick={() => {
                setQuery(prompt);
                handleAsk(prompt);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="rag-query-box">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            systemStatus.ready
              ? 'Ask a question about the indexed corpus...'
              : 'Load or upload a file to unlock document-specific suggestions...'
          }
          className="rag-query-input"
        />
        <div className="rag-query-actions">
          <p className="rag-muted-copy">
            {systemStatus.ready
              ? 'Ask about the uploaded documents, then inspect which chunks were retrieved, how strong they scored, and why.'
              : 'Suggestions stay hidden until a corpus is ready so they can be generated from the actual indexed file.'}
          </p>
          <button
            type="button"
            className="rag-primary-button"
            onClick={() => handleAsk()}
            disabled={loading || systemStatus.status !== 'ok'}
          >
            {loading ? 'Retrieving...' : 'Run Query'}
          </button>
        </div>
      </div>

      {error && <div className="rag-chat-error">{error}</div>}

      <div className="rag-results-list">
        {messages.length === 0 ? (
          <div className="rag-empty-state">
            <h4>No queries yet</h4>
            <p>
              {systemStatus.status === 'ok'
                ? 'Load the demo corpus and ask your first question.'
                : 'Start the FastAPI backend first so the demo can retrieve and answer questions.'}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <article key={message.id} className="rag-answer-card">
              <div className="rag-answer-question">Q: {message.query}</div>
              <div className="rag-answer-body">
                <ReactMarkdown>{message.answer}</ReactMarkdown>
              </div>

              <div className="rag-answer-footer">
                <span className="rag-mode-pill">{message.answer_mode}</span>
                <span>{message.retrieval?.matched_chunks || 0} matching chunks</span>
              </div>

              <div className="rag-source-attribution-list">
                {(message.sources || []).map((source) => (
                  <span key={source.chunk_id} className="rag-source-chip rag-source-chip--attribution">
                    {source.label}
                  </span>
                ))}
              </div>

              <div className="rag-context-grid">
                {(message.contexts || []).map((context) => (
                  <div key={context.chunk_id} className="rag-context-card">
                    <div className="rag-context-head">
                      <strong>{context.source}</strong>
                      <span>{context.attribution}</span>
                    </div>
                    <p>{context.preview}</p>
                    <div className="rag-context-metrics">
                      <span>overall {context.score}</span>
                      <span>semantic {context.semantic_score}</span>
                      <span>lexical {context.lexical_score}</span>
                      <span>quality {context.quality_score}</span>
                    </div>
                    <div className="rag-context-metrics rag-context-metrics--quality">
                      <span className={`rag-quality-pill rag-quality-pill--${context.quality_label}`}>
                        {context.quality_label} quality
                      </span>
                      {context.quality_reasons?.map((reason) => (
                        <span key={`${context.chunk_id}-${reason}`}>{reason}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
