"use client";

import { useActionState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createListing } from "./create-listing-action";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function CreateListingForm() {
  const [formState, formAction, isPending] = useActionState(createListing, {});
  const { data: categories } = useFetch("/categories");

  useEffect(() => {
    if (formState?.success) {
      toast.success("Listing created!");
      setTimeout(() => {
        redirect("/my-listings");
      }, 1000);
    }
    if (formState?.error?.global?.errors) {
      toast.error(formState.error.global.errors[0]);
    }
  }, [formState]);

  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <div className="listing-form">
      <ToastContainer />
      <form action={formAction} className="listing-form__container">
        <h2 className="listing-form__heading">Create New Listing</h2>

        <div className="listing-form__field">
          <label htmlFor="title" className="listing-form__label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`listing-form__input ${
              formState?.error?.title ? "listing-form__input--error" : ""
            }`}
            placeholder="What are you swapping?"
            defaultValue={formState?.data?.title}
          />
          {formState?.error?.title?.errors &&
            formState.error.title.errors.length > 0 && (
              <p className="listing-form__error-text">
                {formState.error.title.errors[0]}
              </p>
            )}
        </div>

        <div className="listing-form__field">
          <label htmlFor="description" className="listing-form__label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={`listing-form__textarea ${
              formState?.error?.description
                ? "listing-form__textarea--error"
                : ""
            }`}
            placeholder="Describe your item in detail..."
            rows="5"
            defaultValue={formState?.data?.description}
          />
          {formState?.error?.description?.errors &&
            formState.error.description.errors.length > 0 && (
              <p className="listing-form__error-text">
                {formState.error.description.errors[0]}
              </p>
            )}
        </div>

        <div className="listing-form__field">
          <label htmlFor="categoryId" className="listing-form__label">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={`listing-form__select ${
              formState?.error?.categoryId ? "listing-form__select--error" : ""
            }`}
            defaultValue={formState?.data?.categoryId || ""}
          >
            <option value="">Select a category</option>
            {categoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formState?.error?.categoryId?.errors &&
            formState.error.categoryId.errors.length > 0 && (
              <p className="listing-form__error-text">
                {formState.error.categoryId.errors[0]}
              </p>
            )}
        </div>

        <div className="listing-form__field">
          <label htmlFor="image" className="listing-form__label">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="listing-form__file-input"
          />
        </div>

        <div className="listing-form__buttons">
          <button
            type="submit"
            className="listing-form__submit-btn"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Listing"}
          </button>
          <Link href="/my-listings" className="listing-form__cancel-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
