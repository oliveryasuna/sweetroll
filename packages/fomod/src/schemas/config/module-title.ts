import z from 'zod';

const moduleTitlePositionSchema = z.union([
  z.literal('Left'),
  z.literal('Right'),
  z.literal('RightOfImage')
]);

type ModuleTitlePosition = z.infer<typeof moduleTitlePositionSchema>;

const moduleTitleSchema = z.object({
  value: z.string(),
  position: moduleTitlePositionSchema.optional().default('Left'),
  colour: z.string().optional().default('000000')
});

type ModuleTitle = z.infer<typeof moduleTitleSchema>;

export type {
  ModuleTitlePosition,
  ModuleTitle
};
export {
  moduleTitlePositionSchema,
  moduleTitleSchema
};
