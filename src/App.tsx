import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CustomerOrdering from './components/CustomerOrdering';
//import EmployeeDashboard from './components/EmployeeDashboard';
//import OrderStatusCheck from './components/OrderStatusCheck';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<CustomerOrdering />} />
        {/* <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/order-status" element={<OrderStatusCheck />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
