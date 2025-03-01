import React, { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { shopCollection } from "../Database/Firebase"; // ✅ Import Firestore
import { useCart } from "../Layout/CartContext";  // Import the custom CartContext hook
import CartIcon from "../assets/Shop-Images/ShoppingCart.png";
import CloseIcon from "../assets/Shop-Images/Multiply.png";
import SizeChartImage from "../assets/Shop-Images/sizechart.png";
import { ShoppingCart, CheckCircle } from "lucide-react";


function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { addToCart, cartItems } = useCart(); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");



  // Fetch Products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(shopCollection);
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Firestore Fetch Error:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle Category Change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter Products
  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const handleImageClick = (product) => {
    // Get the first available size with stock > 0
    const availableSizes = Object.entries(product.stocks || {})
      .filter(([size, stock]) => stock > 0) // Only keep sizes with stock
      .map(([size]) => size);

    setSelectedProduct({
      ...product,
      quantity: 1, // Default to 1
      size: availableSizes.length > 0 ? availableSizes[0] : "", // Select first available size
    });

    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Handle Size Chart Toggle
  const toggleSizeChart = () => {
    setShowSizeChart(!showSizeChart);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
  
    const cartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      size: selectedProduct.size,
      quantity: selectedProduct.quantity,  // Default quantity is 1
      image: selectedProduct.image[0],
    };
  
    addToCart(cartItem);  // Add item to cart in the global context
    setShowModal(false);  // Close modal after adding item to the cart
    showConfirmationModal("Item added to cart!");  // Show confirmation modal
  };
  

  const showConfirmationModal = (message) => {
    setConfirmationMessage(message);
    setShowConfirmation(true);
  
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000); // Hide modal after 2 seconds
  };
  

  
  

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen mt-20">
      {/* Search and Category Selection */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold font-cousine">SHOP</h1>
        <div className="mt-2 text-lg font-medium text-gray-700 text-center font-cousine">
          {selectedCategory === "all"
            ? "Showing All Products"
            : `Showing ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} products`}
        </div>
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="premium tees">Premium Tees</option>
            <option value="basic tees">Basic Tees</option>
            <option value="new">New</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ml-10 mr-10">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg shadow p-4 flex flex-col bg-[#E2E2E2]">
            {/* Product Image with Hover Effect */}
            <div
              className="relative w-full aspect-square overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(product)}
            >
              {product.image && product.image.length > 0 && (
                <>
                  <img
                    src={product.image[0]}
                    alt="Product Image"
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ease-in-out"
                  />
                  {product.secondaryImages && product.secondaryImages.length > 0 && (
                    <img
                      src={product.secondaryImages[0]}
                      alt="Secondary Image"
                      className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
                    />
                  )}
                </>
              )}
            </div>

            {/* Product Info & Cart Button */}
            <div className="flex justify-between items-center w-full mt-4 px-2">
              <div className="flex flex-col">
                <h2 className="font-semibold text-lg font-cousine">{product.name}</h2>
                <p className="text-gray-600 font-medium">₱{product.price}</p>
              </div>

              {/* Cart Icon */}
              <button onClick={() => handleImageClick(product)}>
                <img src={CartIcon} alt="Cart" className="w-15 h-8" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-4/5 md:w-1/2 relative">
            {/* Close Button */}
            <button className="absolute top-4 right-4" onClick={closeModal}>
              <img src={CloseIcon} alt="Close" className="w-8 h-8 cursor-pointer" />
            </button>

            <div className="flex mb-4">
              {/* Left Side: Image with Hover Effect */}
              <div className="w-1/2 relative">
                {selectedProduct.image && selectedProduct.secondaryImages && (
                  <img
                    src={selectedProduct.image[0]}
                    alt="Product"
                    className="w-full h-full object-contain transition-opacity duration-300 ease-in-out hover:opacity-0"
                  />
                )}
                {selectedProduct.secondaryImages && selectedProduct.secondaryImages.length > 0 && (
                  <img
                    src={selectedProduct.secondaryImages[0]}
                    alt="Secondary Image"
                    className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
                  />
                )}
              </div>

              {/* Right Side: Product Details */}
              <div className="w-1/2 pl-4">
                <h2 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h2>
                <p className="text-lg text-gray-600 mb-4">₱{selectedProduct.price}</p>

                {/* Color Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm">Color</label>
                  <select
                    className="w-full border p-2 mt-1"
                    value={selectedProduct.color || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e.target.value })}
                  >
                    {selectedProduct.color?.split(",").map((color, index) => (
                      <option key={index} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Size Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm">Size</label>
                  <select
                    className="w-full border p-2 mt-1"
                    value={selectedProduct.size || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, size: e.target.value })}
                  >
                    {["small", "medium", "large", "xl"].map((size) => (
                      <option
                        key={size}
                        value={size}
                        disabled={selectedProduct.stocks[size] === 0}
                        className={selectedProduct.stocks[size] === 0 ? "text-red-500 font-bold" : ""}
                      >
                        {size.toUpperCase()} {selectedProduct.stocks[size] === 0 ? " - Out of Stock" : ` (${selectedProduct.stocks[size]} in stock)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Selector */}
                {Object.values(selectedProduct.stocks || {}).every((stock) => stock === 0) ? null : (
                  <div className="mb-4">
                    <label className="block text-sm">Quantity</label>
                    <div className="flex items-center space-x-4">
                      <button
                        className="bg-gray-200 p-2"
                        onClick={() =>
                          setSelectedProduct((prev) => ({
                            ...prev,
                            quantity: Math.max(1, prev.quantity - 1),
                          }))
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 p-2 border text-center"
                        value={selectedProduct.quantity}
                        onChange={(e) => {
                          const value = Math.min(
                            Math.max(1, Number(e.target.value)),
                            selectedProduct.stocks[selectedProduct.size] || 1
                          );
                          setSelectedProduct((prev) => ({ ...prev, quantity: value }));
                        }}
                      />
                      <button
                        className="bg-gray-200 p-2"
                        onClick={() =>
                          setSelectedProduct((prev) => ({
                            ...prev,
                            quantity: Math.min(
                              prev.quantity + 1,
                              selectedProduct.stocks[selectedProduct.size] || 1
                            ),
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                <button className="p-2 rounded-md mb-4 underline font-semibold" onClick={toggleSizeChart}>View Size Chart</button>

                {/* Add To Cart Button */}
                <button className="bg-black text-white w-full py-2 mb-3" onClick={handleAddToCart}>
                  Add To Cart
                </button>
                <button className="bg-gray-200 text-black w-full py-2">Check Out</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5 h-auto max-h-[90vh] relative">
            <button className="absolute top-4 right-4" onClick={toggleSizeChart}>
              <img src={CloseIcon} alt="Close" className="w-8 h-8 cursor-pointer" />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-black text-center">Size Chart</h2>
            <div className="flex justify-center">
              <img src={SizeChartImage} alt="Size Chart" className="w-full h-auto max-h-[75vh] object-contain" />
            </div>
          </div>
        </div>
      )}


{/* Confirmation Modal */}
{showConfirmation && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center animate-fadeInOut w-96 max-w-lg">
      <div className="flex flex-col items-center justify-center mb-4">
        {/* Check Icon - Smaller, placed on top */}
        <CheckCircle size={30} className="text-black mb-2" />
        {/* Cart Icon - Larger, placed below the checkmark */}
        <ShoppingCart size={90} className="text-black" />
      </div>
      <p className="text-lg font-semibold">{confirmationMessage}</p>
    </div>
  </div>
)}


    </div>
  );
}

export default Shop;
