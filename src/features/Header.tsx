import React from "react";
import { Link } from "react-router-dom";
import PostList from "./posts/PostList";
import UserList from "./posts/UserList";

const Header: React.FC = () => {
  return (
    <header style={{ padding: "1rem", backgroundColor: "#f2f2f2" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/posts"><PostList/></Link>
        <Link to="/users"><UserList/></Link>
      </nav>
    </header>
  );
};

export default Header;
