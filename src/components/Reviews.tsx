import { useState, useCallback, useEffect } from "react";
import "./styles/Reviews.css";
import { FaStar } from "react-icons/fa6";

const reviews = [
  {
    name: "Elspeth Cavendish",
    location: "Manchester, UK",
    feedback:
      "Anas rebuilt our booking funnel in Next.js with meticulous TypeScript types. Launch landed two weeks early and conversions climbed within the first month. A rare blend of engineering craft and thoughtful communication.",
  },
  {
    name: "Thaddeus Whitmore",
    location: "Austin, USA",
    feedback:
      "Our MERN dashboard had stalled for months. Anas untangled the Node APIs, cleaned MongoDB schemas, and shipped a Tailwind interface our team genuinely enjoys using. I would hire him again without hesitation.",
  },
  {
    name: "Klara Eisenberg",
    location: "Hamburg, Germany",
    feedback:
      "He delivered our SaaS admin panel with React, Sass architecture, and MongoDB pipelines that finally scale. Pixel-perfect on every breakpoint and patient through every sprint demo we scheduled.",
  },
  {
    name: "Donovan Fitzpatrick",
    location: "Seattle, USA",
    feedback:
      "Freelancer who behaves like an in-house tech lead. Migrated Bootstrap legacy pages into Next.js, wired authentication end to end, and left documentation our junior developers could follow on day one.",
  },
];

const AUTO_INTERVAL_MS = 2500;

const Reviews = () => {
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

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === reviews.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    const timer = setInterval(goToNext, AUTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="reviews-section" id="reviews">
      <div className="reviews-container section-container">
        <h2>
          Client <span>Reviews</span>
        </h2>

        <div className="reviews-carousel-wrapper">
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div className="carousel-slide review-slide" key={index}>
                  <div className="review-card">
                      <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="review-feedback">{review.feedback}</p>
                    <div className="review-author">
                      <h4>{review.name}</h4>
                      <span>{review.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentIndex ? "carousel-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to review ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
