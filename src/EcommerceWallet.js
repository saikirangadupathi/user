import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartDetails from './cartDetails';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { Shop, WalletFill, TagFill, PersonCircle } from 'react-bootstrap-icons';

const EcommerceWallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(location.state?.cart || []);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [greenPointsInCart] = useState(location.state?.greenPointsInCart || 0);
  const cartDetailsRef = useRef();
  const [showLottie, setShowLottie] = useState(false);
  const [profileGreenPoints, setProfileGreenPoints] = useState('');
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        let finalres=response.data



          console.log('profiledata..',finalres);
          setProfileData(finalres);
          setWalletBalance(Number(finalres.wallet) || 0);
          setProfileGreenPoints(finalres.greenpoints);


        
        


      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const timer = setTimeout(() => setLoading(false), 3000);
    fetchProfileData();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);
  console.log('profileGreenPoints',(profileGreenPoints));
  const Footer = ({ navigate }) => (
    <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'white', padding: '10px 0', margin: '0' }}>
      <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div onClick={() => navigate('/EcommerceHome')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <Shop size={30} />
          <span>Shopping</span>
        </div>
        <div onClick={() => navigate('/couponPage')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <TagFill size={30} />
          <span>Coupons</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
          <WalletFill size={30} />
          <span>Wallet</span>
        </div>
        <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <PersonCircle size={30} />
          <span>Profile</span>
        </div>
      </Col>
    </Row>
  );

  function getCurrentISTDate() {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
    const istDate = new Date(now.getTime() + offset);
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const styles = {
    ecommerceWallet: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#e6ebf0',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: '130px'
    },
    walletContainer: {
      backgroundColor: '#92E792',
      color: 'black',
      padding: '20px',
      textAlign: 'center',
      borderRadius: '10px',
      margin: '20px',
      fontSize: '20px', // Updated font size
      fontWeight: 'bold' // Added font weight
    },
    section: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      margin: '10px',
    },
    walletBalance: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    checkbox: {
      marginLeft: '10px'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px',
      backgroundColor: '#fff'
    },
    addButton: {
      backgroundColor: '#6a1b9a',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    paymentSection: {
      margin: '10px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '180px'
    },
    radioContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start'
    },
    radioOption: {
      marginBottom: '10px'
    },
    lottieFullScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      zIndex: 9999,
    },
    iframePlayer: {
      width: '100%',
      height: '100%'
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleWalletAmountChange = (e) => {
    const value = Math.min(parseFloat(e.target.value) || 0, walletBalance, getTotalPrice());
    setWalletAmount(value);
  };

  const handleWalletCheckboxChange = (e) => {
    setUseWallet(e.target.checked);
    if (!e.target.checked) {
      setWalletAmount(0);
    }
  };

  const getFinalAmount = () => {
    const totalPrice = parseFloat(getTotalPrice());
    return (totalPrice - walletAmount).toFixed(2);
  };

  const updateGreenPoints = async (newBalance) => {
    try {
      const response = await axios.post('https://recycle-backend-lflh.onrender.com/api/updateGreenPoints', { greenpoints: newBalance }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setProfileGreenPoints(response.data.greenpoints);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const updateWalletBalance = async (newBalance) => {
    try {
      const response = await axios.post('https://recycle-backend-lflh.onrender.com/api/updateWallet', { wallet: newBalance }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWalletBalance(Number(response.data.wallet) || 0);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const updateReCommerceOrderHistory = async (orderData) => {
    try {
      await axios.post('https://recycle-backend-lflh.onrender.com/api/updateReCommerceOrderHistory', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      console.error('Error updating reCommerce order history:', error);
    }
  };

  const handlePayment = async () => {
    const cartDetails = cartDetailsRef.current.getDetails();

    // Validate required data
    if (!cartDetails.name) {
        alert('Name is required.');
        return;
    }
    if (!cartDetails.phone) {
        alert('Contact (Phone number) is required.');
        return;
    }
    if (!cartDetails.address) {
        alert('Shipping address is required.');
        return;
    }
    if (!cartDetails.location) {
        alert('Location is required.');
        return;
    }
    if (cart.length === 0) {
        alert('Cart is empty.');
        return;
    }

    const orderId = `ORD${new Date().getTime()}`;

    const orderData = {
        id: orderId.toString(),
        userId: profileData.id, // Ensure this is available in profileData
        name: cartDetails.name,
        contact: cartDetails.phone,
        location: {
            address: cartDetails.address,
            lat: cartDetails.location.lat,
            lng: cartDetails.location.lng
        },
        cart: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            sellerId: item.sellerId,
            quantity: item.quantity,
            price: item.price,
            status: 'orderplaced',
        })),
        totalPrice: parseFloat(getTotalPrice()),
        status: 'orderplaced',
        date: getCurrentISTDate(),
        paymentMethod: selectedPaymentMethod,
        greenPoints: greenPointsInCart,
        orderHistory: [{
            status: 'orderplaced',
            date: new Date(),
            remarks: 'Order placed successfully'
        }]
    };
    console.log('address..',cartDetails.address); 

    try {
        const response = await axios.post('https://recycle-backend-lflh.onrender.com/api/order', orderData);
        console.log('Order placed successfully:', response.data);
        alert('Order placed successfully');

        // Update green points in local storage
        const totalGreenPoints = parseInt(profileGreenPoints) + parseInt(greenPointsInCart);
        console.log('total greenpoints', totalGreenPoints);
        localStorage.setItem('greenPoints', totalGreenPoints);

        await updateGreenPoints(totalGreenPoints);

        // Update wallet balance
        const newWalletBalance = walletBalance - walletAmount;
        await updateWalletBalance(newWalletBalance);

        // Update reCommerceOrderHistory
        const reCommerceOrderHistoryData = {
            id: orderId,
            totalPrice: orderData.totalPrice,
            date: orderData.date,
            greenpoints: greenPointsInCart
        };
        await updateReCommerceOrderHistory(reCommerceOrderHistoryData);

        // Show Lottie animation
        setShowLottie(true);
        // Hide Lottie animation after 5.5 seconds
        setTimeout(() => {
            setShowLottie(false);
        }, 4500);
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
    }
};


  return (
    <>
      {showLottie && (
        <div style={styles.lottieFullScreen}>
          <iframe 
            src="https://lottie.host/embed/bc670896-1c25-4765-ac0d-f4bb2f5e800a/UmXfG7vjzs.json" 
            style={styles.iframePlayer}
            title="Order Confirmation Animation"
          ></iframe>
        </div>
      )}
      {!showLottie && (
        <div style={styles.ecommerceWallet}>
          <div style={styles.walletContainer}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>
              <span role="img" aria-label="coins">🪙</span> Wallet Balance: ₹{walletBalance.toFixed(2)}
            </div>
          </div>
          {cart.length > 0 && (
            <CartDetails
              ref={cartDetailsRef}
              getTotalPrice={getTotalPrice}
              useWallet={useWallet}
              walletAmount={walletAmount}
              getFinalAmount={getFinalAmount}
            />
          )}
          <section style={styles.section}>
            <h3>Wallet Balance</h3>
            <div style={styles.walletBalance}>
              <label>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={useWallet}
                  onChange={handleWalletCheckboxChange}
                />
                Use Wallet Balance
              </label>
              {useWallet && (
                <div>
                  <input
                    type="number"
                    value={walletAmount}
                    onChange={handleWalletAmountChange}
                    max={Math.min(walletBalance, getTotalPrice())}
                  />
                  <div>Remaining: ₹{(walletBalance - walletAmount).toFixed(2)}</div>
                </div>
              )}
            </div>
          </section>
          <section style={styles.paymentSection}>
            <h3>Choose Payment Method</h3>
            <div style={styles.radioContainer}>
              <label style={styles.radioOption}>
                <input
                  type="radio"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                UPI Payment
              </label>
              <label style={styles.radioOption}>
                <input
                  type="radio"
                  value="razorpay"
                  checked={selectedPaymentMethod === 'razorpay'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                Razorpay Payment
              </label>
            </div>
            <button style={styles.addButton} onClick={handlePayment}>Make Payment</button>
          </section>
          <Footer navigate={navigate} />
        </div>
      )}
    </>
  );
};

export default EcommerceWallet;
