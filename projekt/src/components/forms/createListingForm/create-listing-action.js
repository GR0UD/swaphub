"use server";

import { z } from "zod";
import { cookies } from "next/headers";

const listingSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be under 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
});

export async function createListing(prevState, formData) {
  if (!formData) return prevState;

  const title = formData.get("title");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");
  const image = formData.get("image");

  const result = listingSchema.safeParse({
    title: title?.trim(),
    description: description?.trim(),
    categoryId,
  });

  if (!result.success) {
    const error = {};
    for (const key in result.error.flatten().fieldErrors) {
      error[key] = { errors: result.error.flatten().fieldErrors[key] };
    }
    return {
      success: false,
      error,
      data: { title, description, categoryId },
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!token || !userId) {
    return {
      success: false,
      error: { global: { errors: ["You must be logged in"] } },
    };
  }

  try {
    let assetId = null;

    // Upload billede hvis der er valgt et
    if (image && image.size > 0) {
      const uploadForm = new FormData();
      uploadForm.append("file", image);

      const assetRes = await fetch("http://localhost:4000/api/v1/assets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      if (assetRes.ok) {
        const assetData = await assetRes.json();
        assetId = assetData.id;
      }
    }

    // Opret listing
    const listingPayload = {
      title: title.trim(),
      description: description.trim(),
      categoryid: parseInt(categoryId),
      userid: parseInt(userId),
    };

    if (assetId) {
      listingPayload.assetid = assetId;
    }

    const res = await fetch("http://localhost:4000/api/v1/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingPayload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: {
          global: {
            errors: [errData.message || "Failed to create listing"],
          },
        },
        data: { title, description, categoryId },
      };
    }

    return { success: true, message: "Listing created!" };
  } catch (err) {
    return {
      success: false,
      error: { global: { errors: [err.message] } },
      data: { title, description, categoryId },
    };
  }
}
