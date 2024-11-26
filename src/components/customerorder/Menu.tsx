import React, { useEffect, useState, memo, useCallback } from 'react';
import './Menu.css';
import headerImage from '../../assets/pizza.png';
import CustomizationDialog from './CustomizationDialog';
import { Pizza, PricingData } from '../../types';

const Menu: React.FC = memo(() => {
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [pricing, setPricing] = useState<PricingData | null>(null);

    useEffect(() => {
        console.log("Menu component mounted or updated.");
        return () => {
            console.log("Menu component unmounted.");
        };
    }, []);

    useEffect(() => {
        const fetchSpecialtyPizzas = async () => {
            try {
                const response = await fetch('https://api.sparrowtest.com/v2/lmd/hiring/frontend/take-home/specialty-pizzas');
                const data = await response.json();
                const updatedPizzas = data.specialtyPizzas.map((pizza: Pizza) => ({
                    ...pizza,
                    type: 'specialty',
                }));
                setPizzas(updatedPizzas);
            } catch (error) {
                console.error('Error fetching specialty pizzas:', error);
            }
        };

        const fetchPricingData = async () => {
            try {
                const response = await fetch('https://api.sparrowtest.com/v2/lmd/hiring/frontend/take-home/pizza-pricing');
                const data = await response.json();
                setPricing(data);
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            }
        };

        fetchSpecialtyPizzas();
        fetchPricingData();
    }, []);

    useEffect(() => {
        if (pricing && pizzas.length > 0) {
            const customPizzaExists = pizzas.some(pizza => pizza.id === 'custom');
            if (!customPizzaExists) {
                const customPizza: Pizza = {
                    id: 'custom',
                    name: 'Custom Pizza',
                    group: 'classics',
                    type: 'custom',
                    description: 'Create your own pizza with all your favorite toppings!',
                    price: {
                        small: pricing.size.small,
                        medium: pricing.size.medium,
                        large: pricing.size.large,
                    },
                    toppings: [],
                };

                setPizzas((prevPizzas) => [customPizza, ...prevPizzas]);
            }

        }
    }, [pricing, pizzas]);

    const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = (pizza: Pizza) => {
        setSelectedPizza(pizza);
        setIsDialogOpen(true);
    };

    // Using useCallback to memoize the handleCloseDialog function
    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false);
        setSelectedPizza(null);
    }, []);

    useEffect(() => {
        if (isDialogOpen) {
            console.log("CustomizationDialog opened for:", selectedPizza?.name);
        } else {
            console.log("CustomizationDialog closed.");
        }
    }, [isDialogOpen]);

    return (
        <div className="menu-grid">
            {pizzas.map((p) => (
                <div key={p.id} className="menu-item" onClick={() => handleOpenDialog(p)}>
                    <img src={headerImage} alt={p.name} className="menu-item-image" />
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <p className="item-price">Small: ${p.price.small}</p>
                    <p className="item-price">Medium: ${p.price.medium}</p>
                    <p className="item-price">Large: ${p.price.large}</p>
                </div>
            ))}
            <CustomizationDialog open={isDialogOpen} onClose={handleCloseDialog} pizza={selectedPizza} pricingData={pricing} />
        </div>
    );
});

export default Menu;
