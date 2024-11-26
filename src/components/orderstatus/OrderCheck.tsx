import React, { useState } from 'react';
import { cancelPizzaOrder, getPizzaOrderById } from '../../types/api/index';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { HiringFrontendTakeHomeOrderResponse, HiringFrontendTakeHomeOrderStatus } from '../../types/index';
import { useNavigate } from 'react-router-dom';

const OrderCheck: React.FC = () => {
    const [orderId, setOrderId] = useState<string>('');
    const [order, setOrder] = useState<HiringFrontendTakeHomeOrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleCheckStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPizzaOrderById(orderId);
            setOrder(data.order as HiringFrontendTakeHomeOrderResponse);
        } catch (err) {
            setError('Order not found. Please check your order ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!orderId || order?.status !== 'pending') {
            setError('Only orders with status "pending" can be cancelled.');
            return;
        }
        try {
            setLoading(true);
            await cancelPizzaOrder(orderId);
            setOrder({ ...order, status: HiringFrontendTakeHomeOrderStatus.Cancelled });
            alert('Order cancelled successfully.');
        } catch (err) {
            setError('Failed to cancel order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
            <Paper style={{ padding: '1rem' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="1rem">
                    <h2 style={{ margin: 0 }}>Order Status</h2>
                    <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }} className="header-button">Home</button>
                </Box>
                <TextField
                    label="Enter Order ID"
                    fullWidth
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckStatus}
                    disabled={loading || !orderId}
                    style={{ marginBottom: '1rem' }}
                >
                    {loading ? 'Checking...' : 'Check Status'}
                </Button>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {order && (
                    <div>
                        <h3>Order Details</h3>
                        <p>Order ID: {order.id}</p>
                        <p>Status: {order.status}</p>
                        <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
                        {order.status === 'pending' && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCancelOrder}
                                disabled={loading}
                            >
                                {loading ? 'Cancelling...' : 'Cancel Order'}
                            </Button>
                        )}
                    </div>
                )}
            </Paper>
        </div>
    );
};

export default OrderCheck;
