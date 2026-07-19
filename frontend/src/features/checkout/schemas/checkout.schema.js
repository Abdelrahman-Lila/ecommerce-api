import { z } from "zod";

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, "Shipping address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(6, "Phone is required"),
});

export const checkoutDefaultValues = {
  shippingAddress: "",
  city: "",
  country: "",
  phone: "",
};
