import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import App from "../../../App";
import axios from "axios";
import PostList from "../PostList";
import userEvent from "@testing-library/user-event";

import { userInfo } from "os";


jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App component", () => {
    it("displays posts after fetch", async() => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id:1, title:"React Testing 1", body:"Body 1"},
                {id:2, title:"Post 2", body:"Body 2"},
                {id:3, title:"Post 3", body:"Body 3"},
                {id:4, title:"Post 4", body:"Body 4"},
            ],
        });

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        );

        const allPosts = await screen.findAllByTestId("post-item");
        expect(allPosts).toHaveLength(4)

        await waitFor(() => {
            expect(screen.getByText("React Testing 1")).toBeInTheDocument();
            expect(screen.getByText("Post 2")).toBeInTheDocument();
        })

        // Type in search input
        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "react" } });

        // only posts containing react on body or title should be shown
        const filteredPosts = screen.getAllByTestId('post-item');
        expect(filteredPosts).toHaveLength(1);
        expect(filteredPosts[0]).toHaveTextContent("React Testing");
    })

    it("shows 'No posts found.' if no match", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id:1, title:"React Testing 1", body:"Body 1"},
                {id:2, title:"Post 2", body:"Body 2"},
                {id:3, title:"Post 3", body:"Body 3"},
                {id:4, title:"Post 4", body:"Body 4"},
            ],
        });

        render(
            <Provider store={store}>
                <PostList />
            </Provider>
        );

        const searchInput = await screen.findByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "Python" } });

        expect(screen.queryAllByTestId("post-item")).toHaveLength(0);
        expect(screen.getByText("No posts found.")).toBeInTheDocument();
    });
})