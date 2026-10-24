// src/pages/OwnerDashboard/OwnerDashboard.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";

import {
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineLightBulb,
  HiOutlineCheckCircle,
  HiOutlineUsers,
  HiStar,
} from "react-icons/hi2";

// Backend endpoint that returns all PG listings
const API_URL = "http://localhost:5000/api/pgs/mine";

// Shown when a PG has no image (or the image fails to load)
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";

// ---------- Helper: format rent in Indian rupees ----------
// Example: 7500 -> "₹7,500/month"
const formatRent = (rent) => {
  const amount = Number(rent);
  if (Number.isNaN(amount)) return String(rent);
  return `₹${amount.toLocaleString("en-IN")}/month`;
};

// ---------- Quick Actions ----------
const quickActions = [
  { label: "Add New PG", icon: <HiOutlinePlus />, to: "/add-pg" },
  { label: "View PG Listings", icon: <HiOutlineHome />, to: "/browse" },
  { label: "AI Description", icon: <HiOutlineSparkles />, to: "/ai-description" },
  { label: "Profile", icon: <HiOutlineUser />, to: "/profile" },
];

// ---------- Owner Tips ----------
const ownerTips = [
  "Keep rent and sharing information updated.",
  "Clearly mention available amenities.",
  "Use a detailed and accurate PG description.",
];

function OwnerDashboard() {
  const { token } = useAuth();
  // ---------- State ----------
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0); // used by "Try Again"

  // ---------- Fetch listings from the backend ----------
  useEffect(() => {
    let isCancelled = false; // avoids updating state after leaving the page

    const fetchListings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (response.status === 401) {
  throw new Error("Your session has expired. Please log in again.");
}

if (response.status === 403) {
  throw new Error("Only PG owners can access these listings.");
}

if (!response.ok) {
  throw new Error("Server responded with an error.");
}

const data = await response.json();

        if (!isCancelled) {
          setListings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            "Could not load listings. Please make sure the backend is running on http://localhost:5000."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isCancelled = true;
    };
  }, [reloadCount, token]);

  // Number of listings in the fetched array that are marked verified
  const verifiedCount = listings.filter((pg) => pg.isVerified).length;

  return (
    <>
    <Navbar/>
    <section className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ---------- Dashboard Header ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 rounded-xl p-6 md:p-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, PG Owner! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your PG listings and keep your accommodation information
              up to date.
            </p>
          </div>

          <Link
            to="/add-pg"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <HiOutlinePlus />
            Add New PG
          </Link>
        </div>

        {/* ---------- Quick Stats ---------- */}
        {/* Total Listings and Verified come from the fetched data. */}
        {/* The other two are not available from the backend yet. */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="border border-gray-200 rounded-xl p-6">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xl">
              <HiOutlineClipboardDocumentList />
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {loading ? "..." : error ? "-" : listings.length}
            </p>
            <p className="mt-1 text-sm text-gray-600">Total Listings</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xl">
              <HiOutlineCheckCircle />
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {loading ? "..." : error ? "-" : verifiedCount}
            </p>
            <p className="mt-1 text-sm text-gray-600">Verified Listings</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg text-xl">
              <HiOutlineUsers />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-400">
              Not available yet
            </p>
            <p className="mt-1 text-sm text-gray-600">Interested Students</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg text-xl">
              <HiStar />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-400">
              Not available yet
            </p>
            <p className="mt-1 text-sm text-gray-600">Average Rating</p>
          </div>

        </div>

        {/* ---------- Main Content Grid ---------- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---------- Left Column: PG Listings ---------- */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900">My PG Listings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Showing only PG listings created by your account.
            </p>

            {/* Loading state */}
            {loading && (
              <div className="mt-6 border border-gray-200 rounded-xl p-10 text-center text-gray-600">
                Loading listings...
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="mt-6 border border-red-200 bg-red-50 rounded-xl p-8 text-center">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => setReloadCount(reloadCount + 1)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && listings.length === 0 && (
              <div className="mt-6 border border-gray-200 rounded-xl p-10 text-center">
                <HiOutlineHome className="mx-auto text-gray-300 w-12 h-12" />
                <p className="mt-3 text-lg font-semibold text-gray-900">
                  No PG listings yet
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Add your first PG and it will appear here.
                </p>
                <Link
                  to="/add-pg"
                  className="mt-5 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Add New PG
                </Link>
              </div>
            )}

            {/* Listings */}
            {!loading && !error && listings.length > 0 && (
              <div className="mt-6 space-y-6">
                {listings.map((pg) => (
                  <div
                    key={pg._id}
                    className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-md transition-shadow"
                  >
                    {/* PG Image */}
                    <div className="rounded-lg w-full sm:w-32 h-24 overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={pg.image || DEFAULT_IMAGE}
                        alt={pg.pgName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* PG Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {pg.pgName}
                        </h3>

                        {pg.isVerified && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center text-gray-600 text-sm">
                        <HiOutlineMapPin className="mr-1" />
                        {pg.location}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-blue-600 font-semibold">
                          {formatRent(pg.rent)}
                        </span>

                        <div className="flex items-center text-gray-600">
                          <HiOutlineUserGroup className="mr-1" />
                          {pg.sharing}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:w-32 flex-shrink-0">
                      <Link
                        to={`/pg/${pg._id}`}
                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>

                      {/* Editing is not implemented yet, so this stays disabled
                      <button
                        disabled
                        title="Editing is not implemented yet"
                        className="flex-1 text-center border border-gray-200 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Edit
                      </button> */}

                      {/* Opens the same form as Add PG, filled with this listing's data */}
<Link
  to={`/edit-pg/${pg._id}`}
  className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
>
  Edit
</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Right Column ---------- */}
          <div className="space-y-6">

            {/* AI Description Generator Card */}
            <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-2 text-blue-600">
                <HiOutlineSparkles className="text-xl" />
                <span className="text-sm font-semibold">AI-Assisted</span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Create Better PG Descriptions
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Use AI assistance to create clear and student-friendly
                descriptions for your PG listings.
              </p>

              <Link
                to="/ai-description"
                className="mt-4 block text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Generate Description
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-blue-600 text-lg">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Owner Tips */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 text-gray-900">
                <HiOutlineLightBulb className="text-blue-600 text-lg" />
                <h3 className="text-lg font-bold">Tips for Better Listings</h3>
              </div>

              <ul className="mt-4 space-y-2">
                {ownerTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <span className="text-blue-600 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
    </>
  );
}

export default OwnerDashboard;