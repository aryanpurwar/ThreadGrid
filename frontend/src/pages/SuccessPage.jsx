import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { clearCart } from '../features/cartSlice';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';

const formatStatusLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const SuccessPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(Boolean(sessionId));

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const loadOrder = async () => {
      setLoadingOrder(true);

      try {
        const { data } = await api.get(`/orders/by-session/${sessionId}`);
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [sessionId]);

  return (
    <div className="page-shell">
      <section className="success-panel">
        <CheckCircle size={42} />
        <p className="eyebrow">Payment complete</p>
        <h1>Your drop is reserved.</h1>
        <p>
          Stripe confirmed the checkout. Your order record is stored securely and the inventory
          will update after the webhook event is received.
        </p>

        {loadingOrder && <p className="orders-muted">Fetching your current order...</p>}

        {order && (
          <div className="current-order-card">
            <h2>Current order</h2>
            <p className="orders-muted">
              Order #{order._id.slice(-8).toUpperCase()} · Payment:{' '}
              {formatStatusLabel(order.paymentStatus)}
            </p>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={`${item.name}-${item.size || 'default'}`}>
                  <span>
                    {item.name}
                    {item.size ? ` / ${item.size}` : ''} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="order-total">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link className="primary-button" to="/dashboard">
            View all orders
          </Link>
          <Link className="secondary-button" to="/">
            Back to store
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SuccessPage;
