import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { addToCart } from '../features/cartSlice';
import { clearSelectedProduct, fetchProductBySlug } from '../features/productSlice';
import { formatCurrency } from '../utils/currency';

const ProductPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selected: product, loading } = useSelector((state) => state.products);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSize(product.sizes[0]);
    }
  }, [product]);

  const savings = useMemo(() => {
    if (!product?.compareAtPrice) {
      return null;
    }

    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }, [product]);

  if (loading || !product) {
    return <Spinner />;
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size,
        quantity,
        inventory: product.inventory
      })
    );
  };

  return (
    <div className="product-page">
      <section className="gallery">
        <img className="main-product-image" src={product.images[activeImage]} alt={product.name} />
        <div className="thumb-row">
          {product.images.map((image, index) => (
            <button
              className={index === activeImage ? 'is-active' : ''}
              key={image}
              onClick={() => setActiveImage(index)}
            >
              <img src={image} alt={`${product.name} view ${index + 1}`} />
            </button>
          ))}
        </div>
      </section>

      <section className="product-detail">
        <p className="eyebrow">{product.badge}</p>
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <div className="price-row">
          <span>{formatCurrency(product.price)}</span>
          {product.compareAtPrice && <del>{formatCurrency(product.compareAtPrice)}</del>}
          {savings && <strong>{savings}% off</strong>}
        </div>

        <div className="option-group">
          <span>Size</span>
          <div className="size-options">
            {product.sizes.map((entry) => (
              <button
                className={entry === size ? 'is-selected' : ''}
                key={entry}
                onClick={() => setSize(entry)}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <span>Quantity</span>
          <div className="quantity-control">
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((value) => Math.min(product.inventory, value + 1))}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button className="checkout-button" onClick={handleAddToCart}>
          <ShoppingBag size={18} />
          Add to cart
        </button>

        <div className="details-list">
          {product.details.map((detail) => (
            <span key={detail}>{detail}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
