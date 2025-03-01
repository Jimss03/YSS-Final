import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

// Import images
import slide1 from "../assets/Home-Images/carousel1.png";
import slide2 from "../assets/Home-Images/carousel2.png";
import slide3 from "../assets/Home-Images/carousel3.png";
import slide4 from "../assets/Home-Images/carousel4.png";

// Images Features
import premiumTeesImg from "../assets/Home-Images/premuim-tees.png";
import basicTeesImg from "../assets/Home-Images/basic-tees.png";
import newProductsImg from "../assets/Home-Images/new-product.png";

// Quote Images
import quote1 from "../assets/Home-Images/quote1.png";
import quote2 from "../assets/Home-Images/quote2.png";
import quote3 from "../assets/Home-Images/quote3.png";
import quote4 from "../assets/Home-Images/quote4.png";
import quote5 from "../assets/Home-Images/quote5.png";
import quote6 from "../assets/Home-Images/quote6.png";


const images = [
  { src: slide1, alt: "Young Soul Seekers" },
  { src: slide2, alt: "All The Time" },
  { src: slide3, alt: "Faith Shirt" },
  { src: slide4, alt: "God First" },
];

const quotes = [
  [quote1, quote2, quote3],
  [quote4, quote5, quote6],
  
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const prevQuote = () => {
    setQuoteIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
  };



  return (

    
    <div>

      
      {/* Carousel */}
      <div className="relative w-full h-[400px] overflow-hidden mt-10">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

              {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ❯
      </button>

      </div>
          {/* Marquee Section */}
          <div className="w-full bg-black py-6 overflow-hidden">
            <div className="relative flex items-center whitespace-nowrap text-white text-2xl animate-marquee">
              <div className="flex">
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
              </div>
              {/* Duplicate content for seamless loop */}
              <div className="flex">
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
                <span className="mx-8 font-cousine text-bold">·</span>
                <span className="mx-8 font-cousine text-bold">WEAR GOD'S WORDS</span>
              </div>
            </div>
          </div>

      
      {/* Features Section */}
      <div className="w-full py-16 px-4 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">FEATURES</h2>

          {/* Section 1: Premium & Basic Tees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="relative group mb-6">
                <img
                  src={premiumTeesImg}
                  alt="PREMIUM TEES"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold mb-2">PREMIUM TEES</h3>
                  <a
                    href="/shop?category=premium%20tees"
                    className="text-white underline text-sm tracking-wide"
                  >
                    Shop Now
                  </a>
                </div>
              </div>

              <div className="relative group">
                <img
                  src={basicTeesImg}
                  alt="BASIC TEES"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold mb-2">BASIC TEES</h3>
                  <a
                    href="/shop?category=basic%20tees"
                    className="text-white underline text-sm tracking-wide"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="relative w-full h-full">
                <img
                  src={newProductsImg}
                  alt="NEW"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold mb-2">NEW</h3>
                  <a
                    href="/shop?category=new"
                    className="text-white underline text-sm tracking-wide"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Shop All Products Button */}
          <div className="mt-8">
            <a
              href="/shop"
              className="bg-black text-white py-2 px-6 rounded-lg font-medium text-sm hover:bg-gray-800"
            >
              Shop All Products
            </a>
          </div>
        </div>
      </div>

       {/* Quote Carousel */}
       <div className="relative w-full h-full mb-10 flex justify-center items-center px-10">
        <button 
          onClick={prevQuote} 
          className="absolute left-5 z-10 bg-black text-white p-3 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="flex transition-transform duration-1000 ease-in-out transform">
          {quotes[quoteIndex].map((quote, index) => (
            <img key={index} src={quote} alt={`Quote ${index + 1}`} className="w-1/3 object-cover shadow-lg" />
          ))}
        </div>
        <button 
          onClick={nextQuote} 
          className="absolute right-5 z-10 bg-black text-white p-3 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>







    </div>
  );
}

export default Home;
