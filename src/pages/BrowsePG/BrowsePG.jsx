import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiStar,
} from "react-icons/hi2";

function BrowsePG() {
  // Store PG listings fetched from MongoDB
  const [pgListings, setPgListings] = useState([]);

  // Track loading and API errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("Location");
  const [budgetFilter, setBudgetFilter] = useState("Maximum Budget");
  const [sharingFilter, setSharingFilter] = useState("Sharing Type");

  // Fetch PG listings from the backend when the page loads
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/pgs");

        if (!response.ok) {
          throw new Error("Failed to fetch PG listings.");
        }

        const data = await response.json();

        // Convert MongoDB fields into the format used by our UI
        const formattedPGs = data.map((pg) => ({
          id: pg._id,
          name: pg.pgName,
          location: pg.location,
          rent: Number(pg.rent),
          rating: pg.rating ?? "New",
          sharing: pg.sharing,
          amenities: pg.amenities ?? [],
          description: pg.description ?? "",
          image: pg.image ?? "",
        }));

        setPgListings(formattedPGs);
      } catch (err) {
        console.error("Error fetching PG listings:", err);
        setError(
          "Unable to load PG listings. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, []);

  // Convert numeric rent into a readable format
  const formatRent = (rent) => {
    return `₹${Number(rent).toLocaleString("en-IN")}/month`;
  };

  // Apply search and filters
  const filteredListings = pgListings.filter((pg) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      pg.name.toLowerCase().includes(search) ||
      pg.location.toLowerCase().includes(search);

    const matchesLocation =
      locationFilter === "Location" || pg.location === locationFilter;

    let matchesBudget = true;

    if (budgetFilter !== "Maximum Budget") {
      const rentValue = Number(pg.rent);

      if (budgetFilter === "Under ₹7,000") {
        matchesBudget = rentValue <= 7000;
      } else if (budgetFilter === "Under ₹8,000") {
        matchesBudget = rentValue <= 8000;
      } else if (budgetFilter === "Under ₹9,000") {
        matchesBudget = rentValue <= 9000;
      }
    }

    const matchesSharing =
      sharingFilter === "Sharing Type" || pg.sharing === sharingFilter;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesBudget &&
      matchesSharing
    );
  });

  // Reset all filters
  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("Location");
    setBudgetFilter("Maximum Budget");
    setSharingFilter("Sharing Type");
  };

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse PGs
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Find a comfortable place that fits your budget and lifestyle.
          </p>
        </div>

        {/* Search Bar */}
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

        {/* Filter Controls */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
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

        {/* Result Count and Clear Filters */}
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

        {/* Loading State */}
        {loading && (
          <div className="mt-16 text-center">
            <p className="text-gray-600">Loading PG listings...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-16 text-center">
            <p className="text-red-600 font-medium">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredListings.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-gray-900">
              No PGs found
            </p>

            <p className="mt-2 text-gray-600 text-sm">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* PG Cards */}
        {!loading && !error && filteredListings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((pg) => (
              <div
                key={pg.id}
                // className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                className="group border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Placeholder Visual */}
                {/* PG Image */}
<div className="relative h-52 overflow-hidden bg-gray-100">
  {pg.image && (
    <img
      src={pg.image}
      alt={`${pg.name} accommodation`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling?.classList.remove("hidden");
      }}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )}

  {/* Fallback when an image is unavailable */}
  <div
    className={`${
      pg.image ? "hidden" : ""
    } absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100`}
  >
    <HiOutlineHome className="w-14 h-14 text-blue-500" />

    <p className="mt-2 text-sm font-medium text-gray-600">
      Student Accommodation
    </p>
  </div>

  {/* Accommodation label */}
  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
    Student Stay
  </span>
</div>
                {/* Card Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pg.name}
                  </h3>

                  <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <HiOutlineMapPin className="mr-1" />
                    {pg.location}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-blue-600 font-semibold">
                      {formatRent(pg.rent)}
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