import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="ThreadGrid home">
        ThreadGrid
      </Link>

      <button className="icon-button menu-button" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={`nav-links ${open ? 'is-open' : ''}`}>
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/category/sneakers" onClick={() => setOpen(false)}>
          Sneakers
        </NavLink>
        <NavLink to="/category/clothes" onClick={() => setOpen(false)}>
          Clothes
        </NavLink>
        <NavLink to="/dashboard" onClick={() => setOpen(false)}>
          Dashboard
        </NavLink>
      </nav>

      <div className="nav-actions">
        <Link className="icon-button" to="/dashboard" aria-label="Account dashboard">
          <UserRound size={20} />
        </Link>
        <Link className="cart-button" to="/cart" aria-label="Shopping cart">
          <ShoppingBag size={20} />
          <span>{cartCount}</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
