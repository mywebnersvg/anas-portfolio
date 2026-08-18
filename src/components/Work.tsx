import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "ProDrive — 3D Garage Experience",
    category:
      "A modern auto-service landing page where visitors scroll to watch a car assemble piece by piece in 3D, then explore the full vehicle before browsing services and pricing. Built to feel premium, interactive, and memorable — not like a typical garage website.",
    tools: "Three.js, Scroll-driven 3D, Next.js, GSAP",
    image: "/images/prodrive.png",
    link: "https://caroil-rose.vercel.app",
  },
  {
    title: "GreenVolt Energie",
    category:
      "A bilingual (EN/DE) marketing site for a solar energy company — clean UI, language switch, and clear messaging around saving energy with smart solar tech.",
    tools: "Next.js, i18n (EN/DE), Marketing UI",
    image: "/images/greenvolt.png",
    link: "https://green-volt-12zd.vercel.app/de",
  },
  {
    title: "CallHQ",
    category: "Voice AI Calling Platform",
    tools: "Voice AI, Calling Automation, CRM Integrations",
    image: "/images/callhq.png",
    link: "https://callhq.ai",
  },
  {
    title: "Whatsapp Automation",
    category: "WABA Application",
    tools: "WhatsApp Business API, Workflow Automation, Notifications",
    image: "/images/whatsapp.png",
    link: "https://whatsapp.callhq.ai",
  },
  {
    title: "Broki",
    category: "Real Estate Platform for FnB Industry",
    tools: "Property Discovery, Lead Management, Marketplace Workflows",
    image: "/images/broki.png",
    link: "https://broki.in",
  },
  {
    title: "Orrdr.com",
    category: "Ecommerce Platform and Mobile App",
    tools: "Ecommerce, Mobile Experience, Order Management",
    image: "/images/orrdr.png",
    link: "https://orrdr.com",
  },
  {
    title: "NeuroFlow AI",
    category:
      "An AI SaaS web app where users sign up, use an AI dashboard, upload files, see analytics, manage teams, and handle subscriptions — all in the browser.",
    tools:
      "Next.js, TypeScript, Tailwind CSS, Framer Motion, MongoDB, NextAuth, OpenAI, Stripe, Recharts, Zustand, Express",
    image: "/images/neuroflow-ai.png",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Portfolio</span>
        </h2>

        <div className="work-carousel">
          <button
            className="work-carousel-arrow work-carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="work-carousel-arrow work-carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          <div className="work-carousel-viewport">
            <div
              className="work-carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="work-carousel-slide" key={project.title}>
                  <div className="work-carousel-content">
                    <div className="work-carousel-info">
                      <div className="work-carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="work-carousel-details">
                        <h4>{project.title}</h4>
                        <p className="work-carousel-description">
                          {project.category}
                        </p>
                        <div className="work-carousel-tools">
                          <span className="tools-label">Tools</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="work-carousel-image">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="work-carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`work-carousel-dot ${
                  index === currentIndex ? "work-carousel-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
