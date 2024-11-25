import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../types/api/index';
import { HiringFrontendTakeHomeOrderResponse, HiringFrontendTakeHomeOrderStatus } from '../types/index';
import { useNavigate } from 'react-router-dom';
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

interface EmployeeOrdersDashboardProps {
  locationId: string;
}

const EmployeeOrdersDashboard: React.FC<EmployeeOrdersDashboardProps> = ({ locationId }) => {
  const [orders, setOrders] = useState<HiringFrontendTakeHomeOrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2>Employee Orders Dashboard</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EmployeeOrdersDashboard;
