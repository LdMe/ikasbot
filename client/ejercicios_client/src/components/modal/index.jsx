import { useState } from 'react';
import './Modal.scss';

const Modal = ({ children, defaultShow = false }) => {
    const [show, setShow] = useState(defaultShow);
    const handleShow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(!show);
    }

    return (
        <div className="modal-container">
            <button className="modal-button" onClick={() => setShow(!show)}>{show ? 'Ocultar' : 'Mostrar'}</button>
            <div className={`modal ${show ? 'show' : ''}`} onClick={() => setShow(false)}>
                <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                    <button className='modal__close-button' title="Cerrar" onClick={handleShow}>X</button>
                    <div className="modal-content">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Modal