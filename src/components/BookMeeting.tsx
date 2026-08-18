import { useState } from "react";
import { MdArrowForward, MdVideoCall } from "react-icons/md";
import BookMeetingModal from "./BookMeetingModal";
import "./styles/BookMeeting.css";

const BookMeeting = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="book-meeting-section section-container" id="book-meeting">
        <div className="book-meeting-section-inner">
          <h2>
            Book a <span>Meeting</span>
          </h2>
          <p className="book-meeting-section-desc">
            Have a project in mind or want to discuss an opportunity? Schedule a
            free 30-minute video call. Pick a time in your timezone — I will send
            a confirmation and Zoom link before the meeting starts.
          </p>
          <ul className="book-meeting-section-points">
            <li>30-minute intro call</li>
            <li>Times shown in your local timezone</li>
            <li>Zoom link sent before the meeting</li>
          </ul>
          <button
            type="button"
            className="book-meeting-trigger book-meeting-trigger-large"
            onClick={() => setIsOpen(true)}
          >
            <MdVideoCall />
            Schedule a Call
            <MdArrowForward />
          </button>
        </div>
      </section>

      <BookMeetingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default BookMeeting;
