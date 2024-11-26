import React, { useState } from 'react';
import './Header.css';
import CartDialog from './CartDialog';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  const navigate = useNavigate();

    return (
        <header style={headerStyles}>
            <button className="header-button" onClick={() => navigate('/')}>Home</button>
            <h1 style={styles.title}>Peppa's Pizza</h1>
            <button className="header-button" onClick={handleCartOpen}>Cart</button>
            <CartDialog open={isCartOpen} onClose={handleCartClose} />
        </header>
    );
}

// Clean this up & Figure out how to style
const headerStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    color: '#f13312',
    padding: '1rem',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const styles = {
    title: {
        margin: '0 auto',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
};

export default Header;