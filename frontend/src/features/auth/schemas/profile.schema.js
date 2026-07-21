import { z } from "zod";

const optionalText = (minimumLength, message) =>
  z
    .string()
    .trim()
    .refine(
      (value) => !value || value.length >= minimumLength,
      message,
    );

export const profileSchema = z
  .object({
    firstName: optionalText(2, "First name must be at least 2 characters"),
    lastName: optionalText(2, "Last name must be at least 2 characters"),
    phone: optionalText(6, "Phone must be at least 6 characters"),
    street: z.string().trim(),
    apartment: z.string().trim(),
    city: z.string().trim(),
    country: z.string().trim(),
    password: optionalText(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) =>
      !password || password === confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const profileDefaultValues = {
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  apartment: "",
  city: "",
  country: "",
  password: "",
  confirmPassword: "",
};
