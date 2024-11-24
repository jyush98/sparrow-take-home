export interface Pizza {
    id: string;
    name: string;
    description: string;
    toppings: string[];
    price: {
        small: number;
        medium: number;
        large: number;
    };
}

export interface PricingData {
    size: {
        small: number;
        medium: number;
        large: number;
    };
    toppingPrices: {
        [key: string]: {
            light: number;
            regular: number;
            extra: number;
        };
    };
}