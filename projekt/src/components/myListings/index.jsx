"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useUserData from "@/hooks/useUserData";
import { getUserToken } from "@/utils/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa6";

export default function MyListings() {
  const { userData, loading, error } = useUserData();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setDeletingId(listingId);
    try {
      const token = getUserToken();
      const res = await fetch(
        `http://localhost:4000/api/v1/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }

      toast.success("Listing deleted!");
      // Genindlæs siden for at vise opdaterede listings
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Could not delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="my-listings">
        <div className="my-listings__loading">Loading your listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-listings">
        <div className="my-listings__error">
          Failed to load your listings: {error.message}
        </div>
      </div>
    );
  }

  const listings = userData?.listings || [];

  return (
    <div className="my-listings">
      <ToastContainer />
      <div className="my-listings__header">
        <h1 className="my-listings__title">My Listings</h1>
        <Link href="/my-listings/create" className="my-listings__create-btn">
          <FaPlus />
          Create New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="my-listings__empty">
          <p>You don't have any listings yet.</p>
          <Link href="/my-listings/create" className="my-listings__create-btn">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="my-listings__grid">
          {listings.map((listing) => (
            <div key={listing.id} className="my-listings__card">
              <Link
                href={`/details/${listing.id}`}
                className="my-listings__image"
              >
                {listing.asset?.url ? (
                  <Image
                    src={listing.asset.url}
                    alt={listing.title}
                    width={300}
                    height={300}
                    loading="lazy"
                    className="my-listings__img"
                  />
                ) : (
                  <Image
                    src="/images/placeholder.svg"
                    alt={listing.title}
                    width={300}
                    height={300}
                    loading="lazy"
                    className="my-listings__img"
                  />
                )}
              </Link>
              <div className="my-listings__info">
                <p className="my-listings__item-title">{listing.title}</p>
                <div className="my-listings__actions">
                  <Link
                    href={`/my-listings/edit/${listing.id}`}
                    className="my-listings__edit-btn"
                  >
                    <FaPen /> Edit
                  </Link>
                  <button
                    className="my-listings__delete-btn"
                    onClick={() => handleDelete(listing.id)}
                    disabled={deletingId === listing.id}
                  >
                    <FaTrash />
                    {deletingId === listing.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
