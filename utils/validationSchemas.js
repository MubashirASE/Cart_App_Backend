import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 9 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin", "superAdmin"]).default("user"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password is required"),
  }),
});

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    quantity: z.coerce.number().int().min(0, "Quantity must be a non-negative integer"),
    serial_number: z.coerce.number().int().min(1, "Serial number is required"),
    category: z.string().min(1, "Category ID is required"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Product ID is required"),
    name: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    quantity: z.coerce.number().int().min(0).optional(),
    serial_number: z.coerce.number().int().min(1).optional(),
    category: z.string().optional(),
  }),
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    parent: z.string().nullable().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
  body: z.object({
    name: z.string().optional(),
    parent: z.string().nullable().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const orderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })).min(1, "Order must have at least one item"),
    shippingAddress: z.object({
      fullName: z.string().min(1, "Full name is required"),
      lastName: z.string().optional(),
      phone: z.string().min(1, "Phone number is required"),
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      postalCode: z.string().optional(),
      country: z.string().default("Pakistan"),
    }),
    paymentMethod: z.enum(["CARD", "COD"], {
      errorMap: () => ({ message: "Payment method must be CARD or COD" }),
    }),
    totalAmount: z.coerce.number().min(0, "Total amount must be at least 0"),
  }),
});

export const addCartSchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
});

export const updateCartSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Item/Product ID is required"),
  }),
  body: z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Order ID is required"),
  }),
  body: z.object({
    status: z.enum(["Pending", "In progress", "In transited", "Delivered"], {
      errorMap: () => ({ message: "Invalid order status" }),
    }),
  }),
});
