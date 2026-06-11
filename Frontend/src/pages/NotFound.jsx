import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

/**
 * 404 Not Found page.
 * Shown for any route that doesn't match the app's route table.
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Large decorative 404 */}
      <p className="text-[9rem] sm:text-[12rem] font-extrabold leading-none text-gray-100 select-none">
        404
      </p>

      {/* Floating card overlaid on the number */}
      <div className="-mt-16 sm:-mt-20 relative z-10 flex flex-col items-center gap-4">
        {/* Brand logo */}
        <img
          src={assets.logo}
          alt="SwiftCare"
          className="h-8 mb-2 opacity-80"
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button onClick={() => navigate("/")} className="btn-primary">
            Go to Home
          </button>
          <button onClick={() => navigate(-1)} className="btn-outline">
            Go Back
          </button>
        </div>

        {/* Quick-links */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
          {[
            { label: "Find a Doctor", path: "/doctors" },
            { label: "About Us", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="hover:text-primary transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
