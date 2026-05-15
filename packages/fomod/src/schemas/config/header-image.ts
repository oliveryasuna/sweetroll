import z from 'zod';

const headerImageSchema = z.object({
  path: z.string().optional(),
  showImage: z.boolean().optional().default(true),
  showFade: z.boolean().optional().default(true),
  height: z.number().optional().default(-1)
});

type HeaderImage = z.infer<typeof headerImageSchema>;

export type {
  HeaderImage
};
export {
  headerImageSchema
};
