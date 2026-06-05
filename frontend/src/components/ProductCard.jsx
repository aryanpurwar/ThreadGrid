import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

const ProductCard = ({ product }) => (
  <article className="product-card">
    <Link to={`/product/${product.slug}`} className="product-media">
      <img src={product.images[0]} alt={product.name} loading="lazy" />
      <span>{product.badge}</span>
    </Link>
    <div className="product-card-body">
      <div>
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
      </div>
      <div className="product-card-row">
        <p className="price">{formatCurrency(product.price)}</p>
        <Link className="round-link" to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  </article>
);

export default ProductCard;
