import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

import BackArrow from './back.png';

import Support from './support.png';

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
  const [orderStatus, setOrderStatus] = useState('');

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const toggleSupportModal = () => {
    setIsSupportModalOpen(!isSupportModalOpen);
  };

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
    const statusOrder = ['scheduled', 'approved','Pending', 'in Progress', 'completed'];
    return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(status);
  };

  const calculateTotalPrice = () => {
    return orderInfo.cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };


  

  return (
    <Container>
      <Content>
      <Header>
          <StyledBackArrow src={BackArrow} alt="Back" onClick={() => navigate(-1)} />
          <SupportIcon src={Support} alt="Support" onClick={toggleSupportModal} />
        </Header>
        <StatusContainer>
          <PackageId>Package ID: {orderInfo.Id || 'N/A'}</PackageId>
          <StatusList>
            <StatusItem $completed={isCompleted('scheduled')}>Pickup scheduled</StatusItem>
            <StatusItem $completed={isCompleted('Pending')}>Pickup Approved</StatusItem>
            <StatusItem $completed={isCompleted('in Progress')}>Pickup Truck near you</StatusItem>
            <StatusItem $completed={isCompleted('completed')} $pulsating={isCompleted('completed')}>Pickup completed</StatusItem>
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
        <FooterButton onClick={handleTrackOrderClick}>Track Your Pickup</FooterButton>
      </Footer>
      <SupportModalContainer
        isOpen={isSupportModalOpen}
        onRequestClose={toggleSupportModal}
        contentLabel="Support Options"
        style={{
          overlay: {
            backgroundColor: 'transparent',
          },
          content: {
            top: '50px',        // Positioned 40px from the top of the viewport
            right: '10px',      // Positioned near the right edge of the viewport
            bottom: 'auto',
            left: 'auto',
            transform: 'none',  // Remove any translate transformations
            padding: '0',
            width: '150px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <ModalOption onClick={() => { /* Handle Help click */ }}>Help</ModalOption>
        <ModalOption onClick={handleCancelOrder}>Cancel Order</ModalOption>
      </SupportModalContainer>
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
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark semi-transparent overlay
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                  width: '50%', // Adjusted width for a better visual balance
                  padding: '10px',
                  borderRadius: '12px', // Softer rounded corners
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // Deeper shadow for a floating effect
                  backgroundColor: '#f9f9f9', // Soft background color
                  border: 'none',
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


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background: linear-gradient(135deg, #f3f2f8 0%, #e0e0e0 100%);
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
  min-height: 34px;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  position: fixed;
  top: 0;
  background: linear-gradient(135deg, #4b79a1 0%, #283e51 100%);
  padding: 8px 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1100;
`;

const SupportIcon = styled.img`
  width: 34px;
  height: 34px;
  margin-right: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const SupportModalContainer = styled(Modal)`
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 15px;
  width: 150px;
  z-index: 1000;
`;

const ModalOption = styled.div`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
`;

const StyledBackArrow = styled.img`
  width: 34px;
  height: 34px;
  margin-left: 5px;
  color: whitesmoke;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;



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

const ProfileButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4b4b4b;
  transition: color 0.3s ease;

  &:hover {
    color: #1a73e8;
  }
`;

const StatusContainer = styled.div`
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  padding: 25px;
  margin-top: 20px;
`;

const PackageId = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const StatusItem = styled.div`
  font-size: 18px;
  color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
  position: relative;
  padding-left: 35px;
  margin-bottom: 20px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:after {
    content: '';
    position: absolute;
    left: 11px;
    top: 25px;
    width: 2px;
    height: 40px;
    background-color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
    display: ${props => (props.$completed ? 'block' : 'none')};
  }

  &:last-child:after {
    display: none;
  }
`;


const OrderDetails = styled.div`
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  padding: 25px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f9f9f9;
  border-left: 6px solid #4caf50;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const Detail = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #444;
`;

const MaterialsContainer = styled.div`
  padding: 15px;
  background-color: #f1f1f1;
  border-left: 6px solid #4caf50;
  border-radius: 10px;
`;

const MaterialsHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const MaterialsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MaterialItem = styled.li`
  font-size: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  color: #555;

  &:last-child {
    border-bottom: none;
  }
`;

const TotalPrice = styled.li`
  font-size: 16px;
  padding: 10px 0;
  font-weight: bold;
  color: #000;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: linear-gradient(135deg, #4b79a1 0%, #283e51 100%);
  padding: 8px 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const FooterButton = styled.button`
  background: linear-gradient(135deg, #d0f5d3 0%, #d0f5d3 100%);
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: black;
  margin: 12px;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #ff6a3d 0%, #fe8c71 100%);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(0);
  }
`;


const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const ConfirmText = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e53935;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;



Modal.setAppElement('#root');
