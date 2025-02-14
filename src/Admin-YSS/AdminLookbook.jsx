import React, { useState, useEffect } from 'react';
import { db, lookbookCollection } from '../Database/Firebase';  // Import Firestore collection
import { addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function AdminLookbook() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Main image
  const [imageFile, setImageFile] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]); // Array to hold multiple secondary images
  const [lookbooks, setLookbooks] = useState([]); // State to store lookbook entries
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); // To track which lookbook is being edited

  const handleFileChange = (e, type, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...secondaryImages];
      if (type === 'main') {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file)); // Preview the image
      } else {
        // For secondary images, replace the image at the given index
        newImages[index] = URL.createObjectURL(file);
        setSecondaryImages(newImages);
      }
    }
  };

  const handleAddSecondaryImage = () => {
    setSecondaryImages([...secondaryImages, '']); // Add a new empty string to the array for new secondary image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing lookbook
        const lookbookDoc = doc(db, 'lookbook', editingId);
        await updateDoc(lookbookDoc, {
          name: name,
          description: description,
          image: imageUrl,
          secondaryImages: secondaryImages, // Store multiple secondary images
        });
        alert('Lookbook updated successfully!');
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Add new lookbook
        await addDoc(lookbookCollection, {
          name: name,
          description: description,
          image: imageUrl,
          secondaryImages: secondaryImages, // Store multiple secondary images
          timestamp: new Date(),
        });
        alert('Lookbook added successfully!');
      }

      // Clear form and refetch lookbooks
      setName('');
      setDescription('');
      setImageUrl('');
      setSecondaryImages([]);
      setImageFile(null);
      fetchLookbooks();
    } catch (error) {
      console.error("Error adding/updating lookbook: ", error);
      alert("Error adding/updating lookbook.");
    }
  };

  // Fetch lookbooks from Firestore
  const fetchLookbooks = async () => {
    try {
      const querySnapshot = await getDocs(lookbookCollection);
      const lookbooksArray = [];
      querySnapshot.forEach((doc) => {
        lookbooksArray.push({ id: doc.id, ...doc.data() });
      });
      setLookbooks(lookbooksArray);
    } catch (error) {
      console.error("Error fetching lookbooks: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const lookbookDoc = doc(db, 'lookbook', id);
      await deleteDoc(lookbookDoc);
      alert('Lookbook deleted successfully!');
      fetchLookbooks(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting lookbook: ", error);
      alert("Error deleting lookbook.");
    }
  };

  const handleEdit = (lookbook) => {
    setIsEditing(true);
    setEditingId(lookbook.id);
    setName(lookbook.name);
    setDescription(lookbook.description);
    setImageUrl(lookbook.image);
    setSecondaryImages(lookbook.secondaryImages || []); // Handle multiple secondary images
  };

  // Fetch lookbooks when the component first loads
  useEffect(() => {
    fetchLookbooks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">{isEditing ? 'Edit Lookbook' : 'Create Lookbook Entry'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Choose Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'main')}
            className="p-2 border border-gray-300 rounded-lg"
          />
          {imageFile && (
            <button
              onClick={() => window.open(imageUrl, '_blank')}
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
            >
              Open Main Image
            </button>
          )}
        </div>

        {/* Secondary Images */}
        <div>
          <label className="block font-medium">Secondary Images:</label>
          {secondaryImages.map((secondaryImage, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'secondary', index)}
                className="p-2 border border-gray-300 rounded-lg"
              />
              {secondaryImage && (
                <button
                  onClick={() => window.open(secondaryImage, '_blank')}
                  className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
                >
                  Open Secondary Image {index + 1}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSecondaryImage}
            className="p-2 bg-green-500 text-white rounded-lg mt-2"
          >
            + Add Secondary Image
          </button>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {isEditing ? 'Update Lookbook' : 'Submit Lookbook'}
        </button>
      </form>

      {/* Display Lookbook Entries Below the Form */}
      <h3 className="text-2xl font-semibold text-center mt-8 mb-4">Existing Lookbooks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lookbooks.length === 0 ? (
          <p className="text-center col-span-3">No lookbooks available.</p>
        ) : (
          lookbooks.map((lookbook) => (
            <div key={lookbook.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold">{lookbook.name}</h4>
              <p>{lookbook.description}</p>
              <div className="relative">
                <img
                  src={lookbook.image}
                  alt={lookbook.name}
                  className="mt-4 w-full h-56 object-cover rounded-lg"
                />
                {/* Display all secondary images on top of the main image */}
                {lookbook.secondaryImages && lookbook.secondaryImages.map((secondaryImage, index) => (
                  <img
                    key={index}
                    src={secondaryImage}
                    alt={`Secondary Image ${index + 1}`}
                    className="absolute top-0 left-0 w-1/4 h-1/4 object-cover rounded-lg border-2 border-white"
                  />
                ))}
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEdit(lookbook)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lookbook.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminLookbook;
