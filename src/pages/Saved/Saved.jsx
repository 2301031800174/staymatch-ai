// // Saved Page
// // Shows PGs that a student has bookmarked/saved
// // URL: /saved
// function Saved() {
//   return (
//     <h1>Saved Page</h1>
//   );
// }

// export default Saved;

// src/pages/Saved/Saved.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiStar,
  HiOutlineBookmark,
} from "react-icons/hi2";

// Same localStorage key used in PGDetails.jsx - must match exactly
const SAVED_PGS_KEY = "staymatch_saved_pgs";

function Saved() {
  // Holds the list of saved PGs read from localStorage
  const [savedPGs, setSavedPGs] = useState([]);

  // ---------- Helper: safely read saved PGs from localStorage ----------
  // Same safe-parsing logic as PGDetails.jsx, so a missing or corrupted
  // localStorage value never breaks the page.
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

  // ---------- On page load: read saved PGs once ----------
  useEffect(() => {
    setSavedPGs(getSavedPGs());
  }, []);

  // ---------- Remove handler ----------
  // Removes one PG from both localStorage AND our state,
  // so the page updates immediately without needing a refresh.
  const handleRemove = (pgId) => {
    const updatedList = savedPGs.filter((pg) => pg.id !== pgId);
    localStorage.setItem(SAVED_PGS_KEY, JSON.stringify(updatedList));
    setSavedPGs(updatedList);
  };

  // ---------- Empty State ----------
  if (savedPGs.length === 0) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <HiOutlineBookmark className="mx-auto text-gray-300 w-16 h-16" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          No Saved PGs
        </h1>
        <p className="mt-2 text-gray-600">
          Save PG listings you like and they will appear here.
        </p>
        <Link
          to="/browse"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse PGs
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ---------- Page Heading ---------- */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Saved PGs
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            PGs you've saved for later, all in one place.
          </p>
        </div>

        {/* ---------- Saved PG Cards Grid ---------- */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedPGs.map((pg) => (
            <div
              key={pg.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* ---------- Placeholder Visual ---------- */}
              <div className="bg-blue-50 h-40 flex items-center justify-center">
                <HiOutlineHome className="text-blue-600 w-16 h-16" />
              </div>

              {/* ---------- Card Content ---------- */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {pg.name}
                </h3>

                <div className="mt-2 flex items-center text-gray-600 text-sm">
                  <HiOutlineMapPin className="mr-1" />
                  {pg.location}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">
                    {pg.rent}
                  </span>

                  <div className="flex items-center text-sm text-gray-700">
                    <HiStar className="text-yellow-400 mr-1" />
                    {pg.rating}
                  </div>
                </div>

                <div className="mt-2 flex items-center text-gray-600 text-sm">
                  <HiOutlineUserGroup className="mr-1" />
                  {pg.sharing}
                </div>

                {/* ---------- View Details + Remove Buttons ---------- */}
                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    to={`/pg/${pg.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleRemove(pg.id)}
                    className="block text-center border border-red-300 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Saved;