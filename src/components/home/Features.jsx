// src/components/home/Features.jsx

// Importing icons for each feature card
// Each icon visually represents what that feature does
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineCalculator,
  HiOutlineBookmark,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

function Features() {
  // Storing all feature card data in a simple array
  // This avoids repeating the same JSX 6 times and keeps the code clean
  const features = [
    {
      icon: <HiOutlineHome />,
      title: "Find PGs",
      description:
        "Explore student-friendly PGs with useful accommodation details.",
    },
    {
      icon: <HiOutlineUserGroup />,
      title: "Roommate Compatibility",
      description:
        "Compare lifestyle preferences and discover potentially compatible roommates.",
    },
    {
      icon: <HiOutlineSparkles />,
      title: "AI Assistance",
      description:
        "Use AI-assisted features to simplify accommodation and roommate decisions.",
    },
    {
      icon: <HiOutlineCalculator />,
      title: "Expense Estimation",
      description:
        "Estimate your monthly living expenses before choosing a PG.",
    },
    {
      icon: <HiOutlineBookmark />,
      title: "Save Listings",
      description:
        "Save interesting PGs and easily revisit them later.",
    },
    {
      icon: <HiOutlineMagnifyingGlass />,
      title: "Easy Search",
      description:
        "Quickly explore accommodation options using a simple student-friendly interface.",
    },
  ];

  return (
    // "bg-white" keeps the section background clean
    // "py-16 md:py-24" gives generous vertical spacing around the section
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ---------- Section Heading ---------- */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything You Need for a Better Stay
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Find the right accommodation, discover compatible roommates, and
            make better living decisions with StayMatch AI.
          </p>
        </div>

        {/* ---------- Feature Cards Grid ---------- */}
        {/* 
          Responsive grid:
          - 1 column on mobile (default)
          - 2 columns on tablets ("sm:grid-cols-2")
          - 3 columns on desktop ("lg:grid-cols-3")
          "gap-8" adds spacing between cards
        */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Looping through the features array to render one card per feature */}
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              {/* Icon wrapper with a light blue circular background */}
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-2xl">
                {feature.icon}
              </div>

              {/* Feature title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="mt-2 text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;