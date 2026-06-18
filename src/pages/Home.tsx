import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // TODO 用户空闲时预加载 About
    setTimeout(() => {
      import('./Admin');
    }, 0);
  }, []);

  return (
    <div className='home-page'>
      <div className='flex'>
        <button
          className='bg-green-200 rounded-md px-2 hover:bg-green-300'
          onClick={() => {
            navigate('/admin');
          }}
        >
          Admin页
        </button>
        <button
          className='bg-green-200 rounded-md px-2 hover:bg-green-300 mx-2'
          onClick={() => {
            navigate('/react');
          }}
        >
          ReactStudy页
        </button>
        <button
          className='bg-pink-200 rounded-md px-2 hover:bg-pink-300 mx-2'
          onClick={() => {
            navigate('/react/children');
          }}
        >
          React Study -子路由页
        </button>
      </div>
      <div className='card'>
        <button
          className='bg-amber-200 rounded-md px-2 hover:bg-amber-300'
          onClick={(e) => {
            // e.nativeEvent
            setCount((count) => count + 1);
          }}
        >
          count
        </button>
        <p>{count}</p>
        <p className='read-the-docs'>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          className='bg-blue-200 hover:bg-blue-300 rounded-md px-2  my-2'
          onClick={() => {
            setShowModal(!showModal);
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
