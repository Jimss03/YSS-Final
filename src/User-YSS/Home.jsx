"use client"

import { useState, useEffect, useRef } from "react"
import "tailwindcss/tailwind.css"

// Import images
import slide1 from "../assets/Home-Images/carousel1.png"
import slide2 from "../assets/Home-Images/carousel2.png"
import slide3 from "../assets/Home-Images/carousel3.png"
import slide4 from "../assets/Home-Images/carousel4.png"

// Images Features
import premiumTeesImg from "../assets/Home-Images/premuim-tees.png"
import basicTeesImg from "../assets/Home-Images/basic-tees.png"
import newProductsImg from "../assets/Home-Images/new-product.png"

// Quote Images
import quote1 from "../assets/Home-Images/quote1.png"
import quote2 from "../assets/Home-Images/quote2.png"
import quote3 from "../assets/Home-Images/quote3.png"
import quote4 from "../assets/Home-Images/quote4.png"
import quote5 from "../assets/Home-Images/quote5.png"
import quote6 from "../assets/Home-Images/quote6.png"

const images = [
  { src: slide1, alt: "Young Soul Seekers" },
  { src: slide2, alt: "All The Time" },
  { src: slide3, alt: "Faith Shirt" },
  { src: slide4, alt: "God First" },
]

// Replace the quotes array definition with this:


function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef(null)


  const quotes = [quote1, quote2, quote3, quote4, quote5, quote6,]

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  // Replace the nextQuote function with this:
  const nextQuote = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // Apply animation class
    if (carouselRef.current) {
      carouselRef.current.style.transform = "translateX(-33.33%)"
    }

    // After animation completes, reset position and update index
    setTimeout(() => {
      // Update the index without modulo to allow continuous scrolling
      setQuoteIndex((prevIndex) => {
        // If we're at the end of the original quotes, don't reset
        // but continue with the duplicated quotes
        if (prevIndex >= quotes.length - 4) {
          return prevIndex + 1
        }
        return (prevIndex + 1) % (quotes.length - 2)
      })

      if (carouselRef.current) {
        carouselRef.current.style.transition = "none"
        carouselRef.current.style.transform = "translateX(0)"
        // Force reflow
        carouselRef.current.offsetHeight
        carouselRef.current.style.transition = "transform 500ms ease-in-out"
      }
      setIsAnimating(false)
    }, 500)
  }

  // Replace the prevQuote function with this:
  const prevQuote = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // If we're at the beginning, don't allow going back further
    if (quoteIndex === 0) {
      setIsAnimating(false)
      return
    }

    // First insert the previous item at the beginning without animation
    if (carouselRef.current) {
      carouselRef.current.style.transition = "none"
      carouselRef.current.style.transform = "translateX(-33.33%)"
      // Force reflow
      carouselRef.current.offsetHeight
      carouselRef.current.style.transition = "transform 500ms ease-in-out"
      carouselRef.current.style.transform = "translateX(0)"
    }

    // After animation completes, update the index
    setTimeout(() => {
      setQuoteIndex((prevIndex) => prevIndex - 1)
      setIsAnimating(false)
    }, 500)
  }

  // Get the current visible quotes
  const visibleQuotes = [
    quotes[quoteIndex % quotes.length],
    quotes[(quoteIndex + 1) % quotes.length],
    quotes[(quoteIndex + 2) % quotes.length],
  ]

  return (
    <div>
      {/* Carousel */}
      <div className="relative w-full h-[400px] overflow-hidden mt-10">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src || "/placeholder.svg"}
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
      <div className="w-full py-10 px-4 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">FEATURES</h2>

          {/* Section 1: Premium & Basic Tees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="relative group mb-6">
                <img
                  src={premiumTeesImg || "/placeholder.svg"}
                  alt="PREMIUM TEES"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold mb-2">PREMIUM TEES</h3>
                  <a href="/shop?category=premium%20tees" className="text-white underline text-sm tracking-wide">
                    Shop Now
                  </a>
                </div>
              </div>

              <div className="relative group">
                <img src={basicTeesImg || "/placeholder.svg"} alt="BASIC TEES" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold mb-2">BASIC TEES</h3>
                  <a href="/shop?category=basic%20tees" className="text-white underline text-sm tracking-wide">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="relative w-full h-full">
                <img src={newProductsImg || "/placeholder.svg"} alt="NEW" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-bold mb-2">NEW</h3>
                  <a href="/shop?category=new" className="text-white underline text-sm tracking-wide">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Shop All Products Button */}
          <div className="mt-8">
            <a href="/shop" className="bg-black text-white py-2 px-6 rounded-lg font-medium text-sm hover:bg-gray-800">
              Shop All Products
            </a>
          </div>
        </div>
      </div>

      {/* Quote Carousel - Enhanced with smooth animations and larger size */}
      <div className="relative w-full py-5 bg-gray-50">

        <div className="relative max-w-7xl mx-auto px-4 overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: "translateX(0)" }}
          >
            {visibleQuotes.map((quote, index) => (
              <div key={index} className="w-1/3 px-2">
                <div className="transform transition-all duration-500 hover:scale-105">
                  <img
                    src={quote || "/placeholder.svg"}
                    alt={`Quote ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg shadow-xl"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevQuote}
            disabled={isAnimating}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 ease-in-out z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={nextQuote}
            disabled={isAnimating}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 ease-in-out z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Replace the indicator dots section with this: */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: quotes.length - 2 }).map((_, index) => {
              // Only show dots for the original quotes (not duplicates)
              if (index < 6) {
                return (
                  <button
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === (quoteIndex % 6) ? "bg-black scale-125" : "bg-gray-300"
                    }`}
                    onClick={() => !isAnimating && setQuoteIndex(index)}
                    disabled={isAnimating}
                  />
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

