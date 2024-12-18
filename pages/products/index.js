import { useState, useEffect } from "react";
import { Package, Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function ProductManagement() {
  // State for form inputs
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // State for products and management
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Error and loading states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred while fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Validate Form
  const validateForm = () => {
    if (!productName.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setError("Invalid price");
      return false;
    }
    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      setError("Invalid stock quantity");
      return false;
    }
    return true;
  };

  // Create Product
  const handleCreateProduct = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/createProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: productName,
          description,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      // Reset form
      setProductName("");
      setDescription("");
      setPrice("");
      setStock("");
      setError(null);

      // Refresh product list
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Error creating product");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare Product for Editing
  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.product_name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
  };

  // Update Product
  const handleUpdateProduct = async () => {
    if (!validateForm() || !editingProduct) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/updateProduct/${editingProduct.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_name: productName,
            description,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Reset form and editing state
      setProductName("");
      setDescription("");
      setPrice("");
      setStock("");
      setEditingProduct(null);
      setError(null);

      // Refresh product list
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/deleteProduct/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh product list
      await fetchProducts();

      // Reset any ongoing editing
      if (editingProduct && editingProduct.product_id === productId) {
        setEditingProduct(null);
        setProductName("");
        setDescription("");
        setPrice("");
        setStock("");
      }
    } catch (err) {
      setError(err.message || "Error deleting product");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingProduct(null);
    setProductName("");
    setDescription("");
    setPrice("");
    setStock("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Product Management
        </h1>

        {/* Product Form */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock Quantity"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
              min="0"
            />
          </div>

          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}

          <div className="flex space-x-4 mt-4">
            <button
              onClick={
                editingProduct ? handleUpdateProduct : handleCreateProduct
              }
              disabled={isLoading}
              className="flex-1 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {editingProduct ? (
                <>
                  <Save size={20} />
                  <span>{isLoading ? "Updating..." : "Update Product"}</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>{isLoading ? "Creating..." : "Create Product"}</span>
                </>
              )}
            </button>

            {editingProduct && (
              <button
                onClick={cancelEditing}
                className="flex-1 p-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center justify-center space-x-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Products List */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Current Products
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400">No products available</div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-gray-800 rounded-lg p-5 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    Product #{product.product_id}
                  </span>
                  <Package size={20} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {product.product_name}
                </h3>
                <p className="text-gray-300 mb-2 h-12 overflow-hidden">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-400 font-semibold">
                      ${product.price}
                    </p>
                    <p className="text-blue-300 text-sm">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditProduct(product)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)}
                      className="text-red-400 hover:text-red-300"
                      title="Delete Product"
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
