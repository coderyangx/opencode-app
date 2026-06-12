import React, { useState } from 'react';
import Modal from '../components/Modal';

function About() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='admin-page'>
      <h4>Admin</h4>
      <p>管理后台</p>

      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          open modal
        </button>
      </div> */}

      {/* <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div>About 弹窗</div>
      </Modal> */}
    </div>
  );
}

export default About;
