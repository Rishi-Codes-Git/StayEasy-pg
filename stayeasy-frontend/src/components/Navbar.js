import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">PG</Link>
    <Link to="/signup">Sign Up</Link>
    <Link to="/login">Login</Link>
  </nav>
);

export default Navbar;
