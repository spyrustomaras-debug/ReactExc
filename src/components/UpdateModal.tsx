import React, { useEffect, useRef } from "react";
import Modal from "./Modal";

interface UpdateModalProps {
  isOpen: boolean;
  title: string;
  body: string;
  onChangeTitle: (value: string) => void;
  onChangeBody: (value: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  title,
  body,
  onChangeTitle,
  onChangeBody,
  onUpdate,
  onCancel,
}) => {

   

  return (
    <Modal isOpen={isOpen} onClose={onCancel} testId="update-modal">
      <h3>Edit Post</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => onChangeBody(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px" }}>
        <button onClick={onUpdate}>Update</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
};

export default UpdateModal;
