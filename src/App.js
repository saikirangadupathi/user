import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import LocationPicker from './LocationPicker';
import SellBuyPage from './SellBuyPage';
import CategoryPage from './CategoryPage';
import PickupOrderStatus from './pickupOrderStatus';
import PickupInfo from './pickupInfo';
import PickupList from './ordersList';
import MarketPrice from './marketPrice';
import Profile from './profile';
import EcommerceHome from './EcommerceHome';
import EcommerceWallet from './EcommerceWallet';
import CouponPage from './couponPage';
import ProductDescriptionPage from './productDescriptionPage';
import PurchasedVouchersPage from './purchasedVouchersPage';
import AccountInfo from './accountInfo';
import PreviousOrders from './previousOrders';

import ScrapBuyersList from './scrapBuyerPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchasedVouchers, setPurchasedVouchers] = useState([]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handleConfirmLocation = (location) => {
    setSavedLocation(location);
  };

  const addOrder = (newOrder) => {
    setOrdersList((prevOrders) => [...prevOrders, newOrder]);
  };

  const cancelOrder = (packageId) => {
    setOrdersList((prevOrders) => prevOrders.filter((order) => order.packageId !== packageId));
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                savedLocation ? (
                  <Navigate to="/sell-buy" />
                ) : (
                  <Navigate to="/location-picker" />
                )
              ) : (
                <Login onAuthenticate={handleAuthentication} />
              )
            }
          />
          <Route
            path="/location-picker"
            element={
              isAuthenticated ? (
                <LocationPicker onConfirmLocation={handleConfirmLocation} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/sell-buy"
            element={
              savedLocation == null ? (
                <SellBuyPage />
              ) : (
                <Navigate to="/sell-buy" />
              )
            }
          />
          <Route path="/EcommerceHome" element={<EcommerceHome />} />
          <Route path="/EcommerceWallet" element={<EcommerceWallet />} />
          <Route path="/category" element={<CategoryPage ordersList={ordersList} />} />
          <Route path="/pickup-order-status" element={<PickupOrderStatus cancelOrder={cancelOrder} />} />
          <Route path="/pickup-info" element={<PickupInfo addOrder={addOrder} cart={cart} updateCart={updateCart} />} />
          <Route path="/pickup-list" element={<PickupList ordersList={ordersList} />} />
          <Route path="/market-price" element={<MarketPrice addOrder={addOrder} updateCart={updateCart} cart={cart} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product-description/:id" element={<ProductDescriptionPage />} />
          <Route path="/couponPage" element={<CouponPage />} />
          <Route path="/purchased-Vouchers" element={<PurchasedVouchersPage />} />
          <Route path="/account-info" element={<AccountInfo />} />
          <Route path="/previous-orders" element={<PreviousOrders />} />
          <Route path="/ScrapBuyersList" element={<ScrapBuyersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
