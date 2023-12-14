import {Toast, ToastContainer} from "react-bootstrap";

const Alert = ({alert, onAlert}) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
      <Toast onClose={() => onAlert()} show={alert.show} delay={2000} autohide
                className="d-inline-block m-1"
                bg={alert.bg}>
        <Toast.Body style={{color: '#fff', fontWeight: 500}}>
                    {alert.msg}
        </Toast.Body>
       </Toast>
    </ToastContainer>
    );
}

export default Alert;
