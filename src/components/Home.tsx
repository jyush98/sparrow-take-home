import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import background from '../assets/wallpaper.png';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Welcome to Peppa's Pizza
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            component={Link}
            to="/pizzas"
            sx={{
              color: 'black',
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            Employee Dashboard
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};


const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <Button variant="contained" color="primary" onClick={() => navigate('/order')} style={{ margin: '1rem' }}>
          Order Pizza
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/order-status')} style={{ margin: '1rem' }}>
          Check Order
        </Button>
      </Box>
    </>

  );
};

export default Home;