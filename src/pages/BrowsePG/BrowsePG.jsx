// src/pages/BrowsePG/BrowsePG.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

// Icons used on this page:
import {
  HiOutlineMagnifyingGlass,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiStar,
} from "react-icons/hi2";

function BrowsePG() {
  // Simple local array storing sample PG data
  // Each PG has a unique "id" so we can link to its own details page
  const pgListings = [
    {
      id: 1,
      name: "Sunrise Student PG",
      location: "Ahmedabad",
      rent: "₹7,500/month",
      rating: 4.5,
      sharing: "2 Sharing",
    },
    {
      id: 2,
      name: "Student Nest",
      location: "Ahmedabad",
      rent: "₹8,000/month",
      rating: 4.3,
      sharing: "3 Sharing",
    },
    {
      id: 3,
      name: "Green Homes PG",
      location: "Ahmedabad",
      rent: "₹6,500/month",
      rating: 4.6,
      sharing: "2 Sharing",
    },
    {
      id: 4,
      name: "Campus View PG",
      location: "Ahmedabad",
      rent: "₹7,000/month",
      rating: 4.4,
      sharing: "2 Sharing",
    },
    {
      id: 5,
      name: "Scholar Stay",
      location: "Ahmedabad",
      rent: "₹8,500/month",
      rating: 4.7,
      sharing: "3 Sharing",
    },
    {
      id: 6,
      name: "Comfort Living PG",
      location: "Ahmedabad",
      rent: "₹6,800/month",
      rating: 4.2,
      sharing: "2 Sharing",
    },
  ];

  // ---------- State for search + filters ----------
  // Each piece of the filter UI gets its own state value.
  // Defaults mean "no filter applied" for that control.
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("Location");
  const [budgetFilter, setBudgetFilter] = useState("Maximum Budget");
  const [sharingFilter, setSharingFilter] = useState("Sharing Type");

  // ---------- Helper: convert rent string to a number ----------
  // Rent is stored like "₹7,500/month". To compare it against a budget,
  // we need to strip out "₹", "," and "/month" and turn it into a plain number.
  const getRentAsNumber = (rentString) => {
    // Remove everything that isn't a digit (₹, commas, "/month", spaces)
    const numericPart = rentString.replace(/[^0-9]/g, "");
    return Number(numericPart);
  };

  // ---------- Filtering logic ----------
  // We build the filtered list fresh on every render based on current state.
  // No need for extra state just to hold "filtered results" - deriving it
  // directly from pgListings + filters keeps things simple and always in sync.
  const filteredListings = pgListings.filter((pg) => {
    // 1. Search filter (PG name OR location, case-insensitive)
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      pg.name.toLowerCase().includes(search) ||
      pg.location.toLowerCase().includes(search);

    // 2. Location filter ("Location" means show all)
    const matchesLocation =
      locationFilter === "Location" || pg.location === locationFilter;

    // 3. Budget filter ("Maximum Budget" means no limit)
    let matchesBudget = true;
    if (budgetFilter !== "Maximum Budget") {
      const rentValue = getRentAsNumber(pg.rent);
      if (budgetFilter === "Under ₹7,000") {
        matchesBudget = rentValue <= 7000;
      } else if (budgetFilter === "Under ₹8,000") {
        matchesBudget = rentValue <= 8000;
      } else if (budgetFilter === "Under ₹9,000") {
        matchesBudget = rentValue <= 9000;
      }
    }

    // 4. Sharing type filter ("Sharing Type" means show all)
    const matchesSharing =
      sharingFilter === "Sharing Type" || pg.sharing === sharingFilter;

    // A PG only shows up if it passes ALL active filters
    return matchesSearch && matchesLocation && matchesBudget && matchesSharing;
  });

  // ---------- Clear Filters handler ----------
  // Resets every filter back to its default ("show everything") value
  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("Location");
    setBudgetFilter("Maximum Budget");
    setSharingFilter("Sharing Type");
  };

  return (
    // "bg-white" keeps background consistent with the rest of the site
    <section className="bg-white py-12 px-4">
      {/* Max-width container keeps content aligned with Navbar/Hero/Features */}
      <div className="max-w-7xl mx-auto">

        {/* ---------- Page Heading ---------- */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse PGs
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Find a comfortable place that fits your budget and lifestyle.
          </p>
        </div>

        {/* ---------- Search Bar ---------- */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 transition-colors">
            <HiOutlineMagnifyingGlass className="text-gray-400 text-xl mr-3" />
            <input
              type="text"
              placeholder="Search by PG name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>
        </div>

        {/* ---------- Filter Controls ---------- */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 outline-none focus:border-blue-500"
          >
            <option>Location</option>
            <option>Ahmedabad</option>
            <option>Surat</option>
            <option>Vadodara</option>
          </select>

          {/* Maximum Budget Filter */}
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 outline-none focus:border-blue-500"
          >
            <option>Maximum Budget</option>
            <option>Under ₹7,000</option>
            <option>Under ₹8,000</option>
            <option>Under ₹9,000</option>
          </select>

          {/* Sharing Type Filter */}
          <select
            value={sharingFilter}
            onChange={(e) => setSharingFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 outline-none focus:border-blue-500"
          >
            <option>Sharing Type</option>
            <option>2 Sharing</option>
            <option>3 Sharing</option>
          </select>
        </div>

        {/* ---------- Result Count + Clear Filters ---------- */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto gap-3">
          <p className="text-gray-600 text-sm">
            Showing {filteredListings.length} PG
            {filteredListings.length !== 1 ? "s" : ""}
          </p>

          <button
            onClick={clearFilters}
            className="text-blue-600 text-sm font-medium hover:underline self-start sm:self-auto"
          >
            Clear Filters
          </button>
        </div>

        {/* ---------- PG Cards Grid OR Empty State ---------- */}
        {filteredListings.length === 0 ? (
          // Shown when no PG matches the current search/filters
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-gray-900">
              No PGs found
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Looping through the filtered list instead of the full list */}
            {filteredListings.map((pg) => (
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
                  {/* PG Name */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pg.name}
                  </h3>

                  {/* Location */}
                  <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <HiOutlineMapPin className="mr-1" />
                    {pg.location}
                  </div>

                  {/* Rent and Rating side by side */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-blue-600 font-semibold">
                      {pg.rent}
                    </span>

                    <div className="flex items-center text-sm text-gray-700">
                      <HiStar className="text-yellow-400 mr-1" />
                      {pg.rating}
                    </div>
                  </div>

                  {/* Sharing Type */}
                  <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <HiOutlineUserGroup className="mr-1" />
                    {pg.sharing}
                  </div>

                  {/* ---------- View Details Button ---------- */}
                  <Link
                    to={`/pg/${pg.id}`}
                    className="mt-5 block text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default BrowsePG;