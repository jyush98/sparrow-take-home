import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <h1>Welcome to Peppa's Pizza</h1>
      <Button variant="contained" color="primary" onClick={() => navigate('/order')} style={{ margin: '1rem' }}>
        Customer Ordering Flow
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(`/pizzas`)}
        style={{ margin: '1rem' }}
      >
        Employee Orders Dashboard
      </Button>
      <Button variant="contained" color="primary" onClick={() => navigate('/order-status')} style={{ margin: '1rem' }}>
        Order Status Check
      </Button>
    </Box>
  );
};

export default Home;