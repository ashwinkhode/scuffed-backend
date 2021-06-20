import { integer, select, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const OrderItem = list({
  fields: {
    title: text({ isRequired: true }),
    price: integer(),
    mrp: integer(),
    quantity: integer(),
    order: relationship({ ref: 'Order.items' }),
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
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
  },
});
