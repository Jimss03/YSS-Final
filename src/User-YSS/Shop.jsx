import React, { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { shopCollection } from "../Database/Firebase";
import { useCart } from "../Layout/CartContext";
import CloseIcon from "../assets/Shop-Images/Multiply.png";
import SizeChartImage from "../assets/Shop-Images/sizechart.png";
import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addToCart } from "../Database/Firebase";  // Import your addToCart function from Firebase

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { cartItems } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOption, setSortOption] = useState("default");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const auth = getAuth();
  const userUID = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid); // Store the userUID
      } else {
        setUserUID(null); // No user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

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

  // Filter Products
  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products, priceRange, sortOption]);

  const handleImageClick = (product) => {
    const availableSizes = Object.entries(product.stocks || {})
      .filter(([size, stock]) => stock > 0)
      .map(([size]) => size);

    setSelectedProduct({
      ...product,
      quantity: 1,
      size: availableSizes.length > 0 ? availableSizes[0] : "",
    });
    setCurrentImageIndex(0);
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
    if (!selectedProduct || !userUID) {
      // Show a message or redirect to login page if the user is not logged in
      console.log('User not logged in');
      return;
    }

    const cartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      size: selectedProduct.size,
      quantity: selectedProduct.quantity,
      image: selectedProduct.image[0],
    };

    // Call the addToCart function from Firebase to add the item to Firestore
    addToCart(userUID, cartItem);
    setShowModal(false);
    showConfirmationModal("Item added to cart!");
  };

  const showConfirmationModal = (message) => {
    setConfirmationMessage(message);
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const handleQuickAdd = (product) => {
    const availableSizes = Object.entries(product.stocks || {})
      .filter(([size, stock]) => stock > 0)
      .map(([size]) => size);

    if (availableSizes.length === 0) {
      showConfirmationModal("Item out of stock!");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: availableSizes[0],
      quantity: 1,
      image: product.image[0],
    };

    addToCart(userUID, cartItem); // Call the addToCart function from Firebase for quick add
    showConfirmationModal("Item added to cart!");
  };

  const nextImage = () => {
    if (!selectedProduct) return;
    const allImages = [...(selectedProduct.image || []), ...(selectedProduct.secondaryImages || [])];
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const prevImage = () => {
    if (!selectedProduct) return;
    const allImages = [...(selectedProduct.image || []), ...(selectedProduct.secondaryImages || [])];
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  // Check if item is new (added in the last 14 days)
  const isNewProduct = (product) => {
    if (!product.dateAdded) return false;
    const addedDate = new Date(product.dateAdded);
    const now = new Date();
    const diffTime = Math.abs(now - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  };

  // Check if item has limited stock
  const hasLimitedStock = (product) => {
    const totalStock = Object.values(product.stocks || {}).reduce((sum, current) => sum + current, 0);
    return totalStock > 0 && totalStock < 10;
  };

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen mt-20">


      {/* Search and Category Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold font-cousine mb-4 md:mb-0">SHOP</h1>
          
          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <button 
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === "all" ? "bg-black text-white" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedCategory("premium tees")}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === "premium tees" ? "bg-black text-white" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              Premium
            </button>
            <button 
              onClick={() => setSelectedCategory("basic tees")}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === "basic tees" ? "bg-black text-white" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              Basic
            </button>
            <button 
              onClick={() => setSelectedCategory("new")}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === "new" ? "bg-black text-white" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              New
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 text-lg font-medium text-gray-700 text-center font-cousine">
        {filteredProducts.length === 0 ? (
          "No products found. Try adjusting your filters."
        ) : (
          selectedCategory === "all"
            ? `Showing ${filteredProducts.length} products`
            : `Showing ${filteredProducts.length} ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} products`
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="border rounded-lg shadow-md overflow-hidden bg-white transition-transform duration-300 hover:shadow-xl hover:scale-105"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
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
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"
                  />
                  {product.secondaryImages && product.secondaryImages.length > 0 && (
                    <img
                      src={product.secondaryImages[0]}
                      alt="Secondary Image"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
                    />
                  )}
                </>
              )}
              
              {/* Product Badges */}
              <div className="absolute top-0 left-0 p-2 flex flex-col gap-2">
                {isNewProduct(product) && (
                  <span className="bg-black text-white text-xs px-2 py-1 rounded">NEW</span>
                )}
                {hasLimitedStock(product) && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    LIMITED STOCK
                  </span>
                )}
              </div>

              {/* Quick Add Button (appears on hover) */}
              {hoveredProduct === product.id && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 transition-all duration-300">
                  <button 
                    className="w-full py-2 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(product);
                    }}
                  >
                    <ShoppingCart size={16} />
                    Quick Add
                  </button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h2 className="font-semibold text-lg font-cousine truncate">{product.name}</h2>
              <div className="flex flex-wrap mt-1 mb-2">
                {product.color?.split(",").map((color, index) => (
                  <div 
                    key={index} 
                    className="w-4 h-4 rounded-full mr-1 border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase().trim() }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-900 font-medium text-lg">₱{product.price}</p>
                <button 
                  onClick={() => handleImageClick(product)}
                  className="text-black hover:underline flex items-center"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-8 p-8 bg-gray-50 rounded-lg">
          <ShoppingCart size={64} className="text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setPriceRange([0, 5000]);
              setSortOption("default");
            }} 
            className="bg-black text-white px-4 py-2 rounded"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-4/5 lg:max-w-4xl max-h-[90vh] overflow-auto relative">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100" 
              onClick={closeModal}
            >
              <img src={CloseIcon} alt="Close" className="w-6 h-6 cursor-pointer" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Side: Image Gallery */}
              <div className="w-full md:w-1/2 relative">
                {selectedProduct.image && selectedProduct.secondaryImages && (
                  <div className="relative aspect-square">
                    {/* Main Image */}
                    {(() => {
                      const allImages = [
                        ...(selectedProduct.image || []),
                        ...(selectedProduct.secondaryImages || [])
                      ];
                      return allImages.length > 0 ? (
                        <img
                          src={allImages[currentImageIndex]}
                          alt={`Product view ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : null;
                    })()}

                    {/* Image Navigation Arrows */}
                    <button 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {[...(selectedProduct.image || []), ...(selectedProduct.secondaryImages || [])].map(
                        (_, index) => (
                          <button
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              currentImageIndex === index ? "bg-black" : "bg-gray-300"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Thumbnail Images */}
                <div className="flex overflow-x-auto gap-2 p-4 border-t mt-2">
                  {[...(selectedProduct.image || []), ...(selectedProduct.secondaryImages || [])].map(
                    (img, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 min-w-16 border rounded ${
                          currentImageIndex === index ? "border-black border-2" : "border-gray-200"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Right Side: Product Details */}
              <div className="w-full md:w-1/2 p-6">
                {/* Product Name and Price */}
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">{selectedProduct.name}</h2>
                  <div className="flex items-center mt-1">
                  </div>
                  <p className="text-2xl font-bold mt-2">₱{selectedProduct.price}</p>
                </div>


                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.color?.split(",").map((color, index) => (
                      <button
                        key={index}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedProduct.selectedColor === color ? "border-black" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.toLowerCase().trim() }}
                        onClick={() => setSelectedProduct({ ...selectedProduct, selectedColor: color })}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <button className="text-sm text-gray-600 underline" onClick={toggleSizeChart}>
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["small", "medium", "large", "xl"].map((size) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-md border ${
                          selectedProduct.size === size
                            ? "bg-black text-white"
                            : selectedProduct.stocks[size] === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        disabled={selectedProduct.stocks[size] === 0}
                        onClick={() => setSelectedProduct({ ...selectedProduct, size })}
                      >
                        {size.toUpperCase()}
                        {selectedProduct.stocks[size] === 0 && " - Sold Out"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                {Object.values(selectedProduct.stocks || {}).some((stock) => stock > 0) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center border rounded-md w-fit">
                      <button
                        className="px-3 py-2 hover:bg-gray-100"
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
                        className="w-12 py-2 border-x text-center"
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
                        className="px-3 py-2 hover:bg-gray-100"
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
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedProduct.stocks[selectedProduct.size] || 0} items available
                    </p>
                  </div>
                )}

                {/* Add To Cart and Checkout Buttons */}
                <div className="flex flex-col gap-3">
                  <button 
                    className="bg-black text-white w-full py-3 rounded-md hover:bg-gray-800 transition font-medium flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} />
                    Add To Cart
                  </button>


                  <button className="bg-gray-100 text-black w-full py-3 rounded-md hover:bg-gray-200 transition font-medium">
                    Check Out
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/5 lg:w-1/2 xl:w-2/5 max-h-[90vh] overflow-auto relative">
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100" 
              onClick={toggleSizeChart}
            >
              <img src={CloseIcon} alt="Close" className="w-6 h-6 cursor-pointer" />
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
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center animate-fadeIn w-96 max-w-lg">
            <div className="flex flex-col items-center justify-center mb-4">
              <CheckCircle size={40} className="text-green-500 mb-2" />
              <ShoppingCart size={64} className="text-black" />
            </div>
            <p className="text-xl font-semibold">{confirmationMessage}</p>
            <div className="mt-4 flex gap-3">
              <button 
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                onClick={() => setShowConfirmation(false)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;
