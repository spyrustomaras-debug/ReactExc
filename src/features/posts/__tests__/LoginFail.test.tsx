import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import App from "../../../App";
import axios from "axios";
import PostList from "../PostList";
import userEvent from "@testing-library/user-event";


jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Login Failed", () => {
    it("Test case for Login Failed",async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {id: 1, title: "Post 1", body:"Body 1"},
                {id: 2, title: "Post 2", body:"Body 2"},
            ],
        });
        const container = render(
            <Provider store={store}>
                    <App/>
            </Provider>
        )
        screen.debug(undefined, 10000);
        const submitButton = await screen.findByText("Create Post");
        fireEvent.click(submitButton);
        screen.debug(undefined, 10000);

        const title = screen.getByPlaceholderText('Title');
        const body = screen.getByPlaceholderText('Body') as HTMLTextAreaElement;

        const submit = screen.getByText("Submit");
        expect(submit).toBeInTheDocument();

        fireEvent.click(submit);

        const titleError = await screen.findByText("Title is required");
        expect(titleError).toBeInTheDocument();

        const bodyError = await screen.findByText("Body is required");
        expect(bodyError).toBeInTheDocument();

        fireEvent.change(body, {target: { value:"This" }});

        fireEvent.click(submit);

        const newBodyError = await screen.findByText("Body must be at least 10 characters");
        expect(newBodyError).toBeInTheDocument();
    });
});