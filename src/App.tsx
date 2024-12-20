import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CustomerOrdering from './components/customerorder/CustomerOrdering';
import CheckoutPage from './components/customerorder/CheckoutPage';
import EmployeeDashboard from './components/employeedashboard/EmployeeDashboard';
import OrderCheck from './components/orderstatus/OrderCheck';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<CustomerOrdering />} />
        <Route path="/order/checkout" element={<CheckoutPage />} />
        <Route path="/pizzas" element={<EmployeeDashboard locationId={'j-yushuvayev'} />} />
        <Route path="/order-status" element={<OrderCheck />} />
      </Routes>
    </Router>
  );
};

export default App;
