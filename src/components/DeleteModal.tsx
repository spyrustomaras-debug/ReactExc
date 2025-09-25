import React from "react";
import Modal from "./Modal";

interface DeleteModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} testId="delete-modal">
      <p>Are you sure you want to delete this post?</p>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px" }}>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteModal;