import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';

const PickupList = () => {
  const [ordersList, setOrdersList] = useState([]);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('profiledata..', response.data)
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    const timer = setTimeout(() => setLoading(false), 3000);

    fetchProfileData();

    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://recycle-backend-lflh.onrender.com/getorders");
        const filteredOrders = response.data.orderslist.filter(order =>
          order.status === "scheduled" || order.status === "inProgress" || order.status === "completed" || order.status === "Pending"
        );
        setOrdersList(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleprofileClick = () => {
    navigate('/profile');
  };

  const handlePriceClick = () => {
    navigate('/market-price');
  };

  const handleOrderClick = (order) => {
    navigate('/pickup-order-status', { state: { ordersInfo: order } });
  };

  const scheduledAndInProgressOrders = ordersList.filter(order => order.status !== 'completed');
  const completedOrders = ordersList.filter(order => order.status === 'completed');

  return (
    <Container>
      <Header style={{ position: 'fixed', top: '0' }}>
        <Title>Orders List</Title>
      </Header>
      <OrdersContainer style={{ marginTop: '45px', marginBottom: '40px' }}>
        {scheduledAndInProgressOrders.map((order, index) => (
          <OrderCard key={index} onClick={() => handleOrderClick(order)}>
            <OrderInfo>
              <Detail>Package ID: {order.Id}</Detail>
              <Detail>Customer: {order.name}</Detail>
              <Detail>Status: {order.status}</Detail>
            </OrderInfo>
            <ItemsList>
              <Detail>Items:</Detail>
              {order.cart.map((item, idx) => (
                <ItemDetail key={idx}>{item.name} - {item.quantity}KGS</ItemDetail>
              ))}
            </ItemsList>
          </OrderCard>
        ))}
      </OrdersContainer>
      <CompletedOrdersContainer>
        <CompletedTitle>Completed Pickups</CompletedTitle>
        {completedOrders.map((order, index) => (
          <OrderCard key={index} onClick={() => handleOrderClick(order)}>
            <OrderInfo>
              <Detail>Package ID: {order.Id}</Detail>
              <Detail>Customer: {order.name}</Detail>
              <Detail>Status: {order.status}</Detail>
            </OrderInfo>
            <ItemsList>
              <Detail>Items:</Detail>
              {order.cart.map((item, idx) => (
                <ItemDetail key={idx}>{item.name} - {item.quantity}KGS</ItemDetail>
              ))}
            </ItemsList>
          </OrderCard>
        ))}
      </CompletedOrdersContainer>
      <Footer>
        <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#eaeaea', padding: '10px 0', margin: '0' }}>
          <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div onClick={() => navigate('/market-price')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
              <CurrencyRupee size={30} />
              <span>Market Price</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
              <Clipboard size={30} />
              <span>Pick up Status</span>
            </div>
            <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
              <Person size={30} />
              <span>Profile</span>
            </div>
          </Col>
        </Row>
      </Footer>
    </Container>
  );
};

export default PickupList;

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  padding: 0 20px;
`;

const CompletedOrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  padding: 0 20px;
`;

const OrderCard = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  background-color: #f9f9f9;
  align-items: center;
`;

const Detail = styled.div`
  font-size: 16px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: left;

  &:first-child, &:nth-child(2), &:nth-child(4),&:nth-child(6) {
    font-weight: bold;
  }
`;

const ItemsList = styled.div`
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  border-left: 5px solid #4caf50;
`;

const ItemDetail = styled.div`
  font-size: 14px;
  margin-left: 10px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  &:before {
    content: '• ';
    color: #4caf50;
    margin-right: 5px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f3f2f8;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  padding: 10px 0;
  text-align: center;
  background-color: #402E7A;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
`;

const CompletedTitle = styled.h2`
  margin: 0 0 20px 0;
  text-align: center;
`;