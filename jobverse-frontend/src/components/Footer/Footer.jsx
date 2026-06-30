import React, { memo } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Main Footer */}
        <div className="flex flex-col items-center text-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.jpeg"
              alt="JobVerse"
              loading="lazy"
              className="w-12 h-12 rounded-xl object-cover shadow-sm"
            />

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                JobVerse
              </h2>

              <p className="text-sm text-gray-500">
                Career & Hiring Platform
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="max-w-md text-sm text-gray-500 mb-6">
            Connecting talented professionals with great
            opportunities through a modern hiring experience.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-5 mb-8">
            
            <a
              href="#"
              className="text-gray-500 hover:text-pink-600 transition duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={22} />
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-700 transition duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition duration-200"
              aria-label="Facebook"
            >
              <FaFacebook size={22} />
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-black transition duration-200"
              aria-label="Twitter"
            >
              <FaXTwitter size={22} />
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-red-600 transition duration-200"
              aria-label="YouTube"
            >
              <FaYoutube size={22} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            
            <p>
              © {new Date().getFullYear()} JobVerse.
              All rights reserved.
            </p>

            <p>
              Built for modern hiring and career growth.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);

