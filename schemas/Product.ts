import { integer, select, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Product = list({
  // TODO
  // access:
  fields: {
    title: text({ isRequired: true }),
    price: integer(),
    mrp: integer(),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    category: select({
      options: [
        { label: 'Men Clothing', value: 'MEN CLOTHING' },
        { label: 'Women Clothing', value: 'WOMEN CLOTHING' },
        { label: 'Jewelery', value: 'JEWELERY' },
        { label: 'Electronics', value: 'ELECTRONICS' },
      ],
      defaultValue: 'MEN CLOTHING',
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    image: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
  },
});
