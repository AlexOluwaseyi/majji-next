"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import HomePage from "@/app/home/page";
import BrowsePage from "@/app/browse/page";
import ProductPage from "@/app/products/page";
import DashboardPage from "@/app/dashboard/page";
import AuthPage from "@/app/auth/page";
import AddProductPage from "@/app/add-product/page";
import { useUser } from "@/contexts/AuthContext";
import { type Page, NavigationOptions, User } from "@/types";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>("");
  const user = useUser();

  const handleNavigate = (options: string | NavigationOptions) => {
    if (typeof options === "string") {
      // Legacy string navigation
      setCurrentPage(options as Page);
      setSelectedProductId(null);
      setCurrentSearchTerm("");
    } else {
      // New object navigation
      setCurrentPage(options.page);
      setSelectedProductId(options.productId || null);
      setCurrentSearchTerm(options.searchTerm || "");
    }
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage("product");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductSelect={navigateToProduct}
          />
        );
      case "browse":
        return (
          <BrowsePage
            onNavigate={handleNavigate}
            onProductSelect={navigateToProduct}
            initialSearchTerm={currentSearchTerm}
          />
        );
      case "product":
        return (
          <ProductPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        );
      case "dashboard":
        return user ? (
          <DashboardPage />
        ) : (
          <AuthPage onNavigate={handleNavigate} />
        );
      case "auth":
        return <AuthPage onNavigate={handleNavigate} />;
      case "add-product":
        return user ? (
          <AddProductPage onNavigate={handleNavigate} />
        ) : (
          <AuthPage onNavigate={handleNavigate} />
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductSelect={navigateToProduct}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}
