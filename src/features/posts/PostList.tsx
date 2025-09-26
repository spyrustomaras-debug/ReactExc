import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchPosts, createPost, deletePost, updatePost } from "./postSlice";
import DeleteModal from "../../components/DeleteModal";
import UpdateModal from "../../components/UpdateModal";
import { fetchCommentsByPostId } from "../comments/commentsSlice";

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);
  const { comments, loading: commentsLoading,  error: commentsError} = useAppSelector((state) => state.comments);

  // Track which post's comments are open
  const [activePostId, setActivePostId] = useState<number | null>(null);

  // Toggle Comments
  const toggleComments = (postId: number) => {
    if(activePostId == postId){
      setActivePostId(null); // hide if already open
    } else {
      setActivePostId(postId);
      dispatch(fetchCommentsByPostId(postId));
    }
  }

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

  type ValidationError = "" | "Title is required" | "Title must be at least 3 characters";

  const [titleError, setTitleError] = useState<ValidationError>("");
  const [bodyError, setBodyError] = useState("");


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(searchQuery)
    }, 300);

    return () => clearTimeout(handler)
  },[searchQuery])


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

   // Filtered Posts based on searchQuery
  const filteredPosts = useMemo(() =>{
    return posts.filter((post) => 
      post.title.toLowerCase().includes(debounceQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(debounceQuery.toLowerCase())
    );
  },[posts, debounceQuery]);

    // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;

    if (!title.trim()) {
      setTitleError("Title is required");
      hasError = true;
    } else if (title.length < 3) {
      setTitleError("Title must be at least 3 characters");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!body.trim()) {
      setBodyError("Body is required");
      hasError = true;
    } else if (body.length < 10) {
      setBodyError("Body must be at least 10 characters");
      hasError = true;
    } else {
      setBodyError("");
    }

    if (hasError) return;

    dispatch(createPost({ title, body }));
    setTitle("");
    setBody("");
    setShowForm(false);
  };


  if (loading) return <p data-testid="loading">Loading...</p>;
  if (error) return <p data-testid="error">Error: {error}</p>;

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
                <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                {titleError && <p style={{ color: "red" }}>{titleError}</p>}
                <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                {bodyError && <p style={{ color: "red" }}>{bodyError}</p>}
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

            {/* Comments Toggle */}
            <button onClick={() => toggleComments(post.id)}>
              {activePostId == post.id ? "Hide Comments": "Show Comments"}
            </button>

            {/* ✅ Render comments */}
            {activePostId === post.id && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                {commentsLoading && <p>Loading comments...</p>}
                {commentsError && <p style={{ color: "red" }}>{commentsError}</p>}
                <ul>
                  {comments.map((c) => (
                    <li key={c.id}>
                      <strong>{c.name}</strong> ({c.email})
                      <p>{c.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
