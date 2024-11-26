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
                {order.items.map((item) => (
                    <div key={item.id} style={{ marginBottom: '1rem' }}>
                        {/* Would have liked to include the pizza names or IDs here but 
                        the OrderResponse and the Pizza do not contain that info */}
                        <p>Size: {item.item.size}</p>
                        <p>Quantity: {item.item.quantity}</p>
                        <p>Toppings: {(item.item.toppings ?? []).map((topping) => `${topping.name} (${topping.quantity})`).join(', ') || 'None'}</p>
                        <p>Topping Exclusions: {item.item.toppingExclusions?.join(', ') || 'None'}</p>
                        <p>Price per Unit: ${item.item.totalPrice.toFixed(2)}</p>
                        <Divider style={{ margin: '1rem 0' }} />
                    </div>
                ))}
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