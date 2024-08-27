import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, FormControl, InputGroup, ButtonGroup } from 'react-bootstrap';
import { ArrowLeft, Cart, Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const ButtonGroupWrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 15px;
  color: white;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  display: flex;
  flex-wrap: nowrap;
  color: white;
`;

const CategoryButton = styled(Button)`
  background-color: white;
  border-color: white;
  margin-right: 5px;
  flex: 0 0 auto;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #9FD4A3;
    color: white;
  }
`;

const FixedHeader = styled.div`
  background-color: #402E7A;
  padding: 10px 15px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const ScrollableContent = styled.div`
  background-color: #D6CDF6;
  padding-top: 160px; /* Adjusting padding to account for the header and search/category section */
  overflow-y: auto;
  height: calc(100vh - 130px); /* Adjusting height to account for the footer */
`;

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CartIconWrapper = styled.div`
  position: relative;
`;

const CartBubble = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: yellow;
  color: black;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
`;

const MarketPrice = ({ updateCart, cart }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/api/recycling-materials');
        const categoryData = {};
        response.data.forEach(category => {
          categoryData[category.category] = category.items;
        });
        setCategories(categoryData);
        setAllItems(response.data.flatMap(category => category.items));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    setTimeout(() => {
      setLoading(false);
      fetchCategories();
    }, 4000);
  }, []);

  useEffect(() => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  const handleAdd = (item) => {
    const itemKey = `${item.name}-${item.itemId}`;
  
    const updatedQuantities = {
      ...quantities,
      [itemKey]: (quantities[itemKey] || 0) + 1,
    };
    
    setQuantities(updatedQuantities);
  
    const updatedCart = cart.some(cartItem => cartItem.itemId === item.itemId)
      ? cart.map(cartItem =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: updatedQuantities[itemKey] }
            : cartItem
        )
      : [...cart, { ...item, quantity: 1 }];
  
    updateCart(updatedCart);
  };
  
  const handleMinus = (item) => {
    const itemKey = `${item.name}-${item.itemId}`;
  
    if (quantities[itemKey] > 0) {
      const updatedQuantities = {
        ...quantities,
        [itemKey]: quantities[itemKey] - 1,
      };
  
      setQuantities(updatedQuantities);
  
      const updatedCart = cart
        .map(cartItem =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: updatedQuantities[itemKey] }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0);
  
      updateCart(updatedCart);
    }
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return allItems.filter(item => item.name.toLowerCase().includes(searchTerm));
    }
    return categories[selectedCategory]?.filter(item => item.name.toLowerCase().includes(searchTerm)) || [];
  };

  const filteredItems = getFilteredItems();

  return (
    <Container fluid style={{ backgroundColor: '#b29dfa', minHeight: '100vh', padding: '0' }}>
      {loading ? (
        <CenteredLoader>
          <iframe 
            src="https://lottie.host/embed/9d9ed392-5459-4927-8c94-a74d323a09b5/f0jEp4ugFb.json"
            style={{ width: '300px', height: '300px', border: 'none' }}
          ></iframe>
        </CenteredLoader>
      ) : (
        <>
          <FixedHeader>
            <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Col xs="auto" onClick={() => navigate('/sell-buy')} style={{ cursor: 'pointer', color: 'white ' }}>
                <ArrowLeft size={30} />
              </Col>
              <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                Market Price
                <div style={{ marginLeft: 'auto', fontSize: '18px' }}>Today</div>
              </Col>
              <Col xs="auto" style={{ display: 'flex', alignItems: 'center' }}>
                <CartIconWrapper>
                  <Cart size={30} style={{ cursor: 'pointer', color: 'white', marginRight: '15px' }} onClick={() => navigate('/pickup-info', { state: { cart } })} />
                  {cartCount > 0 && <CartBubble>{cartCount}</CartBubble>}
                </CartIconWrapper>
              </Col>
            </Row>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={handleSearch}
              />
            </InputGroup>
            <ButtonGroupWrapper>
              <StyledButtonGroup>
                <CategoryButton
                  variant={selectedCategory === 'all' ? 'success' : 'outline-light'}
                  onClick={() => setSelectedCategory('all')}
                  style={{ color: 'black' }}
                >
                  All
                </CategoryButton>
                {Object.keys(categories).map((category, idx) => (
                  <CategoryButton
                    key={idx}
                    variant={selectedCategory === category ? 'success' : 'outline-light'}
                    onClick={() => setSelectedCategory(category)}
                    style={{ color: 'black' }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </CategoryButton>
                ))}
              </StyledButtonGroup>
            </ButtonGroupWrapper>
          </FixedHeader> ------------------------------ #9FD4A3 ----------- other colors
          <ScrollableContent>
            <Row className="mb-3" style={{ margin: '10px 5px' }}>
              <Col xs={12}>
                {filteredItems.map((item, index) => (
                  <Card key={index} style={{ backgroundColor: 'white', border: 'none', color: 'black', padding: '15px', marginBottom: '10px', height: '150px' }}>
                    <Row>
                      <Col xs={5} style={{ padding: '19px', marginRight: '45px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img src={item.imageUrl} alt={item.name} style={{height:'90%', width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={5} style={{ backgroundColor: '#f3f2f8', height: "100px", borderRadius: "10px", marginRight: '2px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', justifyContent: 'space-between', height: '100%', fontFamily: 'SanFrancisco', fontWeight: '150' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '14px' }}>{item.name}</div><br />
                            <div style={{ fontSize: '18px' }}>₹ {item.price}/KG</div>
                          </div>
                          <div style={{ color: 'black', display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: '15px' }}>
                            <Button style={{ color: 'black', border: 'solid', borderColor: '#f1f1f1' }} variant="outline-light" onClick={() => handleMinus(item)}>-</Button>
                            <span>{quantities[`${item.name}-${item.itemId}`] || 0}</span>
                            <Button style={{ color: 'black', border: 'solid', borderColor: '#f1f1f1' }} variant="outline-light" onClick={() => handleAdd(item)}>+</Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Col>
            </Row>
          </ScrollableContent>
          <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#eaeaea', padding: '10px 0', margin: '0' }}>
            <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
                <CurrencyRupee size={30} />
                <span>Market Price</span>
              </div>
              <div onClick={() => navigate('/pickup-list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
                <Clipboard size={30} />
                <span>Pick up Status</span>
              </div>
              <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
                <Person size={30} />
                <span>Profile</span>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default MarketPrice;
