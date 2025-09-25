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

export const createPost = createAsyncThunk("posts/createPost",async(post: {title: string, body:string}) => {
        const response = await axios.post("https://jsonplaceholder.typicode.com/posts",post);
        return response.data;
    }
)

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
      return "error message";
    }
  }
);



const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // limit to 5
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
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
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postSlice.reducer;
