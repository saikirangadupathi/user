import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const CartModal = ({ modalIsOpen, setModalIsOpen, cart, getTotalPrice, greenPointsInCart, removeFromCart, handlePaymentClick, handleSaveCart }) => {
  return (
    <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cart Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length > 0 ? (
          <div>
            {cart.map((item, index) => (
              <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '10px' }}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                />
                <div style={{ marginTop: '10px' }}>
                  <div><strong>{item.name}</strong></div>
                  <div>Price: ₹{item.price}</div>
                  <div>Quantity: {item.quantity}</div>
                  <div style={{ color: 'green' }}>Green Points: {item.greenPoints}</div>
                </div>
                <Trash style={{ cursor: 'pointer', color: 'red', marginTop: '10px' }} onClick={() => removeFromCart(item)} />
              </div>
            ))}
            <h3>Total: ₹{getTotalPrice()}</h3>
            <h3>Total Green Points: ♻️ {greenPointsInCart}</h3>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
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
  );
};

export default CartModal;
