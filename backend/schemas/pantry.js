const z = require('zod');

const pantryItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    quantity: z.string().optional(),
    imageUrl: z.string().optional(),
});

const createPantrySchema = z.object({
    data: pantryItemSchema
});

const updatePantrySchema = z.object({
    data: pantryItemSchema.partial()
});

module.exports = { pantryItemSchema, createPantrySchema, updatePantrySchema };
