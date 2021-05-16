import { CartItem } from '../schemas/CartItem';
/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {

  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('you must be logged in to do this');
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity',
  });
  const [ existingCartItem ] = allCartItems;
  if (existingCartItem) {
    console.log(
      `there are already ${existingCartItem.quantity}, increment by 1`
    );
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: +existingCartItem.quantity + +1 },
      resolveFields: false,
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId }},
      user: { connect: { id: sesh.itemId }},
    },
    resolveFields: false,
  })
}
