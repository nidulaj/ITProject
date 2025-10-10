import React, { useState, useEffect } from "react";
import { ShoppingCart, User, Heart, Star, Truck, Shield, Award, Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom'; 


const PubuduHomepage = ({ hideHeader = false }) => {
  const [selectedProduct, setSelectedProduct] = useState("classic-yogurt");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Featured Products
  const products = [
    {
      id: "classic-yogurt",
      name: "Classic Natural Yogurt",
      price: "Rs. 70",
      image: "/images_sadi/ad1.jpg",
      description: "Rich, creamy texture with live probiotics",
      rating: 4.8,
    },
    {
      id: "greek-yogurt",
      name: "Jelly Yogurt",
      price: "Rs. 80",
      image: "/images_sadi/ad2.jpg",
      description: "High protein, thick and creamy",
      rating: 4.9,
    },
    {
      id: "fruit-yogurt",
      name: "Family Pack Yogurt",
      price: "Rs. 520",
      image: "/images_sadi/ad3.jpg",
      description: "Healthy choice with great taste",
      rating: 4.7,
    },
    {
      id: "low-fat-yogurt",
      name: "Mix Fruit Nectar",
      price: "Rs. 100",
      image: "/images_sadi/ad4.jpg",
      description: "Fresh fruits with natural sweetness",
      rating: 4.6,
    },
    {
      id: "low-fat-yogurt",
      name: "Mix Fruit Nectar",
      price: "Rs. 300+",
      image: "/images_sadi/cuz1.png",
      description: "Fresh fruits with natural sweetness",
      rating: 4.6,
    },
    {
      id: "low-fat-yogurt",
      name: "Mix Fruit Nectar",
      price: "Rs. 300+",
      image: "/images_sadi/cuz2.png",
      description: "Fresh fruits with natural sweetness",
      rating: 4.6,
    },
    {
      id: "low-fat-yogurt",
      name: "Mix Fruit Nectar",
      price: "Rs. 300+",
      image: "/images_sadi/cuz3.png",
      description: "Fresh fruits with natural sweetness",
      rating: 4.6,
    },
    {
      id: "low-fat-yogurt",
      name: "Mix Fruit Nectar",
      price: "Rs. 300+",
      image: "/images_sadi/cuz4.png",
      description: "Fresh fruits with natural sweetness",
      rating: 4.6,
    },
  ];

  // Hero slides
  const heroSlides = [
    {
      title: "Pure Ceylon Milk Goodness",
      subtitle: "Farm Fresh • Naturally Delicious • Always Pure",
      image: "/images_sadi/cow5.png",
      cta: "Shop Now"
    },
    {
      title: "Customize Your Perfect Yogurt",
      subtitle: "Choose Your Flavors • Add Your Toppings • Make It Yours",
      image: "/images_sadi/chef1.png",
      cta: "Customize Order"
    },
    {
      title: "Premium Quality Promise",
      subtitle: "100% Natural • No Artificial Colors • Rich in Probiotics",
      image: "/images_sadi/milk1.png",
      cta: "Learn More"
    }
  ];

  const activeProduct = products.find(p => p.id === selectedProduct) || products[0];

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      {!hideHeader && (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div>
                <img 
                  src="/images_sadi/logoPubudu.png" 
                  alt="Pubudu Logo" 
                  className="w-25 h-12 object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Pubudu</h1>
                <p className="text-xs text-gray-500 -mt-1">Milk Products</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="#products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</a>
              <a href="#customize" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Customize</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="#products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</a>
                <a href="#customize" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Customize</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
              </div>
            </nav>
          )}
        </div>
      </header>
      )}

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-12">
          <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-3xl overflow-hidden min-h-[500px]">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={heroSlides[currentSlide].image}
                alt="Hero Background"
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center min-h-[500px] px-12">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl">
                    {heroSlides[currentSlide].cta}
                  </button>
                  <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                    Watch Video
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery on orders over Rs. 10,000 within Colombo</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Assured</h3>
              <p className="text-gray-600">100% natural ingredients with no artificial preservatives</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-200 transition-colors">
                <Award className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Award Winning</h3>
              <p className="text-gray-600">Recognized for excellence in dairy product quality</p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Premium Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our range of carefully crafted yogurt products, made with the finest Ceylon milk
            </p>
            </div>

            {/* First 4 Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
                <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                <div className="aspect-square overflow-hidden relative">
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                    <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                        />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm">({product.rating})</span>
                    </div>

                    <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition-colors text-sm">
                        Add to Cart
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* Add Text Section */}
            <div className="text-center mt-12 mb-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our customized Yogurt?</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our yogurts are crafted with the highest quality, using 100% pure Ceylon milk to bring you a healthy and delicious treat that your family will love.
            </p>
            </div>

            {/* Last 4 Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(4).map((product) => (
                <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                <div className="aspect-square overflow-hidden relative">
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                    <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                        />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm">({product.rating})</span>
                    </div>

                    <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    <Link to="/yogurt-landing">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-[1.05] shadow-lg">
                        Customize Now
                      </button>
                    </Link>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>


      {/* Customization CTA Section */}
      <section id="customize" className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Create Your Perfect Yogurt Experience
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Why settle for ordinary when you can create extraordinary? Design your own custom yogurt 
              with our wide selection of flavors, toppings, and healthy additions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl">
                Start Customizing
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                View Examples
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center"> */}
                  <img 
                    src="/images_sadi/logoPubudu.png" 
                    alt="Pubudu Logo" 
                    className="w-20 h-10 object-cover"
                  />
                {/* </div> */}
                <div>
                  <h3 className="text-xl font-bold">Pubudu</h3>
                  <p className="text-sm text-gray-400">Milk Products</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Premium quality dairy products made with love and care, bringing you the finest taste of Ceylon milk.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#products" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                <li><a href="#customize" className="text-gray-400 hover:text-white transition-colors">Customize</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Order Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">+94 77 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">info@pubudumilk.lk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-400">Kamburupitiya, Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Pubudu Milk Products. All rights reserved. Made with ❤️ in Sri Lanka
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PubuduHomepage;