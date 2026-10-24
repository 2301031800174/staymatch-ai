// src/pages/AddPG/AddPG.jsx
// One form used for BOTH modes:
//   /add-pg       -> Add mode  (POST /api/pgs)
//   /edit-pg/:id  -> Edit mode (PUT  /api/pgs/:id)

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api/pgs";

const AMENITY_OPTIONS = [
  "WiFi",
  "Food",
  "Laundry",
  "Security",
  "Study Area",
  "Housekeeping",
];

const SHARING_OPTIONS = ["1 Sharing", "2 Sharing", "3 Sharing", "4 Sharing"];

const MAX_RENT = 1000000;

// Empty form values. Rent is kept as text while the user types.
const emptyForm = {
  pgName: "",
  location: "",
  rent: "",
  sharing: "2 Sharing",
  amenities: [],
  description: "",
  ownerName: "",
  contactNumber: "",
};

// ---------- Helper: validate the form ----------
// Returns an object of error messages (empty object = no errors)
const validateForm = (data) => {
  const errors = {};

  if (data.pgName.trim().length < 2) {
    errors.pgName = "Please enter the PG name (at least 2 characters).";
  }
  if (data.location.trim().length < 2) {
    errors.location = "Please enter the location.";
  }

  const rentText = data.rent.trim();
  if (rentText === "") {
    errors.rent = "Please enter the monthly rent.";
  } else if (!/^\d+(\.\d{1,2})?$/.test(rentText)) {
    errors.rent = "Rent must be a positive number (digits only).";
  } else if (Number(rentText) <= 0) {
    errors.rent = "Rent must be greater than 0.";
  } else if (Number(rentText) > MAX_RENT) {
    errors.rent = "Rent cannot be more than 10,00,000.";
  }

  if (!data.sharing) {
    errors.sharing = "Please choose a sharing type.";
  }

  if (data.contactNumber.trim() !== "") {
    const digitsOnly = data.contactNumber
      .replace(/[\s-]/g, "")
      .replace(/^\+91/, "");
    if (!/^\d{10}$/.test(digitsOnly)) {
      errors.contactNumber = "Enter a valid 10-digit contact number.";
    }
  }

  if (data.description.length > 1000) {
    errors.description = "Description must be 1000 characters or less.";
  }

  return errors;
};

