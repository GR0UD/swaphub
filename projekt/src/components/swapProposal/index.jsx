"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { getUserToken, getUserId, isUserLoggedIn } from "@/utils/auth";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";

export default function SwapProposal({ targetListingId, listingOwnerId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const userId = isUserLoggedIn() ? getUserId() : null;
  const { data: allListings } = useFetch("/listings");

  const isOwnListing =
    userId && listingOwnerId && parseInt(userId) === parseInt(listingOwnerId);

  // Luk modal med Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Hent brugerens egne listings
  const myListings = useMemo(() => {
    if (!Array.isArray(allListings) || !userId) return [];
    return allListings.filter((listing) => listing.userId === parseInt(userId));
  }, [allListings, userId]);

  const handlePropose = async (offerListingId) => {
    setSubmitting(true);
    try {
      const token = getUserToken();
      const res = await fetch("http://localhost:4000/api/v1/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestItem: parseInt(targetListingId),
          offerItem: offerListingId,
          userId: parseInt(userId),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create swap request");
      }

      toast.success("Swap proposal sent!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err.message || "Could not send swap proposal");
    } finally {
      setSubmitting(false);
    }
  };

  if (isOwnListing) return null;

  return (
    <div className="swap-proposal">
      <button
        onClick={() => setIsOpen(true)}
        className="swap-proposal__trigger"
      >
        Propose a swap
      </button>

      {isOpen && (
        <div
          className="swap-proposal__overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="swap-proposal__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="swap-proposal__modal-header">
              <h3 className="swap-proposal__heading">
                Select an item to offer
              </h3>
              <button
                className="swap-proposal__close"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            {myListings.length === 0 ? (
              <p className="swap-proposal__empty">
                You don&apos;t have any listings to swap. Create one first!
              </p>
            ) : (
              <div className="swap-proposal__list">
                {myListings.map((listing) => (
                  <button
                    key={listing.id}
                    className="swap-proposal__item"
                    onClick={() => handlePropose(listing.id)}
                    disabled={submitting}
                  >
                    <div className="swap-proposal__item-image">
                      {listing.asset?.url ? (
                        <Image
                          src={listing.asset.url}
                          alt={listing.title}
                          width={50}
                          height={50}
                          className="swap-proposal__img"
                        />
                      ) : (
                        <div className="swap-proposal__img-placeholder" />
                      )}
                    </div>
                    <span className="swap-proposal__item-title">
                      {listing.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
