"use client";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  User2Icon,
  Menu,
  X,
  Code,
  Star,
  Shield,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartModal from "./CartModal";
import { useUser } from "@/contexts/AuthContext";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
  currentPage: string;
  // handleNavigate: (options: NavigationOptions | string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const user = useUser();
  const router = useRouter();
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemCount = getItemCount();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      redirectTo: "/",
    });
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleNavigate("/")}
            >
              <Image
                src="/Majji-removebg-preview.png"
                alt="Majji Logo"
                className="h-30 w-20"
                width={80}
                height={80}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => handleNavigate("/")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === "/"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate("/browse")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === "/browse"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                Browse Products
              </button>
              {user && (
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "/dashboard"
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User2Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="hidden sm:block">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-900">
                            {user.name}
                          </span>
                          {user.verified && (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500 capitalize">
                            {user.type}
                          </span>
                          {user.rating && (
                            <>
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500">
                                {user.rating}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={async () => await handleSignOut()}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigate("/auth")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors btn-animate"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <button
                onClick={() => {
                  handleNavigate("/");
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                  currentPage === "/"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  handleNavigate("/browse");
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                  currentPage === "browse"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                Browse Products
              </button>
              {user && (
                <button
                  onClick={() => {
                    handleNavigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    currentPage === "dashboard"
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
