import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key);
};

const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return { subtotal, shipping, tax, total };
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, email } = req.body;

  if (!items?.length || !email) {
    res.status(400);
    throw new Error('Cart items and email are required');
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, status: 'active' });

  const orderItems = items.map((item) => {
    const product = products.find((entry) => entry._id.toString() === item.productId);

    if (!product) {
      throw new Error('One or more products are unavailable');
    }

    if (product.inventory < item.quantity) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    return {
      product: product._id,
      name: product.name,
      image: product.images[0],
      size: item.size,
      quantity: item.quantity,
      price: product.price
    };
  });

  const totals = calculateOrderTotals(orderItems);
  const lineItems = orderItems.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: 'inr',
      unit_amount: Math.round(item.price * 100),
      product_data: {
        name: `${item.name}${item.size ? ` / ${item.size}` : ''}`,
        images: item.image ? [item.image] : []
      }
    }
  }));

  if (totals.shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'inr',
        unit_amount: Math.round(totals.shipping * 100),
        product_data: {
          name: 'Shipping'
        }
      }
    });
  }

  if (totals.tax > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'inr',
        unit_amount: Math.round(totals.tax * 100),
        product_data: {
          name: 'Estimated tax'
        }
      }
    });
  }

  const order = await Order.create({
    user: req.user?._id,
    email,
    items: orderItems,
    ...totals,
    paymentStatus: 'pending'
  });

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: lineItems,
    metadata: {
      orderId: order._id.toString()
    },
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.status(201).json({ url: session.url, orderId: order._id });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderBySession = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ stripeSessionId: req.params.sessionId });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(order);
});

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    res.status(400);
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findById(session.metadata.orderId);

    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      await order.save();

      await Promise.all(
        order.items.map((item) =>
          Product.findByIdAndUpdate(item.product, {
            $inc: { inventory: -item.quantity }
          })
        )
      );
    }
  }

  res.json({ received: true });
});
