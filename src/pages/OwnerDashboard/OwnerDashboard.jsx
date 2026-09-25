// // Owner Dashboard Page
// // Main dashboard for PG owners
// // URL: /owner
// function OwnerDashboard() {
//   return (
//     <h1>Owner Dashboard Page</h1>
//   );
// }

// export default OwnerDashboard;  

// src/pages/OwnerDashboard/OwnerDashboard.jsx

import { Link } from "react-router-dom";

// Icons used throughout this dashboard
import {
  HiOutlineHome,
  HiOutlineMapPin,
  HiStar,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineLightBulb,
} from "react-icons/hi2";

function OwnerDashboard() {
  // ---------- Static Quick Stats ----------
  // Demo values for now, not connected to any backend
  const quickStats = [
    {
      label: "Total Listings",
      value: "3",
      icon: <HiOutlineHome />,
    },
    {
      label: "Active Listings",
      value: "2",
      icon: <HiOutlineClipboardDocumentList />,
    },
    {
      label: "Total Interested Students",
      value: "18",
      icon: <HiOutlineUsers />,
    },
    {
      label: "Average Rating",
      value: "4.5",
      icon: <HiStar />,
    },
  ];

  // ---------- My PG Listings ----------
  // Static sample data, kept consistent with BrowsePG.jsx / PGDetails.jsx
  const myListings = [
    {
      id: 1,
      name: "Sunrise Student PG",
      location: "Ahmedabad",
      rent: "₹7,500/month",
      rating: 4.5,
      sharing: "2 Sharing",
      status: "Active",
    },
    {
      id: 2,
      name: "Student Nest",
      location: "Ahmedabad",
      rent: "₹8,000/month",
      rating: 4.3,
      sharing: "3 Sharing",
      status: "Active",
    },
    {
      id: 3,
      name: "Green Homes PG",
      location: "Ahmedabad",
      rent: "₹6,500/month",
      rating: 4.6,
      sharing: "2 Sharing",
      status: "Inactive",
    },
  ];

  // ---------- Quick Actions ----------
  // AI Description links to the existing /ai-description route,
  // which is already registered in AppRoutes.jsx
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

  return (
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
        {/* Left column (2/3 width on desktop): My PG Listings */}
        {/* Right column (1/3 width on desktop): AI Description + Quick Actions + Tips */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---------- Left Column ---------- */}
          <div className="lg:col-span-2">

            {/* ---------- My PG Listings ---------- */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My PG Listings
              </h2>

              <div className="mt-4 space-y-6">
                {myListings.map((pg) => (
                  <div
                    key={pg.id}
                    className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-md transition-shadow"
                  >
                    {/* Placeholder visual */}
                    <div className="bg-blue-50 rounded-lg w-full sm:w-32 h-24 flex items-center justify-center flex-shrink-0">
                      <HiOutlineHome className="text-blue-600 w-10 h-10" />
                    </div>

                    {/* PG Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {pg.name}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            pg.status === "Active"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {pg.status}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center text-gray-600 text-sm">
                        <HiOutlineMapPin className="mr-1" />
                        {pg.location}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-blue-600 font-semibold">
                          {pg.rent}
                        </span>

                        <div className="flex items-center text-gray-700">
                          <HiStar className="text-yellow-400 mr-1" />
                          {pg.rating}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <HiOutlineUserGroup className="mr-1" />
                          {pg.sharing}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:w-32 flex-shrink-0">
                      <Link
                        to={`/pg/${pg.id}`}
                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>

                      {/* 
                        Edit is a demo-only button for now since there's no 
                        edit route or backend yet - clearly labeled and disabled-looking
                        so it doesn't pretend to do something it can't.
                      */}
                      <button
                        disabled
                        title="Editing will be available once the backend is connected"
                        className="flex-1 text-center border border-gray-200 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- Right Column ---------- */}
          <div className="space-y-6">

            {/* ---------- AI Description Generator Card ---------- */}
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

            {/* ---------- Owner Tips ---------- */}
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
  );
}

export default OwnerDashboard;