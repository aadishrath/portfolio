import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loading from '../components/ui/Loading';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import NotFoundPage from '../pages/NotFoundPage';
import RouteEffects from './RouteEffects';
import useTheme from '../hooks/useTheme';
import './App.css';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));


function App() {
  const { theme, toggleTheme } = useTheme();
  return <BrowserRouter>
    <RouteEffects />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="app-container">
      <Navbar theme={theme} onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} toggleTheme={toggleTheme} />
      <main id="main-content" tabIndex={-1} className="main-content">
        <ErrorBoundary><Suspense fallback={<Loading />}><Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage key="ml" category="ml" />} />
          <Route path="/frontend" element={<ProjectsPage key="frontend" category="frontend" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes></Suspense></ErrorBoundary>
      </main>
      <Footer />
    </div>
  </BrowserRouter>;
}
export default App;
