import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    testId: string; 

}


const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, testId}) => {
    if(!isOpen) return null;

    return (
        <div
            className="modal-backdrop"
            data-testid={testId}
            style={{
                position:"fixed",
                top: 0,
                left: 0,
                width:"100vw",
                height: "100vh",
                backgroundColor:"rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems:"center",
                zIndex: 100,
            }}
            onClick={onClose}
        >
            <div
                className="modal-content"
                style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                width: "300px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                {children}
            </div>

        </div>
    )
}

export default Modal;