import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DeviceIcon from './gps.png';
import PinLocationIcon from './pin.png';

// Custom marker icons
const customIcon = new L.Icon({
  iconUrl: PinLocationIcon,
  iconSize: [41, 41],
  iconAnchor: [12, 41],
});

const deviceIcon = new L.Icon({
  iconUrl: DeviceIcon,
  iconSize: [17, 15],
  iconAnchor: [7.5, 7.5],
  className: 'device-location-marker',
});

const LocationMarker = ({ setDeviceLocation, setLocation }) => {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    locationfound(e) {
      setDeviceLocation(e.latlng);
      setLocation(e.latlng);
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      setLocation(center);
      setPosition(center);
    });
  }, [map, setLocation]);

  return position === null ? null : (
    <Marker position={position} icon={deviceIcon}></Marker>
  );
};

const CartDetails = forwardRef(({ getTotalPrice, useWallet, walletAmount, getFinalAmount }, ref) => {
  const [cart, setCart] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddressFormModal, setShowAddressFormModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedAddresses) {
      setSavedAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getDetails: () => ({
      name,
      phone,
      address,
      location,
    })
  }));

  const handleSaveLocation = () => {
    if (location) {
      alert(`Location saved: ${location.lat}, ${location.lng}`);
      setShowLocationModal(false);
    } else {
      alert('Please select a location on the map.');
    }
  };

  const handleSaveAddress = () => {
    const newAddress = {
      name,
      phone,
      address,
      location,
    };
    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    localStorage.setItem('selectedAddress', JSON.stringify(newAddress));
    setName('');
    setPhone('');
    setAddress('');
    setLocation(null);
    setShowAddressModal(false);
    setShowAddressFormModal(false);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleSelectAddress = (addr) => {
    setAddress(addr.address);
    setName(addr.name);
    setPhone(addr.phone);
    setLocation(addr.location);
    setShowAddressModal(false);
    localStorage.setItem('selectedAddress', JSON.stringify(addr));
  };

  const styles = {
    section: {
      margin: '20px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: 'white',
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #eee',
    },
    cartItemName: {
      flex: '2',
    },
    cartItemPrice: {
      flex: '1',
      textAlign: 'right',
    },
    cartItemQuantity: {
      flex: '1',
      textAlign: 'right',
    },
    billingInfo: {
      marginTop: '20px',
    },
    billingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
    },
    billingLabel: {
      fontWeight: 'bold',
    },
    centerMarker: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      zIndex: '1000',
      pointerEvents: 'none',
    },
    formGroup: {
      marginBottom: '15px',
    },
    formControl: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    billingAmount: {
      fontWeight: 'bold',
    },
    addressContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      marginBottom: '20px',
    },
    locationIcon: {
      fontSize: '24px',
      marginRight: '10px',
    },
    addressText: {
      fontSize: '16px',
    },
    savedAddressList: {
      display: 'flex',
      flexDirection: 'column',
    },
    savedAddressCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      marginBottom: '10px',
      cursor: 'pointer',
    },
    addNewAddressCard: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9',
    },
    trashIcon: {
      color: 'red',
      cursor: 'pointer',
    }
  };

  return (
    <section style={styles.section}>
      <h3>Cart Details</h3>
      {cart.map((item, index) => (
        <div key={index} style={styles.cartItem}>
          <span style={styles.cartItemName}>{item.name}</span>
          <span style={styles.cartItemPrice}>₹{item.price}</span>
          <span style={styles.cartItemQuantity}>x{item.quantity}</span>
        </div>
      ))}
      <div style={styles.billingInfo}>
        <div style={styles.billingRow}>
          <span>Total:</span>
          <span>₹{getTotalPrice()}</span>
        </div>
        {useWallet && (
          <div style={styles.billingRow}>
            <span>Wallet Amount Used:</span>
            <span>₹{walletAmount}</span>
          </div>
        )}
        <div style={styles.billingRow}>
          <span style={styles.billingLabel}>Final Amount to Pay:</span>
          <span style={styles.billingLabel}>₹{getFinalAmount()}</span>
        </div>
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
                onClick={() => handleSelectAddress(addr)}
              >
                <div>
                  <div>{addr.name}</div>
                  <div>{addr.phone}</div>
                  <div>{addr.address}</div>
                </div>
                <div style={styles.trashIcon} onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(index);
                }}>
                  🗑️
                </div>
              </div>
            ))}
            <div
              style={styles.addNewAddressCard}
              onClick={() => setShowAddressFormModal(true)}
            >
              + Add New Address
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAddressFormModal} onHide={() => setShowAddressFormModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" style={styles.formGroup}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="formPhone" style={styles.formGroup}>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.formControl}
              />
            </Form.Group>
            <Form.Group controlId="formAddress" style={styles.formGroup}>
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.formControl}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => setShowLocationModal(true)}>
              Locate on Map
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressFormModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveAddress}>
            Save Address
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Locate on Map</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: 'relative' }}>
          <div style={styles.centerMarker}>
            <img
              src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
              alt="center marker"
              style={{ width: '25px', height: '41px' }}
            />
          </div>
          <MapContainer
            center={deviceLocation || [51.505, -0.09]}
            zoom={13}
            style={{ width: '100%', height: '400px' }}
            whenCreated={(map) => {
              setTimeout(() => {
                map.invalidateSize();
                if (deviceLocation) {
                  map.setView(deviceLocation, map.getZoom());
                }
              }, 0);

              map.on('moveend', () => {
                const center = map.getCenter();
                setLocation(center);
              });
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {deviceLocation && (
              <Marker position={deviceLocation} icon={customIcon} />
            )}
            <LocationMarker
              setDeviceLocation={setDeviceLocation}
              setLocation={setLocation}
            />
          </MapContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLocationModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveLocation}>
            Save Location
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
});

export default CartDetails;
