type PizzaSize = "small" | "medium" | "large";

type PizzaType = "specialty" | "custom";

type PizzaToppings =
  | "pepperoni"
  | "mushrooms"
  | "onions"
  | "sausage"
  | "bacon"
  | "extra cheese"
  | "black olives"
  | "green peppers"
  | "pineapple"
  | "ham";

type ToppingQuantity = "light" | "regular" | "extra";

// Represents a single topping with its quantity
interface PizzaTopping {
  name: PizzaToppings;
  quantity: ToppingQuantity;
}

interface Pizza {
  type: PizzaType;
  size: PizzaSize;
  // For specialty pizzas, we only add extra toppings in the toppings array
  // For custom pizzas, we charge for all toppings
  toppings: PizzaTopping[];
  // For specialty pizzas, we can exclude toppings that are already included in the pizza
  toppingExclusions?: PizzaToppings[];
  quantity: number;
  totalPrice: number;
}

interface OrderItem {
  id: string;
  item: Pizza;
}

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface OrderRequest {
  id: string;
  //IMPORTANT: unique identifier for this pizza location (and your test)
  locationId: string;
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  paymentMethod: "credit_card" | "cash";
  creditCardNumber?: string;
  type: "delivery" | "pickup";
}

interface OrderResponse extends OrderRequest {
  status: OrderStatus;
  // Note: these are Unix timestamps
  orderDate: number;
  createdAt: number;
  updatedAt: number;
  // Only for "delivery" orders
  estimatedDeliveryTime?: number;
}

type SpecialtyPizzaGroup =
  | "meat lovers"
  | "veggie lovers"
  | "new recipes"
  | "classics";

export type SpecialtyPizza = {
  id: string;
  name: string;
  group: SpecialtyPizzaGroup;
  toppings: PizzaTopping[];
  description: string;
  price: Record<PizzaSize, number>;
};

// API interface
interface GetSpecialtyPizzaResponse {
  specialtyPizzas: SpecialtyPizza[];
}

interface GetPizzaPricingResponse {
  size: Record<PizzaSize, number>;
  toppingPrices: Record<PizzaToppings, Record<ToppingQuantity, number>>;
}

// This endpoint should be used to get the specialty pizzas list
type GetSpecialtyPizzasRequest = () => Promise<GetSpecialtyPizzaResponse>;
// This endpoint should be used to get the pizza pricing
type GetPizzaPricingRequest = () => Promise<GetPizzaPricingResponse>;
// This endpoint should be used to create a new order in the "Checkout" view
type CreateOrderRequest = (order: OrderRequest) => Promise<OrderResponse>;
// This endpoint should be used to get the list of all orders for a specific location in the "Pizza Orders Table" view
type GetAllOrdersRequest = (locationId: string) => Promise<OrderResponse[]>;
// This endpoint should be used to get the customer's order by orderId to display the order details and status in the "Check on your order" view
type GetOrderRequest = (orderId: string) => Promise<OrderResponse>;
// This endpoint should be used to update the order status by the restaurant
type UpdateOrderStatusRequest = (
  orderId: string,
  status: OrderStatus
) => Promise<OrderResponse>;
// This endpoint should be used to cancel the order by the customer. Note: only orders with status "pending" can be cancelled
type CancelOrderRequest = (orderId: string) => Promise<OrderResponse>;
