import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const mapboxAccessToken = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ';

const truckIconUrl = './truck.png';

const PickupOrderStatus = ({ cancelOrder }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderInfo = location.state?.ordersInfo || {
    packageId: '12345',
    name: 'John Doe',
    totalWeight: 10,
    cart: [{ name: 'Paper', quantity: 5, price: 10 }, { name: 'Plastic', quantity: 5, price: 20 }],
    status: 'scheduled',
    schedulepickup: '2023-08-01'
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [orderStatus, setOrderStatus] = useState('scheduled');

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`https://recycle-backend-lflh.onrender.com/api/order-status/${orderInfo.Id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrderStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };
    fetchOrderStatus();
  }, [orderInfo.Id]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCustomerLocation([latitude, longitude]);

      const agentLat = latitude + 0.018;
      const agentLng = longitude;
      setAgentLocation([agentLat, agentLng]);
    });
  }, []);

  useEffect(() => {
    if (customerLocation && agentLocation) {
      const fetchRoute = async () => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${customerLocation[1]},${customerLocation[0]};${agentLocation[1]},${agentLocation[0]}?geometries=geojson&access_token=${mapboxAccessToken}`;
        try {
          const response = await axios.get(url);
          setRouteData(response.data.routes[0].geometry);
        } catch (error) {
          console.error('Error fetching route data:', error);
        }
      };

      fetchRoute();
    }
  }, [customerLocation, agentLocation]);

  const handlePickUpClick = () => {
    navigate('/market-price', { state: { ordersInfo: orderInfo } });
  };

  const handleCancelOrder = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axios.delete(`https://recycle-backend-lflh.onrender.com/api/order/${orderInfo.Id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      cancelOrder(orderInfo.Id);
      setIsConfirmModalOpen(false);
      navigate('/pickup-list');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to cancel the order. Please try again.');
    }
  };

  const handleTrackOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const isCompleted = (status) => {
    const statusOrder = ['scheduled', 'approved', 'in-progress', 'at-doorstep'];
    return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(status);
  };

  const calculateTotalPrice = () => {
    return orderInfo.cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <Container>
      <Content>
        <Header>
          <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
        </Header>
        <StatusContainer>
          <PackageId>Package ID: {orderInfo.Id || 'N/A'}</PackageId>
          <StatusList>
            <StatusItem $completed={isCompleted('scheduled')}>Pickup placed</StatusItem>
            <StatusItem $completed={isCompleted('approved')}>Pickup Approved</StatusItem>
            <StatusItem $completed={isCompleted('in-progress')}>Pickup Truck near you</StatusItem>
            <StatusItem $completed={isCompleted('at-doorstep')} $pulsating={isCompleted('at-doorstep')}>Pickup is at your Doorstep</StatusItem>
          </StatusList>
        </StatusContainer>
        <OrderDetails>
          <DetailContainer>
            <Detail>Customer: {orderInfo.name || 'N/A'}</Detail>
            <Detail>Package weight: {orderInfo.totalWeight || 'N/A'} kg</Detail>
            <Detail>Order Status: {orderInfo.status || 'N/A'}</Detail>
            <Detail>Schedule Pickup: {orderInfo.schedulePickup || 'N/A'}</Detail>
          </DetailContainer>
          <MaterialsContainer>
            <MaterialsHeader>List of materials:</MaterialsHeader>
            <MaterialsList>
              {orderInfo.cart?.map((item, index) => (
                <MaterialItem key={index}>{item.name} - {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}</MaterialItem>
              )) || 'N/A'}
            </MaterialsList>
            <TotalPrice>Est. Total Price: ₹{calculateTotalPrice()}</TotalPrice>
          </MaterialsContainer>
        </OrderDetails>
      </Content>
      <Footer>
        <FooterButton onClick={handlePickUpClick}>Market price</FooterButton>
        <FooterButton onClick={handleCancelOrder}>Cancel Order</FooterButton>
        <FooterButton onClick={handleTrackOrderClick}>Track Your Pickup</FooterButton>
      </Footer>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Track Order"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
          },
        }}
      >
        {customerLocation && agentLocation && (
          <Map
            initialViewState={{
              latitude: customerLocation[0],
              longitude: customerLocation[1],
              zoom: 12,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxAccessToken}
          >
            <Marker latitude={customerLocation[0]} longitude={customerLocation[1]} color="blue" />
            <Marker latitude={agentLocation[0]} longitude={agentLocation[1]}>
              <img src={truckIconUrl} alt="Truck Icon" width="30" height="30" />
            </Marker>
            {routeData && (
              <Source id="route" type="geojson" data={routeData}>
                <Layer
                  id="route"
                  type="line"
                  source="route"
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                  paint={{
                    'line-color': '#888',
                    'line-width': 6,
                  }}
                />
              </Source>
            )}
          </Map>
        )}
        <CloseButton onClick={handleCloseModal}>Close</CloseButton>
      </Modal>
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={handleCloseConfirmModal}
        contentLabel="Confirm Cancel Order"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            height: '20%',
          },
        }}
      >
        <ConfirmText>Are you sure you want to cancel this order?</ConfirmText>
        <ButtonContainer>
          <ConfirmButton onClick={confirmCancelOrder}>Yes</ConfirmButton>
          <CancelButton onClick={handleCloseConfirmModal}>No</CancelButton>
        </ButtonContainer>
      </Modal>
    </Container>
  );
};

export default PickupOrderStatus


const pulsate = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f3f2f8;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 100px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const StatusContainer = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 20px;
  margin-top: 20px;
`;

const PackageId = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const StatusItem = styled.div`
  font-size: 18px;
  color: ${props => (props.$completed ? 'green' : 'gray')};
  position: relative;
  padding-left: 30px;
  margin-bottom: 20px;
  animation: ${props => (props.$pulsating ? pulsate : 'none')} 1.5s infinite;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => (props.$completed ? 'green' : 'gray')};
  }

  &:after {
    content: '';
    position: absolute;
    left: 9px;
    top: 25px;
    width: 2px;
    height: 40px;
    background-color: ${props => (props.$completed ? 'green' : 'gray')};
    display: ${props => (props.$completed ? 'block' : 'none')};
  }

  &:last-child:after {
    display: none;
  }
`;

const OrderDetails = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  background-color: #f9f9f9;
  border-left: 5px solid #4caf50;
  margin-bottom: 20px;
`;

const Detail = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const MaterialsContainer = styled.div`
  padding: 10px;
  background-color: #f1f1f1;
  border-left: 5px solid #4caf50;
`;

const MaterialsHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const MaterialsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TotalPrice = styled.li`
  font-size: 16px;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;



const MaterialItem = styled.li`
  font-size: 16px;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 400px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  padding: 10px 0;
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #4b4b4b;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dcdcdc;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #4b4b4b;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    background-color: #dcdcdc;
  }
`;

const ConfirmText = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e53935;
  }
`;

Modal.setAppElement('#root');
