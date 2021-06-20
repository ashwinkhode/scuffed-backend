import { CartItem } from '../schemas/CartItem';
import { Order } from '../schemas/Order';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';

/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw

export default async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  const userId = context.session.itemId;
  if(!userId) {
    throw new Error('Sorry! You must be signed in to create an order')
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          title
          price
          mrp
          description
          id
          image {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }

      }
    `
  })

  const cartItems = user.cart.filter( cartItem => cartItem.product)
  const amount = cartItems.reduce(function(tally: number, cartItem ) {
    return tally + cartItem?.quantity * cartItem?.product?.price;
  }, 0)

  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'INR',
    description: `${user.name} payment`,
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err)
    throw new Error(err.message)
  })
  console.log(charge)

  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      title: cartItem.product.title,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      image: { connect: { id: cartItem.product.image.id }},
    }
    return orderItem;
  })

  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId }}
    }
  })

  const cartItemIds = user.cart.map(cartItem => cartItem.id)
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  })

  return order;

}
