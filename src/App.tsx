import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PostList from "./features/posts/PostList";
import UserList from "./features/posts/UserList";
import { Routes, Route, Link } from "react-router-dom";
import ThemeToggle from "./components/ToggleButton";
import { ThemeProvider } from "./context/ThemeContext";
function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>JSONPlaceholder with Redux</h1>
        <ThemeProvider>
          <ThemeToggle></ThemeToggle>
        </ThemeProvider>
        <PostList />
      </div>
    </Provider>
  );
}

export default App;
