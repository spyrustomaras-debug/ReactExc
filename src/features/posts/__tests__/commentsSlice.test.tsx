import reducer, { fetchCommentsByPostId, clearComments, Comment } from "../../comments/commentsSlice";
import axios from "axios";
import { AnyAction } from "@reduxjs/toolkit";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("commentsSlice", () => {
    const initialState = { comments: [], loading: false, error: null };
    it("Should had initial state", () => {
        expect(reducer(undefined, {type:"unknown"})).toEqual(initialState);
    });

    it("should handle fetchCommentsByPostId.pending", () => {
        const action: AnyAction = { type: fetchCommentsByPostId.pending.type };
        const state = reducer(initialState, action);
        expect(state).toEqual({
            comments: [],
            loading: true,
            error: null,
        });
    });

    it("Should handle fetchCommentsByPostId.fulfilled", () => {
        const comments: Comment[] = [
            { id: 1, postId: 5, name: "John", email: "john@test.com", body: "Nice post!" },
            { id: 2, postId: 5, name: "Jane", email: "jane@test.com", body: "Interesting!" },
        ]

        const action: AnyAction = {
            type: fetchCommentsByPostId.fulfilled.type,
            payload: comments,
        };

        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.comments).toEqual(comments);
    });

    it("should handle fetchCommentsByPostId.rejected", () => {
        const action: AnyAction = {
        type: fetchCommentsByPostId.rejected.type,
        error: { message: "Network Error" },
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Network Error");
    });
    it("should handle clearComments", () => {
        const prevState = {
        comments: [
            { id: 1, postId: 5, name: "John", email: "john@test.com", body: "Nice post!" },
        ],
        loading: false,
        error: "Something went wrong",
        };
        const action = clearComments();
        const state = reducer(prevState, action);
        expect(state.comments).toEqual([]);
        expect(state.error).toBeNull();
    });
})