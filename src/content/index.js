import profile from './profile.json';
import skills from './skills.json';
import projectSummaries from './projects.json';

const descriptions = import.meta.glob('./projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export { profile, skills };
export const projects = projectSummaries.map(project => ({
  ...project,
  details: descriptions[`./projects/${project.detailsFile}`],
}));
export const frontendProjects = projects.filter(project => project.category === 'frontend');
export const mlProjects = projects.filter(project => project.category === 'ml');
