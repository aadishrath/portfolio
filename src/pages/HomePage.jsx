import { Link } from 'react-router-dom';
import { profile, skills, projects } from '../content';
import { FaBrain, FaRobot, FaLaptopCode, FaTools, FaCogs, FaChartBar } from 'react-icons/fa';
import './HomePage.css';

const skillIcons = { FaBrain, FaRobot, FaLaptopCode, FaTools, FaCogs, FaChartBar };
export default function HomePage() {
  const featured = ['adibank-copilot', 'paperwise'].map(id => projects.find(project => project.id === id)).filter(Boolean);
  return <div className="about-container">
    <section className="hero-intro full-screen-hero">
      <h1 className="hero-title gradient-text">{profile.name}</h1>
      <p className="hero-subtitle">{profile.title}</p>
      <p className="hero-subtext">{profile.summary}</p>
      <div className="hero-actions"><Link className="action-link primary" to="/frontend">View Projects</Link><a className="action-link" href={profile.resume}>View Resume</a><a className="action-link" href={`mailto:${profile.email}`}>Email Me</a></div>
      <a className="scroll-arrow" href="#featured" aria-label="Explore featured projects">↓</a>
    </section>
    <section id="featured" className="featured-section">
      <h2 className="aboutMe-title gradient-text">Frontend & AI Projects</h2><div className="section-underline" />
      <div className="featured-grid">{featured.map(project => <article key={project.id} className="featured-card"><h3>{project.title}</h3><p>{project.description}</p><Link to={`${project.category === 'ml' ? '/projects' : '/frontend'}#${project.id}`}>Explore project →</Link></article>)}</div>
    </section>
    <section className="intro" id="about"><h2 className="aboutMe-title gradient-text">About Me</h2><div className="section-underline" />{profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>
    <section className="tech-grid-section" id="skills"><h2 className="tech-grid-title gradient-text">Languages & Tools</h2><div className="section-underline" /><div className="tech-grid-container">{skills.map(bucket => { const Icon = skillIcons[bucket.icon]; return <div key={bucket.title} className="tech-grid-card"><div className="tech-grid-header">{Icon && <Icon aria-hidden="true" className="tech-grid-icon" />}<h3>{bucket.title}</h3></div><ul className="tech-grid-list">{bucket.items.map(item => <li key={item} className="tech-grid-item">{item}</li>)}</ul></div>; })}</div></section>
  </div>;
}
