"use client";

import SellerDashboard from "@/components/SellerDashboard";
import BuyerDashboard from "@/components/BuyerDashboard";
import { NavigationOptions } from "@/types";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/AuthContext";

interface DashboardPageProps {
  onNavigate: (options: NavigationOptions | string) => void;
}

const DashboardPage = () => {
  const router = useRouter();
  const user = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to access your dashboard
          </h2>
          <button
            onClick={() => router.push("/auth")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.type === "seller" ? (
        <SellerDashboard user={user} />
      ) : (
        <BuyerDashboard user={user} />
      )}
    </div>
  );
};

export default DashboardPage;
