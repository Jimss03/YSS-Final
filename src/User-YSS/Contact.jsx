import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome styles
import ContactBG from "../../src/assets/Contact-Images/RightsideBackground.png";

function Contact() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#FAFAFA]">
      <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Contact Form */}
        <div className="w-1/2 p-8 bg-[#FAFAFA]">
          <h2 className="text-center text-4xl font-bold mb-6 font-cousine">CONTACT US</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name *"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <input
              type="email"
              placeholder="Email *"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <textarea
              placeholder="Comment"
              className="w-full p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              SEND
            </button>
          </form>
        </div>

        {/* Right Side - Contact Information with Background Image */}
        <div className="w-1/2 p-8 flex flex-col justify-center relative">
          {/* Background Image */}
          <img
            src={ContactBG}
            alt="Contact Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Content on top of the image */}
          <div className="relative z-10 text-white self-start pl-10">
            <h2 className="text-3xl font-bold mb-6 font-cousine">Contact Information</h2>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-3 text-lg">
                <i className="fas fa-envelope text-2xl"></i>
                <p className="text-lg">Email: youngsoulseekers@gmail.com</p>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <i className="fas fa-phone text-2xl"></i>
                <p className="text-lg">Phone: 09982113817</p>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <i className="fas fa-map-marker-alt text-2xl"></i>
                <p className="text-lg">Address: Kalawisan, Lapu-Lapu City, Cebu, Philippines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;