"use client";

import { useActionState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { subscribeToNewsletter } from "./news-letter-action";
import { useEffect } from "react";

export default function NewsLetterForm() {
  const [formState, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    {},
  );

  useEffect(() => {
    if (formState.success) {
      toast.success("Thank you for subscribing!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else if (formState.error) {
      toast.error(formState.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [formState]);

  useEffect(() => {
    if (isPending) {
      toast.loading("Subscribing...", {
        position: "bottom-right",
        toastId: "newsletter-toast",
      });
    } else {
      toast.dismiss("newsletter-toast");
    }
  }, [isPending]);

  return (
    <>
      <div className="newsletter">
        <div className="newsletter__container">
          <h2 className="newsletter__title">Stay Up To Date</h2>
          <p className="newsletter__subtitle">
            For the latest news and updates from Command Shift, join our mailing
            list!
          </p>
          <form className="newsletter__form" action={formAction}>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              className={`newsletter__input ${
                formState.error ? "newsletter__input--error" : ""
              }`}
              disabled={isPending}
            />
            {formState.error && (
              <div className="newsletter__error-text">{formState.error}</div>
            )}
            <button
              type="submit"
              className="newsletter__button"
              disabled={isPending}
            >
              {isPending ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
