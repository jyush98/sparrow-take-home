import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');
    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        if (!name || !address || !cardNumber || !cvv) {
            alert('Please fill in all fields');
            return;
        }
        
        // This is where you would handle placing the order, e.g., sending the information to a backend server.
        alert('Order placed successfully!');
        navigate('/'); // Navigate back to home or confirmation page after order placement.
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.pricePerUnit * item.quantity, 0).toFixed(2);
    };

    if (cartItems.length === 0) {
        return <p>Your cart is empty. Please add items to proceed to checkout.</p>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
            <Paper style={{ padding: '1rem' }}>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                    <h3>Order Summary:</h3>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ marginBottom: '1rem' }}>
                            <h4>{item.name}</h4>
                            <p>Size: {item.size}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Default Toppings: {Object.entries(item.defaultToppings).map(([topping, level]) => `${topping} (${level})`).join(', ') || 'None'}</p>
                            <p>Extra Toppings: {Object.entries(item.extraToppings).map(([topping, level]) => `${topping} (${level})`).join(', ') || 'None'}</p>
                            <p>Price per Unit: ${item.pricePerUnit.toFixed(2)}</p>
                            <Divider style={{ margin: '1rem 0' }} />
                        </div>
                    ))}
                    <h3>Total: ${calculateTotal()}</h3>

                    <h3>Billing Information:</h3>
                    <TextField
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Address"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Card Number"
                        fullWidth
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="CVV"
                        fullWidth
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate('/cart')} color="secondary">
                        Back to Cart
                    </Button>
                    <Button onClick={handlePlaceOrder} variant="contained" color="primary">
                        Place Order
                    </Button>
                </DialogActions>
            </Paper>
        </div>
    );
};

export default CheckoutPage;
