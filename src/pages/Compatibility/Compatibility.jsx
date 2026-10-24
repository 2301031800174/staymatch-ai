// src/pages/Compatibility/Compatibility.jsx

import { useState, useEffect } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineMoon,
  HiOutlineBookOpen,
  HiOutlineHome,
  HiOutlineHeart,
} from "react-icons/hi2";

// localStorage key where both profiles' preferences are saved (browser only)
const STORAGE_KEY = "staymatch_compatibility_preferences";

// ---------- Budget ranges ----------
// Each budget option stands for a real rupee range (min and max per month).
// "₹9,000+" has no upper limit, so we use 12,000 as an assumed upper end.
const BUDGET_RANGES = {
  "Under ₹7,000": { min: 0, max: 7000 },
  "₹7,000 - ₹8,000": { min: 7000, max: 8000 },
  "₹8,000 - ₹9,000": { min: 8000, max: 9000 },
  "₹9,000+": { min: 9000, max: 12000 },
};

// ---------- Categories ----------
// weight = how much this category counts towards the final score (total = 100)
// partial = pairs of different options that are still partly compatible
// fallback = score for any different pair that is not listed in "partial"
const categories = [
  {
    key: "study",
    label: "Study Habits",
    icon: <HiOutlineBookOpen />,
    weight: 20,
    options: ["Quiet & Focused", "Flexible", "Social & Collaborative"],
    partial: [
      { pair: ["Quiet & Focused", "Flexible"], score: 70 },
      { pair: ["Flexible", "Social & Collaborative"], score: 70 },
    ],
    fallback: 20,
  },
  {
    key: "sleep",
    label: "Sleep Schedule",
    icon: <HiOutlineMoon />,
    weight: 20,
    options: ["Early Sleeper", "Flexible", "Night Owl"],
    partial: [
      { pair: ["Early Sleeper", "Flexible"], score: 70 },
      { pair: ["Flexible", "Night Owl"], score: 70 },
    ],
    fallback: 20,
  },
  {
    key: "cleanliness",
    label: "Cleanliness",
    icon: <HiOutlineHome />,
    weight: 20,
    options: ["Very Important", "Moderate", "Flexible"],
    partial: [
      { pair: ["Very Important", "Moderate"], score: 60 },
      { pair: ["Moderate", "Flexible"], score: 70 },
    ],
    fallback: 30, // Very Important vs Flexible
  },
  {
    key: "food",
    label: "Food Preference",
    icon: <HiOutlineHeart />,
    weight: 10,
    options: ["Vegetarian", "Non-Vegetarian", "Both / No Preference"],
    partial: [
      { pair: ["Vegetarian", "Both / No Preference"], score: 80 },
      { pair: ["Non-Vegetarian", "Both / No Preference"], score: 80 },
    ],
    fallback: 30, // Vegetarian vs Non-Vegetarian
  },
  {
    key: "social",
    label: "Social Preference",
    icon: <HiOutlineUserGroup />,
    weight: 15,
    options: ["Quiet / Private", "Balanced", "Social / Friendly"],
    partial: [
      { pair: ["Quiet / Private", "Balanced"], score: 70 },
      { pair: ["Balanced", "Social / Friendly"], score: 70 },
    ],
    fallback: 20,
  },
  {
    key: "budget",
    label: "Preferred Monthly Budget",
    icon: <HiOutlineSparkles />,
    weight: 15,
    options: ["Under ₹7,000", "₹7,000 - ₹8,000", "₹8,000 - ₹9,000", "₹9,000+"],
  },
];

// ---------- Default selections ----------
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

// ---------- Scoring ----------

// Budget rule:
//  - same option                          -> 100
//  - ranges touch at a boundary           -> 60  (e.g. 7,000-8,000 and 8,000-9,000)
//  - ranges do not touch (gap in rupees)  -> 60 minus 30 points for every ₹1,000
//    of gap, never below 0 (so a ₹1,000 gap = 30, a ₹2,000 gap = 0)
const getBudgetScore = (optionA, optionB) => {
  if (optionA === optionB) return 100;

  const a = BUDGET_RANGES[optionA];
  const b = BUDGET_RANGES[optionB];
  if (!a || !b) return 0;

  // Gap between the closest ends of the two ranges (0 or less = touching)
  const gap = Math.max(a.min, b.min) - Math.min(a.max, b.max);
  if (gap <= 0) return 60;

  return Math.max(0, Math.round(60 - (gap / 1000) * 30));
};

// Score (0-100) for one category, for two selected options
const getCategoryScore = (category, optionA, optionB) => {
  if (optionA === optionB) return 100;

  if (category.key === "budget") {
    return getBudgetScore(optionA, optionB);
  }

  // Look for a listed partial pair (in either order)
  const match = category.partial.find(
    (item) =>
      (item.pair[0] === optionA && item.pair[1] === optionB) ||
      (item.pair[0] === optionB && item.pair[1] === optionA)
  );

  return match ? match.score : category.fallback;
};

// Final weighted score: sum of (category score x weight / 100), rounded, kept 0-100
const calculateFinalScore = (breakdown) => {
  const total = breakdown.reduce(
    (sum, item) => sum + (item.score * item.weight) / 100,
    0
  );
  return Math.min(100, Math.max(0, Math.round(total)));
};

// ---------- Messages and colours ----------
const getResultMessage = (percentage) => {
  if (percentage >= 80) {
    return "Great match! Your lifestyle preferences are highly compatible.";
  } else if (percentage >= 60) {
    return "Good potential match! You share several important preferences.";
  } else if (percentage >= 40) {
    return "Moderate compatibility. Consider discussing lifestyle differences.";
  }
  return "Low compatibility. You may want to discuss your preferences carefully.";
};

