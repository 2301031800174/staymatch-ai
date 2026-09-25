// // Student Dashboard Page
// // Main dashboard for logged-in students
// // URL: /student
// function StudentDashboard() {
//   return (
//     <h1>Student Dashboard Page</h1>
//   );
// }

// export default StudentDashboard;

// src/pages/StudentDashboard/StudentDashboard.jsx

import { Link } from "react-router-dom";

// Icons used throughout this dashboard
import {
  HiOutlineHome,
  HiOutlineMapPin,
  HiStar,
  HiOutlineBookmark,
  HiOutlineUserGroup,
  HiOutlineCalculator,
  HiOutlineSparkles,
  HiOutlineCurrencyRupee,
  HiOutlineHeart,
  HiOutlineArrowRight,
} from "react-icons/hi2";

function StudentDashboard() {
  // ---------- Static Quick Stats ----------
  // These are demo values for now, not connected to any backend
  const quickStats = [
    {
      label: "Saved PGs",
      value: "3",
      icon: <HiOutlineBookmark />,
    },
    {
      label: "Compatibility Score",
      value: "83%",
      icon: <HiOutlineUserGroup />,
    },
    {
      label: "Monthly Budget",
      value: "₹8,000",
      icon: <HiOutlineCurrencyRupee />,
    },
    {
      label: "Roommate Matches",
      value: "4",
      icon: <HiOutlineHeart />,
    },
  ];

  // ---------- Recommended PGs ----------
  // Static sample data, kept consistent with BrowsePG.jsx / PGDetails.jsx
  const recommendedPGs = [
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
  ];

  // ---------- Saved Listings (compact preview) ----------
  // A short static list just to show on the dashboard,
  // separate from the full Saved page which reads from localStorage
  const savedListingsPreview = [
    {
      id: 1,
      name: "Sunrise Student PG",
      location: "Ahmedabad",
      rent: "₹7,500/month",
    },
    {
      id: 4,
      name: "Campus View PG",
      location: "Ahmedabad",
      rent: "₹7,000/month",
    },
    {
      id: 5,
      name: "Scholar Stay",
      location: "Ahmedabad",
      rent: "₹8,500/month",
    },
  ];

  // ---------- Quick Action Buttons ----------
  const quickActions = [
    { label: "Browse PGs", icon: <HiOutlineHome />, to: "/browse" },
    { label: "Find Roommate", icon: <HiOutlineUserGroup />, to: "/compatibility" },
    { label: "Calculate Expenses", icon: <HiOutlineCalculator />, to: "/expenses" },
    { label: "View Saved PGs", icon: <HiOutlineBookmark />, to: "/saved" },
  ];

  return (
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
        {/* 
          Responsive grid:
          - 1 column on mobile
          - 2 columns on small screens
          - 4 columns on large screens
        */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xl">
                {stat.icon}
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ---------- Main Content Grid ---------- */}
        {/* Left column (2/3 width on desktop): Recommended PGs + Saved Listings */}
        {/* Right column (1/3 width on desktop): Compatibility + Expenses cards */}
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

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendedPGs.map((pg) => (
                  <div
                    key={pg.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Placeholder visual */}
                    <div className="bg-blue-50 h-32 flex items-center justify-center">
                      <HiOutlineHome className="text-blue-600 w-12 h-12" />
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900">
                        {pg.name}
                      </h3>

                      <div className="mt-1 flex items-center text-gray-600 text-sm">
                        <HiOutlineMapPin className="mr-1" />
                        {pg.location}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-blue-600 font-semibold text-sm">
                          {pg.rent}
                        </span>
                        <div className="flex items-center text-sm text-gray-700">
                          <HiStar className="text-yellow-400 mr-1" />
                          {pg.rating}
                        </div>
                      </div>

                      <div className="mt-1 flex items-center text-gray-600 text-xs">
                        <HiOutlineUserGroup className="mr-1" />
                        {pg.sharing}
                      </div>

                      <Link
                        to={`/pg/${pg.id}`}
                        className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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

              <div className="mt-4 border border-gray-200 rounded-xl divide-y divide-gray-100">
                {savedListingsPreview.map((pg) => (
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
            </div>
          </div>

          {/* ---------- Right Column ---------- */}
          <div className="space-y-6">

            {/* ---------- Roommate Compatibility Card ---------- */}
            <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-2 text-blue-600">
                <HiOutlineSparkles className="text-xl" />
                <span className="text-sm font-semibold">AI-Assisted</span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Find a Compatible Roommate
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Compare lifestyle preferences such as study habits, sleep
                schedule, cleanliness and social preferences.
              </p>

              <div className="mt-4 flex items-center justify-between bg-white border border-blue-100 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-600">
                  Compatibility Score
                </span>
                <span className="text-lg font-bold text-blue-600">83%</span>
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
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.to}
                    className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-blue-600 text-lg">
                      {action.icon}
                    </span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default StudentDashboard;