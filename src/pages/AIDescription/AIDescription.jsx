// src/pages/AIDescription/AIDescription.jsx

import { useState } from "react";

// Icons used on this page
import {
  HiOutlineSparkles,
  HiOutlineClipboardDocument,
  HiOutlineTrash,
} from "react-icons/hi2";

function AIDescription() {
  // ---------- Form State ----------
  const [formData, setFormData] = useState({
    pgName: "",
    location: "",
    rent: "",
    sharing: "2 Sharing",
  });

  // Selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Generated AI description
  const [generatedText, setGeneratedText] = useState("");

  // Copy button state
  const [copied, setCopied] = useState(false);

  // Loading state while Gemini is generating
  const [isGenerating, setIsGenerating] = useState(false);

  // Error message if something goes wrong
  const [error, setError] = useState("");

  // List of available amenities
  const amenityOptions = [
    "WiFi",
    "Food",
    "Laundry",
    "Security",
    "Study Area",
    "Housekeeping",
  ];

  // ---------- Handlers ----------

  // Updates a single form field
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Adds or removes an amenity
  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // ---------- Generate AI Description ----------
 const handleGenerate = async () => {
  // Clear previous error
  setError("");

  // Basic validation
  if (!formData.pgName.trim()) {
    setError("Please enter the PG name.");
    return;
  }

  if (!formData.location.trim()) {
    setError("Please enter the location.");
    return;
  }

  if (!formData.rent.trim()) {
    setError("Please enter the monthly rent.");
    return;
  }

  try {
    // Show loading state
    setIsGenerating(true);

    // Remove previous generated text
    setGeneratedText("");

    // Send form data to Express backend
    const response = await fetch(
      "http://localhost:5000/api/ai/generate-description",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pgName: formData.pgName,
          location: formData.location,
          rent: formData.rent,
          sharing: formData.sharing,
          amenities: selectedAmenities,
        }),
      }
    );

    // Try to read the backend response
    const data = await response.json();

    // Handle backend errors
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to generate description."
      );
    }

    // Display Gemini's generated description
    setGeneratedText(data.description);

    // Reset copy state
    setCopied(false);
  } catch (error) {
    console.error("AI Description Error:", error);

    setError(
      error.message ||
        "Unable to generate the description. Please make sure the backend server is running."
    );
  } finally {
    // Stop loading state
    setIsGenerating(false);
  }
};

  // ---------- Copy to Clipboard ----------
  const handleCopy = () => {
    if (!generatedText) return;

    navigator.clipboard.writeText(generatedText).then(() => {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  // ---------- Clear Form ----------
  const handleClear = () => {
    setFormData({
      pgName: "",
      location: "",
      rent: "",
      sharing: "2 Sharing",
    });

    setSelectedAmenities([]);
    setGeneratedText("");
    setCopied(false);
    setError("");
  };

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ---------- Page Heading ---------- */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI PG Description Generator
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Generate a clear and student-friendly description for your PG
            using AI assistance.
          </p>
        </div>

        {/* ---------- Form Card ---------- */}
        <div className="mt-10 border border-gray-200 rounded-xl p-6 md:p-8">

          {/* PG Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              PG Name
            </label>

            <input
              type="text"
              value={formData.pgName}
              onChange={(e) => handleChange("pgName", e.target.value)}
              placeholder="e.g. Sunrise Student PG"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>

            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. Ahmedabad"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Rent and Sharing Type */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Monthly Rent */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Monthly Rent (₹)
              </label>

              <input
                type="text"
                value={formData.rent}
                onChange={(e) => handleChange("rent", e.target.value)}
                placeholder="e.g. 7500"
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Sharing Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Sharing Type
              </label>

              <select
                value={formData.sharing}
                onChange={(e) => handleChange("sharing", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              >
                <option>2 Sharing</option>
                <option>3 Sharing</option>
                <option>4 Sharing</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Available Amenities
            </label>

            <div className="mt-2 flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* ---------- Action Buttons ---------- */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <HiOutlineSparkles />

              {isGenerating
                ? "Generating..."
                : "Generate Description"}
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              <HiOutlineTrash />
              Clear
            </button>
          </div>
        </div>

        {/* ---------- Generated Description ---------- */}
        {generatedText && (
          <div className="mt-8">

            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Generated Description
            </h2>

            <div className="border border-blue-200 bg-blue-50 rounded-xl p-6">

              <p className="text-gray-700 leading-relaxed">
                {generatedText}
              </p>

              <button
                onClick={handleCopy}
                className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
              >
                <HiOutlineClipboardDocument />

                {copied
                  ? "Copied!"
                  : "Copy Description"}
              </button>
            </div>
          </div>
        )}

        {/* ---------- Information Section ---------- */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">

          <HiOutlineSparkles className="text-blue-600 text-2xl flex-shrink-0 mt-1" />

          <p className="text-gray-600 text-sm">
            AI assistance helps PG owners create clear and consistent
            accommodation descriptions.
          </p>
        </div>

      </div>
    </section>
  );
}

export default AIDescription;