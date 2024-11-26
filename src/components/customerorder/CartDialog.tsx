import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { removeItemFromCart, updateQuantity } from '../../store/cartSlice';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

interface CartDialogProps {
    open: boolean;
    onClose: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ open, onClose }) => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [localQuantities, setLocalQuantities] = useState<{ [key: string]: string }>({});

    React.useEffect(() => {
        const initialQuantities = cartItems.reduce((acc, item) => {
            acc[item.id] = item.quantity.toString();
            return acc;
        }, {} as { [key: string]: string });
        setLocalQuantities(initialQuantities);
    }, [cartItems]);

    const handleQuantityChange = (id: string, value: string) => {
        setLocalQuantities((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleQuantityBlur = (id: string) => {
        const quantity = parseInt(localQuantities[id], 10);
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        } else {
            // Reset to 1 if the entered value is invalid
            setLocalQuantities((prev) => ({
                ...prev,
                [id]: '1',
            }));
            dispatch(updateQuantity({ id, quantity: 1 }));
        }
    };

    const handleRemoveItem = (id: string) => {
        dispatch(removeItemFromCart(id));
    };

    const handleProceedToCheckout = () => {
        onClose();
        navigate('/order/checkout');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.pricePerUnit * item.quantity, 0).toFixed(2);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Your Cart</DialogTitle>
            <DialogContent>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} style={{ marginBottom: '1rem' }}>
                            <h4>{item.name}</h4>
                            <p>Size: {item.size}</p>
                            <p>
                                Toppings:{' '}
                                {item.defaultToppings.join(', ') || 'None'}
                            </p>
                            <p>
                                Removed Toppings:{' '}
                                {item.removedToppings.join(', ') || 'None'}
                            </p>
                            <p>
                                Extra Toppings:{' '}
                                {Object.entries(item.extraToppings)
                                    .filter(([_, level]) => level && level.toLowerCase() !== 'none')
                                    .map(([topping, level]) => `${topping} (${level})`)
                                    .join(', ') || 'None'}
                            </p>
                            <p>Price per Unit: ${item.pricePerUnit.toFixed(2)}</p>
                            <p>Total Price: ${(item.quantity * item.pricePerUnit).toFixed(2)}</p>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={localQuantities[item.id] || ''}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                onBlur={() => handleQuantityBlur(item.id)}
                                slotProps={{ input: { inputProps: { min: 1 } } }}
                            />
                            <Button onClick={() => handleRemoveItem(item.id)} color="secondary">
                                Remove
                            </Button>
                        </div>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                {cartItems.length > 0 && (
                    <>
                        <Button onClick={handleProceedToCheckout} variant="contained" color="primary">
                            Proceed to Checkout
                        </Button>
                        <h3>${calculateTotal()}</h3>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CartDialog;
