import { FaLinkedin, FaGithub, FaEnvelope, FaFilePdf } from 'react-icons/fa';
import { profile } from '../../content';
import './Footer.css';

function Footer() {
  return <footer id="contact"><section className="contact-section">
    <h2 className="gradient-text">Let’s Work Together</h2><div className="section-underline" />
    <p>Looking for a Frontend Engineer or AI Frontend Engineer? Let’s talk about your product.</p>
    <a className="action-link primary" href={`mailto:${profile.email}`}><FaEnvelope aria-hidden="true" /> {profile.email}</a>
    <div className="contact-links"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin aria-hidden="true" /> LinkedIn</a><a href={profile.github} target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" /> GitHub</a><a href={profile.resume}><FaFilePdf aria-hidden="true" /> View Resume</a><a href={profile.resume} download="Aadish_Rathore_Resume.pdf">Download Resume</a></div>
    <p>© {new Date().getFullYear()} {profile.name}</p>
  </section></footer>;
}
export default Footer;
