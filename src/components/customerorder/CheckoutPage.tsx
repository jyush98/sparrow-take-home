import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearCart } from '../../store/cartSlice';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useNavigate } from 'react-router-dom';
import {
    HiringFrontendTakeHomeOrderRequest,
    HiringFrontendTakeHomePaymentMethod,
    HiringFrontendTakeHomeOrderType,
    HiringFrontendTakeHomePizzaSize,
    HiringFrontendTakeHomeToppingQuantity,
    HiringFrontendTakeHomePizzaType,
    HiringFrontendTakeHomePizzaToppings,
} from '../../types/index';
import { createPizzaOrder } from '../../types/api/index';


interface DeliveryAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

interface PizzaTopping {
    name: HiringFrontendTakeHomePizzaToppings;
    quantity: HiringFrontendTakeHomeToppingQuantity;
}

const CheckoutPage: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<DeliveryAddress>({
        street: '',
        city: '',
        state: '',
        zipCode: '',
    });
    const [cardNumber, setCardNumber] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
    const [obtainMethod, setObtainMethod] = useState<'pickup' | 'delivery'>('pickup');


    const handlePlaceOrder = async () => {
        // Validate user input before proceeding
        if (
            !firstName ||
            !lastName ||
            !email ||
            (obtainMethod === 'delivery' &&
                (!address.street || !address.city || !address.state || !address.zipCode)) ||
            (paymentMethod === 'card' && (!cardNumber || !cvv))
        ) {
            alert('Please fill in all fields');
            return;
        }


        // Prepare order items for the request
        const items = cartItems.map((item) => ({
            id: item.id,
            pizza: {
                type: item.type as HiringFrontendTakeHomePizzaType,
                size: item.size as HiringFrontendTakeHomePizzaSize,
                toppings: [
                    ...Object.entries(item.extraToppings).map(
                        ([toppingName, toppingQuantity]) =>
                            ({
                                name: toppingName as HiringFrontendTakeHomePizzaToppings,
                                quantity: toppingQuantity as HiringFrontendTakeHomeToppingQuantity,
                            }) as PizzaTopping
                    )],
                toppingExclusions: (item.removedToppings ?? []).map(
                    (toppingName) => toppingName as HiringFrontendTakeHomePizzaToppings
                ),
                quantity: item.quantity,
                totalPrice: item.pricePerUnit * item.quantity,
            },
        }));

        // Create the order object according to HiringFrontendTakeHomeOrderRequest type
        const order: HiringFrontendTakeHomeOrderRequest = {
            locationId: "j-yushuvayev",
            items: items,
            customer: {
                firstName,
                lastName,
                email,
                ...(obtainMethod === 'delivery' && {
                    deliveryAddress: {
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                    },
                })
            },
            totalAmount: parseFloat(calculateTotal()),
            paymentMethod:
                paymentMethod === 'card'
                    ? HiringFrontendTakeHomePaymentMethod.CreditCard
                    : HiringFrontendTakeHomePaymentMethod.Cash,
            creditCardNumber: paymentMethod === 'card' ? cardNumber : undefined,
            type: obtainMethod === 'pickup' ? HiringFrontendTakeHomeOrderType.Pickup : HiringFrontendTakeHomeOrderType.Delivery,
        };


        try {
            // Call the createPizzaOrder function with the constructed order
            await createPizzaOrder(order);
            //alert(`Order placed successfully! Order ID: ${result.order.id}`);
            dispatch(clearCart());
            navigate('/');
        } catch (error) {
            alert("Failed to place order. Please try again.");
        }
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

                    <TextField
                        label="First Name"
                        fullWidth
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <h3>Pick up or Delivery:</h3>
                    <RadioGroup
                        value={obtainMethod}
                        onChange={(e) => setObtainMethod(e.target.value as 'pickup' | 'delivery')}
                        style={{ marginBottom: '1rem' }}
                    >
                        <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                        <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                    </RadioGroup>
                    {obtainMethod === 'delivery' && (
                        <>
                            <TextField
                                label="Street"
                                fullWidth
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                style={{ marginBottom: '1rem' }}
                            />
                            <TextField
                                label="City"
                                fullWidth
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                style={{ marginBottom: '1rem' }}
                            />
                            <TextField
                                label="State"
                                fullWidth
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                style={{ marginBottom: '1rem' }}
                            />
                            <TextField
                                label="ZIP Code"
                                fullWidth
                                value={address.zipCode}
                                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                style={{ marginBottom: '1rem' }}
                            />
                        </>
                    )}


                    <h3>Billing Information:</h3>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
                        style={{ marginBottom: '1rem' }}
                    >
                        <FormControlLabel value="cash" control={<Radio />} label="Pay with Cash" />
                        <FormControlLabel value="card" control={<Radio />} label="Pay with Card" />
                    </RadioGroup>
                    {paymentMethod === 'card' && (
                        <>
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
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate('/order')} color="secondary">
                        Back to Menu
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
