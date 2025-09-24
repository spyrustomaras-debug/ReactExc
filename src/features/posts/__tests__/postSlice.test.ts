import reducer, { createPost, fetchPosts, deletePost } from "../postSlice";
import axios from "axios";
import { AnyAction } from "@reduxjs/toolkit";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe("postSlice", () =>{
    const initialState = {posts: [], loading: false, error: null};

    it("should handle initial state", () => {
        expect(reducer(undefined, {type: 'unknown'})).toEqual(initialState)
    })

    it("should handle fetchPosts.pending", () => {
        const action = {type: fetchPosts.pending.type};
        const state = reducer(initialState, action);
        expect(state).toEqual({
            posts: [],
            loading: true,
            error: null,
        });
    });

    it("should handle fetchPosts.fullfilled", () => {
        const posts = [
            { id: 1, title: "Post 1", body: "Body 1" },
            { id: 2, title: "Post 2", body: "Body 2" },
            { id: 3, title: "Post 3", body: "Body 3" },
            { id: 4, title: "Post 4", body: "Body 4" },
            { id: 5, title: "Post 5", body: "Body 5" },
            { id: 6, title: "Post 6", body: "Body 6" },
        ];
        const action = { type: fetchPosts.fulfilled.type, payload: posts };
        const state = reducer(initialState, action);
        expect(state.posts.length).toBe(5);
        expect(state.loading).toBe(false)
        expect(state.posts[0].title).toBe("Post 1")
    });

    it("should handle fetchPosts.rejected", () => {
        const action = {
            type: fetchPosts.rejected.type,
            error: { message: "Network Error" },
        };
        const state = reducer(initialState, action);
        expect(state).toEqual({
            posts: [],
            loading: false,
            error: "Network Error",
        });
    });

    // createPost tests
    it("handles createPost.fulfilled", () => {
        const newPost = {id: 101, title: 'New Post', body: 'New Body'};
        const action: AnyAction = {type: createPost.fulfilled.type, payload: newPost};
        const state = reducer(initialState, action);
        expect(state.posts[0]).toEqual(newPost);
    })

    it("should handle deletePost.fulfilled", () => {
        const stateWithPosts = {
            posts: [
                {id: 1, title: "Post 1", body: "Body 1"},
                {id: 2, title: "Post 2", body: "Body 2"},
            ],
            loading: false,
            error: null,
            
        };
        const action: AnyAction = {type: deletePost.fulfilled.type, payload: 1};
        const state = reducer(stateWithPosts, action);
        expect(state.posts).toHaveLength(1);
        expect(state.posts[0].id).toBe(2);
    });
});