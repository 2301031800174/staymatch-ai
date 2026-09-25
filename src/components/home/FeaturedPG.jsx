// src/components/home/FeaturedPG.jsx

// Link is used for the "View Details" button so navigation works via React Router
import { Link } from "react-router-dom";

// Icons used inside each card:
// HiOutlineHome as a placeholder visual (instead of a real PG image)
// HiOutlineMapPin for location, HiStar for rating, HiOutlineUserGroup for sharing type
import { HiOutlineHome, HiOutlineMapPin, HiOutlineUserGroup } from "react-icons/hi2";
import { HiStar } from "react-icons/hi2";

function FeaturedPG() {
  // Simple local array storing sample PG data
  // In a real app, this would come from a backend/database,
  // but for this project we're using static data for now
  const pgListings = [
    {
      name: "Sunrise Student PG",
      location: "Ahmedabad",
      rent: "₹7,500/month",
      rating: 4.5,
      sharing: "2 Sharing",
    },
    {
      name: "Student Nest",
      location: "Ahmedabad",
      rent: "₹8,000/month",
      rating: 4.3,
      sharing: "3 Sharing",
    },
    {
      name: "Green Homes PG",
      location: "Ahmedabad",
      rent: "₹6,500/month",
      rating: 4.6,
      sharing: "2 Sharing",
    },
  ];

  return (
    // "bg-white" keeps background consistent with Features section
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ---------- Section Heading ---------- */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured PGs
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Explore student-friendly accommodation options in one place.
          </p>
        </div>

        {/* ---------- PG Cards Grid ---------- */}
        {/* 
          Responsive grid:
          - 1 column on mobile (default)
          - 2 columns on tablets ("sm:grid-cols-2")
          - 3 columns on desktop ("lg:grid-cols-3")
        */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Looping through the pgListings array to render one card per PG */}
          {pgListings.map((pg, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* ---------- Placeholder Visual ---------- */}
              {/* Using a light blue box with a large icon instead of a real image */}
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
                  to="/browse"
                  className="mt-5 block text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default FeaturedPG;  