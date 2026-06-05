import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import SuccessPage from './pages/SuccessPage';

const App = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </main>
  </>
);

export default App;
