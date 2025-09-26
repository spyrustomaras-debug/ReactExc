import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

export const createPost = createAsyncThunk<Post, { title: string; body: string }>(
  "posts/createPost",
  async (post) => {
    const response = await axios.post<Post>(
      "https://jsonplaceholder.typicode.com/posts",
      post
    );
    return response.data;
  }
);

// Thunk to delete a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: number) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    return postId; // return the deleted post id to remove it from state
  }
);

// Thunk to fetch posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get<Post[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
});

// Async thunk for updating a post
// Async thunk for updating a post with Axios
export const updatePost = createAsyncThunk<Post, Post>(
  "posts/updatePost",
  async (postData,{ rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${postData.id}`,
        postData,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update post")
    }
  }
);

const setLoading = (state: PostState) => {
  state.loading = true;
  state.error = null;
}

const setError = (state: PostState, action: any) => {
  state.loading = false;
  state.error = action.payload || action.error?.message || "Something went wrong"
}

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, setLoading)
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // limit to 5
      })
      .addCase(fetchPosts.rejected, setError)
      .addCase(createPost.pending, setLoading)
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, setError)
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(updatePost.pending, setLoading)
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;

        // find the post by id and replace it
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          // optional: if post wasn't found, push it
          state.posts.push(action.payload);
        }
      })
      .addCase(updatePost.rejected, setError);
  },
});

export default postSlice.reducer;