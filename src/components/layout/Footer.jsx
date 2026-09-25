// function Footer() {
//   return (
//     <footer className="py-8 text-center">
//       Footer
//     </footer>
//   );
// }

// export default Footer;
// src/components/layout/Footer.jsx

// Link is used for navigation so clicking these doesn't reload the whole page
import { Link } from "react-router-dom";

function Footer() {
  return (
    // "bg-slate-50" gives a light, soft background (slightly different from pure white)
    // "mt-auto" (optional use later) would push footer down if using flex layout on page
    <footer className="bg-slate-50">
      {/* "py-12" gives generous top/bottom spacing, "px-4" keeps content off screen edges on mobile */}
      <div className="max-w-7xl mx-auto py-12 px-4">

        {/* 
          Main content grid:
          - Single column on mobile ("grid-cols-1")
          - Three columns on medium+ screens ("md:grid-cols-3")
          - "gap-10" adds spacing between each column
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ---------- Column 1: Brand Info ---------- */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              StayMatch AI
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              Find the Right Stay. Meet the Right Roommate.
            </p>
          </div>

          {/* ---------- Column 2: Quick Links ---------- */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Quick Links
            </h3>
            {/* "flex flex-col" stacks links vertically, "space-y-2" adds spacing between them */}
            <div className="mt-4 flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Browse PGs
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Login
              </Link>
            </div>
          </div>

          {/* ---------- Column 3: Contact ---------- */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Contact
            </h3>
            <p className="mt-4 text-gray-600 text-sm">
              support@staymatch.ai
            </p>
          </div>

        </div>

        {/* ---------- Bottom Section ---------- */}
        {/* "border-t" adds a thin line above this section to visually separate it */}
        {/* "mt-10 pt-6" adds spacing above and inside, before the copyright text */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 StayMatch AI. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;