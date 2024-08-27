import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const AccountInfo = () => {
  const [userData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loginCredits, setLoginCredits] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfileData(response.data);
        setLoginCredits(response.data.loginCredentials[0]);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.post('https://recycle-backend-lflh.onrender.com/api/users', userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Account Information</h2>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                Personal Information 
                <FaEdit
                  style={{ float: 'right', cursor: 'pointer' }}
                  onClick={() => setEditMode(true)}
                />
              </Card.Title>
              {editMode ? (
                <Form>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={loginCredits.username || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={userData.name || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formContact">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={userData.contactNumber || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSave}>
                    Save
                  </Button>
                </Form>
              ) : (
                <div>
                  <p>Username: {loginCredits.username}</p>
                  <p>Name: {userData.name}</p>
                  <p>Contact: {userData.contactNumber}</p>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Account Balance</Card.Title>
              <p>Wallet Balance: {userData.wallet}</p>
              <p>Green Points: {userData.greenpoints}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountInfo;
