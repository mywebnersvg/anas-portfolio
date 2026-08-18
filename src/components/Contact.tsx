import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { MdCopyright } from "react-icons/md";
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  GMAIL_COMPOSE_URL,
  LINKEDIN_URL,
} from "../constants/contact";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-link-with-icon"
              >
                <FaLinkedinIn aria-hidden="true" />
                LinkedIn — Anas Sheikh
              </a>
            </p>
            <h4>Education</h4>
            <p>
              B.S. Information Technology, Punjab University — 2022–2026
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              <FaGithub aria-hidden="true" />
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              <FaLinkedinIn aria-hidden="true" />
              LinkedIn
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Anas Sheikh</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
