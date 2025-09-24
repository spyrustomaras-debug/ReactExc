import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts, createPost, deletePost, updatePost } from "./postSlice";

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // state for delete confirmation modal 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // state for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

   // ---- UPDATE ----
  const confirmToUpdate = (id: number, currentTitle: string, currentBody: string) => {
    setPostToUpdate(id);
    setEditTitle(currentTitle);
    setEditBody(currentBody);
    setShowUpdateModal(true);
  };

  const handleUpdate = () => {
    if (postToUpdate !== null) {
      dispatch(updatePost({ id: postToUpdate, title: editTitle, body: editBody, userId: 1 }));
      setPostToUpdate(null);
      setEditTitle("");
      setEditBody("");
      setShowUpdateModal(false);
    }
  };

  const cancelUpdate = () => {
    setPostToUpdate(null);
    setEditTitle("");
    setEditBody("");
    setShowUpdateModal(false);
  };

  const confirmToDelete = (id:number) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  }

  const handleDelete = () => {
    if(postToDelete !== null) {
        dispatch(deletePost(postToDelete));
        setPostToDelete(null);
        setShowDeleteModal(false);
    }
  }


  const cancelDelete = () => {
    setPostToDelete(null);
    setShowDeleteModal(false);
  }

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <p data-testid="loading">Loading...</p>;
  if (error) return <p data-testid="error">Error: {error}</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createPost({title, body}));
    setTitle("");
    setBody("");
    setShowForm(false)
  }

  return (
    <div>
        <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel": "Create Post"}
        </button>
        {showForm && (
            <form onSubmit={handleSubmit}>
                <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} required></textarea>
                <button type="submit">Submit</button>
            </form>
        )}
      <h2>Posts</h2>
      <ul data-testid="post-list">
        {posts.map((post) => (
          <li key={post.id} data-testid="post-item">
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <button onClick={() => confirmToUpdate(post.id, post.title, post.body)}>Edit</button>
            <button onClick={() => confirmToDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {showDeleteModal && (
        <div
          data-testid="delete-modal"
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
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
          >
            <p>Are you sure you want to delete this post?</p>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px" }}>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div
          data-testid="update-modal"
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
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
          >
            <h3>Edit Post</h3>
            <input
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <textarea
              placeholder="Body"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            ></textarea>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "15px",
              }}
            >
              <button onClick={handleUpdate}>Update</button>
              <button onClick={cancelUpdate}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostList;
