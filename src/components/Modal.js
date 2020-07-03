import React from 'react'
import Modal from 'react-modal';

import DesignElement3 from '../assets/images/DesignElement3.png';

export default function CustomModal({ isOpen, onClose, children }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => onClose(false)}
            ariaHideApp={false}
            className="Modal"
            overlayClassName="Overlay"
        >
            <img src={DesignElement3} alt="" style={{ right: -5, top: 5 }} className="absolute w-24 transform rotate-90 rounded-lg" />
            <img src={DesignElement3} alt="" style={{ left: -5, bottom: 4 }} className="absolute w-16 transform -rotate-90 rounded-lg" />
            <div className="px-5 pt-3 pb-12 modal-content">
                <i onClick={() => onClose(false)} className="cursor-pointer fa fa-arrow-left"></i>
                {children}
            </div>
        </Modal>
    )
}