// Colours for the big score card
const getResultColorClasses = (percentage) => {
  if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
  if (percentage >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-red-600 bg-red-50 border-red-200";
};

// Colours for each category's bar and label
const getBarColorClass = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

const getTextColorClass = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-500";
};

const getStatusLabel = (score) => {
  if (score === 100) return "Exact match";
  if (score >= 40) return "Partial match";
  return "Different";
};

// ---------- Loading saved preferences safely ----------
// Keeps only values that are valid options. Anything else falls back to defaults.
const cleanProfile = (saved, defaults) => {
  const result = { ...defaults };
  if (!saved || typeof saved !== "object") return result;

  categories.forEach((category) => {
    if (category.options.includes(saved[category.key])) {
      result[category.key] = saved[category.key];
    }
  });
  return result;
};

const loadSavedPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return {
          user: cleanProfile(parsed.user, defaultUser),
          roommate: cleanProfile(parsed.roommate, defaultRoommate),
        };
      }
    }
  } catch (error) {
    // Corrupted data - ignore it and use the defaults below
  }
  return { user: { ...defaultUser }, roommate: { ...defaultRoommate } };
};

function Compatibility() {
  // ---------- State ----------
  // prefs holds both profiles: { user: {...}, roommate: {...} }
  const [prefs, setPrefs] = useState(loadSavedPreferences);

  // result stays null until "Calculate Compatibility" is clicked
  const [result, setResult] = useState(null);

  // ---------- Save to localStorage whenever preferences change ----------
  // This also covers Reset, because Reset changes prefs back to the defaults.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      // Storage may be full or blocked - the page still works without saving
    }
  }, [prefs]);

  // ---------- Handlers ----------
  const handleSelect = (profileType, key, value) => {
    setPrefs({
      ...prefs,
      [profileType]: { ...prefs[profileType], [key]: value },
    });
    // Hide the old result so it never looks out of date
    setResult(null);
  };

  const calculateCompatibility = () => {
    const breakdown = categories.map((category) => {
      const userValue = prefs.user[category.key];
      const roommateValue = prefs.roommate[category.key];

      return {
        key: category.key,
        label: category.label,
        weight: category.weight,
        userValue,
        roommateValue,
        score: getCategoryScore(category, userValue, roommateValue),
      };
    });

    setResult({ percentage: calculateFinalScore(breakdown), breakdown });
  };

  const resetPreferences = () => {
    setPrefs({ user: { ...defaultUser }, roommate: { ...defaultRoommate } });
    setResult(null);
  };

  // ---------- Reusable preference card ----------
  const renderPreferenceCard = (title, profileType) => (
    <div className="border border-gray-200 rounded-xl p-6 md:p-8 flex-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.key}>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="text-blue-600">{category.icon}</span>
              {category.label}
            </div>

            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => {
                const isSelected = prefs[profileType][category.key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelect(profileType, category.key, option)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
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
        <div className="mt-10 flex flex-col md:flex-row gap-8">
          {renderPreferenceCard("Your Preferences", "user")}
          {renderPreferenceCard("Compare With Roommate", "roommate")}
        </div>

        {/* ---------- Action Buttons ---------- */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={calculateCompatibility}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Calculate Compatibility
          </button>

          <button
            onClick={resetPreferences}
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Reset Preferences
          </button>
        </div>

        {/* ---------- Result Section ---------- */}
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
              <p className="mt-3 text-xs opacity-80">
                A simple rule-based estimate, not a scientifically validated
                prediction.
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="mt-8 border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compatibility Breakdown
              </h3>

              <div className="space-y-4">
                {result.breakdown.map((item) => (
                  <div
                    key={item.key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.label}
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          (weight {item.weight}%)
                        </span>
                      </p>
                      <p
                        className={`text-sm font-semibold ${getTextColorClass(
                          item.score
                        )}`}
                      >
                        {item.score}% · {getStatusLabel(item.score)}
                      </p>
                    </div>

                    {/* Selected preferences side by side */}
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>
                        <span className="text-gray-500">You: </span>
                        {item.userValue}
                      </p>
                      <p>
                        <span className="text-gray-500">Roommate: </span>
                        {item.roommateValue}
                      </p>
                    </div>

                    {/* Simple bar showing the category score */}
                    <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getBarColorClass(
                          item.score
                        )}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------- How the Score Works ---------- */}
        <div className="mt-12 border border-gray-200 rounded-xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900">
            How the Score Works
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Each category gets a score from 0 to 100. Identical choices score
            100, and close choices (for example, Flexible with Early Sleeper)
            score partial points. The final percentage is the weighted average
            of all six categories.
          </p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category.key}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-gray-700">{category.label}</span>
                <span className="font-semibold text-blue-600">
                  {category.weight}%
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium text-gray-800">Budget rule: </span>
            same range = 100, ranges that touch at a boundary (such as ₹7,000 -
            ₹8,000 and ₹8,000 - ₹9,000) = 60, and ranges with a gap lose 30
            points for every ₹1,000 of gap. The "₹9,000+" option is treated as
            ₹9,000 to ₹12,000 for this comparison.
          </p>
        </div>

        {/* ---------- Honest Labelling ---------- */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
          <HiOutlineSparkles className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Rule-Based Compatibility Matching
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              This is a lifestyle compatibility analysis using fixed rules and
              weights. It does not use an AI model. Your choices are saved only
              in this browser.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Compatibility;