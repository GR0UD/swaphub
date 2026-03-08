"use client";

import { useActionState, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitContactForm } from "./contact-form-action";

export default function ContactForm() {
  const [formState, formAction, isPending] = useActionState(
    submitContactForm,
    {},
  );
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (formState.success) {
      toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setShowLoading(false);
    } else if (formState?.error && typeof formState.error === "string") {
      toast.error(formState.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setShowLoading(false);
    } else if (formState?.error && typeof formState.error === "object") {
      // Hent første feltfejl fra objektet
      const firstFieldError = Object.values(formState.error)[0]?.errors?.[0];
      if (firstFieldError) {
        toast.error(firstFieldError, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setShowLoading(false);
    }
  }, [formState]);

  useEffect(() => {
    if (isPending && showLoading) {
      toast.loading("Sending message...", {
        position: "bottom-right",
        toastId: "contact-toast",
      });
    } else {
      toast.dismiss("contact-toast");
    }
  }, [isPending, showLoading]);

  return (
    <>
      <div className="contact-form">
        <form className="contact-form__container" action={formAction}>
          <div className="contact-form__name-row">
            <div className="contact-form__field contact-form__field--half">
              <label htmlFor="firstName" className="contact-form__label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`contact-form__input ${
                  formState?.error?.firstName
                    ? "contact-form__input--error"
                    : ""
                }`}
                placeholder="John"
                disabled={isPending}
                defaultValue={formState?.data?.firstName}
              />
              {formState?.error?.firstName?.errors &&
                formState.error.firstName.errors.length > 0 && (
                  <p className="contact-form__error-text">
                    {formState.error.firstName.errors[0]}
                  </p>
                )}
            </div>

            <div className="contact-form__field contact-form__field--half">
              <label htmlFor="lastName" className="contact-form__label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`contact-form__input ${
                  formState?.error?.lastName ? "contact-form__input--error" : ""
                }`}
                placeholder="Doe"
                disabled={isPending}
                defaultValue={formState?.data?.lastName}
              />
              {formState?.error?.lastName?.errors &&
                formState.error.lastName.errors.length > 0 && (
                  <p className="contact-form__error-text">
                    {formState.error.lastName.errors[0]}
                  </p>
                )}
            </div>
          </div>

          <div className="contact-form__field">
            <label htmlFor="email" className="contact-form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`contact-form__input ${
                formState?.error?.email ? "contact-form__input--error" : ""
              }`}
              placeholder="example@email.com"
              disabled={isPending}
              defaultValue={formState?.data?.email}
            />
            {formState?.error?.email?.errors &&
              formState.error.email.errors.length > 0 && (
                <p className="contact-form__error-text">
                  {formState.error.email.errors[0]}
                </p>
              )}
          </div>

          <div className="contact-form__field">
            <label htmlFor="subject" className="contact-form__label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className={`contact-form__input ${
                formState?.error?.subject ? "contact-form__input--error" : ""
              }`}
              placeholder="How can we help you?"
              disabled={isPending}
              defaultValue={formState?.data?.subject}
            />
            {formState?.error?.subject?.errors &&
              formState.error.subject.errors.length > 0 && (
                <p className="contact-form__error-text">
                  {formState.error.subject.errors[0]}
                </p>
              )}
          </div>

          <div className="contact-form__field">
            <label htmlFor="message" className="contact-form__label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className={`contact-form__textarea ${
                formState?.error?.message ? "contact-form__textarea--error" : ""
              }`}
              placeholder="Tell us more about your inquiry..."
              rows="5"
              disabled={isPending}
              defaultValue={formState?.data?.message}
            />
            {formState?.error?.message?.errors &&
              formState.error.message.errors.length > 0 && (
                <p className="contact-form__error-text">
                  {formState.error.message.errors[0]}
                </p>
              )}
          </div>

          <button
            type="submit"
            className="contact-form__submit-btn"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
