import React, { useState, useEffect } from "react";
import { db, shopCollection } from "../Database/Firebase"; // ✅ Import Firestore
import { addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import axios from "axios"; 

function AdminShop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    price: "",
    image: [],
    secondaryImages: [],
    category: "premium tees",
    color: " ",
    size: "small",
    stocks:{
      small: 0,
      medium: 0,
      large: 0,
      xl: 0,
    },  
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);


  // ✅ Fetch Products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(shopCollection);
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          color: doc.data().color || "", 
          size: doc.data().size || "small",
          stocks: doc.data().stocks || { small: 0, medium: 0, large: 0, xl: 0 },
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray); // Initially, show all products
      } catch (error) {
        console.error("Firestore Fetch Error:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleStockChange = (e, size) => {
    const { value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      stocks: { ...prev.stocks, [size]: Number(value) || 0 }, // ✅ Ensures a valid number
    }));
  };
  
  

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // ✅ Handle Category Change for Search
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // ✅ Filter Products based on Search and Category
  useEffect(() => {
    let filtered = products.filter((product) => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // ✅ Cloudinary Image Upload
  const handleImageUpload = async (e, imageType) => {
    const files = e.target.files;
    const imageUrls = [];
    const secondaryImageUrls = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "product_shop"); // Replace with your actual upload preset
      formData.append("cloud_name", "dm97yk6vr"); // Replace with your actual cloud name
  
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dm97yk6vr/image/upload",
          formData
        );
        if (response.data.secure_url) {
          if (imageType === "primary") {
            imageUrls.push(response.data.secure_url); // Push to primary images
          } else {
            secondaryImageUrls.push(response.data.secure_url); // Push to secondary images
          }
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
      }
    }
  
    // Set the state for primary and secondary images
    if (imageType === "primary") {
      setCurrentProduct((prev) => ({ ...prev, image: imageUrls }));
    } else if (imageType === "secondary") {
      setCurrentProduct((prev) => ({ ...prev, secondaryImages: secondaryImageUrls }));
    }
  };
  

  const handleSave = async () => {
    if (currentProduct.image.length === 0) {
      console.error("No images uploaded!");
      return;
    }
  
    try {
      if (currentProduct.id) {
        const productRef = doc(db, "shop", currentProduct.id);
        await updateDoc(productRef, {
          name: currentProduct.name,
          price: Number(currentProduct.price),
          image: currentProduct.image,
          secondaryImages: currentProduct.secondaryImages,
          category: currentProduct.category,
          color: currentProduct.color,
          stocks: currentProduct.stocks,
        });
  
        setProducts((prev) =>
          prev.map((product) =>
            product.id === currentProduct.id ? { ...currentProduct } : product
          )
        );
  
        showConfirmationModal("Product updated successfully!");
      } else {
        const docRef = await addDoc(shopCollection, {
          name: currentProduct.name,
          price: Number(currentProduct.price),
          image: currentProduct.image,
          secondaryImages: currentProduct.secondaryImages,
          category: currentProduct.category,
          color: currentProduct.color,
          stocks: currentProduct.stocks,
        });
  
        setProducts((prev) => [...prev, { ...currentProduct, id: docRef.id }]);
  
        showConfirmationModal("Product added successfully!");
      }
  
      setShowModal(false);
    } catch (error) {
      console.error("Firestore Save Error:", error);
    }
  };
  
    
  // ✅ Delete Product from Firestore
  const handleDelete = async () => {
    if (currentProduct.id) {
      try {
        await deleteDoc(doc(db, "shop", currentProduct.id));
        setProducts((prev) => prev.filter((product) => product.id !== currentProduct.id));
  
        showConfirmationModal("Product removed successfully!");
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
    setShowModal(false);
  };
  

  const handleCancel = () => {
    setShowModal(false);
    showConfirmationModal("Action cancelled!");
  };
  
  
  
  
  const getStockColor = (stock) => {
    if (stock < 10) return "text-red-500 font-bold"; // 🔴 Red for below 10
    if (stock < 30) return "text-yellow-500 font-bold"; // 🟡 Yellow for below 30
    return "text-green-500 font-bold"; // 🟢 Green for 30 and above
  };

  const showConfirmationModal = (message) => {
    setConfirmationMessage(message);
    setShowConfirmation(true);
  
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000); // Hide modal after 2 seconds
  };
  
  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold font-cousine">SHOP</h1>

          <div className="mt-2 text-lg font-medium text-gray-700 text-center">
    {selectedCategory === "all"
      ? "All Product"
      : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
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
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
      <div
        key={product.id}
        className="border rounded-lg shadow p-4 flex flex-col items-center"
      >   
        {/* Image Container for Hover Effect */}
        <div className="relative w-48 h-48 cursor-pointer">
          {/* Primary Image */}
          {product.image && product.image.length > 0 && (
            <>
              <img
                src={product.image[0]} // Primary image
                alt="Primary Image"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-100"
              />
              {/* Secondary Image */}
              {product.secondaryImages && product.secondaryImages.length > 0 && (
                <img
                  src={product.secondaryImages[0]} // Secondary image
                  alt="Secondary Image"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
                />
              )}
            </>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
            <p className="text-sm font-semibold">{product.name}</p>
            <p className="text-xs font-medium">₱{product.price}</p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-2 text-sm font-medium mt-2">
          <div className={`flex justify-between px-3 py-2 border rounded-lg ${getStockColor(product.stocks?.small)}`}>
            <span>Small</span> 
            <span>({product.stocks?.small || 0})</span>
          </div>
          <div className={`flex justify-between px-3 py-2 border rounded-lg ${getStockColor(product.stocks?.medium)}`}>
            <span>Medium</span> 
            <span>({product.stocks?.medium || 0})</span>
          </div>
          <div className={`flex justify-between px-3 py-2 border rounded-lg ${getStockColor(product.stocks?.large)}`}>
            <span>Large</span> 
            <span>({product.stocks?.large || 0})</span>
          </div>
          <div className={`flex justify-between px-3 py-2 border rounded-lg ${getStockColor(product.stocks?.xl)}`}>
            <span>XL</span> 
            <span>({product.stocks?.xl || 0})</span>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentProduct(product);
            setShowModal(true);
          }}
           className="mt-2 px-4 py-2 bg-black text-white rounded-lg transition duration-300 ease-in-out hover:bg-gray-500"
        >
          Edit
        </button>
      </div>
    ))}
        <div
          className="border rounded-lg shadow flex items-center justify-center cursor-pointer"
          onClick={() => {
            setCurrentProduct({ id: null, name: "", price: "", stocks: "", image: [], secondaryImages: [], category: "premium tees" });
            setShowModal(true);
          }}
        >
          <span className="text-3xl text-gray-400">+</span>
        </div>
      </div>

      {/* Modal for Add/Edit Product */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg w-[750px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">
                  {currentProduct.id ? "Edit Product" : "Add Product"}
                </h2>

                {/* Product Name */}
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  placeholder="Enter Product Name"
                />

                {/* Price */}
                <label className="block font-medium mb-1">Price (₱)</label>
                <input
                  type="number"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  placeholder="Enter Price"
                />

                {/* Category Dropdown */}
                <label className="block font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                >
                  <option value="premium tees">Premium Tees</option>
                  <option value="basic tees">Basic Tees</option>
                  <option value="new">New</option>
                </select>

                {/* Color */}
                <label className="block font-medium mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={currentProduct.color || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  placeholder="Enter Color"
                />

                {/* Stock Inputs for Each Size */}
                <label className="block font-medium mb-2">Stock per Size</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block font-medium">Small</label>
                    <input
                      type="number"
                      value={currentProduct.stocks?.small || 0}
                      onChange={(e) => handleStockChange(e, "small")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Stock for Small"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Medium</label>
                    <input
                      type="number"
                      value={currentProduct.stocks?.medium || 0}
                      onChange={(e) => handleStockChange(e, "medium")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Stock for Medium"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Large</label>
                    <input
                      type="number"
                      value={currentProduct.stocks?.large || 0}
                      onChange={(e) => handleStockChange(e, "large")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Stock for Large"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">XL</label>
                    <input
                      type="number"
                      value={currentProduct.stocks?.xl || 0}
                      onChange={(e) => handleStockChange(e, "xl")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Stock for XL"
                    />
                  </div>
                </div>

                {/* Primary Image Upload (Front Image) */}
                <label className="block font-medium mb-1">Front Image</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "primary")} // Upload primary images
                  className="mb-4 border border-gray-300 rounded-lg px-3 py-2 w-full"
                />

                {/* Secondary Image Upload (Back Image) */}
                <label className="block font-medium mb-1">Back Image</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "secondary")} // Upload secondary images
                  className="mb-4 border border-gray-300 rounded-lg px-3 py-2 w-full"
                />

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  {/* Save Button - Always on the Left */}
                  <button onClick={handleSave} 
                  className="px-6 py-3 bg-black text-white rounded-lg transition duration-300 ease-in-out hover:bg-gray-500">
                    Save
                  </button>

                  {/* Cancel & Delete - Grouped on the Right */}
                  <div className="flex space-x-3">
                    {currentProduct.id && (
                      <button onClick={handleDelete} 
                      className="px-6 py-3 bg-red-500 text-white rounded-lg transition duration-300 ease-in-out hover:bg-red-700">
                        Delete
                      </button>
                    )}
                    <button onClick={() => setShowModal(false)} 
                    className="px-6 py-3 bg-neutral-800 text-white rounded-lg transition duration-300 ease-in-out hover:bg-neutral-600">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center animate-fadeInOut">
                <svg
                  className="w-16 h-16 text-green-500 mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg font-semibold">{confirmationMessage}</p>
              </div>
            </div>
)}

    </div>
  );
}
export default AdminShop;
