import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { Pizza } from '.././types';
import headerImage from '../assets/pizza.png';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../store/cartSlice';

interface ToppingPrices {
    [key: string]: {
        light: number;
        regular: number;
        extra: number;
    };
}

interface CustomizationDialogProps {
    open: boolean;
    onClose: () => void;
    pizza: Pizza | null;
    pricingData: {
        size: {
            small: number;
            medium: number;
            large: number;
        };
        toppingPrices: ToppingPrices;
    } | null;
}

const CustomizationDialog: React.FC<CustomizationDialogProps> = ({ open, onClose, pizza, pricingData }) => {
    const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [selectedToppings, setSelectedToppings] = useState<{ [key: string]: string }>({});
    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useDispatch();

    useEffect(() => {
        if (open && pizza && pricingData) {
            console.log("CustomizationDialog mounted for:", pizza.name);
            setSelectedSize('medium');
            const initialToppings: { [key: string]: string } = {};
            pizza.toppings.forEach(topping => {
                initialToppings[topping] = 'regular';
            });
            setSelectedToppings(initialToppings);
            setQuantity(1);
        }
    }, [open, pizza, pricingData]);

    if (!pizza || !pricingData) {
        return null;
    }

    const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
        setSelectedSize(size);
    };

    // Handle changes in topping selection
    const handleToppingChange = (toppingName: string, value: string) => {
        setSelectedToppings((prev) => ({
            ...prev,
            [toppingName]: value,
        }));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setQuantity(value);
        }
    };

    // Calculate the total price
    const calculateTotalPrice = () => {
    let totalPrice = pizza.price[selectedSize];

    // Add price of toppings (light, regular, extra)
    Object.entries(selectedToppings).forEach(([toppingName, quantity]) => {
        if (quantity !== 'none' && pricingData?.toppingPrices[toppingName] && !pizza.toppings.includes(toppingName)) {
            const toppingLevel = quantity as 'light' | 'regular' | 'extra';
            totalPrice += pricingData.toppingPrices[toppingName][toppingLevel];
        }
    });

    totalPrice *= quantity;

    return totalPrice.toFixed(2);
};

    const handleAddToCart = () => {
        const cartItem = {
            id: `${pizza.id}-${Date.now()}`, // Generating a unique ID using timestamp
            name: pizza.name,
            size: selectedSize,
            toppings: selectedToppings,
            quantity,
            pricePerUnit: parseFloat(calculateTotalPrice()) / quantity,
        };

        console.log("Adding item to cart:", cartItem); 
        dispatch(addItemToCart(cartItem)); 
        onClose(); 
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Customize Your Pizza</DialogTitle>
            <DialogContent>
                <img src={headerImage} alt={pizza.name} style={{ width: '100%', height: '200px', borderRadius: '8px', marginBottom: '1rem', objectFit: 'cover' }} />
                <h3>{pizza.name}</h3>
                <p>{pizza.description}</p>

                <h4>Select Size:</h4>
                <RadioGroup value={selectedSize} onChange={(e) => handleSizeChange(e.target.value as keyof typeof pizza.price)}>
                    <FormControlLabel
                        value="small"
                        control={<Radio />}
                        label={`Small ($${pizza.price.small})`}
                    />
                    <FormControlLabel
                        value="medium"
                        control={<Radio />}
                        label={`Medium ($${pizza.price.medium})`}
                    />
                    <FormControlLabel
                        value="large"
                        control={<Radio />}
                        label={`Large ($${pizza.price.large})`}
                    />
                </RadioGroup>
                <h4>Default Toppings:</h4>
                {pizza.toppings.map((topping) => (
                    <div key={topping}>
                        <h5>{topping}</h5>
                        <RadioGroup value={selectedToppings[topping] || 'none'} onChange={(e) => handleToppingChange(topping, e.target.value)}>
                            <FormControlLabel
                                value="none"
                                control={<Radio />}
                                label={'None'}
                            />
                            <FormControlLabel
                                value="light"
                                control={<Radio />}
                                label={'Light'}
                            />
                            <FormControlLabel
                                value="regular"
                                control={<Radio />}
                                label={'Regular'}
                            />
                            <FormControlLabel
                                value="extra"
                                control={<Radio />}
                                label={'Extra'}
                            />
                        </RadioGroup>
                    </div>
                ))}
                <h4>Extra Toppings:</h4>
                {pricingData ? (
                    Object.entries(pricingData.toppingPrices)
                        .filter(([toppingName]) =>
                            !pizza.toppings.some(
                                existingTopping => existingTopping.toLowerCase().replace(/\s+/g, '_') === toppingName.toLowerCase()
                            ) && selectedToppings[toppingName] !== 'none'
                        )
                        .map(([toppingName, prices]) => (
                            <div key={toppingName}>
                                <h5>{toppingName.replace('_', ' ')}</h5>
                                <RadioGroup value={selectedToppings[toppingName] || 'none'} onChange={(e) => handleToppingChange(toppingName, e.target.value)}>
                                    <FormControlLabel value="none" control={<Radio />} label={'None'} />
                                    <FormControlLabel value="light" control={<Radio />} label={`Light ($${prices.light})`} />
                                    <FormControlLabel value="regular" control={<Radio />} label={`Regular ($${prices.regular})`} />
                                    <FormControlLabel value="extra" control={<Radio />} label={`Extra ($${prices.extra})`} />
                                </RadioGroup>
                            </div>
                        ))
                ) : (
                    <p>Loading topping prices...</p>
                )}

            </DialogContent>
            <div style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                Total Price: ${calculateTotalPrice()}
            </div>
            <DialogActions>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    slotProps={{ input: { inputProps: { min: 1 } } }}
                />
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAddToCart} variant="contained" color="primary">
                    Add to Cart
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomizationDialog;
