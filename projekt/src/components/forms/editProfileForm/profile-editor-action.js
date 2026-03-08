"use server";

import { z } from "zod";
import { cookies } from "next/headers";

const userUpdateSchema = z.object({
  email: z.string().email({ message: "You must enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
});

export async function updateUser(prevState, formData) {
  if (!formData) return prevState;

  const email = formData.get("email");
  const password = formData.get("password");
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");

  const result = userUpdateSchema.safeParse({
    email,
    password,
    firstname,
    lastname,
  });

  if (!result.success) {
    // Byg fejlstruktur til formatet komponenten forventer
    const error = {};
    for (const key in result.error.flatten().fieldErrors) {
      error[key] = { errors: result.error.flatten().fieldErrors[key] };
    }
    return {
      error,
      data: { email, password, firstname, lastname },
    };
  }

  const cookieStore = await cookies();
  const id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("user_token")?.value;

  // Tjek om bruger er autentificeret
  if (!id || !token) {
    return {
      error: { global: { errors: ["User not authenticated"] } },
      data: { email, password, firstname, lastname },
    };
  }

  const res = await fetch(`http://localhost:4000/api/v1/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      password,
      firstname,
      lastname,
    }),
  });

  if (!res.ok) {
    return {
      error: { global: { errors: ["Failed to update user"] } },
      data: { email, password, firstname, lastname },
    };
  }

  return { success: true, message: "Profile updated!" };
}
