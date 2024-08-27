import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Image, ListGroup, ListGroupItem } from 'react-bootstrap';
import { ArrowLeft, ChevronRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Goku from './sonGoku.jpg';

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #5e348b;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const timer = setTimeout(() => setLoading(false), 3000);

    fetchProfileData();

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <CenteredLoader>
        <iframe
          src="https://lottie.host/embed/986cc7f5-3bf9-4d59-83d4-c35c6e3d608a/0mitlmdS4c.json"
          style={{ width: '300px', height: '300px', border: 'none' }}
        ></iframe>
      </CenteredLoader>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: '#5e348b', height: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
      <Row style={{ padding: '10px 15px', backgroundColor: '#5e348b', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Col xs="auto" onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: 'white' }}>
          <ArrowLeft size={30} />
        </Col>
        <Col xs="auto" onClick={handleLogout} style={{ cursor: 'pointer', color: 'white' }}>
          Logout
        </Col>
      </Row>
      <Row className="mb-3" style={{ justifyContent: 'center', alignItems: 'center', margin: '0 15px' }}>
        <Col xs={12} style={{ backgroundColor: '#8bc34a', borderRadius: '10px', padding: '15px', color: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>Your scorecard in our contributions</div>
          <Row style={{ justifyContent: 'space-around' }}>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  CO2
                </div>
                <div>0.0012KT</div>
              </div>
            </Col>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  Trees
                </div>
                <div>32 Trees</div>
              </div>
            </Col>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  Waste
                </div>
                <div>0.001KT</div>
              </div>
            </Col>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  Energy
                </div>
                <div>40KWh</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-3" style={{ justifyContent: 'center', alignItems: 'center', margin: '0 15px', flex: '1 0 auto' }}>
        <Col xs={12} style={{ textAlign: 'center' }}>
          <Image src= {Goku} roundedCircle style={{ width: '200px', height: '200px', marginBottom: '15px' }} />
        </Col>
        <Col xs={12} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '0', color: '#5e348b', marginBottom: '15px' }}>
          <ListGroup variant="flush">
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 10px' }} onClick={() => navigate('/account-info')}>
              My Account
              <ChevronRight size={20} />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 10px' }}>
              Payments
              <ChevronRight size={20} />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 10px' }} onClick={() => navigate('/previous-orders')}>
              Previous Orders
              <ChevronRight size={20} />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ padding: '15px 10px' }}>
              Help
              <ChevronRight size={20} />
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
