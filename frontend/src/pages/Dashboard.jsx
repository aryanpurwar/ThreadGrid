import {
  Boxes,
  LogOut,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  UserRound
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../features/authSlice';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';

const emptyProduct = {
  name: '',
  slug: '',
  sku: '',
  category: 'sneakers',
  description: '',
  price: '',
  compareAtPrice: '',
  image: '',
  sizes: 'S, M, L',
  inventory: '',
  badge: 'Limited Drop'
};

const formatOrderDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

const formatStatusLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const CustomerDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoadingOrders(true);
      setOrdersError('');

      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (error) {
        setOrdersError(error.response?.data?.message || 'Orders could not be loaded');
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="page-shell dashboard-page">
      <section className="account-panel">
        <UserRound size={28} />
        <div>
          <p className="eyebrow">Customer account</p>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <button className="secondary-button" onClick={onLogout}>
          <LogOut size={18} />
          Sign out
        </button>
      </section>

      <section className="orders-preview">
        <div className="orders-preview-heading">
          <PackageCheck size={26} />
          <div>
            <h2>Your orders</h2>
            <p>Track payment and fulfillment for every drop you reserve.</p>
          </div>
        </div>

        {loadingOrders && <p className="orders-muted">Loading your orders...</p>}
        {ordersError && <p className="error-text">{ordersError}</p>}

        {!loadingOrders && !ordersError && orders.length === 0 && (
          <p className="orders-muted">
            No orders yet. Complete checkout with this email to see them here.
          </p>
        )}

        {!loadingOrders && !ordersError && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div className="order-card-header">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="orders-muted">{formatOrderDate(order.createdAt)}</p>
                  </div>
                  <div className="order-badges">
                    <span className={`status-badge is-${order.paymentStatus}`}>
                      Payment: {formatStatusLabel(order.paymentStatus)}
                    </span>
                    <span className={`status-badge is-${order.fulfillmentStatus}`}>
                      {formatStatusLabel(order.fulfillmentStatus)}
                    </span>
                  </div>
                </div>

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
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const AdminDashboard = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 100 } });
    setProducts(data);
    setDrafts(
      data.reduce(
        (allDrafts, product) => ({
          ...allDrafts,
          [product._id]: {
            price: product.price,
            compareAtPrice: product.compareAtPrice || '',
            inventory: product.inventory,
            status: product.status
          }
        }),
        {}
      )
    );
  };

  useEffect(() => {
    loadProducts().catch(() => setError('Could not load products'));
  }, []);

  const updateDraft = (productId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value
      }
    }));
  };

  const saveProduct = async (productId) => {
    setError('');
    setMessage('');

    try {
      const draft = drafts[productId];
      await api.put(`/products/${productId}`, {
        price: Number(draft.price),
        compareAtPrice: Number(draft.compareAtPrice) || undefined,
        inventory: Number(draft.inventory),
        status: draft.status
      });
      setMessage('Product updated');
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update product');
    }
  };

  const createProduct = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.post('/products', {
        name: newProduct.name,
        slug: newProduct.slug,
        sku: newProduct.sku,
        category: newProduct.category,
        description: newProduct.description,
        price: Number(newProduct.price),
        compareAtPrice: Number(newProduct.compareAtPrice) || undefined,
        images: [newProduct.image],
        sizes: newProduct.sizes.split(',').map((size) => size.trim()).filter(Boolean),
        inventory: Number(newProduct.inventory),
        badge: newProduct.badge,
        details: ['Premium limited edition', 'India-ready dispatch', 'Curated ThreadGrid drop']
      });
      setNewProduct(emptyProduct);
      setMessage('New product added');
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create product');
    }
  };

  return (
    <div className="page-shell dashboard-page admin-dashboard">
      <section className="account-panel">
        <ShieldCheck size={28} />
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <button className="secondary-button" onClick={onLogout}>
          <LogOut size={18} />
          Sign out
        </button>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Catalog manager</p>
            <h2>Manage limited drops</h2>
          </div>
          <Boxes size={28} />
        </div>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-row" key={product._id}>
              <img src={product.images[0]} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.category} · {formatCurrency(product.price)}</p>
              </div>
              <label>
                Price
                <input
                  type="number"
                  value={drafts[product._id]?.price || ''}
                  onChange={(event) => updateDraft(product._id, 'price', event.target.value)}
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  value={drafts[product._id]?.inventory || ''}
                  onChange={(event) => updateDraft(product._id, 'inventory', event.target.value)}
                />
              </label>
              <label>
                Status
                <select
                  value={drafts[product._id]?.status || 'active'}
                  onChange={(event) => updateDraft(product._id, 'status', event.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <button className="secondary-button" onClick={() => saveProduct(product._id)}>
                Save
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">New product</p>
            <h2>Add a drop</h2>
          </div>
          <ShoppingBag size={28} />
        </div>

        <form className="admin-form" onSubmit={createProduct}>
          <label>
            Name
            <input
              value={newProduct.name}
              onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={newProduct.slug}
              onChange={(event) => setNewProduct({ ...newProduct, slug: event.target.value })}
              placeholder="example-product-slug"
              required
            />
          </label>
          <label>
            SKU
            <input
              value={newProduct.sku}
              onChange={(event) => setNewProduct({ ...newProduct, sku: event.target.value })}
              required
            />
          </label>
          <label>
            Category
            <select
              value={newProduct.category}
              onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
            >
              <option value="sneakers">Sneakers</option>
              <option value="clothes">Clothes</option>
            </select>
          </label>
          <label>
            Price INR
            <input
              type="number"
              value={newProduct.price}
              onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
              required
            />
          </label>
          <label>
            Compare at INR
            <input
              type="number"
              value={newProduct.compareAtPrice}
              onChange={(event) =>
                setNewProduct({ ...newProduct, compareAtPrice: event.target.value })
              }
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              value={newProduct.inventory}
              onChange={(event) =>
                setNewProduct({ ...newProduct, inventory: event.target.value })
              }
              required
            />
          </label>
          <label>
            Badge
            <input
              value={newProduct.badge}
              onChange={(event) => setNewProduct({ ...newProduct, badge: event.target.value })}
            />
          </label>
          <label className="form-wide">
            Image URL
            <input
              value={newProduct.image}
              onChange={(event) => setNewProduct({ ...newProduct, image: event.target.value })}
              required
            />
          </label>
          <label className="form-wide">
            Sizes
            <input
              value={newProduct.sizes}
              onChange={(event) => setNewProduct({ ...newProduct, sizes: event.target.value })}
              required
            />
          </label>
          <label className="form-wide">
            Description
            <textarea
              value={newProduct.description}
              onChange={(event) =>
                setNewProduct({ ...newProduct, description: event.target.value })
              }
              required
            />
          </label>
          <button className="checkout-button" type="submit">
            Add product
          </button>
        </form>
      </section>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [accountType, setAccountType] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', adminCode: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const endpoint = mode === 'login' ? '/users/login' : '/users/register';
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password, role: accountType }
          : { ...form, role: accountType };
      const { data } = await api.post(endpoint, payload);
      dispatch(setCredentials(data));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Account request failed');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setAccountType(null);
  };

  if (user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (user) {
    return <CustomerDashboard user={user} onLogout={handleLogout} />;
  }

  if (!accountType) {
    return (
      <div className="page-shell dashboard-page">
        <section className="role-choice-panel">
          <p className="eyebrow">Choose access</p>
          <h1>Continue as</h1>
          <div className="role-choice-grid">
            <button onClick={() => setAccountType('customer')}>
              <UserRound size={30} />
              <span>Customer</span>
              <small>Shop drops, manage cart and place orders.</small>
            </button>
            <button onClick={() => setAccountType('admin')}>
              <ShieldCheck size={30} />
              <span>Admin</span>
              <small>Manage products, pricing and stock.</small>
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell dashboard-page">
      <section className="auth-panel">
        <p className="eyebrow">{accountType === 'admin' ? 'Admin access' : 'Customer account'}</p>
        <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <div className="segmented-control">
          <button
            className={mode === 'login' ? 'is-active' : ''}
            type="button"
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'is-active' : ''}
            type="button"
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={8}
              required
            />
          </label>
          {accountType === 'admin' && mode === 'register' && (
            <label>
              Admin invite code
              <input
                value={form.adminCode}
                onChange={(event) => setForm({ ...form, adminCode: event.target.value })}
                required
              />
            </label>
          )}
          {error && <p className="error-text">{error}</p>}
          <button className="checkout-button" type="submit">
            Continue
          </button>
          <button className="text-button" type="button" onClick={() => setAccountType(null)}>
            Change account type
          </button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
