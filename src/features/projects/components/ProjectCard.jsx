import './ProjectCard.css';

export default function ProjectCard({ id, icon, title, description, link, repo, onClick }) {
  return <article id={id} className="project-card">
    <h2><span aria-hidden="true">{icon}</span> {title}</h2><p className="desc-text">{description}</p>
    <div className="project-actions"><button type="button" onClick={onClick} aria-label={`View details for ${title}`}>View Details</button>{link && <a href={link} target="_blank" rel="noopener noreferrer">Live Demo ↗</a>}{repo && <a href={repo} target="_blank" rel="noopener noreferrer">Repository ↗</a>}</div>
  </article>;
}
