const Modal = (props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div
      className='modal'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', minHeight: '200px', minWidth: '200px' }}
    >
      <div>弹窗标题</div>
      <div className='modal-content'>
        <span
          className='close'
          style={{
            float: 'right',
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: 'skyblue',
            padding: '0 8px',
          }}
          onClick={props.onClose}
        >
          &times;
        </span>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
