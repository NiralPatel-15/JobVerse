import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // get query from URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:4000/api/user/search?query=${encodeURIComponent(query)}`,
          { withCredentials: true },
        );

        if (res.data && res.data.users) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (query && query.trim() !== "") {
      fetchUsers();
    } else {
      setUsers([]); // ✅ clear old results
      setLoading(false); // ✅ stop loading
    }
  }, [query]);

  // ✅ LOADING
  if (loading) return <p>Loading...</p>;

  // ✅ EMPTY QUERY
  if (!query || query.trim() === "") {
    return <p style={{ padding: "20px" }}>Please enter a search query</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for "{query}"</h2>

      {users.length === 0 ? (
        <p>No such user found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} style={{ marginBottom: "10px" }}>
            <h4>{user.f_name || "User"}</h4>
            <p>{user.headline || "No headline"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Search;