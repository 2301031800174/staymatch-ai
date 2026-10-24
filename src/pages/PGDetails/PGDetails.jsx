// src/pages/PGDetails/PGDetails.jsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  HiOutlineMapPin,
  HiStar,
  HiOutlineUserGroup,
  HiOutlineWifi,
  HiOutlineCake,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBookOpen,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineMap,
  HiOutlinePhone,
} from "react-icons/hi2";

// Backend endpoint that returns all PGs
const API_URL = "http://localhost:5000/api/pgs";

// localStorage key shared with the Saved page
const SAVED_PGS_KEY = "staymatch_saved_pgs";

// Shown when a PG has no image (or the image fails to load)
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80";

// Static house rules (not stored in the database)
const HOUSE_RULES = [
  "Maintain cleanliness",
  "No smoking inside rooms",
  "Respect quiet hours",
  "Visitors allowed during permitted hours",
];

// ---------- Helper: format rent in Indian currency ----------
// Example: 7500 -> "₹7,500/month"
const formatRent = (rent) => {
  const amount = Number(rent);
  if (Number.isNaN(amount)) return String(rent);
  return `₹${amount.toLocaleString("en-IN")}/month`;
};

// ---------- Helper: pick an icon for an amenity name ----------
// Amenities come from MongoDB as text, so we match by keyword.
const getAmenityIcon = (name) => {
  const text = String(name).toLowerCase();
  if (text.includes("wifi") || text.includes("internet")) return <HiOutlineWifi />;
  if (text.includes("food") || text.includes("meal") || text.includes("mess"))
    return <HiOutlineCake />;
  if (text.includes("laundry")) return <HiOutlineSparkles />;
  if (text.includes("security") || text.includes("cctv"))
    return <HiOutlineShieldCheck />;
  if (text.includes("study")) return <HiOutlineBookOpen />;
  if (text.includes("housekeeping") || text.includes("clean"))
    return <HiOutlineTrash />;
  return <HiOutlineCheckCircle />;
};

// ---------- Helper: safely read saved PGs from localStorage ----------
const getSavedPGs = () => {
  try {
    const stored = localStorage.getItem(SAVED_PGS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

function PGDetails() {
  // The MongoDB _id from the URL, e.g. /pg/6ad3689f761663b6828a63e5
  const { id } = useParams();

  // ---------- State ----------
  const [pg, setPg] = useState(null); // the PG that matches the URL id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [reloadCount, setReloadCount] = useState(0); // used by the "Try Again" button

  // ---------- Fetch PGs and find the one matching the URL id ----------
  useEffect(() => {
    let isCancelled = false; // avoids updating state after leaving the page

    const fetchPG = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Server responded with an error.");
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((item) => item._id === id);

        if (!isCancelled) {
          setPg(found || null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            "Could not load PG details. Please make sure the backend is running on http://localhost:5000."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchPG();

    return () => {
      isCancelled = true;
    };
  }, [id, reloadCount]);

  // ---------- Check whether this PG is already saved ----------
  useEffect(() => {
    if (!pg) {
      setIsSaved(false);
      return;
    }
    const savedPGs = getSavedPGs();
    setIsSaved(savedPGs.some((item) => item.id === pg._id));
  }, [pg]);

  // ---------- Save / Unsave ----------
  const handleSaveToggle = () => {
    if (!pg) return;

    const savedPGs = getSavedPGs();

    if (isSaved) {
      // Remove this PG
      const updatedList = savedPGs.filter((item) => item.id !== pg._id);
      localStorage.setItem(SAVED_PGS_KEY, JSON.stringify(updatedList));
      setIsSaved(false);
    } else {
      // Add this PG only if it isn't already there (no duplicates)
      const alreadyExists = savedPGs.some((item) => item.id === pg._id);

      if (!alreadyExists) {
        const pgToSave = {
          id: pg._id,
          name: pg.pgName,
          location: pg.location,
          rent: formatRent(pg.rent),
          rating: "New", // new PGs have no rating yet
          sharing: pg.sharing,
          description: pg.description || "",
        };
        localStorage.setItem(
          SAVED_PGS_KEY,
          JSON.stringify([...savedPGs, pgToSave])
        );
      }
      setIsSaved(true);
    }
  };

  // ---------- Loading State ----------
  if (loading) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <p className="text-gray-600">Loading PG details...</p>
      </section>
    );
  }

  // ---------- Error State ----------
  if (error) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setReloadCount(reloadCount + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            to="/browse"
            className="inline-block text-blue-600 font-medium hover:underline py-2"
          >
            ← Back to Browse PGs
          </Link>
        </div>
      </section>
    );
  }

  // ---------- PG Not Found State ----------
  if (!pg) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">PG not found</h1>
        <p className="mt-2 text-gray-600">
          The PG you're looking for doesn't exist.
        </p>
        <Link
          to="/browse"
          className="mt-6 inline-block text-blue-600 font-medium hover:underline"
        >
          ← Back to Browse PGs
        </Link>
      </section>
    );
  }

  // ---------- Prepare data for display ----------
  // Amenities may be an array, or a comma-separated string - handle both
  let amenities = [];
  if (Array.isArray(pg.amenities)) {
    amenities = pg.amenities;
  } else if (typeof pg.amenities === "string" && pg.amenities.trim() !== "") {
    amenities = pg.amenities.split(",").map((item) => item.trim());
  }
  amenities = amenities.filter((item) => item);

  const hasContactNumber = Boolean(pg.contactNumber);

  // ---------- Main Page ----------
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ---------- Back Link ---------- */}
        <Link
          to="/browse"
          className="text-blue-600 font-medium hover:underline text-sm"
        >
          ← Back to Browse PGs
        </Link>

        {/* ---------- Large PG Image ---------- */}
        {/* ---------- Large PG Image ---------- */}
