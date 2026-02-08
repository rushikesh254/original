import { z } from 'zod';

export const pantryItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    quantity: z.string().optional(),
    imageUrl: z.string().optional(),
});
