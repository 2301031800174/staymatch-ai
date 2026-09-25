// src/pages/PGDetails/PGDetails.jsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// Icons used throughout this page
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
} from "react-icons/hi2";

// This is the localStorage key we use to store saved PGs.
// Keeping it as one constant means we never risk typing it
// differently in two places.
const SAVED_PGS_KEY = "staymatch_saved_pgs";

function PGDetails() {
  // Reading the "id" value from the URL
  const { id } = useParams();

  // Local array storing all six PGs (same data used in BrowsePG.jsx)
  const pgListings = [
    {
      id: 1,
      name: "Sunrise Student PG",
      location: "Ahmedabad",
      rent: "₹7,500/month",
      rating: 4.5,
      sharing: "2 Sharing",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      description:
        "Comfortable and student-friendly accommodation with essential facilities for everyday living. This PG is suitable for students looking for a convenient and affordable place to stay in Ahmedabad.",
    },
    {
      id: 2,
      name: "Student Nest",
      location: "Ahmedabad",
      rent: "₹8,000/month",
      rating: 4.3,
      sharing: "3 Sharing",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      description:
        "Comfortable and student-friendly accommodation with essential facilities for everyday living. This PG is suitable for students looking for a convenient and affordable place to stay in Ahmedabad.",
    },
    {
      id: 3,
      name: "Green Homes PG",
      location: "Ahmedabad",
      rent: "₹6,500/month",
      rating: 4.6,
      sharing: "2 Sharing",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
      description:
        "Comfortable and student-friendly accommodation with essential facilities for everyday living. This PG is suitable for students looking for a convenient and affordable place to stay in Ahmedabad.",
    },
    {
      id: 4,
      name: "Campus View PG",
      location: "Ahmedabad",
      rent: "₹7,000/month",
      rating: 4.4,
      sharing: "2 Sharing",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
      description:
        "Comfortable and student-friendly accommodation with essential facilities for everyday living. This PG is suitable for students looking for a convenient and affordable place to stay in Ahmedabad.",
    },
    {
      id: 5,
      name: "Scholar Stay",
      location: "Ahmedabad",
      rent: "₹8,500/month",
      rating: 4.7,
      sharing: "3 Sharing",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
      description:
        "Comfortable and student-friendly accommodation with essential facilities for everyday living. This PG is suitable for students looking for a convenient and affordable place to stay in Ahmedabad.",
    },
    {
      id: 6,
      name: "Comfort Living PG",
      location: "Ahmedabad",
      rent: "₹6,800/month",
      rating: 4.2,
      sharing: "2 Sharing",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      description:
        "Comfortable and student-friendly accommodation with essential facilities for everyday living. This PG is suitable for students looking for a convenient and affordable place to stay in Ahmedabad.",
    },
  ];

  // Finding the PG whose id matches the id from the URL
  const pg = pgListings.find((item) => item.id === Number(id));

  // ---------- Saved Listing State ----------
  // Tracks whether THIS PG is currently saved or not
  const [isSaved, setIsSaved] = useState(false);

  // ---------- Helper: safely read saved PGs from localStorage ----------
  // Wrapped in try/catch because localStorage data could be missing,
  // empty, or corrupted (not valid JSON) - we don't want that to crash the page.
  const getSavedPGs = () => {
    try {
      const stored = localStorage.getItem(SAVED_PGS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Make sure what we got back is actually an array before using it
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // If JSON.parse fails (corrupted data), just treat it as empty
      return [];
    }
  };

  // ---------- On page load: check if this PG is already saved ----------
  // useEffect runs after the component renders. We use it here to read
  // localStorage once when the page opens (or when the URL id changes).
  useEffect(() => {
    if (!pg) return; // nothing to check if PG doesn't exist

    const savedPGs = getSavedPGs();
    const alreadySaved = savedPGs.some((item) => item.id === pg.id);
    setIsSaved(alreadySaved);
  }, [id]); // re-run this check whenever the URL id changes

  // ---------- Save / Unsave handler ----------
  const handleSaveToggle = () => {
    if (!pg) return;

    const savedPGs = getSavedPGs();

    if (isSaved) {
      // Currently saved -> remove it
      const updatedList = savedPGs.filter((item) => item.id !== pg.id);
      localStorage.setItem(SAVED_PGS_KEY, JSON.stringify(updatedList));
      setIsSaved(false);
    } else {
      // Currently not saved -> add it (only if it's not already there,
      // to avoid accidental duplicates)
      const alreadyExists = savedPGs.some((item) => item.id === pg.id);

      if (!alreadyExists) {
        // Only storing the fields the Saved page actually needs
        const pgToSave = {
          id: pg.id,
          name: pg.name,
          location: pg.location,
          rent: pg.rent,
          rating: pg.rating,
          sharing: pg.sharing,
          description: pg.description,
        };

        const updatedList = [...savedPGs, pgToSave];
        localStorage.setItem(SAVED_PGS_KEY, JSON.stringify(updatedList));
      }

      setIsSaved(true);
    }
  };

  // Amenities list - each has an icon and a label
  const amenities = [
    { icon: <HiOutlineWifi />, label: "WiFi" },
    { icon: <HiOutlineCake />, label: "Food" },
    { icon: <HiOutlineSparkles />, label: "Laundry" },
    { icon: <HiOutlineShieldCheck />, label: "Security" },
    { icon: <HiOutlineBookOpen />, label: "Study Area" },
    { icon: <HiOutlineTrash />, label: "Housekeeping" },
  ];

  // House rules list - simple static text items
  const houseRules = [
    "Maintain cleanliness",
    "No smoking inside rooms",
    "Respect quiet hours",
    "Visitors allowed during permitted hours",
  ];

  // ---------- Handling PG Not Found ----------
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
        <div className="mt-6 rounded-xl overflow-hidden h-64 md:h-96">
          <img
            src={pg.image}
            alt={pg.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ---------- Main Info Card ---------- */}
        <div className="mt-8 border border-gray-200 rounded-xl p-6 md:p-8">

          {/* Name and Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {pg.name}
            </h1>

            <div className="flex items-center text-gray-700">
              <HiStar className="text-yellow-400 mr-1" />
              {pg.rating}
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
              {pg.rent}
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
              {pg.description}
            </p>
          </div>

          {/* ---------- Amenities Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Amenities
            </h2>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm"
                >
                  <span className="text-blue-600 text-lg">
                    {amenity.icon}
                  </span>
                  {amenity.label}
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Room & Sharing Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Room & Sharing
            </h2>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Sharing Type</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {pg.sharing}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Monthly Rent</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {pg.rent}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Suitable For</p>
                <p className="mt-1 font-semibold text-gray-900">Students</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">Availability</p>
                <p className="mt-1 font-semibold text-green-600 flex items-center justify-center gap-1">
                  <HiOutlineCheckCircle />
                  Available
                </p>
              </div>
            </div>
          </div>

          {/* ---------- House Rules Section ---------- */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              House Rules
            </h2>
            <ul className="mt-4 space-y-2">
              {houseRules.map((rule, index) => (
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
            <h2 className="text-lg font-semibold text-gray-900">
              Location
            </h2>
            <p className="mt-2 text-gray-600 text-sm flex items-center gap-1">
              <HiOutlineMapPin className="text-blue-600" />
              {pg.location}
            </p>

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg h-40 flex flex-col items-center justify-center text-blue-600">
              <HiOutlineMap className="w-10 h-10" />
              <p className="mt-2 font-medium">Map Preview</p>
              <p className="text-sm text-blue-500">Ahmedabad, Gujarat</p>
            </div>
          </div>

          {/* ---------- Action Buttons ---------- */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {/* Save Listing - now fully functional using localStorage */}
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

            {/* Navigates to the Compatibility page (still UI-only destination) */}
            <Link
              to="/compatibility"
              className="flex-1 text-center border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Check Compatibility
            </Link>
          </div>

          {/* ---------- Contact / Owner Card ---------- */}
          <div className="mt-10 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Need more information?
              </h3>

              <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
                <HiOutlineUser className="text-blue-600" />
                PG Owner
                <span className="flex items-center gap-1 text-green-600 text-xs font-medium ml-2">
                  <HiOutlineCheckCircle />
                  Verified Owner
                </span>
              </div>
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
              Contact Owner
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default PGDetails;