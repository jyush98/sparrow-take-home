/**
 * Pizza API Documentation
 * Base URL: https://api.sparrowtest.com/v2/lmd/hiring/frontend/take-home
 */

import {
  HiringFrontendTakeHomeOrderRequest,
  HiringFrontendTakeHomeOrderResponse,
  HiringFrontendTakeHomeOrderStatus,
  HiringFrontendTakeHomePizzaSize,
  HiringFrontendTakeHomePizzaToppings,
  HiringFrontendTakeHomeToppingQuantity,
  SpecialtyPizza,
} from "..";

const BASE_URL = "https://api.sparrowtest.com/v2/lmd/hiring/frontend/take-home";

/**
 * Response type for pizza pricing endpoint
 */
interface GetPizzaPricingResponse {
  size: Record<HiringFrontendTakeHomePizzaSize, number>;
  toppingPrices: Record<
    HiringFrontendTakeHomePizzaToppings,
    Record<HiringFrontendTakeHomeToppingQuantity, number>
  >;
}

/**
 * API Endpoint Types
 */

/**
 * GET /specialty-pizzas
 * Retrieves the list of specialty pizzas
 */
type GetAllSpecialtyPizzasRequest = () => Promise<{
  specialtyPizzas: SpecialtyPizza[];
}>;

export const getAllSpecialtyPizzas: GetAllSpecialtyPizzasRequest = async () => {
  const response = await fetch(`${BASE_URL}/specialty-pizzas`);
  if (!response.ok) {
    throw new Error("Failed to fetch specialty pizzas");
  }
  return response.json();
};

/**
 * GET /pizza-pricing
 * Retrieves pizza pricing information
 */
type GetPizzaPricingRequest = () => Promise<GetPizzaPricingResponse>;

export const getPizzaPricing: GetPizzaPricingRequest = async () => {
  const response = await fetch(`${BASE_URL}/pizza-pricing`);
  if (!response.ok) {
    throw new Error("Failed to fetch pizza pricing");
  }
  return response.json();
};

/**
 * POST /pizza
 * Creates a new order in the Checkout view
 */
type CreatePizzaOrderRequest = (
  order: HiringFrontendTakeHomeOrderRequest
) => Promise<{
  id: any;
  order: HiringFrontendTakeHomeOrderResponse;
}>;

export const createPizzaOrder: CreatePizzaOrderRequest = async (order) => {
  const response = await fetch(`${BASE_URL}/pizza`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error("Failed to create pizza order");
  }
  return response.json();
};

/**
 * GET /pizzas
 * Retrieves all orders for a specific location in the Pizza Orders Table view
 */
type GetAllOrdersRequest = (locationId: string) => Promise<{
  orders: HiringFrontendTakeHomeOrderResponse[];
}>;

export const getAllOrders: GetAllOrdersRequest = async (locationId) => {
  const response = await fetch(`${BASE_URL}/pizzas?locationId=${locationId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

/**
 * GET /pizza
 * Retrieves customer's order details by orderId for the Check on your order view
 */
type GetPizzaOrderByIdRequest = (orderId: string) => Promise<{
  order: HiringFrontendTakeHomeOrderRequest;
}>;

export const getPizzaOrderById: GetPizzaOrderByIdRequest = async (orderId) => {
  const response = await fetch(`${BASE_URL}/pizza?orderId=${orderId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }
  return response.json();
};

/**
 * PUT /pizza/status
 * Updates the order status by the restaurant
 */
type UpdatePizzaOrderStatusRequest = (
  orderId: string,
  status: HiringFrontendTakeHomeOrderStatus
) => Promise<{
  order: HiringFrontendTakeHomeOrderResponse;
}>;

export const updatePizzaOrderStatus: UpdatePizzaOrderStatusRequest = async (
  orderId,
  status
) => {
  const response = await fetch(`${BASE_URL}/pizza/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId, status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update order status");
  }
  return response.json();
};

/**
 * POST /pizza/cancel
 * Cancels an order by the customer
 * Note: Only orders with status "pending" can be cancelled
 */
type CancelPizzaOrderRequest = (orderId: string) => Promise<{
  order: HiringFrontendTakeHomeOrderResponse;
}>;

export const cancelPizzaOrder: CancelPizzaOrderRequest = async (orderId) => {
  const response = await fetch(`${BASE_URL}/pizza/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });
  if (!response.ok) {
    throw new Error("Failed to cancel order");
  }
  return response.json();
};
