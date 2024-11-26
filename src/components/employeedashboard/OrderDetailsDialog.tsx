import React from 'react';
import { HiringFrontendTakeHomeOrderResponse } from '../../types/index';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

interface OrderDetailsDialogProps {
    order: HiringFrontendTakeHomeOrderResponse | null;
    open: boolean;
    onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, open, onClose }) => {
    if (!order) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
                <h3>Order Summary:</h3>
                <h3>Time Created: {new Date(order.createdAt * 1000).toLocaleString()}</h3>
                {order.items.map((orderItem, index) => {
                    const pizza = orderItem.pizza;
                    //console.log(order.items);
                    if (!pizza) return null;

                    return (
                        <div key={orderItem.id || index} style={{ marginBottom: '1rem' }}>
                            {/* Would have liked to include the pizza names or IDs here but 
                            the OrderResponse and the Pizza do not contain that info */}
                            <p>Pizza: {pizza.type ?? 'Unknown'}</p>
                            <p>Size: {pizza.size}</p>
                            <p>Quantity: {pizza.quantity}</p>
                            <p>Toppings: {(pizza.topping ?? []).map((t) => `${t.name} (${t.quantity})`).join(', ') || 'None'}</p>
                            <p>Topping Exclusions: {pizza.toppingExclusions?.join(', ') || 'None'}</p>
                            <p>Price per Unit: ${pizza.totalPrice.toFixed(2)}</p>
                            <Divider style={{ margin: '1rem 0' }} />
                        </div>
                    );
                })}
                <h3>Total: ${order.totalAmount.toFixed(2)}</h3>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;