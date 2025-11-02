import { LoaderCircle } from "lucide-react";

interface GoogleSignInProps {
  onClickAction: () => void;
  isLoading: boolean;
}

export const GoogleSignIn = ({
  onClickAction,
  isLoading,
}: GoogleSignInProps) => {
  return (
    <button
      type="button"
      onClick={onClickAction}
      disabled={isLoading}
      className="w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 
                 dark:border-gray-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 
                 dark:text-gray-200 font-medium py-3 px-4 rounded-md 
                 transition-colors duration-200 flex items-center justify-center space-x-3 
                 shadow-sm disabled:opacity-50"
    >
      {isLoading ? (
        <LoaderCircle className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
      ) : (
        <>
          {/* Google G Logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.3c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.2 7.1l3.6 2.8c.9-2.6 3.3-4.6 6.2-4.6z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.9 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8C4 20.5 7.7 23 12 23z"
            />
            <path
              fill="#4285F4"
              d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.7 3.3-8.1z"
            />
            <path
              fill="#FBBC05"
              d="M5.8 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1V7.1H2.2C1.4 8.6 1 10.2 1 12s.4 3.5 1.2 4.9l2.9-2.2.7-.6z"
            />
          </svg>
          <span className="text-sm font-medium">Sign in with Google</span>
        </>
      )}
    </button>
  );
};
