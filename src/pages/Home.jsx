import { useState, useEffect } from 'react';
import Modal from '../components/Modal';

function Home() {
  const [count, setCount] = useState(0);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // TODO 用户空闲时预加载 About
    setTimeout(() => {
      import('./About');
    }, 0);
  }, []);

  return (
    <div className='home-page'>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p className='read-the-docs'>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

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
        <div>Home 弹窗</div>
      </Modal>
    </div>
  );
}

export default Home;
