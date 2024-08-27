import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Carousel, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Cart, Trash } from 'react-bootstrap-icons';

const ProductDescriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, similarProducts } = location.state;

  const [currentProduct, setCurrentProduct] = useState(product);
  const [currentSimilarProducts, setCurrentSimilarProducts] = useState(similarProducts);
  const [modalIsOpen, setModalIsOpen] = useState(false);


// //////////////////

  const [cart, setCart] = useState([]);

  const [greenPointsInCart, setGreenpointsincart] = useState(0);

  useEffect(() => {
    const totalGreenPoints = cart.reduce((total, item) => {
      return total + parseInt(item.greenPoints, 10);
    }, 0);

    setGreenpointsincart(totalGreenPoints);
  }, [cart])




//////////////////////

  const [question, setQuestion] = useState('');

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState('');


  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([
    // Sample saved addresses
    { name: 'gaduparthi sai teja', phone: '9390438443', address: 'plot no 37& 52,madhura nagarr,nizampet,telangana -500090' },
    { name: 'leoo', phone: '0987654321', address: 'plot -31,madhura nagarr,nizampet,telangana -500090' },
  ]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    const productDetailsSection = document.getElementById('productDetails');
      if (productDetailsSection) {
        productDetailsSection.style.display = 'block';
      }
  }, []);

  const styles = {
    container: {
      padding: '10px',
      backgroundColor: '#D6CDF6',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
  productSection: {
    padding: '7px',
    borderRadius: '10px',
    backgroundColor: '#f1f1f1',
  },
    cartIconContainer: {
      position: 'relative',
      cursor: 'pointer',
    },
    cartIcon: {
      fontSize: '24px',
    },
    cartBubble: {
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px',
    },
    productHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    productName: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    averageRating: {
      display: 'flex',
      alignItems: 'center',
    },
    imageSlider: {
      width: '100%',
      height: '40vh',         // Set a fixed height for the entire carousel
      marginBottom: '20px',
    },
    carouselItem: {
      width: '100%',
      height: '100%',  
      justifyContent: 'center',
      alignItems: 'center',  
      marginBottom: '10px',     // Ensure each Carousel.Item takes up the full height of the imageSlider
    },
    image: {
      maxWidth: '100%',        // Image scales to fit the container width
      height: '40vh',     // Image scales to fit the container height
      objectFit: 'contain',    // Ensures the whole image fits within the container without cropping
      borderRadius: '10px',
    },

    imageContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff', // White background to fill any empty space around the image
    },
    choicesSection: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
    },
    choiceCard: {
      flex: '0 0 100px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      textAlign: 'center',
      cursor: 'pointer',
    },
    productInfo: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    addressSection: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },

    giftWrapSection: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative', 
      width: '100%' ,
      marginBottom: '20px'
    },
    addressContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    locationIcon: {
      marginRight: '10px',
    },
    addressText: {
      fontSize: '16px',
    },
    savedAddressList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    savedAddressCard: {
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sectionHeader: {
      cursor: 'pointer',
      padding: '10px',
      backgroundColor: '#f1f1f1',
      borderRadius: '10px',
      marginBottom: '10px',
    },
    sectionContent: {
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '10px',
      display: 'none',
    },
    productGallery: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      marginTop: '20px',
    },
    questionSection: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    questionInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    questionButton: {
      backgroundColor: '#92E792',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
    },
    addButton: {
      backgroundColor: '#92E792',
      width: '30px',
      height: '30px',
      color: 'black',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    addCartButton: {
      backgroundColor: '#92E792',
      width: '180px',
      height: '40px',
      color: 'black',
      border: 'none',
      borderRadius: '13px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    BuyButton: {
      backgroundColor: '#FFFF00',
      width: '180px',
      height: '40px',
      color: 'black',
      border: 'none',
      borderRadius: '13px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    cartItemsContainer: {
      display: 'flex',
      overflowX: 'scroll',
      gap: '10px',
      padding: '10px 0',
    },
    cartItemCard: {
      minWidth: '200px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      textAlign: 'center',
      position: 'relative',
    },
    cartItemImage: {
      width: '100%',
      height: '95px',
      objectFit: 'cover',
      borderRadius: '10px',
      marginBottom: '10px',
    },
    cartItemInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    cartItemName: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    cartItemPrice: {
      marginBottom: '5px',
    },
    cartItemQuantity: {
      marginBottom: '10px',
    },
    trashIcon: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      cursor: 'pointer',
      color: 'red',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    cartAddButton: {
      width: '90px',
      height: '40px',
      backgroundColor: '#92E792',
      color: 'black',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    saveButton: {
      backgroundColor: '#ffbf00',
      width: '90px',
      height: '40px',
      color: 'black',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    similarProductsContainer: {
      marginTop: '10px',
      display: 'flex',
      overflowX: 'auto',
      gap: '10px',
      padding: '10px 0',
    },
    similarProductCard: {
      flex: '0 0 auto',
      width: '200px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      textAlign: 'center',
      cursor: 'pointer',
    },

    strikethrough: {
      textDecoration: 'line-through',
      color: 'black',
      marginRight: '10px',
    },
    discountedPrice: {
      color: 'green',
      fontSize: '27px', // Adjusted for larger font size
    },
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{ color: '#FFFF00' }}>
          &#9733;
        </span>
      ); // Full star
    }
  
    if (halfStar) {
      stars.push(
        <span key="half" style={{ color: '#FFFF00' }}>
          &#9733;
        </span>
      ); // Half star
    }
  
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <span key={i + 5} style={{ color: 'white' }}>
          &#9734;
        </span>
      ); // Empty star
    }

    return stars;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleSimilarProductClick = async (similarProduct) => {
    try {
      const response = await axios.get('https://recycle-backend-lflh.onrender.com/products');
      const newSimilarProducts = response.data.filter(p => p.category === similarProduct.category && p._id !== similarProduct._id);
      setCurrentProduct(similarProduct);
      setCurrentSimilarProducts(newSimilarProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.name !== item.name);
      }
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePaymentClick = () => {
    if (getTotalPrice() === '0.00') {
      alert('Please add items to the cart.');
    } else {
      handleSaveCart( cart );
      localStorage.setItem('cart', JSON.stringify( cart));
      navigate('/EcommerceWallet', { state: { cart, greenPointsInCart } });

    }
  };

  const handleSaveCart = async () => {
    try {
      const response = await axios.post(
        'https://recycle-backend-lflh.onrender.com/api/saveCart',
        { cart },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error saving cart:', error);
      alert('Failed to save cart.');
    }
  };

  const toggleSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section.style.display === 'none' || section.style.display === '') {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  };

  const handleGiftWrapChange = (e) => {
    setIsGiftWrap(e.target.checked);
  };

  const handleSendQuestion = () => {
    console.log('Question sent:', question);
    // Add logic to send question to the server or handle it as needed
    setQuestion(''); // Clear the input after sending
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Product Description</h1>
        <div style={styles.cartIconContainer} onClick={() => setModalIsOpen(true)}>
          <Cart style={styles.cartIcon} />
          {cart.length > 0 && <span style={styles.cartBubble}>{cart.length}</span>}
        </div>
      </div>
      <div style={styles.productHeader}>
        <p style={styles.productName}>{currentProduct.name}</p>
        <div style={styles.averageRating}>
          {renderStars(calculateAverageRating(currentProduct.reviews))}
        </div>
      </div>
      
      <Carousel style={styles.imageSlider}>
        {currentProduct.images.map((imageUrl, index) => (
          <Carousel.Item key={index} style={styles.carouselItem}>
            <div style={styles.imageContainer}>
              <img
                className="d-block"
                src={imageUrl}
                alt={`${currentProduct.name} image ${index + 1}`}
                style={styles.image} 
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div style={styles.productSection}>
            <div style={styles.choicesSection}>
              <div style={styles.choiceCard}>Color</div>
              <div style={styles.choiceCard}>Weight</div>
              <div style={styles.choiceCard}>Features</div>
            </div>
            <div style={styles.productInfo}>
              <p>
                <span>M.R.P </span>
                <span style={styles.strikethrough}>₹{currentProduct.price}</span>
                <span style={styles.discountedPrice}>
                  ₹{calculateDiscountedPrice(currentProduct.price, currentProduct.discount)} ({currentProduct.discount}% off)
                </span>
              </p>
              <p>{currentProduct.description}</p>
              {cart.find((item) => item.name === currentProduct.name) ? (
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.addButton}
                    onClick={() => removeFromCart(currentProduct)}
                  >
                    -
                  </button>
                  <span>{cart.find((item) => item.name === currentProduct.name)?.quantity || 0}</span>
                  <button
                    style={styles.addButton}
                    onClick={() => addToCart(currentProduct)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button style={styles.addCartButton} onClick={() => addToCart(currentProduct)}>Add to Cart</button>
              )}
              <button style={styles.BuyButton} onClick={() => console.log('Buy now')}>Buy Now</button>
            </div>


            <div
              style={styles.addressContainer}
              onClick={() => setShowAddressModal(true)}
            >
              <div style={styles.locationIcon}>📍</div>
              <div style={styles.addressText}>
                Deliver to: {address || 'Select an address'}
              </div>
            </div>


            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Choose Your Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={styles.savedAddressList}>
                  {savedAddresses.map((addr, index) => (
                    <div
                      key={index}
                      style={styles.savedAddressCard}
                      onClick={() => {
                        setAddress(addr.address);
                        setShowAddressModal(false);
                      }}
                    >
                      <div>{addr.name}</div>
                      <div>{addr.phone}</div>
                      <div>{addr.address}</div>
                    </div>
                  ))}
                </div>
              </Modal.Body>
            </Modal>
            <div style={styles.giftWrapSection}>
                  <div style={{ position: 'absolute', left: '20' }}>
                    <label>
                      <input
                        type="checkbox"
                        style={{ marginRight: '10px' }}
                        checked={isGiftWrap}
                        onChange={handleGiftWrapChange}
                      />
                      Gift-wrap this order
                    </label>
                  </div>
                </div>

            <div style={styles.addressSection}>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('productDetails')}>
                                    Product Details
                                  </div>
                                  <div className="sectionContent" id="productDetails" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('productSpecifications')}>
                                    Product Specifications
                                  </div>
                                  <div className="sectionContent" id="productSpecifications" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('aboutBrand')}>
                                    About the Brand
                                  </div>
                                  <div className="sectionContent" id="aboutBrand" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('additionalDetails')}>
                                    Additional Details
                                  </div>
                                  <div className="sectionContent" id="additionalDetails" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                
                                
                          </div>

              </div>
            <div style={styles.productGallery}>
              <h3>Product Image Gallery</h3>
              <div vertical="true">
                {currentProduct.images.map((imageUrl, index) => (
                    <div key={index} style={styles.carouselItem}>
                      <div style={styles.imageContainer}>
                        <img
                          className="d-block"
                          src={imageUrl}
                          alt={`${currentProduct.name} image ${index + 1}`}
                          style={styles.image} 
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div style={styles.questionSection}>
              <h3>Questions to Ask</h3>
              <input
                type="text"
                placeholder="Ask a question..."
                style={styles.questionInput}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button style={styles.questionButton} onClick={handleSendQuestion}>
                Send
              </button>
            </div>
            <div style={styles.reviewContainer}>
              <h3>Reviews</h3>
              {currentProduct.reviews.map((review, index) => (
                <div key={index}>
                  <p><strong>{review.user}</strong> ({new Date(review.date).toLocaleDateString()})</p>
                  <div style={styles.starContainer}>{renderStars(review.rating)}</div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
       
      <h3 style={{marginTop: '10px' }}>Similar Products</h3>
      <div style={styles.similarProductsContainer}>
          {currentSimilarProducts.map((similarProduct, index) => {
            const averageRating = calculateAverageRating(similarProduct.reviews);
            return (
              <div key={index} style={styles.similarProductCard} onClick={() => handleSimilarProductClick(similarProduct)}>
                <img
                  src={similarProduct.images[0]} 
                  alt={similarProduct.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                />
                <p>{similarProduct.name}</p>
                <p>
                  <span>M.R.P </span>
                  <span style={styles.strikethrough}>₹{similarProduct.price}</span>
                  <span style={styles.discountedPrice}>
                    ₹{calculateDiscountedPrice(similarProduct.price, similarProduct.discount)} ({similarProduct.discount}% off)
                  </span>
                </p>
                <div style={styles.starContainer}>{renderStars(averageRating)}</div>
                {cart.find((item) => item.name === similarProduct.name) ? (
                  <div style={styles.buttonContainer}>
                    <button
                      style={styles.addButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(similarProduct);
                      }}
                    >
                      -
                    </button>
                    <span>{cart.find((item) => item.name === similarProduct.name)?.quantity || 0}</span>
                    <button
                      style={styles.addButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(similarProduct);
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.addCartButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(similarProduct);
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      <Modal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cart Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={styles.cartItemsContainer}>
            {cart.map((item, index) => (
              <div key={index} style={styles.cartItemCard}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={styles.cartItemImage}
                />
                <div style={styles.cartItemInfo}>
                  <span style={styles.cartItemName}>{item.name}</span>
                  <span style={styles.cartItemPrice}>₹{item.price}</span>
                  <span style={styles.cartItemQuantity}>x{item.quantity}</span>

                  <span style={{color:"green"}}>greenPoints:{item.greenPoints}</span>
                </div>
                <Trash style={styles.trashIcon} onClick={() => removeFromCart(item)} />
              </div>
            ))}
          </div>
          <h3>Total: ₹{getTotalPrice()}</h3>

           
          <h3>Total Green points:♻️ {greenPointsInCart}</h3>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePaymentClick}>
            Continue
          </Button>
          <Button variant="warning" onClick={handleSaveCart}>
            Save Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDescriptionPage;
