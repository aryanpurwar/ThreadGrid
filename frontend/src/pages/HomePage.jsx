import { ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { fetchProducts } from '../features/productSlice';

const heroImage =
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=2200&q=90';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <section className="hero">
        <div className="hero-media">
          <img src={heroImage} alt="Premium sneaker editorial for ThreadGrid" />
        </div>
        <div className="hero-content">
          <span className="hero-tag">New season · India</span>
          <p className="eyebrow">Limited edition streetwear</p>
          <h1>ThreadGrid</h1>
          <p className="hero-lede">
            Premium sneakers and refined everyday clothing for people who want their style to feel
            effortless, current and rare.
          </p>
          <div className="hero-actions">
            <Link className="primary-button hero-primary" to="/category/sneakers">
              Shop sneakers <ChevronRight size={18} />
            </Link>
            <Link className="secondary-button hero-secondary" to="/category/clothes">
              Shop clothes
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div>
          <Sparkles size={22} />
          <span>Curated limited drops</span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <span>Secure Stripe checkout</span>
        </div>
        <div>
          <Truck size={22} />
          <span>Free shipping over ₹10,000</span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Fresh arrivals</p>
          <h2>Quiet luxury, street sharp.</h2>
          <Link to="/category/sneakers">View all</Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="product-grid">
            {items.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="category-band">
        <Link to="/category/sneakers">
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=90"
            alt="Premium sneakers"
          />
          <span>Sneakers</span>
        </Link>
        <Link to="/category/clothes">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=90"
            alt="Premium clothes"
          />
          <span>Clothes</span>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
