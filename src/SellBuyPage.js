import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faStore, faRecycle } from '@fortawesome/free-solid-svg-icons';

const SellBuyPage = () => {
  const navigate = useNavigate();

  const handleSellClick = () => {
    navigate('/market-price');
  };

  const handleBuyClick = () => {
    navigate('/EcommerceHome');
  };

  return (
    <Container>
      <LogoContainer>
        <Icon icon={faRecycle} style={{ fontSize: '110px' }} color="#B2E851" />
        <Logo>Green Cycle</Logo>
      </LogoContainer>
      <ButtonContainer>
        <StyledButton onClick={handleSellClick} color="white">
          <IconSell icon={faIndianRupeeSign} />
          <ButtonText>Sell</ButtonText>
        </StyledButton>
        <StyledButton onClick={handleBuyClick} color="white">
          <IconBuy icon={faStore} />
          <ButtonText>Buy</ButtonText>
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default SellBuyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #b29dfa;

`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Logo = styled.h1`
  color: #36454F;
  font-size: 68px;
  margin-left: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn ;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.color};
  color: white;
  width: 250px;
  height: 180px;
  border: none;
  border-radius: 20%;
  cursor: pointer;
  margin-bottom: 40px;
  font-size: 38px;
  font-weight: bold;
  font-family: 'Rhodium Libre', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before, &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }

  &:before {
    width: 350px;
    height: 350px;
    top: -75px;
    left: -50px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
    z-index: -2;
  }

  &:after {
    width: 300px;
    height: 300px;
    top: -50px;
    left: -25px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    z-index: -1;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }

  &:focus {
    outline: none;
  }
`;

const ButtonText = styled.span`
  color:  #36454F;
  margin-bottom: 40px;
  z-index: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.color || '#DAF7A6'};
  margin-top: 20px;
  margin-bottom: 5px;
  font-size: 56px;
  z-index: 1;
`;

const IconSell = styled(FontAwesomeIcon)`
  color: ${(props) => props.color || '#B1F7A6'};
  margin-top: 20px;
  margin-bottom: 5px;
  font-size: 56px;
  z-index: 1;
`;

const IconBuy = styled(FontAwesomeIcon)`
  color: ${(props) => props.color || '#A6DAF7'};
  margin-top: 20px;
  margin-bottom: 5px;
  font-size: 56px;
  z-index: 1;
`;
