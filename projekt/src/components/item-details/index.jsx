"use client";

import React from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { isUserLoggedIn } from "@/utils/auth";
import { formatDate } from "@/utils/dateFormat";
import Link from "next/link";
import UserOtherItems from "../user-other-items";
import SwapProposal from "../swapProposal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ItemDetails({ listingId }) {
  const { data: listing, error, loading } = useFetch(`/listings/${listingId}`);
  const isLoggedIn = isUserLoggedIn();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !listing) {
    return <div className="error">Failed to load listing details</div>;
  }

  return (
    <div className="item-details">
      <ToastContainer />
      <div className="item-details__container">
        <div className="item-details__image-container">
          {listing.asset?.url ? (
            <Image
              src={listing.asset.url}
              alt={listing.title}
              className="item-details__image"
              width={415}
              height={415}
              loading="lazy"
            />
          ) : (
            <div className="item-details__placeholder">
              <span>No image available</span>
            </div>
          )}
        </div>

        <div className="item-details__content">
          <div className="item-details__header">
            <h1 className="item-details__title">{listing.title}</h1>
          </div>

          <div className="item-details__description">
            <p>{listing.description}</p>
          </div>

          <p className="item-details__date">
            On SwapHub since: {formatDate(listing.createdAt)}
          </p>

          <div className="item-details__actions">
            {isLoggedIn ? (
              <SwapProposal
                targetListingId={listingId}
                listingOwnerId={listing.userId}
              />
            ) : (
              <Link href="/sign-in" className="item-details__login-link">
                Login to propose?
              </Link>
            )}
          </div>
        </div>
      </div>

      <UserOtherItems userId={listing.userId} currentListingId={listing.id} />
    </div>
  );
}
