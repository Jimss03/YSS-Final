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
    stocks: "",
    image: [],
    category: "premium tees", // Add a category field
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category

  // ✅ Fetch Products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(shopCollection);
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray); // Initially, show all products
      } catch (error) {
        console.error("Firestore Fetch Error:", error);
      }
    };

    fetchProducts();
  }, []);

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
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "product_shop"); 
      formData.append("cloud_name", "dm97yk6vr"); 

      try {
        console.log("Uploading image to Cloudinary:", file.name);
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dm97yk6vr/image/upload",
          formData
        );

        if (response.data.secure_url) {
          imageUrls.push(response.data.secure_url);
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
      }
    }

    console.log("Final Image URLs:", imageUrls);
    setCurrentProduct((prev) => ({ ...prev, image: imageUrls }));
  };

  // ✅ Save or Update Product in Firestore
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
          stocks: Number(currentProduct.stocks),
          image: currentProduct.image, 
          category: currentProduct.category, // Store category in Firestore
        });

        setProducts((prev) =>
          prev.map((product) =>
            product.id === currentProduct.id ? { ...currentProduct } : product
          )
        );

        console.log("Product Updated:", currentProduct);
      } else {
        const docRef = await addDoc(shopCollection, {
          name: currentProduct.name,
          price: Number(currentProduct.price),
          stocks: Number(currentProduct.stocks),
          image: currentProduct.image, 
          category: currentProduct.category, // Store category in Firestore
        });

        setProducts((prev) => [...prev, { ...currentProduct, id: docRef.id }]);

        console.log("Product Added:", { ...currentProduct, id: docRef.id });
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
        console.log("Product Deleted:", currentProduct.id);
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
    setShowModal(false);
  };

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">SHOP</h1>

          <div className="mt-2 text-lg font-medium text-gray-700 text-center">
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
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow p-4 flex flex-col items-center"
          >
            {product.image && product.image.length > 0 ? (
              <div className="flex space-x-2">
                {product.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-32 h-32 object-cover"
                  />
                ))}
              </div>
            ) : (
              <img
                src="https://via.placeholder.com/150"
                alt={product.name}
                className="w-32 h-32 object-cover mb-4"
              />
            )}
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p>₱{product.price}</p>
            <p>Stocks: {product.stocks}</p>
            <button
              onClick={() => {
                setCurrentProduct(product);
                setShowModal(true);
              }}
              className="mt-2 px-4 py-2 bg-black text-white rounded-lg"
            >
              Edit
            </button>
          </div>
        ))}
        <div
          className="border rounded-lg shadow flex items-center justify-center cursor-pointer"
          onClick={() => {
            setCurrentProduct({ id: null, name: "", price: "", stocks: "", image: [], category: "premium tees" });
            setShowModal(true);
          }}
        >
          <span className="text-3xl text-gray-400">+</span>
        </div>
      </div>

      {/* Modal for Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-2xl font-bold mb-6">
              {currentProduct.id ? "Edit Product" : "Add Product"}
            </h2>
            <input
              type="text"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="Product Name"
            />
            <input
              type="number"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="Price"
            />
            <input
              type="number"
              name="stocks"
              value={currentProduct.stocks}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="Stocks"
            />
            {/* Category Dropdown for Modal */}
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
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="mb-4"
            />
                <div className="flex justify-between mt-4">
                  {/* Save Button - Always on the Left */}
                  <button onClick={handleSave} className="px-6 py-3 bg-black text-white rounded-lg">
                    Save
                  </button>

                  {/* Cancel & Delete - Grouped on the Right */}
                  <div className="flex space-x-3">
                    {currentProduct.id && (
                      <button onClick={handleDelete} className="px-6 py-3 bg-red-500 text-white rounded-lg">
                        Delete
                      </button>
                    )}
                    <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-gray-400 text-white rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminShop;
