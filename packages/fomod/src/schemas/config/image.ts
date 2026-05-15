import z from 'zod';

const imageSchema = z.object({path: z.string()});

type Image = z.infer<typeof imageSchema>;

export type {
  Image
};
export {
  imageSchema
};
