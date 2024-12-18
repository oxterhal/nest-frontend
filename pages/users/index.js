import { useState, useEffect } from "react";
import { User, UserPlus, Edit, Trash2 } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // New state for editing
  const [editingUser, setEditingUser] = useState(null);

  // Get request
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Post request
  const handleCreatePost = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/createUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setError(null);

      // Refetch users
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error creating user");
    } finally {
      setIsLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!editingUser || !name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/updateUser/${editingUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Reset form and editing state
      setName("");
      setEmail("");
      setPassword("");
      setEditingUser(null);
      setError(null);

      // Refetch users
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error updating user");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/deleteUser/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refetch users
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error deleting user");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare user for editing
  const prepareEditUser = (user) => {
    setEditingUser(user);
    setName(user.username);
    setEmail(user.email);
    setPassword(""); // Clear password field
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          User Management
        </h1>

        {/* User Creation/Update Form */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-1 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {error && <p className="text-red-400 mt-2 text-center">{error}</p>}

            <button
              onClick={editingUser ? handleUpdateUser : handleCreatePost}
              disabled={isLoading}
              className="w-full mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {editingUser ? (
                <>
                  <Edit size={20} />
                  <span>{isLoading ? "Updating..." : "Update User"}</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>{isLoading ? "Creating..." : "Create User"}</span>
                </>
              )}
            </button>

            {editingUser && (
              <button
                onClick={() => {
                  setEditingUser(null);
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="w-full mt-2 p-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Users List */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Registered Users
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-400">Loading users...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400">No users found</div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post.user_id}
                className="bg-gray-800 rounded-lg p-5 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    User #{post.user_id}
                  </span>
                  <User size={20} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {post.username}
                </h3>
                <p className="text-gray-300 mb-2">{post.email}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => prepareEditUser(post)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(post.user_id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
