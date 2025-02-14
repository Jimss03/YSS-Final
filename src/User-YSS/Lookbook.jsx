import React, { useEffect, useState } from 'react';
import { db, lookbookCollection } from '../Database/Firebase';  // Import Firestore collection
import { getDocs } from 'firebase/firestore';

function Lookbook() {
  const [lookbooks, setLookbooks] = useState([]);
  const [showModal, setShowModal] = useState(false);  // State for controlling modal visibility
  const [currentImage, setCurrentImage] = useState('');  // State to store the current image to display in modal
  const [currentLookbook, setCurrentLookbook] = useState(null);  // Store the current lookbook to access secondary images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  // Index to track current image in the modal

  useEffect(() => {
    const fetchLookbooks = async () => {
      try {
        const querySnapshot = await getDocs(lookbookCollection); // Fetch data from Firestore
        const lookbooksArray = [];
        querySnapshot.forEach((doc) => {
          lookbooksArray.push({ id: doc.id, ...doc.data() });
        });
        setLookbooks(lookbooksArray);
      } catch (error) {
        console.error("Error fetching lookbooks: ", error);
      }
    };

    fetchLookbooks();
  }, []);

  // Function to handle image click
  const handleImageClick = (image, lookbook) => {
    setCurrentImage(image);
    setCurrentLookbook(lookbook);
    setCurrentImageIndex(0); // Reset the image index to show the main image first
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to go to the next image in the modal
  const nextImage = () => {
    if (currentLookbook && currentLookbook.secondaryImages) {
      if (currentImageIndex < currentLookbook.secondaryImages.length) {
        setCurrentImageIndex((prevIndex) => prevIndex + 1); // Show the next secondary image
      }
    }
  };

  // Function to go to the previous image in the modal
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1); // Show the previous image
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-24">
      {/* Title at the top */}
      <h1 className="text-4xl font-semibold text-center mb-8">Lookbook</h1>

      {/* Hero Image and Text */}
      {lookbooks.length > 0 && (
        <div className="flex items-center mb-8">
          {/* Text on the left */}
          <div className="w-1/2 pr-8">
            <h2 className="text-3xl font-semibold mb-4">{lookbooks[0]?.name || 'Default Collection'}</h2>
            <p className="text-lg mb-4">{lookbooks[0]?.description || 'Default description of the collection'}</p>
          </div>

          {/* Hero Image on the right */}
          <div className="w-1/2">
            <img
              src={lookbooks[0]?.image || 'default-image-url'} // Default image if empty
              alt="Main Lookbook"
              className="w-full h-96 object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(lookbooks[0]?.image, lookbooks[0])} // Open image in modal
            />
          </div>
        </div>
      )}

      {/* Lookbook Items Grid */}
      <h2 className="text-3xl font-semibold text-center mb-8">Lookbook Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lookbooks.map((lookbook) => (
          <div key={lookbook.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg">
            <img
              src={lookbook.image}
              alt={lookbook.name}
              className="w-full h-56 object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(lookbook.image, lookbook)}  // Open image in modal
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{lookbook.name}</h3>
              <p className="text-sm text-gray-600">{lookbook.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Full-Screen Image with Secondary Images */}
      {showModal && currentLookbook && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative max-w-7xl">
            {/* Display the current image */}
            <img
              src={
                currentImageIndex === 0
                  ? currentLookbook.image
                  : currentLookbook.secondaryImages[currentImageIndex - 1]  // Display secondary images based on currentImageIndex
              }
              alt="Full screen"
              className="w-full h-auto max-w-4xl max-h-screen object-contain"
            />

            {/* Navigation Buttons for Modal */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4 z-10">
              <button
                onClick={prevImage}
                className="text-white text-4xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                &#10094;
              </button>
              <button
                onClick={nextImage}
                className="text-white text-4xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                &#10095;
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black text-white rounded-full p-2 hover:bg-gray-800 z-10"
            >
              {/* Close Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lookbook;
