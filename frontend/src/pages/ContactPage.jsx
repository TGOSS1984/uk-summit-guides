import { useState } from "react";
import { FaEnvelope, FaPhone, FaRoute } from "react-icons/fa6";
import Reveal from "../components/ui/Reveal";
import { createContactMessage } from "../lib/api";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitError("Please complete all contact fields.");
      return;
    }

    try {
      setSubmitting(true);

      await createContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitSuccess("Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      const data = err?.data || {};
      const firstError =
        data.detail ||
        data.name?.[0] ||
        data.email?.[0] ||
        data.subject?.[0] ||
        data.message?.[0] ||
        "Unable to send your message right now.";

      setSubmitError(firstError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero__image" />
        <div className="contact-hero__overlay" />

        <div className="container contact-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Contact</p>
            <h1 className="page-title contact-hero__title">
              Get in touch about routes, bookings, and guided mountain days
            </h1>
            <p className="contact-hero__copy">
              This form is now wired to Django and saves customer enquiries into
              the platform for follow-up and future support workflows.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section contact-shell">
        <div className="container contact-layout">
          <Reveal variant="left">
            <form className="contact-form-panel" onSubmit={handleSubmit}>
              <div className="contact-form-panel__heading">
                <p className="section-kicker">Send a message</p>
                <h2 className="section-title">Contact the team</h2>
              </div>

              {submitError ? (
                <div className="booking-note-card">
                  <h3 className="booking-note-card__title">Message error</h3>
                  <p className="booking-note-card__copy">{submitError}</p>
                </div>
              ) : null}

              {submitSuccess ? (
                <div className="booking-note-card booking-note-card--success">
                  <h3 className="booking-note-card__title">Message sent</h3>
                  <p className="booking-note-card__copy">{submitSuccess}</p>
                </div>
              ) : null}

              <div className="booking-form-grid">
                <div className="booking-field">
                  <label className="booking-field__label" htmlFor="contact-name">
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    className="booking-field__control"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Your full name"
                  />
                </div>

                <div className="booking-field">
                  <label className="booking-field__label" htmlFor="contact-email">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    className="booking-field__control"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="booking-field">
                <label className="booking-field__label" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  className="booking-field__control"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Booking help, route question, private guiding..."
                />
              </div>

              <div className="booking-field">
                <label className="booking-field__label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="booking-field__control booking-field__control--textarea"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Tell us how we can help"
                />
              </div>

              <div className="booking-form-actions">
                <button
                  type="submit"
                  className="route-card__link route-card__link--primary"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </Reveal>

          <div className="contact-aside">
            <Reveal variant="right">
              <div className="contact-info-card">
                <p className="contact-info-card__eyebrow">Support</p>
                <h3 className="contact-info-card__title">Ways to get in touch</h3>

                <div className="contact-info-card__list">
                  <div className="contact-info-card__item">
                    <FaEnvelope />
                    <span>General booking support and customer service</span>
                  </div>

                  <div className="contact-info-card__item">
                    <FaRoute />
                    <span>Route questions and private guiding enquiries</span>
                  </div>

                  <div className="contact-info-card__item">
                    <FaPhone />
                    <span>Future phone support and pre-trip coordination</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80} variant="right">
              <div className="contact-info-card">
                <p className="contact-info-card__eyebrow">What happens next</p>
                <h3 className="contact-info-card__title">Your enquiry is stored in Django</h3>
                <p className="contact-info-card__copy">
                  Messages submitted here are now saved into the Django admin as
                  real `ContactMessage` records. Later we can add admin email
                  notifications and customer acknowledgement emails.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;