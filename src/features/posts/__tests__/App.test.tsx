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
    it("renders the heading", () => {
        render(
            <Provider store={store}>
                    <App/>
            </Provider>
        )
        expect(screen.getByText("JSONPlaceholder with Redux")).toBeInTheDocument();
    });

    it("displays posts after fetch", async() => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id: 1, title: "Post 1", body:"Body 1"},
                {id: 2, title: "Post 2", body:"Body 2"},
            ],
        });

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText("Post 1")).toBeInTheDocument();
            expect(screen.getByText("Post 2")).toBeInTheDocument();
        })
    })

    it("shows loading indicator initially", () => {
        render(
        <Provider store={store}>
            <App />
        </Provider>
        );

        // Assuming PostList renders "Loading..." initially
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("shows error message if fetch fails", async() => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Network error request"));

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        );
        await waitFor(() => {
            expect(screen.getByText(/Network error request/i)).toBeInTheDocument();
        })
    })

    it("toggles the create post form", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id: 1, title: "Post 1", body:"Body 1"},
                {id: 2, title: "Post 2", body:"Body 2"},
            ],
        });

        render(
            <Provider store={store}>
                <PostList/>
            </Provider>
        );
        const button = await screen.findByText("Create Post");
        fireEvent.click(button);

        screen.debug(undefined)
        // check if form is visible
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Body')).toBeInTheDocument();

        const cancel = await screen.findByText("Cancel");
        expect(cancel).toBeInTheDocument();
        fireEvent.click(cancel);
        expect(button).toBeInTheDocument();
    });

    it("toggles post form and create a post after that", async() => {
         mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id: 1, title: "Post 1", body:"Body 1"},
                {id: 2, title: "Post 2", body:"Body 2"},
            ],
        });

        render(
            <Provider store={store}>
                <PostList/>
            </Provider>
        );
        const button = await screen.findByText("Create Post");
        fireEvent.click(button);

        const title = screen.getByPlaceholderText("Title");
        const body = screen.getByPlaceholderText("Body");

        await userEvent.type(title, "My Test Post");
        await userEvent.type(body, "This is the body of the post.");

        expect(title).toHaveValue("My Test Post");
        expect(body).toHaveValue("This is the body of the post.");
    });

    it("renders post after creation", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data:[{id: 1, title: 'Initial Post', body:'Initial Body'}]
        });

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        )

        // wait for initial posts
        expect(await screen.findByText("Initial Post")).toBeInTheDocument();

        // show create form
        fireEvent.click(screen.getByText("Create Post"));

        // Fill the form
        fireEvent.change(screen.getByPlaceholderText("Title"), {
            target: {value: "New Post"},
        });

        fireEvent.change(screen.getByPlaceholderText("Body"), {
            target: {value: "New Body"}
        });

        // Mock axios POST
        mockedAxios.post.mockResolvedValueOnce({
            data: {id: 2, title:"New Title", body: "New Body"},
        });

        await waitFor(() => {
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });

        await waitFor(() => {
           expect(screen.getByText(/new title/i)).toBeInTheDocument();
           expect(screen.getByText(/new body/i)).toBeInTheDocument();
        });
    });

    it("renders posts and delete a post via modal", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data:[
                {id: 1, title: 'Initial Post', body:'Initial Body'},
                {id: 2, title: "Second Post", body: "Second Body"},
            ]
        });

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        )

        await waitFor(() => {
            expect(screen.getByText('Initial Post')).toBeInTheDocument();
            expect(screen.getByText('Second Post')).toBeInTheDocument();
        })

        // click delete on first post 
        fireEvent.click(screen.getAllByText("Delete")[0]);

        // Modal should appear
        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

        // Mock axios.delete for post 1
        mockedAxios.delete.mockResolvedValueOnce({status: 200});

        // Click Yes to confirm deletion
        fireEvent.click(screen.getByText("Yes"));

        // Wait for post to be removed from DOM
        await waitFor(() => {
            expect(screen.queryByText("Initial Post")).not.toBeInTheDocument();
            expect(screen.getByText("Second Post")).toBeInTheDocument();
        });

        // Modal should disappear
        expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    })

    it("cancels delete when cancel button is clicked", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data:[
                {id: 1, title: 'Initial Post', body:'Initial Body'},
                {id: 2, title: "Second Post", body: "Second Body"},
            ]
        });

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        )

        // waits for post to load
        await waitFor(() => screen.getByText("Initial Post"));

        // Click delete on first post
        fireEvent.click(screen.getAllByText('Delete')[0]);

        // Modal should appear
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

        // click cancel 
        fireEvent.click(screen.getByText('Cancel'));

        // Modal should disappear and post should still be visible
        expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
        expect(screen.getByText("Initial Post")).toBeInTheDocument();
    })

    it("cancels update when cancel button is clicked", async() => {
        mockedAxios.get.mockResolvedValueOnce({
            data:[
                {id: 1, title: 'Initial Post', body:'Initial Body'},
                {id: 2, title: "Second Post", body: "Second Body"},
            ]
        });

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        )


        // waits for post to load
        await waitFor(() => screen.getByText("Initial Post"));

        // Click update on first post
        fireEvent.click(screen.getAllByText('Edit')[0]);

        // Modal should appear
        expect(screen.getByTestId('update-modal')).toBeInTheDocument();

        // click cancel 
        fireEvent.click(screen.getByText('Cancel'));

        // Modal should disappear and post should still be visible
        expect(screen.queryByTestId("update-modal")).not.toBeInTheDocument();
        expect(screen.getByText("Initial Post")).toBeInTheDocument();
    });

    it("handle update of a post accordingly", async() => {
        mockedAxios.get.mockResolvedValueOnce({
            data:[
                {id: 1, title: 'Initial Post', body:'Initial Body'},
                {id: 2, title: "Second Post", body: "Second Body"},
            ]
        });

        mockedAxios.put.mockResolvedValueOnce({
            data: {id: 1, title: "Update Post", body: "Update Body", userId: 1}
        })

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        )

        await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());

        // Click update on first post
        fireEvent.click(screen.getAllByText('Edit')[0]);

        // Modal should appear
        expect(screen.getByTestId('update-modal')).toBeInTheDocument();

        // Fill the form
        fireEvent.change(screen.getByPlaceholderText("Title"), {
            target: {value: "Update Post"},
        });

        fireEvent.change(screen.getByPlaceholderText("Body"), {
            target: {value: "Update Body"}
        });

        const updateButton = screen.getByText("Update");
        fireEvent.click(updateButton);

        // Wait for UI to update with new post content
        expect(await screen.findByText("Update Post")).toBeInTheDocument();
        expect(await screen.findByText("Update Body")).toBeInTheDocument();
    });

    it("Show and hide comments for a Post", async() => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id: 1, title:"Post 1", body: "Body 1"},
            ],
        });

        // Mock comments API
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {
                    postId: 1,
                    id: 101,
                    name: "John Doe",
                    email: "john@example.com",
                    body: "This is a test comment",
                },
            ],
        });

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        // Wait for posts to appear
        expect(await screen.findByText("Post 1")).toBeInTheDocument();

        // Click show comments
        const toggleButton = screen.getByText("Show Comments");
        fireEvent.click(toggleButton);

        // Wait for posts to appear
        expect(await screen.findByText("John Doe")).toBeInTheDocument();
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

    });

    it("shows loading state while fetching comments", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ id: 1, title: "Post 1", body: "Body 1" }],
        });

        // Delay comments response
        mockedAxios.get.mockImplementationOnce(() =>
            new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve({
                            data: [],
                        }),
                    100
                )
            )
        );

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(await screen.findByText("Post 1")).toBeInTheDocument();

        // Show comments
        fireEvent.click(screen.getByText("Show Comments"));

        // Loading text should appear
        expect(await screen.findByText("Loading comments...")).toBeInTheDocument();
    })

    it("shows error state if fetching comments fails", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ id: 1, title: "Post 1", body: "Body 1" }],
        });

        // Reject comments request
        mockedAxios.get.mockRejectedValueOnce(new Error("Failed to fetch comments"));

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(await screen.findByText("Post 1")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Show Comments"));

        // Wait for error message
        expect(await screen.findByText(/failed to fetch comments/i)).toBeInTheDocument();
    });
})