import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

function About() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='admin-page'>
      <h4>Admin</h4>
      <p>管理后台</p>
      <button
        className='bg-green-200 rounded-md px-2 hover:bg-green-300'
        onClick={() => {
          navigate('/home');
        }}
      >
        Home页
      </button>

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
