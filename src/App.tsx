import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PostList from "./features/posts/PostList";

function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>JSONPlaceholder with Redux</h1>
        <PostList />
      </div>
    </Provider>
  );
}

export default App;
