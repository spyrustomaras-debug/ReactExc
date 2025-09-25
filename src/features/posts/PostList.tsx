import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts, createPost, deletePost, updatePost } from "./postSlice";
import DeleteModal from "../../components/DeleteModal";
import UpdateModal from "../../components/UpdateModal";

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);

    // search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(searchQuery)
    }, 300);

    return () => clearTimeout(handler)
  },[debounceQuery])


  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  // Filtered Posts based on searchQuery
  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(debounceQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(debounceQuery.toLowerCase())
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);


  // // Pagination State
  // const [currentPage, setCurrentPage] = useState(1);
  // const postsPerPage = 5; // change as needed

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
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        data-testid="search-input"
      />
      <ul data-testid="post-list">
        {currentPosts.map((post) => (
          <li key={post.id} data-testid="post-item">
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <button onClick={() => confirmToUpdate(post.id, post.title, post.body)}>Edit</button>
            <button onClick={() => confirmToDelete(post.id)}>Delete</button>
          </li>
        ))}
        {currentPosts.length === 0 && <p>No posts found.</p>}
      </ul>

       {/* Pagination Controls */}
      {totalPages > 1 && (
        <div>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}


      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      <UpdateModal
        isOpen={showUpdateModal}
        title={editTitle}
        body={editBody}
        onChangeTitle={setEditTitle}
        onChangeBody={setEditBody}
        onUpdate={handleUpdate}
        onCancel={cancelUpdate}
      />
    </div>
  );
};

export default PostList;
