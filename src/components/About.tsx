import "./styles/About.css";
import { GITHUB_URL } from "../constants/contact";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I am Anas Sheikh, a Full Stack Developer with 4+ years of experience
          building modern web applications end to end. I have strong command over
          JavaScript, React.js, TypeScript, Next.js, Bootstrap, Tailwind CSS,
          Node.js, MongoDB, CSS, Sass, and SCSS — and I have handled numerous
          projects across startups, agencies, and freelance clients.
        </p>
        <p className="para">
          Explore my work on{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            data-cursor="disable"
          >
            GitHub
          </a>{" "}
          to see the products and platforms I have shipped.
        </p>
      </div>
    </div>
  );
};

export default About;
