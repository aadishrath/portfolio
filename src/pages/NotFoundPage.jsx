import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <section className="status-page"><h1>Page not found</h1><p>This page may have moved. Explore the portfolio from the links below.</p><div className="hero-actions"><Link to="/">Home</Link><Link to="/frontend">Frontend projects</Link><Link to="/projects">ML projects</Link></div></section>;
}
