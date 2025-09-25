import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import axios from "axios";
import PostList from "../PostList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App component", () => {
    beforeEach(async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            title: `Post ${i + 1}`,
            body: `Body ${i + 1}`,
            })),
        });

        render(
            <Provider store={store}>
                <PostList />
            </Provider>
        );

        // Wait until all posts from API are rendered
        await waitFor(() => {
            expect(screen.getByText("Post 1")).toBeInTheDocument();
            expect(screen.getByText("Post 5")).toBeInTheDocument();
        });
    });

    it("renders first page with 5 posts", () => {
        const posts = screen.getAllByTestId("post-item");
        expect(posts).toHaveLength(5); // postsPerPage = 5
        expect(screen.getByText("Post 1")).toBeInTheDocument();
        expect(screen.getByText("Post 5")).toBeInTheDocument();
    });

    it("navigates to next page correctly", () => {
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        const posts = screen.getAllByTestId("post-item");
        expect(posts).toHaveLength(5); // page 2
        expect(screen.getByText("Post 6")).toBeInTheDocument();
        expect(screen.getByText("Post 10")).toBeInTheDocument();
    });

    it("navigates to previous page correctly", () => {
        const previousButton = screen.getByText("Prev");
        fireEvent.click(previousButton);

        const posts = screen.getAllByTestId("post-item");
        expect(posts).toHaveLength(5);
        expect(screen.getByText("Post 1")).toBeInTheDocument();
        expect(screen.getByText("Post 5")).toBeInTheDocument();
        
    })
})