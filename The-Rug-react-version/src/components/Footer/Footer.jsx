import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4A4947] text-[#D8D2C2] pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="block mb-4">
              <img
                src="src/assets/10075827.jpg"
                alt="logo"
                className="h-12 w-auto rounded"
              />
            </Link>
            <p className="mb-4 text-sm">
              Our company is dedicated to providing high-quality products and
              exceptional service to our customers.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#D8D2C2] hover:text-white transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#D8D2C2] hover:text-white transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#D8D2C2] hover:text-white transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4 after:content-[''] after:block after:w-12 after:h-1 after:bg-[#D8D2C2] after:mt-1">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          {/* <div>
            <h3 className="text-white text-lg font-medium mb-4 after:content-[''] after:block after:w-12 after:h-1 after:bg-[#D8D2C2] after:mt-1">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#D8D2C2] hover:text-white transition-colors duration-300 hover:pl-1 block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4 after:content-[''] after:block after:w-12 after:h-1 after:bg-[#D8D2C2] after:mt-1">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>new Zarqa, 26 st., Zarqa, Jordan</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>(+962) 787507215</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>ali.mohammad.abuhassan.se@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="border-t border-b border-[#D8D2C2]/20 py-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-1">
              <h3 className="text-white text-lg font-medium mb-1">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm">
                Get updates on new products and exclusive offers
              </p>
            </div>
            <div className="lg:col-span-2">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 py-2 px-4 rounded-full bg-[#3A3938] text-[#D8D2C2] placeholder-[#D8D2C2]/70 border-2 border-[#D8D2C2]/20 focus:border-[#D8D2C2] outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#D8D2C2] text-[#4A4947] font-medium hover:bg-white transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div> */}

        {/* Footer Bottom */}
        <div className="text-center text-sm">
          <p>© {currentYear} The Rug.jo . All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