<div className="group relative mt-6 h-72 overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:h-80 md:h-[420px]">
  <img
    src={pg.image || DEFAULT_IMAGE}
    alt={`${pg.pgName} accommodation`}
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = DEFAULT_IMAGE;
    }}
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
  />

  {/* Image overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

  {/* Property label */}
  <div className="absolute bottom-5 left-5 right-5">
    <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
      Student Accommodation
    </span>

    <h2 className="mt-3 text-xl font-semibold text-white drop-shadow-md sm:text-2xl">
      {pg.pgName}
    </h2>

    <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
      <HiOutlineMapPin />
      {pg.location}
    </p>
  </div>
</div>
        {/* ---------- Main Info Card ---------- */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          {/* Name and Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {pg.pgName}
            </h1>

            {/* New PGs have no rating, so we show "New" */}
            <div className="flex items-center text-gray-700">
              <HiStar className="text-yellow-400 mr-1" />
              New
            </div>
          </div>

          {/* Location */}
          <div className="mt-3 flex items-center text-gray-600">
            <HiOutlineMapPin className="mr-1" />
            {pg.location}
          </div>

          {/* Rent and Sharing Type */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-blue-600 text-2xl font-bold">
              {formatRent(pg.rent)}
            </span>

            <div className="flex items-center text-gray-600 text-sm border border-gray-200 rounded-lg px-3 py-1">
              <HiOutlineUserGroup className="mr-1" />
              {pg.sharing}
            </div>
          </div>

          {/* ---------- About Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              About this PG
            </h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {pg.description || "No description has been added for this PG yet."}
            </p>
          </div>

          {/* ---------- Amenities Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>

            {amenities.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm"
                  >
                    <span className="text-blue-600 text-lg">
                      {getAmenityIcon(amenity)}
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-600 text-sm">
                No amenities listed for this PG.
              </p>
            )}
          </div>

          {/* ---------- Room & Sharing Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Room & Sharing
            </h2>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Sharing Type</p>
                <p className="mt-1 font-semibold text-gray-900">{pg.sharing}</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Monthly Rent</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatRent(pg.rent)}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Suitable For</p>
                <p className="mt-1 font-semibold text-gray-900">Students</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Verification</p>
                {pg.isVerified ? (
                  <p className="mt-1 font-semibold text-green-600 flex items-center justify-center gap-1">
                    <HiOutlineCheckCircle />
                    Verified
                  </p>
                ) : (
                  <p className="mt-1 font-semibold text-gray-500">Not verified</p>
                )}
              </div>
            </div>
          </div>

          {/* ---------- House Rules Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">House Rules</h2>
            <ul className="mt-4 space-y-2">
              {HOUSE_RULES.map((rule, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-600 text-sm"
                >
                  <span className="text-blue-600 mt-1">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Location Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            <p className="mt-2 text-gray-600 text-sm flex items-center gap-1">
              <HiOutlineMapPin className="text-blue-600" />
              {pg.location}
            </p>

            {/* Simple visual placeholder - no real map */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg h-40 flex flex-col items-center justify-center text-blue-600">
              <HiOutlineMap className="w-10 h-10" />
              <p className="mt-2 font-medium">Map Preview</p>
              <p className="text-sm text-blue-500">{pg.location}</p>
            </div>
          </div>

          {/* ---------- Action Buttons ---------- */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSaveToggle}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                isSaved
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSaved ? "Saved ✓" : "Save Listing"}
            </button>

            <Link
              to="/compatibility"
              className="flex-1 text-center border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Check Compatibility
            </Link>
          </div>

          {/* ---------- Owner Card ---------- */}
          <div className="mt-10 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Need more information?
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-gray-600 text-sm">
                <HiOutlineUser className="text-blue-600" />
                {pg.ownerName || "PG Owner"}

                {pg.isVerified ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-medium ml-2">
                    <HiOutlineCheckCircle />
                    Verified Owner
                  </span>
                ) : (
                  <span className="text-gray-500 text-xs font-medium ml-2">
                    Not verified
                  </span>
                )}
              </div>

              {hasContactNumber && (
                <p className="mt-1 text-gray-600 text-sm">{pg.contactNumber}</p>
              )}
            </div>

            {/* Contact Owner: tel: link if a number exists, otherwise disabled */}
            {hasContactNumber ? (
              <a
                href={`tel:${pg.contactNumber}`}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <HiOutlinePhone />
                Contact Owner
              </a>
            ) : (
              <button
                disabled
                title="No contact number available"
                className="bg-gray-100 text-gray-400 px-6 py-2 rounded-lg font-medium cursor-not-allowed whitespace-nowrap"
              >
                Contact not available
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default PGDetails;