function AddPG() {
  // If the URL has an :id, we are editing an existing listing
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const navigate = useNavigate();
  const { token, user } = useAuth();

  // ---------- State ----------
  // In Add mode, pre-fill the owner name from the logged-in user
  const [formData, setFormData] = useState(() => ({
    ...emptyForm,
    ownerName: user?.name || "",
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit mode only: loading the existing listing
  const [loadingPG, setLoadingPG] = useState(isEditMode);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0); // used by "Try Again"

  // Holds the redirect timer so we can cancel it if the page is left early
  const redirectTimer = useRef(null);
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  // ---------- Edit mode: load the owner's listings and find this one ----------
  useEffect(() => {
    if (!isEditMode) return;

    let isCancelled = false;

    const loadListing = async () => {
      setLoadingPG(true);
      setLoadError("");

      try {
        const response = await fetch(`${API_URL}/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }
        if (!response.ok) {
          throw new Error("Could not load your listings.");
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((item) => item._id === id);

        if (!found) {
          throw new Error(
            "Listing not found. It may not exist, or it may not belong to you."
          );
        }

        if (!isCancelled) {
          setFormData({
            pgName: found.pgName || "",
            location: found.location || "",
            rent: found.rent !== undefined ? String(found.rent) : "",
            sharing: found.sharing || "2 Sharing",
            amenities: Array.isArray(found.amenities) ? found.amenities : [],
            description: found.description || "",
            ownerName: found.ownerName || "",
            contactNumber: found.contactNumber || "",
          });
        }
      } catch (err) {
        if (!isCancelled) {
          setLoadError(
            err.message === "Failed to fetch"
              ? "Could not reach the server. Make sure the backend is running on http://localhost:5000."
              : err.message
          );
        }
      } finally {
        if (!isCancelled) setLoadingPG(false);
      }
    };

    loadListing();

    return () => {
      isCancelled = true;
    };
  }, [id, isEditMode, token, reloadCount]);

  // ---------- Handlers ----------
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
    setSubmitError("");
  };

  // Adds or removes an amenity when its button is clicked
  const toggleAmenity = (amenity) => {
    const selected = formData.amenities.includes(amenity)
      ? formData.amenities.filter((item) => item !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    // 1. Validate
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // 2. Build the data to send (rent must be a number)
    const payload = {
      pgName: formData.pgName.trim(),
      location: formData.location.trim(),
      rent: Number(formData.rent),
      sharing: formData.sharing,
      amenities: formData.amenities,
      description: formData.description.trim(),
      ownerName: formData.ownerName.trim(),
      contactNumber: formData.contactNumber.trim(),
    };

    // 3. Add mode = POST /api/pgs, Edit mode = PUT /api/pgs/:id
    const url = isEditMode ? `${API_URL}/${id}` : API_URL;
    const method = isEditMode ? "PUT" : "POST";

    setSubmitting(true);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          setSubmitError("Your session has expired. Please log in again.");
        } else if (response.status === 403) {
          setSubmitError("Only PG owners can do this.");
        } else {
          setSubmitError(
            data.error || data.message || "Something went wrong. Please try again."
          );
        }
        setSubmitting(false);
        return;
      }

      // 4. Success: show a message, then redirect after about 1.2 seconds
      setSuccessMessage(
        isEditMode
          ? "Listing updated successfully! Redirecting to your dashboard..."
          : "PG listing created successfully! Redirecting to Browse PGs..."
      );

      redirectTimer.current = setTimeout(() => {
        navigate(isEditMode ? "/owner" : "/browse");
      }, 1200);
    } catch (err) {
      setSubmitError(
        "Could not reach the server. Make sure the backend is running on http://localhost:5000."
      );
      setSubmitting(false);
    }
  };

  // ---------- Edit mode: loading and error screens ----------
  if (isEditMode && loadingPG) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <p className="text-gray-600">Loading listing...</p>
      </section>
    );
  }

  if (isEditMode && loadError) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Could not open this listing
        </h1>
        <p className="mt-2 text-gray-600">{loadError}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setReloadCount(reloadCount + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            to="/owner"
            className="text-blue-600 font-medium hover:underline py-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  const inputClass = (field) =>
    `mt-1 w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ---------- Page Heading ---------- */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isEditMode ? "Edit PG Listing" : "Add a New PG"}
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            {isEditMode
              ? "Update the details of your listing."
              : "Fill in the details to list your PG for students."}
          </p>
        </div>

        {/* ---------- Form ---------- */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 border border-gray-200 rounded-xl p-6 md:p-8"
        >
          {/* PG Name */}
          <div>
            <label htmlFor="pgName" className="text-sm font-medium text-gray-700">
              PG Name
            </label>
            <input
              id="pgName"
              type="text"
              value={formData.pgName}
              onChange={(e) => handleChange("pgName", e.target.value)}
              placeholder="e.g. Sunrise Student PG"
              className={inputClass("pgName")}
            />
            {errors.pgName && (
              <p className="mt-1 text-xs text-red-600">{errors.pgName}</p>
            )}
          </div>

          {/* Location */}
          <div className="mt-4">
            <label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. Ahmedabad"
              className={inputClass("location")}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Rent and Sharing */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rent" className="text-sm font-medium text-gray-700">
                Monthly Rent (₹)
              </label>
              <input
                id="rent"
                type="text"
                inputMode="decimal"
                value={formData.rent}
                onChange={(e) => handleChange("rent", e.target.value)}
                placeholder="e.g. 7500"
                className={inputClass("rent")}
              />
              {errors.rent && (
                <p className="mt-1 text-xs text-red-600">{errors.rent}</p>
              )}
            </div>

            <div>
              <label htmlFor="sharing" className="text-sm font-medium text-gray-700">
                Sharing Type
              </label>
              <select
                id="sharing"
                value={formData.sharing}
                onChange={(e) => handleChange("sharing", e.target.value)}
                className={inputClass("sharing")}
              >
                {SHARING_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.sharing && (
                <p className="mt-1 text-xs text-red-600">{errors.sharing}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Amenities</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={isSelected}
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

          {/* Description */}
          <div className="mt-4">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your PG for students..."
              className={inputClass("description")}
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-red-600">{errors.description || ""}</span>
              <span className="text-gray-500">
                {formData.description.length}/1000
              </span>
            </div>
          </div>

          {/* Owner name and contact number */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                id="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange("ownerName", e.target.value)}
                placeholder="Your name"
                className={inputClass("ownerName")}
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                placeholder="10-digit mobile number"
                className={inputClass("contactNumber")}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          {/* Messages */}
          {submitError && (
            <p className="mt-6 border border-red-200 bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
              {submitError}
            </p>
          )}
          {successMessage && (
            <p className="mt-6 border border-green-200 bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm">
              {successMessage}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create PG Listing"}
            </button>

            <Link
              to={isEditMode ? "/owner" : "/browse"}
              className="flex-1 text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </section>
  );
}

export default AddPG;