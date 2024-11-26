import React, { useState, useEffect } from 'react';
import { getAllOrders, updatePizzaOrderStatus } from '../../types/api/index';
import { HiringFrontendTakeHomeOrderResponse, HiringFrontendTakeHomeOrderStatus } from '../../types/index';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OrderDetailsDialog from './OrderDetailsDialog';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

interface EmployeeOrdersDashboardProps {
    locationId: string;
}

const EmployeeOrdersDashboard: React.FC<EmployeeOrdersDashboardProps> = ({ locationId }) => {
    const [orders, setOrders] = useState<HiringFrontendTakeHomeOrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<HiringFrontendTakeHomeOrderResponse | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getAllOrders(locationId);
                setOrders(data.orders);
            } catch (err) {
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [locationId]);

    const handleStatusChange = async (orderId: string, newStatus: HiringFrontendTakeHomeOrderStatus) => {
        try {
            await updatePizzaOrderStatus(orderId, newStatus);

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error('Failed to update order status:', err);
        }
    };

    const handleViewDetails = (order: HiringFrontendTakeHomeOrderResponse) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedOrder(null);
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortOrder === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
    });

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="1rem">
                <h2 style={{ margin: 0 }}>Employee Dashboard</h2>
                <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }} className="header-button">Home</button>
            </Box>
            <Box display="flex" justifyContent="flex-end" marginBottom="1rem">
                <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                </Select>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Delivery Time</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order.id, e.target.value as HiringFrontendTakeHomeOrderStatus)
                                        }
                                    >
                                        {Object.values(HiringFrontendTakeHomeOrderStatus).map((status, index) => (
                                            <MenuItem key={`${order.id}-${index}`} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    {order.type === 'delivery'
                                        ? order.estimatedDeliveryTime
                                            ? new Date(order.estimatedDeliveryTime * 1000).toLocaleString()
                                            : '--'
                                        : 'Pickup'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewDetails(order)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <OrderDetailsDialog order={selectedOrder} open={dialogOpen} onClose={handleCloseDialog} />
        </div>
    );
};

export default EmployeeOrdersDashboard;
