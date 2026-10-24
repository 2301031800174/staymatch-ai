// src/pages/StudentDashboard/StudentDashboard.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

import {
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineBookmark,
  HiOutlineCalculator,
  HiOutlineSparkles,
  HiOutlineCurrencyRupee,
  HiOutlineHeart,
  HiOutlineArrowRight,
} from "react-icons/hi2";

// Backend endpoint that returns all PG listings
const API_URL = "http://localhost:5000/api/pgs";

// Same localStorage key used by PGDetails.jsx and Saved.jsx
const SAVED_PGS_KEY = "staymatch_saved_pgs";

// Shown when a PG has no image (or the image fails to load)
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";

// ---------- Helper: format rent in Indian rupees ----------
// Example: 7500 -> "₹7,500/month"
// Old saved entries already store rent as text, so non-numbers are returned as they are.
const formatRent = (rent) => {
  const amount = Number(rent);
  if (Number.isNaN(amount)) return String(rent);
  return `₹${amount.toLocaleString("en-IN")}/month`;
};

// ---------- Helper: safely read saved PGs from localStorage ----------
// We only READ here - we never change or clear the stored data.
// Supports both formats: an array of PG objects (what PGDetails saves)
// or an array of plain ID strings.
const readSavedEntries = () => {
  try {
    const stored = localStorage.getItem(SAVED_PGS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

// Gets the PG id out of one saved entry (object or plain id)
const getEntryId = (entry) => {
  if (entry && typeof entry === "object") return entry.id;
  return entry;
};

// ---------- Quick Actions ----------
const quickActions = [
  { label: "Browse PGs", icon: <HiOutlineHome />, to: "/browse" },
  { label: "Find Roommate", icon: <HiOutlineUserGroup />, to: "/compatibility" },
  { label: "Calculate Expenses", icon: <HiOutlineCalculator />, to: "/expenses" },
  { label: "View Saved PGs", icon: <HiOutlineBookmark />, to: "/saved" },
];

function StudentDashboard() {
  // ---------- State ----------
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0); // used by "Try Again"

  // Saved entries are read once when the dashboard opens
  const [savedEntries] = useState(readSavedEntries);

  // ---------- Fetch listings from the backend ----------
  useEffect(() => {
    let isCancelled = false; // avoids updating state after leaving the page

    const fetchListings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL);
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
            "Could not load PG listings. Please make sure the backend is running on http://localhost:5000."
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
  }, [reloadCount]);

  // ---------- Recommended PGs ----------
  // There is no personalised matching yet, so we show the 3 newest listings.
  const recommendedPGs = [...listings]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  // ---------- Saved Listings preview ----------
  // For each saved entry, use the real MongoDB record if we have it.
  // If the record can't be found (e.g. backend offline), fall back to the
  // details stored in localStorage. Plain IDs with no record are skipped.
  const savedItems = savedEntries
    .map((entry) => {
      const entryId = getEntryId(entry);
      const realPG = listings.find((pg) => pg._id === entryId);

      if (realPG) {
        return {
          id: realPG._id,
          name: realPG.pgName,
          location: realPG.location,
          rent: formatRent(realPG.rent),
        };
      }

      if (entry && typeof entry === "object") {
        return {
          id: entry.id,
          name: entry.name,
          location: entry.location,
          rent: formatRent(entry.rent),
        };
      }

      return null;
    })
    .filter((item) => item !== null && item.id);

  // The saved count comes from localStorage, so it works even if the backend is offline
  const savedCount = savedEntries.filter((entry) => getEntryId(entry)).length;

  // ---------- Quick Stats ----------
  // Only the saved count is real. The rest are not supported yet.
  const quickStats = [
    {
      label: "Saved PGs",
      value: String(savedCount),
      icon: <HiOutlineBookmark />,
      available: true,
    },
    {
      label: "Compatibility Score",
      value: "Not calculated",
      icon: <HiOutlineUserGroup />,
      available: false,
    },
    {
      label: "Monthly Budget",
      value: "Not set",
      icon: <HiOutlineCurrencyRupee />,
      available: false,
    },
    {
      label: "Roommate Matches",
      value: "Not available yet",
      icon: <HiOutlineHeart />,
      available: false,
    },
  ];

  return (
    <>
    <Navbar />
    <section className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ---------- Dashboard Header ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 rounded-xl p-6 md:p-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, Student! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Find your ideal PG and roommate with StayMatch.
            </p>
          </div>

          <Link
            to="/browse"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Browse PGs
            <HiOutlineArrowRight />
          </Link>
        </div>

        {/* ---------- Quick Stats ---------- */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl ${
                  stat.available
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {stat.icon}
              </div>
              <p
                className={`mt-4 font-bold ${
                  stat.available ? "text-2xl text-gray-900" : "text-lg text-gray-400"
                }`}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ---------- Main Content Grid ---------- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---------- Left Column ---------- */}
          <div className="lg:col-span-2 space-y-10">

            {/* ---------- Recommended PGs ---------- */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recommended PGs
                </h2>
                <Link
                  to="/browse"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View All
                </Link>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Showing the latest PG listings.
              </p>

              {/* Loading state */}
              {loading && (
                <div className="mt-4 border border-gray-200 rounded-xl p-10 text-center text-gray-600">
                  Loading PG listings...
                </div>
              )}

              {/* Error state */}
              {!loading && error && (
                <div className="mt-4 border border-red-200 bg-red-50 rounded-xl p-8 text-center">
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
              {!loading && !error && recommendedPGs.length === 0 && (
                <div className="mt-4 border border-gray-200 rounded-xl p-10 text-center">
                  <HiOutlineHome className="mx-auto text-gray-300 w-12 h-12" />
                  <p className="mt-3 text-lg font-semibold text-gray-900">
                    No PG listings yet
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Listings will appear here once PGs are added.
                  </p>
                </div>
              )}

              {/* PG cards */}
              {!loading && !error && recommendedPGs.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recommendedPGs.map((pg) => (
                    <div
                      key={pg._id}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* PG image (placeholder if missing) */}
                      <div className="h-32 bg-gray-100">
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

                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900">
                          {pg.pgName}
                        </h3>

                        <div className="mt-1 flex items-center text-gray-600 text-sm">
                          <HiOutlineMapPin className="mr-1" />
                          {pg.location}
                        </div>

                        <div className="mt-2 text-blue-600 font-semibold text-sm">
                          {formatRent(pg.rent)}
                        </div>

                        <div className="mt-1 flex items-center text-gray-600 text-xs">
                          <HiOutlineUserGroup className="mr-1" />
                          {pg.sharing}
                        </div>

                        <Link
                          to={`/pg/${pg._id}`}
                          className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---------- Saved Listings ---------- */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Saved Listings
                </h2>
                <Link
                  to="/saved"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View All Saved Listings
                </Link>
              </div>

              {savedItems.length === 0 ? (
                <div className="mt-4 border border-gray-200 rounded-xl p-8 text-center">
                  <HiOutlineBookmark className="mx-auto text-gray-300 w-10 h-10" />
                  <p className="mt-3 font-semibold text-gray-900">
                    No saved listings yet
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Save PGs you like and they will appear here.
                  </p>
                  <Link
                    to="/browse"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse PGs
                  </Link>
                </div>
              ) : (
                <div className="mt-4 border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {/* Only the first 3 saved PGs are previewed here */}
                  {savedItems.slice(0, 3).map((pg) => (
                    <div
                      key={pg.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {pg.name}
                        </p>
                        <div className="mt-1 flex items-center text-gray-600 text-xs">
                          <HiOutlineMapPin className="mr-1" />
                          {pg.location}
                          <span className="mx-2">•</span>
                          {pg.rent}
                        </div>
                      </div>

                      <Link
                        to={`/pg/${pg.id}`}
                        className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ---------- Right Column ---------- */}
          <div className="space-y-6">

            {/* ---------- Roommate Compatibility Card ---------- */}
            <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-2 text-blue-600">
                <HiOutlineSparkles className="text-xl" />
                <span className="text-sm font-semibold">Compatibility Calculator</span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Find a Compatible Roommate
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Compare lifestyle preferences such as study habits, sleep
                schedule, cleanliness and social preferences using our
                rule-based compatibility calculator.
              </p>

              <div className="mt-4 flex items-center justify-between bg-white border border-blue-100 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-600">Compatibility Score</span>
                <span className="text-sm font-semibold text-gray-400">
                  Not calculated
                </span>
              </div>

              <Link
                to="/compatibility"
                className="mt-4 block text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Check Compatibility
              </Link>
            </div>

            {/* ---------- Expense Calculator Card ---------- */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xl">
                <HiOutlineCalculator />
              </div>

              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Plan Your Monthly Expenses
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Estimate your rent, food, travel and other monthly expenses
                before choosing a PG.
              </p>

              <Link
                to="/expenses"
                className="mt-4 block text-center border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Calculate Expenses
              </Link>
            </div>

            {/* ---------- Quick Actions ---------- */}
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

          </div>
        </div>

      </div>
    </section>
    </>
  );
}

export default StudentDashboard;