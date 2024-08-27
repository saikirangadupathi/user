import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'react-bootstrap-icons';
import { ArrowLeft } from 'react-bootstrap-icons';
import axios from 'axios';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { Shop, WalletFill, TagFill, PersonCircle } from 'react-bootstrap-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

Modal.setAppElement('#root');

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const EcommerceHome = () => {
  const navigate = useNavigate();
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [level, setLevel] = useState(0);
  const [filterPrice, setFilterPrice] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [greenPoints, setGreenPoints] = useState(0);
  const [showEcoFriendly, setShowEcoFriendly] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setGreenPoints(response.data.greenpoints || 0);
        setLevel(Math.floor(response.data.greenpoints / 100));

        // Save shoppingSavedCart to local storage as 'cart'
        const savedCart = response.data.shoppingSavedCart || [];
        localStorage.setItem('cart', JSON.stringify(savedCart));
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://recycle-backend-lflh.onrender.com/products');
        setProducts(response.data);
        setLoading(false);
        console.log('Products..',products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    setTimeout(() => {
      setShowLoadingSpinner(false);
      fetchProfileData();
      fetchProducts();
    }, 3000);
  }, []);

  const Footer = ({ navigate }) => (
    <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'white', padding: '10px 0', margin: '0' }}>
      <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
          <Shop size={30} />
          <span>Shopping</span>
        </div>
        <div onClick={() => navigate('/couponPage')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <TagFill size={30} />
          <span>Coupons</span>
        </div>
        <div onClick={() => navigate('/EcommerceWallet')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
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

  const styles = {
    ecommerceHome: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#D6CDF6',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      marginBottom: '71px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      fontSize: '24px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
    profileIcon: {
      fontSize: '24px',
      cursor: 'pointer',
    },
    levelContainer: {
      backgroundColor: '#201E43',
      color: 'whitesmoke',
      padding: '20px',
      textAlign: 'center',
    },
    levelInfo: {
      fontWeight: '600',
      fontFamily: 'Rhodium libre',
      fontSize: '30px',
      marginBottom: '10px',
      marginRight: '65px',
    },
    progressInfo: {
      color: '#92E792',
      fontSize: '16px',
      marginTop: '10px',
      marginRight: '0px',
    },
    greenPointsInfo: {
      fontFamily: 'Rhodium libre',
      fontSize: '20px',
      marginBottom: '10px',
    },
    progressBar: {
      backgroundColor: 'white',
      borderRadius: '10px',
      height: '10px',
      overflow: 'hidden',
      width: '100%',
    },
    progress: {
      backgroundColor: '#92E792',
      height: '100%',
      width: `${greenPoints % 100}%`,
      transition: 'width 0.5s',
    },
    section: {
      padding: '20px',
      overflowY: 'auto',
      flex: 1,
    },
    categoriesContainer: {
      display: isSearching ? 'none' : 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gap: '10px',
      overflowX: 'auto',
      padding: '10px 0',
    },
    itemsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      padding: '10px 0',
      height: '100%',
    },
    categoryItem: {
      minWidth: '150px',
      backgroundColor: '#fff',
      fontFamily: 'Rhodium libre',
      border: '1px solid #ccc',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    activeCategoryItem: {
      minWidth: '150px',
      backgroundColor: '#508C9B',
      border: '1px solid #ccc',
      borderRadius: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '9px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      color: 'whitesmoke',
    },
    item: {
      height: '300px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },

    image: {
      width: '100%',  // Make the image take full width of the container
      height: 'auto',  // Maintain aspect ratio
      maxHeight: '60%', // Ensure the image doesn’t exceed 60% of the container height
      objectFit: 'cover',  // Cover the container space while maintaining aspect ratio
      borderRadius: '10px 10px 0 0',  // Match the top corners of the item container
      marginBottom: 'auto',  // Push the image to the top of the container
    },

    imageitem: {
      height: '250px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
    itemName: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    price: {
      fontSize: '14px',
      color: '#757575',
    },
    filterSortContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },

    filterModal:{
      maxHeight: '150px',
    },
    select: {
      padding: '5px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    toggleButton: {
      backgroundColor: showEcoFriendly ? '#CFE77A' : '#fff',
      color: showEcoFriendly ? '#36454F' : 'black',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '205px',
      marginTop: '20px',
      marginLeft: '0px',
      marginBottom: '10px',
      alignSelf: 'flex-start',
    },
    filterIcon: {
      marginLeft: '10px',
      fontSize: '24px',
      cursor: 'pointer',
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    searchInput: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    searchIcon: {
      marginLeft: '10px',
      fontSize: '24px',
      cursor: 'pointer',
    },
    suggestionsContainer: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
      width: '100%',
    },
    suggestionItem: {
      padding: '10px',
      cursor: 'pointer',
      textAlign: 'left',
    },
    carouselContainer: {
      display: isSearching ? 'none' : 'block',
      marginTop: '20px',
    },
  };

  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'HomeLiving', 'PersonelCare', 'Stationery', 'BathroomEssentials', 'Cleaning', 'Kitchenware'];

  const handleFilterPrice = (event) => {
    setFilterPrice(event.target.value);
  };

  const handleSortOption = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearch = () => {
    setIsSearching(true);
    let results = products.filter((product) => {
      const name = product.name || '';
      const brand = product.brand || '';
      const category = product.category || '';
      return (
        name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        brand.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        category.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    });
    setSearchResults(results);
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filteredSuggestions = products.filter((product) => {
        const name = product.name || '';
        return (
          name.toLowerCase().startsWith(query.toLowerCase()) 
        );
      }).map(product => product.name);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const getFilteredAndSortedItems = () => {
    let items = products.filter(product => product.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    if (filterPrice) {

      items = items.filter((item) => item.price <= filterPrice);
    }

    if (showEcoFriendly) {
      items = items.filter((item) => item.ecoFriendly);
    }

    if (sortOption === 'name') {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'price-asc') {
      items = items.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      items = items.sort((a, b) => b.price - a.price);
    }

    return items;
  };

  const handleProductClick = async (product, index) => {
    try {
      let productId = product.id;
      if (!productId) {
        productId = `productid${Date.now()}`;
        product.id = productId;
      }
  
      const performance = product.performance || { views: 0 };
      performance.views += 1;
  
      const response = await axios.put(`https://recycle-backend-lflh.onrender.com/api/products/${product.id}/update-performance`, {
        id: productId,
        performance
      });
      
      const updatedProduct = response.data;
      console.log('updatedproduct',updatedProduct );
      navigate(`/product-description/${index}`, {
        state: {
          product: updatedProduct,
          similarProducts: products.filter((p) => p.category === product.category && p.id !== product.id),
        },
      });
    } catch (error) {
      console.error('Error updating product performance:', error);
    }
  };
  
  

  const renderProducts = (productsList) => {
    if (productsList.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', color: '#757575' }}>
          Not found
        </div>
      );
    }

    return productsList.map((product, index) => (
      <div
        key={index}
        style={styles.item}
        onClick={() => handleProductClick(product, index)}
      >
        <div style={styles.itemInfo}>
        <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  style={styles.image} 
                />
          <div style={styles.itemName}>{product.name}</div>
          <div style={styles.price}>Price: ₹{product.price}</div>
          {product.ecoFriendly && (
            <div style={styles.price}>
              Green Points: {product.greenPoints}
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#b29dfa' }}>
        <CenteredLoader>
          <iframe 
            src="https://lottie.host/embed/986cc7f5-3bf9-4d59-83d4-c35c6e3d608a/0mitlmdS4c.json"
            style={{ width: '300px', height: '300px', border: 'none' }}
          ></iframe>
        </CenteredLoader>
      </div>
    );
  }

  return (
    <div style={styles.ecommerceHome}>
      <div style={styles.levelContainer}>
        <span style={styles.levelInfo}>
          <span role="img" aria-label="coins">🪙</span> Level - {level}
        </span>
        <span style={styles.greenPointsInfo}>
          Green Points: {greenPoints}
        </span>
        <div style={styles.progressBar}>
          <div style={styles.progress}></div>
        </div>
        <span style={styles.progressInfo}>
          {100 - (greenPoints % 100)} Points to next level
        </span>
      </div>
      <div style={styles.searchContainer}>
        {isSearching && <ArrowLeft onClick={resetSearch} style={{ cursor: 'pointer', color: 'black', marginRight: '10px' }} size={30} />}
        <input
          type="text"
          placeholder="Search products, brands, categories..."
          value={searchQuery}
          onChange={handleInputChange}
          style={styles.searchInput}
        />
        <Search style={styles.searchIcon} onClick={handleSearch} />
        {suggestions.length > 0 && (
          <div style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      <section style={styles.section}>
        <div style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={selectedCategory === category ? styles.activeCategoryItem : styles.categoryItem}
              onClick={() => setSelectedCategory(category)}
            >
              <div style={styles.itemName}>{category}</div>
            </div>
          ))}
        </div>
        <div>
          <button style={styles.toggleButton} onClick={() => setShowEcoFriendly(!showEcoFriendly)}>
            Eco-friendly
          </button>
          <span style={styles.filterIcon} onClick={() => setFilterModalIsOpen(true)}>
            <Filter />
          </span>
        </div>
        <div style={styles.carouselContainer}>
        <Carousel 
              responsive={{ 
                superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 }, 
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 }, 
                tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 }, 
                mobile: { breakpoint: { max: 464, min: 0 }, items: 1 } 
              }}
              autoPlay={true} 
              autoPlaySpeed={3000} // 5000 ms = 5 seconds
              infinite={true} // Makes the carousel loop infinitely
              // showDots={true} // Optional: Displays dots for navigation
            >
              {products.map((product, index) => (
                <div key={index} style={styles.item}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    style={styles.imageitem} 
                  />
                  <div style={styles.itemName}>{product.name}</div>
                  <div style={styles.price}>Price: ₹{product.price}</div>
                </div>
              ))}
            </Carousel>
        </div>
        <div style={styles.itemsContainer}>
          {searchResults.length > 0 ? renderProducts(searchResults) : renderProducts(getFilteredAndSortedItems())}
        </div>
      </section>
      <Footer navigate={navigate} />
      <Modal
        isOpen={filterModalIsOpen}
        onRequestClose={() => setFilterModalIsOpen(false)}
        style={styles.filterModal}
        contentLabel="Filter Options"
      >
        <h2>Filter Options</h2>
        <div style={styles.filterSortContainer}>
          <select style={styles.select} value={filterPrice} onChange={handleFilterPrice}>
            <option value="">Filter by price</option>
            <option value="100">Up to ₹100</option>
            <option value="200">Up to ₹200</option>
            <option value="300">Up to ₹300</option>
            <option value="400">Up to ₹400</option>
            <option value="500">Up to ₹500</option>
            <option value="600">Up to ₹600</option>
            <option value="700">Up to ₹700</option>
            <option value="800">Up to ₹800</option>
            <option value="900">Up to ₹900</option>
            <option value="1000">Up to ₹1000</option>
          </select>
          <select style={styles.select} value={sortOption} onChange={handleSortOption}>
            <option value="">Sort by</option>
            <option value="name">Alphabetical</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default EcommerceHome;
