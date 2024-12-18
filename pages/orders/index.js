import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Edit, Trash2 } from "lucide-react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // New state for update functionality
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Get request
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:4000/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Post request to create order
  const handleCreateOrder = async () => {
    if (!userId || !totalAmount || !status) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/createOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          total_amount: parseFloat(totalAmount),
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset form fields
      setUserId("");
      setTotalAmount("");
      setStatus("");
      setError(null);

      // Refresh orders list
      const fetchResponse = await fetch("http://localhost:4000/orders");
      const data = await fetchResponse.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Error creating order");
    } finally {
      setIsLoading(false);
    }
  };

  // Update order
  const handleUpdateOrder = async () => {
    if (
      !selectedOrder ||
      !selectedOrder.user_id ||
      !selectedOrder.total_amount ||
      !selectedOrder.status
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/updateOrder/${selectedOrder.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: selectedOrder.user_id,
            total_amount: selectedOrder.total_amount,
            status: selectedOrder.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Refresh orders list
      const fetchResponse = await fetch("http://localhost:4000/orders");
      const data = await fetchResponse.json();
      setOrders(data);

      // Close modal and reset
      setIsUpdateModalOpen(false);
      setSelectedOrder(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Error updating order");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/deleteOrder/${selectedOrder.order_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Refresh orders list
      const fetchResponse = await fetch("http://localhost:4000/orders");
      const data = await fetchResponse.json();
      setOrders(data);

      // Close delete confirmation and reset
      setIsDeleteConfirmOpen(false);
      setSelectedOrder(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Error deleting order");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-400";
      case "shipped":
        return "text-blue-400";
      case "delivered":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Order Management
        </h1>

        {/* Order Creation Form */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Total Amount"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Order Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}

          <button
            onClick={handleCreateOrder}
            disabled={isLoading}
            className="w-full mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Plus size={20} />
            <span>{isLoading ? "Creating..." : "Create Order"}</span>
          </button>
        </div>

        {/* Orders List */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Existing Orders
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400">No orders found</div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-gray-800 rounded-lg p-5 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    Order #{order.order_id}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsUpdateModalOpen(true);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">User ID:</span>{" "}
                    {order.user_id}
                  </p>
                  <p className="text-green-400 font-semibold">
                    Total: ${order.total_amount}
                  </p>
                  <p className={`${getStatusColor(order.status)} font-medium`}>
                    Status: {order.status}
                  </p>
                  <div className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update Order Modal */}
        {isUpdateModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Update Order</h2>
              <div className="space-y-4">
                <input
                  type="number"
                  value={selectedOrder.user_id}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      user_id: parseInt(e.target.value, 10),
                    })
                  }
                  placeholder="User ID"
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="number"
                  value={selectedOrder.total_amount}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      total_amount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Total Amount"
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                {error && <p className="text-red-400 text-center">{error}</p>}
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateOrder}
                    className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
                  >
                    Update Order
                  </button>
                  <button
                    onClick={() => {
                      setIsUpdateModalOpen(false);
                      setSelectedOrder(null);
                      setError(null);
                    }}
                    className="flex-1 bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete Order #{selectedOrder.order_id}?
              </p>
              {error && <p className="text-red-400 mb-4">{error}</p>}
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteOrder}
                  className="flex-1 bg-red-600 text-white p-3 rounded hover:bg-red-700 transition"
                >
                  Delete Order
                </button>
                <button
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setSelectedOrder(null);
                    setError(null);
                  }}
                  className="flex-1 bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
