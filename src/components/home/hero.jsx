// function Hero() {
//   return (
//     <div className="py-20 text-center">
//       <h1>Hero Section</h1>
//     </div>
//   );
// }

// export default Hero;

// src/components/layout/Hero.jsx

// Link is used for the CTA buttons so navigation works without a full page reload
import { Link } from "react-router-dom";

// Using a React Icon as a placeholder illustration instead of an image file
// HiHomeModern gives a nice "building/house" look that fits a PG-finder app
import { HiHomeModern } from "react-icons/hi2";

function Hero() {
  return (
    // "py-16 md:py-24" gives generous vertical spacing (more on larger screens)
    // "px-4" keeps content away from screen edges on mobile
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* 
          Flex container:
          - Stacked vertically on mobile ("flex-col")
          - Side-by-side on medium+ screens ("md:flex-row")
          - "gap-12" adds spacing between left text block and right icon block
        */}
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* ---------- Left Side: Text Content ---------- */}
          {/* "flex-1" lets this side grow and share space equally with the right side */}
          <div className="flex-1 text-center md:text-left">

            {/* Large heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Your Perfect PG{" "}
              {/* Highlighting key words in blue to match the primary brand color */}
              <span className="text-blue-600">Meet Your Perfect Roommate.</span>
            </h1>

            {/* Small description below the heading */}
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
              Discover verified PGs, connect with compatible roommates, and estimate your monthly living expenses — all in one place.
            </p>

            {/* ---------- CTA Buttons ---------- */}
            {/* "flex-col sm:flex-row" stacks buttons on very small screens, side-by-side otherwise */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

              {/* Primary button - solid blue background */}
              <Link
                to="/browse"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
              >
                Find PG
              </Link>

              {/* Secondary button - outlined style so it doesn't compete with the primary button */}
              <Link
                to="/compatibility"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium text-center hover:bg-blue-50 transition-colors"
              >
                Find Roommate
              </Link>
            </div>
          </div>

          {/* ---------- Right Side: Icon Illustration ---------- */}
          {/* "flex-1" matches the left side so both halves share space evenly */}
          <div className="flex-1 flex justify-center">
            {/* 
              Circular soft-blue background behind the icon, 
              just to make the plain icon look more like a designed illustration
              rather than a random symbol floating on the page
            */}
            <div className="bg-blue-50 rounded-full p-16 flex items-center justify-center">
              <HiHomeModern className="text-blue-600 w-40 h-40 md:w-56 md:h-56" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;