import { z } from "zod";
export const AdminSeedSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
  isActive: z.boolean().optional(),
});

export type AdminSeed = z.infer<typeof AdminSeedSchema>;
