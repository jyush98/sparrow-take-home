export interface Pizza {
    id: string;
    name: string;
    group: string;
    type: string;
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

// export type SpecialtyPizza = {
//     id: string;
//     name: string;
//     group: HiringFrontendTakeHomeSpecialtyPizzaGroup;
//     toppings: PizzaTopping[];
//     description: string;
//     price: Record<HiringFrontendTakeHomePizzaSize, number>;
//   };