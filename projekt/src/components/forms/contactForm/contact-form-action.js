"use server";

import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "You must enter a valid email" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" }),
});

export async function submitContactForm(prevState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  const parseResult = contactSchema.safeParse({
    firstName: firstName?.trim(),
    lastName: lastName?.trim(),
    email: email?.trim(),
    subject: subject?.trim(),
    message: message?.trim(),
  });

  if (!parseResult.success) {
    // Flad fejlstrukturen for nemmere håndtering
    const flattened = z.flattenError(parseResult.error);

    const errorStructure = {};

    if (flattened.fieldErrors.firstName) {
      errorStructure.firstName = { errors: flattened.fieldErrors.firstName };
    }

    if (flattened.fieldErrors.lastName) {
      errorStructure.lastName = { errors: flattened.fieldErrors.lastName };
    }

    if (flattened.fieldErrors.email) {
      errorStructure.email = { errors: flattened.fieldErrors.email };
    }

    if (flattened.fieldErrors.subject) {
      errorStructure.subject = { errors: flattened.fieldErrors.subject };
    }

    if (flattened.fieldErrors.message) {
      errorStructure.message = { errors: flattened.fieldErrors.message };
    }

    return {
      success: false,
      error: errorStructure,
      data: {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        subject: subject?.trim(),
        message: message?.trim(),
      },
    };
  }

  try {
    const contactData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // API'et har ikke et kontakt-endpoint, så vi simulerer det
    // I produktion ville dette sende til et backend-endpoint
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
