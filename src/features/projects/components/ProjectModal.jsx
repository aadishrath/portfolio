import { useCallback, useRef } from 'react';
import { FaGithub, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFocusDialog from '../../../hooks/useFocusDialog';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const close = useCallback(() => onClose(), [onClose]);
  useFocusDialog(dialogRef, true, close);
  return <div className="popup-overlay" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="popup-box" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" tabIndex={-1}>
      <header className="popup-header-container">
        <div>
          <p className="popup-eyebrow">{project.category === 'frontend' ? 'Frontend engineering' : 'Applied machine learning'}</p>
          <h2 id="project-dialog-title" className="popup-title gradient-text">{project.title}</h2>
        </div>
        <button type="button" className="popup-close-icon" onClick={onClose} aria-label="Close project details"><FaTimes /></button>
      </header>
      <div className="popup-body-container">
        <section className="popup-overview" aria-label="Project overview">
          <p className="popup-summary">{project.description}</p>
          {project.focus && <p className="popup-focus"><strong>Engineering focus</strong>{project.focus}</p>}
          {project.stack?.length > 0 && <ul className="popup-stack" aria-label="Technologies">{project.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>}
        </section>
        <div className="popup-readme markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{project.details}</ReactMarkdown></div>
      </div>
      <footer className="popup-footer">
        <span>Explore the implementation</span>
        <div className="popup-actions">
          {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="action-link">Live Demo ↗</a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="action-link primary"><FaGithub aria-hidden="true" /> View Repository</a>}
        </div>
      </footer>
    </section>
  </div>;
}
