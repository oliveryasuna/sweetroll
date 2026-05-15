import z from 'zod';

const setConditionFlagSchema = z.object({
  name: z.string(),
  value: z.string()
});

type SetConditionFlag = z.infer<typeof setConditionFlagSchema>;

export type {
  SetConditionFlag
};
export {
  setConditionFlagSchema
};
