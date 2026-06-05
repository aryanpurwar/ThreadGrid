import { CreditCard, Minus, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { removeFromCart, updateQuantity } from '../features/cartSlice';
import { formatCurrency } from '../utils/currency';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState(user?.email || '');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const checkout = async () => {
    setCheckoutError('');
    setCheckingOut(true);

    try {
      const { data } = await api.post('/orders/checkout', {
        email,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size
        }))
      });

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(error.response?.data?.message || 'Checkout could not be started');
      setCheckingOut(false);
    }
  };

  return (
    <div className="page-shell cart-page">
      <section>
        <p className="eyebrow">Your selection</p>
        <h1>Cart</h1>
      </section>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is waiting for a drop.</h2>
          <Link className="primary-button" to="/">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={`${item.productId}-${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.size}</p>
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.productId,
                          size: item.size,
                          quantity: item.quantity - 1
                        })
                      )
                    }
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.productId,
                          size: item.size,
                          quantity: item.quantity + 1
                        })
                      )
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="icon-button"
                  onClick={() =>
                    dispatch(removeFromCart({ productId: item.productId, size: item.size }))
                  }
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>

          <aside className="summary-panel">
            <h2>Secure checkout</h2>
            <label>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </label>
            <div className="summary-lines">
              <span>Subtotal <strong>{formatCurrency(subtotal)}</strong></span>
              <span>Shipping <strong>{formatCurrency(shipping)}</strong></span>
              <span>GST estimate <strong>{formatCurrency(tax)}</strong></span>
              <span>Total <strong>{formatCurrency(total)}</strong></span>
            </div>
            {checkoutError && <p className="error-text">{checkoutError}</p>}
            <button className="checkout-button" disabled={!email || checkingOut} onClick={checkout}>
              <CreditCard size={18} />
              {checkingOut ? 'Redirecting...' : 'Pay with Stripe'}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
