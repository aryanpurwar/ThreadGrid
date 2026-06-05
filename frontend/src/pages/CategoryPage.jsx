import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { fetchProducts } from '../features/productSlice';

const categoryCopy = {
  sneakers: {
    title: 'Premium Sneakers',
    text: 'Limited low-tops, sculpted runners and refined court silhouettes built for daily rotation.'
  },
  clothes: {
    title: 'Aesthetic Clothes',
    text: 'Polished layers, soft knits and utility pieces with a clean premium finish.'
  }
};

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const copy = categoryCopy[category] || categoryCopy.sneakers;

  useEffect(() => {
    dispatch(fetchProducts(category));
  }, [category, dispatch]);

  return (
    <div className="page-shell">
      <section className="category-hero">
        <p className="eyebrow">ThreadGrid collection</p>
        <h1>{copy.title}</h1>
        <p>{copy.text}</p>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <section className="product-grid">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
};

export default CategoryPage;
