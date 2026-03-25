import { useEffect, useState } from "react";
import { API_URL, fetchHealth, fetchProfile, fetchProjects } from "./api";

const fallbackProfile = {
  name: "Aadish Rathore",
  title: "ML Engineer | Angular Developer",
  intro:
    "I build user-facing products that blend thoughtful frontend engineering with practical machine learning workflows.",
  about: [
    "My work sits at the intersection of frontend development, data science, and applied AI. I enjoy turning technical systems into products that feel clear, reliable, and useful.",
    "This version of the portfolio is intentionally split into a Vercel-hosted frontend and a Render-hosted backend so it stays simple, inexpensive, and easy to evolve."
  ],
  highlights: [
    "Frontend engineering with React, Angular, and modern UI systems",
    "Applied NLP and ML workflows, including sentiment analysis and retrieval-augmented systems",
    "API integration, deployment setup, and end-to-end product thinking"
  ],
  links: {
    github: "https://github.com/aadishrath",
    linkedin: "https://www.linkedin.com/in/aadishrath"
  }
};

const fallbackProjects = [
  {
    id: "ml-sentiment",
    title: "Sentiment Analysis",
    summary:
      "A lightweight NLP project focused on text classification workflows and model iteration.",
    stack: ["Python", "scikit-learn", "NLP"],
    href: "https://github.com/aadishrath"
  },
  {
    id: "ml-rag",
    title: "RAG Playground",
    summary:
      "An experimentation space for retrieval, embeddings, and response generation patterns.",
    stack: ["FastAPI", "RAG", "Vector Search"],
    href: "https://github.com/aadishrath"
  },
  {
    id: "portfolio",
    title: "Portfolio Platform",
    summary:
      "A personal site rebuilt as a split frontend/backend deployment for free-tier hosting.",
    stack: ["React", "Vite", "FastAPI", "Vercel", "Render"],
    href: "https://github.com/aadishrath/portfolio"
  }
];

function StatusPill({ health }) {
  const online = health?.status === "ok";

  return (
    <div className={`status-pill ${online ? "online" : "offline"}`}>
      <span className="status-dot" />
      <span>{online ? "Backend connected" : "Backend not reachable yet"}</span>
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState(fallbackProjects);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [healthData, profileData, projectsData] = await Promise.all([
          fetchHealth(),
          fetchProfile(),
          fetchProjects()
        ]);

        if (cancelled) {
          return;
        }

        setHealth(healthData);
        setProfile(profileData);
        setProjects(projectsData.projects);
      } catch {
        if (!cancelled) {
          setHealth({ status: "offline" });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Vercel frontend + Render backend</p>
        <h1>{profile.name}</h1>
        <p className="hero-title">{profile.title}</p>
        <p className="hero-copy">{profile.intro}</p>

        <div className="hero-actions">
          <a className="button primary" href="#projects">
            View projects
          </a>
          <a className="button secondary" href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="button secondary" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>

        <div className="hero-meta">
          <StatusPill health={health} />
          <code className="api-tag">{API_URL}</code>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="section-label">About</p>
          <h2>Building product-minded ML experiences</h2>
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="body-copy">
              {paragraph}
            </p>
          ))}
        </article>

        <aside className="panel accent-panel">
          <p className="section-label">Highlights</p>
          <ul className="highlight-list">
            {profile.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="panel" id="projects">
        <div className="section-head">
          <div>
            <p className="section-label">Projects</p>
            <h2>Selected work</h2>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-top">
                <h3>{project.title}</h3>
                <a href={project.href} target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
              <p>{project.summary}</p>
              <div className="tag-row">
                {project.stack.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
