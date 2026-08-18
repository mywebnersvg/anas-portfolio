import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdVideoCall } from "react-icons/md";import {
  MEETING_COUNTRIES,
  getTimezoneForLocation,
  OWNER_TIMEZONE,
} from "../data/meetingLocations";
import {
  bookMeeting,
  fetchBookedSlots,
  type BookMeetingPayload,
} from "../services/meetingApi";
import {
  clientLocalInputToUtc,
  generateAvailableSlots,
  isValidCustomTime,
  type TimeSlot,
} from "../utils/meetingSlots";
import { CONTACT_EMAIL, GMAIL_COMPOSE_URL } from "../constants/contact";
import { lockPageScroll, unlockPageScroll } from "../utils/scrollLock";
import "./styles/BookMeeting.css";

const BOOKING_TEMPORARILY_DISABLED = true;
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type FormStatus = "idle" | "loading" | "success" | "error";

const BookMeetingModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCountry = MEETING_COUNTRIES.find((c) => c.code === countryCode);
  const clientTimezone = getTimezoneForLocation(countryCode, stateName);

  const slotsByDate = useMemo(() => {
    if (!clientTimezone) return {};
    return generateAvailableSlots(clientTimezone, 14, bookedSlots);
  }, [clientTimezone, bookedSlots]);

  const availableDates = useMemo(
    () => Object.keys(slotsByDate).sort(),
    [slotsByDate]
  );

  const slotsForSelectedDate: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDate[selectedDate] ?? [];
  }, [selectedDate, slotsByDate]);

  const selectedSlot = slotsForSelectedDate.find((s) => s.id === selectedSlotId);

  useEffect(() => {
    if (!isOpen) return;

    fetchBookedSlots().then(setBookedSlots);
    lockPageScroll();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockPageScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setCountryCode("");
      setStateName("");
      setSelectedDate("");
      setSelectedSlotId("");
      setUseCustomTime(false);
      setCustomTime("");
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    setStateName("");
    setSelectedDate("");
    setSelectedSlotId("");
    setCustomTime("");
  }, [countryCode]);

  useEffect(() => {
    setSelectedDate("");
    setSelectedSlotId("");
    setCustomTime("");
  }, [stateName]);

  useEffect(() => {
    setSelectedSlotId("");
    setCustomTime("");
  }, [selectedDate, useCustomTime]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (BOOKING_TEMPORARILY_DISABLED) return;
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Name, email, and phone are required.");
      return;
    }

    if (!countryCode || !stateName || !clientTimezone) {
      setErrorMessage("Please select your country and state first.");
      return;
    }

    let meetingUtc = "";
    let meetingLabelClient = "";
    let meetingLabelOwner = "";

    if (useCustomTime) {
      if (!selectedDate || !customTime) {
        setErrorMessage("Pick a date and custom time.");
        return;
      }
      const utc = clientLocalInputToUtc(
        selectedDate,
        customTime,
        clientTimezone
      );
      if (!utc || !isValidCustomTime(utc, bookedSlots)) {
        setErrorMessage(
          "That time is not available. Pick a slot at least 30 minutes ahead during working hours."
        );
        return;
      }
      meetingUtc = utc;
      meetingLabelClient = `${selectedDate} ${customTime} (${clientTimezone})`;
      meetingLabelOwner = new Intl.DateTimeFormat("en-US", {
        timeZone: OWNER_TIMEZONE,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(utc));
    } else {
      if (!selectedSlot) {
        setErrorMessage("Please select an available time slot.");
        return;
      }
      meetingUtc = selectedSlot.utcIso;
      meetingLabelClient = selectedSlot.clientLabel;
      meetingLabelOwner = selectedSlot.ownerLabel;
    }

    const payload: BookMeetingPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: selectedCountry?.name ?? countryCode,
      countryCode,
      state: stateName,
      timezone: clientTimezone,
      meetingUtc,
      meetingLabelClient,
      meetingLabelOwner,
      isCustomTime: useCustomTime,
    };

    setStatus("loading");

    try {
      await bookMeeting(payload);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="book-meeting-overlay" onClick={onClose}>      <div
        className="book-meeting-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-meeting-title"
      >
        <button
          type="button"
          className="book-meeting-close"
          onClick={onClose}
          aria-label="Close"
          data-cursor="disable"
        >
          <MdClose />
        </button>

        {status === "success" ? (
          <div className="book-meeting-success">
            <MdVideoCall className="book-meeting-success-icon" />
            <h3 id="book-meeting-title">Meeting Request Sent</h3>
            <p>
              Thanks, {name}! You will receive a confirmation email shortly.
              A Zoom link will be sent before your meeting time.
            </p>
            <button
              type="button"
              className="book-meeting-submit"
              onClick={onClose}
              data-cursor="disable"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {BOOKING_TEMPORARILY_DISABLED && (
              <div className="book-meeting-maintenance-notice">
                <p>
                  The booking backend is currently being worked on. Please
                  contact me on Gmail at{" "}
                  <a
                    href={GMAIL_COMPOSE_URL}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="book-meeting-header">
              <h3 id="book-meeting-title">Book a Meeting</h3>
              <p>
                Pick a time that works for you. Slots update based on your
                country and timezone.
              </p>
            </div>

            <form
              className={`book-meeting-form${
                BOOKING_TEMPORARILY_DISABLED
                  ? " book-meeting-form-disabled"
                  : ""
              }`}
              onSubmit={handleSubmit}
            >
              <div className="book-meeting-grid">
                <label className="book-meeting-field">
                  <span>
                    Full Name <em>*</em>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={BOOKING_TEMPORARILY_DISABLED}
                    data-cursor="disable"
                  />
                </label>

                <label className="book-meeting-field">
                  <span>
                    Email <em>*</em>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@email.com"
                    required
                    disabled={BOOKING_TEMPORARILY_DISABLED}
                    data-cursor="disable"
                  />
                </label>

                <label className="book-meeting-field">
                  <span>
                    Phone <em>*</em>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    required
                    disabled={BOOKING_TEMPORARILY_DISABLED}
                    data-cursor="disable"
                  />
                </label>
              </div>

              <div className="book-meeting-section">
                <h4>Location (required for timezone)</h4>
                <div className="book-meeting-grid book-meeting-grid-2">
                  <label className="book-meeting-field">
                    <span>
                      Country <em>*</em>
                    </span>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      required
                      disabled={BOOKING_TEMPORARILY_DISABLED}
                      data-cursor="disable"
                    >
                      <option value="">Select country</option>
                      {MEETING_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="book-meeting-field">
                    <span>
                      State / Region <em>*</em>
                    </span>
                    <select
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      required
                      disabled={BOOKING_TEMPORARILY_DISABLED || !countryCode}
                      data-cursor="disable"
                    >
                      <option value="">Select state</option>
                      {(selectedCountry?.states ?? []).map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {clientTimezone && (
                  <p className="book-meeting-timezone-note">
                    Times shown in your timezone:{" "}
                    <strong>{clientTimezone}</strong>
                  </p>
                )}
              </div>

              {clientTimezone && (
                <div className="book-meeting-section">
                  <div className="book-meeting-section-head">
                    <h4>Select date & time</h4>
                    <label className="book-meeting-toggle">
                      <input
                        type="checkbox"
                        checked={useCustomTime}
                        onChange={(e) => setUseCustomTime(e.target.checked)}
                        disabled={BOOKING_TEMPORARILY_DISABLED}
                        data-cursor="disable"
                      />
                      Custom time
                    </label>
                  </div>

                  <label className="book-meeting-field">
                    <span>Date</span>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={BOOKING_TEMPORARILY_DISABLED}
                      data-cursor="disable"
                    >
                      <option value="">Select date</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedDate && !useCustomTime && (
                    <div className="book-meeting-slots">
                      {slotsForSelectedDate.length === 0 ? (
                        <p className="book-meeting-empty">
                          No slots available on this date.
                        </p>
                      ) : (
                        slotsForSelectedDate.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`book-meeting-slot ${
                              selectedSlotId === slot.id
                                ? "book-meeting-slot-active"
                                : ""
                            }`}
                            onClick={() => setSelectedSlotId(slot.id)}
                            disabled={BOOKING_TEMPORARILY_DISABLED}
                            data-cursor="disable"
                          >
                            {new Intl.DateTimeFormat("en-US", {
                              timeZone: clientTimezone,
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }).format(new Date(slot.utcIso))}
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {selectedDate && useCustomTime && (
                    <label className="book-meeting-field">
                      <span>Custom time (your local time)</span>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        step={1800}
                        disabled={BOOKING_TEMPORARILY_DISABLED}
                        data-cursor="disable"
                      />
                      <small>
                        Must be at least 30 minutes from now and within working
                        hours.
                      </small>
                    </label>
                  )}

                  {selectedSlot && !useCustomTime && (
                    <p className="book-meeting-selected">
                      Selected: <strong>{selectedSlot.clientLabel}</strong>
                      <br />
                      <span>
                        Your time ({clientTimezone}) · Anas:{" "}
                        {selectedSlot.ownerLabel} ({OWNER_TIMEZONE})
                      </span>
                    </p>
                  )}
                </div>
              )}

              {errorMessage && (
                <p className="book-meeting-error">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="book-meeting-submit"
                disabled={BOOKING_TEMPORARILY_DISABLED || status === "loading"}
                data-cursor="disable"
              >
                {status === "loading" ? "Booking..." : "Set Meeting"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
export default BookMeetingModal;
