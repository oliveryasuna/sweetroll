import z from 'zod';

const orderEnumSchema = z.enum([
  'Ascending',
  'Descending',
  'Explicit'
]);

type OrderEnum = z.infer<typeof orderEnumSchema>;

export type {
  OrderEnum
};
export {
  orderEnumSchema
};
