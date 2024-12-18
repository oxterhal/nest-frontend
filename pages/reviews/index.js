import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Send } from "lucide-react";

export default function Reviews() {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:4000/reviews");
        setReviews(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleCreateReview = async () => {
    if (!userId || !productId || !rating || !reviewText) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("http://localhost:4000/createReviews", {
        user_id: parseInt(userId, 10),
        product_id: parseInt(productId, 10),
        rating: parseInt(rating, 10),
        review_text: reviewText,
      });

      // Reset form fields
      setUserId("");
      setProductId("");
      setRating("");
      setReviewText("");
      setError(null);

      // Refetch reviews
      const response = await axios.get("http://localhost:4000/reviews");
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error creating review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Product Reviews
        </h1>

        {/* Review Form */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {[...Array(num)].map(() => "★")}
              </option>
            ))}
          </select>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>

          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}

          <button
            onClick={handleCreateReview}
            disabled={isLoading}
            className="w-full mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send size={20} />
            <span>{isLoading ? "Submitting..." : "Submit Review"}</span>
          </button>
        </div>

        {/* Reviews List */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Recent Reviews
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400">No reviews yet</div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div
                key={review.review_id}
                className="bg-gray-800 rounded-lg p-5 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    User #{review.user_id}
                  </span>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-white mb-2">{review.review_text}</p>
                <div className="text-sm text-gray-500">
                  Product #{review.product_id} •{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}