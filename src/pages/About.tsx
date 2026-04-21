import React, { useState } from 'react';
import Modal from '../components/Modal';

function About() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='about-page'>
      <h4>About Us</h4>
      <p>This is the about page of our React application.</p>
      <p>Welcome to learn more about our project!</p>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          open modal
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div>About 弹窗</div>
      </Modal>
    </div>
  );
}

export default About;
