import { useCallback, useState } from 'react';
import ProjectCard from '../features/projects/components/ProjectCard';
import ProjectModal from '../features/projects/components/ProjectModal';
import { frontendProjects, mlProjects } from '../content';
import './ProjectsPage.css';

export default function ProjectsPage({ category }) {
  const [selected, setSelected] = useState(null);
  const closeModal = useCallback(() => setSelected(null), []);
  const isFrontend = category === 'frontend';
  const projects = isFrontend ? frontendProjects : mlProjects;

  return (
    <div className="projects-page">
      <h1 className="project-title gradient-text">
        {isFrontend ? 'Frontend Projects' : 'Machine Learning Projects'}
      </h1>
      <div className="section-underline" />
      {isFrontend && (
        <p className="projects-intro">
          Responsive interfaces, reusable components, and AI product experiences —
          built with Angular, React, Next.js, and TypeScript.
        </p>
      )}
      <div className="project-list">
        {projects.map(project => (
          <ProjectCard key={project.id} {...project} onClick={() => setSelected(project)} />
        ))}
      </div>
      {selected && <ProjectModal project={selected} onClose={closeModal} />}
    </div>
  );
}
