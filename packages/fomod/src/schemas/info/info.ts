import z from 'zod';

const infoSchema = z.object({
  Name: z.string().optional(),
  Author: z.string().optional(),
  Version: z.union([
    z.string(),
    z.object({
      value: z.string(),
      MachineVersion: z.string().optional()
    })
  ]).optional(),
  Description: z.string().optional(),
  Website: z.string().optional(),
  Id: z.string().optional()
}).catchall(z.unknown());

type Info = z.infer<typeof infoSchema>;

export type {
  Info
};
export {
  infoSchema
};
