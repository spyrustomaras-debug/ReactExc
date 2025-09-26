// src/features/comments/commentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch comments by postId
export const fetchCommentsByPostId = createAsyncThunk<Comment[], number>(
  "comments/fetchCommentsByPostId",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get<Comment[]>(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch comments");
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCommentsByPostId.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.loading = false;
          state.comments = action.payload;
        }
      )
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || "Something went wrong";
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
