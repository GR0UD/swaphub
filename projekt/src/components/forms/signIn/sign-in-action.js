"use server";

import { cookies } from "next/headers";
import z from "zod";

export default async function signInAction(prevState, formData) {
  const { email, password } = Object.fromEntries(formData);

  const schema = z.object({
    email: z.string().email({ message: "You must enter a valid email" }),
    password: z.string().min(1, { message: "You must enter a valid password" }),
  });

  const validated = schema.safeParse({ email, password });

  if (!validated.success) {
    const flattened = z.flattenError(validated.error);

    const errorStructure = {};

    if (flattened.fieldErrors.email) {
      errorStructure.email = { errors: flattened.fieldErrors.email };
    }

    if (flattened.fieldErrors.password) {
      errorStructure.password = { errors: flattened.fieldErrors.password };
    }

    return {
      success: false,
      error: errorStructure,
      data: { email }, // husk til form prefill
      errors: flattened.formErrors || [],
    };
  }

  const response = await fetch("http://localhost:4000/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: validated.data.email,
      password: validated.data.password,
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: {},
      data: { email },
      errors: ["Forkert email eller adgangskode"],
    };
  }

  const json = await response.json();

  // Tjek om token og userId findes i responsen
  if (!json.token || !json.userId) {
    return {
      success: false,
      error: {},
      data: { email },
      errors: ["Login failed, please try again"],
    };
  }

  const cookieStore = await cookies();

  // Sæt sikre cookies for brugerens session
  cookieStore.set({
    name: "user_token",
    value: json.token,
    path: "/",
    secure: true,
  });

  cookieStore.set({
    name: "user_id",
    value: json.userId,
    path: "/",
    secure: true,
  });

  return {
    success: true,
    data: {
      email,
      userId: json.userId,
    },
    error: {},
    errors: [],
    message: "Login successful!",
  };
}
