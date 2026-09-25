// // Compatibility Page
// // AI-based roommate compatibility matching feature
// // URL: /compatibility
// function Compatibility() {
//   return (
//     <h1>Compatibility Page</h1>
//   );
// }

// export default Compatibility;

// src/pages/Compatibility/Compatibility.jsx

import { useState } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineMoon,
  HiOutlineBookOpen,
  HiOutlineHome,
  HiOutlineHeart,
} from "react-icons/hi2";

function Compatibility() {
  // ---------- Preference Options ----------
  // These are the same 6 categories used for both the user and the roommate.
  // Storing them as one config array keeps us from repeating the same
  // JSX structure 6 times for each profile card.
  const categories = [
    {
      key: "study",
      label: "Study Habits",
      icon: <HiOutlineBookOpen />,
      options: ["Quiet & Focused", "Flexible", "Social & Collaborative"],
    },
    {
      key: "sleep",
      label: "Sleep Schedule",
      icon: <HiOutlineMoon />,
      options: ["Early Sleeper", "Flexible", "Night Owl"],
    },
    {
      key: "cleanliness",
      label: "Cleanliness",
      icon: <HiOutlineHome />,
      options: ["Very Important", "Moderate", "Flexible"],
    },
    {
      key: "food",
      label: "Food Preference",
      icon: <HiOutlineHeart />,
      options: ["Vegetarian", "Non-Vegetarian", "Both / No Preference"],
    },
    {
      key: "social",
      label: "Social Preference",
      icon: <HiOutlineUserGroup />,
      options: ["Quiet / Private", "Balanced", "Social / Friendly"],
    },
    {
      key: "budget",
      label: "Preferred Monthly Budget",
      icon: <HiOutlineSparkles />,
      options: ["Under ₹7,000", "₹7,000 - ₹8,000", "₹8,000 - ₹9,000", "₹9,000+"],
    },
  ];

  // ---------- Default Selections ----------
  // Giving both profiles sensible default values so the page
  // looks useful right away, instead of starting completely empty.
  const defaultUser = {
    study: "Quiet & Focused",
    sleep: "Early Sleeper",
    cleanliness: "Very Important",
    food: "Vegetarian",
    social: "Balanced",
    budget: "₹7,000 - ₹8,000",
  };

  const defaultRoommate = {
    study: "Flexible",
    sleep: "Flexible",
    cleanliness: "Moderate",
    food: "Both / No Preference",
    social: "Social / Friendly",
    budget: "₹7,000 - ₹8,000",
  };

  // ---------- State ----------
  // userPrefs and roommatePrefs hold the currently selected option
  // for each category, for each profile.
  const [userPrefs, setUserPrefs] = useState(defaultUser);
  const [roommatePrefs, setRoommatePrefs] = useState(defaultRoommate);

  // result holds the calculated score + breakdown after clicking "Calculate"
  // It stays null until the button is clicked, so we know when to show the result section.
  const [result, setResult] = useState(null);

  // ---------- Handlers ----------

  // Updates a single category's selected value for either "user" or "roommate"
  const handleSelect = (profileType, key, value) => {
    if (profileType === "user") {
      setUserPrefs({ ...userPrefs, [key]: value });
    } else {
      setRoommatePrefs({ ...roommatePrefs, [key]: value });
    }
    // Whenever preferences change, hide the old result so it doesn't look outdated
    setResult(null);
  };

  // Calculates compatibility by comparing each category between the two profiles
  const calculateCompatibility = () => {
    // breakdown will store true/false (match or not) for each category
    const breakdown = categories.map((category) => ({
      label: category.label,
      isMatch: userPrefs[category.key] === roommatePrefs[category.key],
    }));

    // Counting how many categories matched
    const matchCount = breakdown.filter((item) => item.isMatch).length;

    // Simple scoring: matches out of 6 categories, converted to a percentage
    const percentage = Math.round((matchCount / categories.length) * 100);

    setResult({ percentage, breakdown });
  };

  // Resets both profiles back to their default values and clears the result
  const resetPreferences = () => {
    setUserPrefs(defaultUser);
    setRoommatePrefs(defaultRoommate);
    setResult(null);
  };

  // ---------- Helper: Result Message Based on Score ----------
  const getResultMessage = (percentage) => {
    if (percentage >= 80) {
      return "Great match! Your lifestyle preferences are highly compatible.";
    } else if (percentage >= 60) {
      return "Good potential match! You share several important preferences.";
    } else if (percentage >= 40) {
      return "Moderate compatibility. Consider discussing lifestyle differences.";
    } else {
      return "Low compatibility. You may want to discuss your preferences carefully.";
    }
  };

  // ---------- Helper: Color Classes Based on Score ----------
  // Used to visually emphasize good vs. weak matches
  const getResultColorClasses = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // ---------- Reusable Preference Card ----------
  // Renders one profile's full set of category selectors.
  // Used twice: once for "user", once for "roommate".
  const renderPreferenceCard = (title, prefs, profileType) => (
    <div className="border border-gray-200 rounded-xl p-6 md:p-8 flex-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>

      {/* Looping through every category to render its label + selectable options */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.key}>
            {/* Category label with icon */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-blue-600">{category.icon}</span>
              {category.label}
            </div>

            {/* Selectable option buttons */}
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => {
                const isSelected = prefs[category.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(profileType, category.key, option)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---------- Page Header ---------- */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find Your Compatible Roommate
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Tell us about your lifestyle and preferences to discover how well
            you may match with another student.
          </p>
        </div>

        {/* ---------- Preference Cards ---------- */}
        {/* Side-by-side on desktop, stacked on mobile */}
        <div className="mt-10 flex flex-col md:flex-row gap-8">
          {renderPreferenceCard("Your Preferences", userPrefs, "user")}
          {renderPreferenceCard("Compare With Roommate", roommatePrefs, "roommate")}
        </div>

        {/* ---------- Action Buttons ---------- */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={calculateCompatibility}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Calculate Compatibility
          </button>

          <button
            onClick={resetPreferences}
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Reset Preferences
          </button>
        </div>

        {/* ---------- Result Section ---------- */}
        {/* Only shown after "Calculate Compatibility" has been clicked */}
        {result && (
          <div className="mt-12">

            {/* Score Card */}
            <div
              className={`border rounded-xl p-8 text-center ${getResultColorClasses(
                result.percentage
              )}`}
            >
              <p className="text-sm font-medium uppercase tracking-wide">
                Your Compatibility Score
              </p>
              <p className="mt-2 text-5xl font-bold">{result.percentage}%</p>
              <p className="mt-3 text-sm md:text-base">
                {getResultMessage(result.percentage)}
              </p>
            </div>

            {/* Match Breakdown */}
            <div className="mt-8 border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compatibility Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <span className="text-gray-700 text-sm">{item.label}</span>
                    {item.isMatch ? (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Match
                      </span>
                    ) : (
                      <span className="text-red-500 text-sm font-medium">
                        ✕ Different
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------- AI Assistance Info Section ---------- */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
          <HiOutlineSparkles className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">AI-Assisted Matching</h3>
            <p className="mt-1 text-gray-600 text-sm">
              StayMatch AI is designed to assist students in comparing
              lifestyle preferences and identifying potentially compatible
              roommates.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Compatibility;