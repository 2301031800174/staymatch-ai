// src/pages/Profile/Profile.jsx

import { useState, useEffect } from "react";

import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

// localStorage key where the profile is saved (browser only, not MongoDB)
const PROFILE_KEY = "staymatch_user_profile";

// Empty profile - we do not invent sample user data
const EMPTY_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  city: "",
  bio: "",
};

// ---------- Helper: safely read the saved profile ----------
// Handles missing data, corrupted JSON and unexpected shapes.
const readProfile = () => {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return { ...EMPTY_PROFILE };
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return { ...EMPTY_PROFILE };

    // Only keep known fields, and only if they are text
    const profile = { ...EMPTY_PROFILE };
    Object.keys(EMPTY_PROFILE).forEach((key) => {
      if (typeof parsed[key] === "string") {
        profile[key] = parsed[key];
      }
    });
    return profile;
  } catch (error) {
    return { ...EMPTY_PROFILE };
  }
};

// ---------- Helper: validate the form ----------
// Returns an object of error messages (empty object = no errors)
const validateProfile = (data) => {
  const errors = {};

  if (data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  if (data.email.trim() !== "") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (data.phone.trim() !== "") {
    // Allows an optional +91 and then exactly 10 digits
    const digitsOnly = data.phone.replace(/[\s-]/g, "").replace(/^\+91/, "");
    if (!/^\d{10}$/.test(digitsOnly)) {
      errors.phone = "Please enter a valid 10-digit phone number.";
    }
  }

  if (data.bio.length > 300) {
    errors.bio = "Bio must be 300 characters or less.";
  }

  return errors;
};

// ---------- Helper: initials for the avatar ----------
const getInitials = (name) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Fields shown in the form, kept in one array so we don't repeat JSX
const formFields = [
  { key: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
  { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
  { key: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit mobile number" },
  { key: "college", label: "College / University", type: "text", placeholder: "Your college or university" },
  { key: "course", label: "Course / Degree", type: "text", placeholder: "e.g. B.Tech Computer Engineering" },
  { key: "city", label: "Current City", type: "text", placeholder: "e.g. Ahmedabad" },
];

function Profile() {
  // ---------- State ----------
  const [profile, setProfile] = useState(readProfile); // saved profile
  const [formData, setFormData] = useState(profile); // draft while editing
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Hide the success message automatically after 3 seconds
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // ---------- Handlers ----------
  const handleEdit = () => {
    setFormData(profile); // start editing from the saved values
    setErrors({});
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile); // throw away unsaved changes
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const validationErrors = validateProfile(formData);
    setErrors(validationErrors);

    // Stop if there is at least one error
    if (Object.keys(validationErrors).length > 0) return;

    // Clean up extra spaces before saving
    const cleaned = {};
    Object.keys(EMPTY_PROFILE).forEach((key) => {
      cleaned[key] = formData[key].trim();
    });

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(cleaned));
    } catch (error) {
      setErrors({ general: "Could not save your profile in this browser." });
      return;
    }

    setProfile(cleaned);
    setFormData(cleaned);
    setIsEditing(false);
    setSuccessMessage("Profile saved on this device.");
  };

  // ---------- Details shown in view mode ----------
  const details = [
    { label: "Email", value: profile.email, icon: <HiOutlineEnvelope /> },
    { label: "Phone", value: profile.phone, icon: <HiOutlinePhone /> },
    { label: "College / University", value: profile.college, icon: <HiOutlineAcademicCap /> },
    { label: "Course / Degree", value: profile.course, icon: <HiOutlineBookOpen /> },
    { label: "Current City", value: profile.city, icon: <HiOutlineMapPin /> },
  ];

  const initials = getInitials(profile.fullName);

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ---------- Page Heading ---------- */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Keep your student details up to date.
          </p>
        </div>

        {/* ---------- Success Message ---------- */}
        {successMessage && (
          <div className="mt-6 flex items-center gap-2 border border-green-200 bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm">
            <HiOutlineCheckCircle className="text-lg flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {/* ---------- Profile Card ---------- */}
        <div className="mt-8 border border-gray-200 rounded-xl p-6 md:p-8">

          {/* Avatar + name + Edit button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {initials ? initials : <HiOutlineUser className="text-2xl" />}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.fullName || "Your Name"}
                </h2>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <HiOutlinePencilSquare />
                Edit Profile
              </button>
            )}
          </div>

          {/* ---------- View Mode ---------- */}
          {!isEditing && (
            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-blue-600 text-base">{item.icon}</span>
                      {item.label}
                    </div>
                    <p
                      className={`mt-1 text-sm ${
                        item.value ? "font-medium text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {item.value || "Not added yet"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500">About Me</p>
                <p
                  className={`mt-1 text-sm leading-relaxed ${
                    profile.bio ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {profile.bio || "No bio added yet."}
                </p>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Your profile is stored only in this browser (localStorage). It
                is not saved to the server or database.
              </p>
            </div>
          )}

          {/* ---------- Edit Mode ---------- */}
          {isEditing && (
            <form onSubmit={handleSave} className="mt-8" noValidate>
              {errors.general && (
                <p className="mb-4 text-sm text-red-600">{errors.general}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.key}
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`mt-1 w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500 ${
                        errors[field.key] ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors[field.key] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="mt-4">
                <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Short Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell others a little about yourself..."
                  className={`mt-1 w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500 ${
                    errors.bio ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-red-600">{errors.bio || ""}</span>
                  <span className="text-gray-500">
                    {formData.bio.length}/300
                  </span>
                </div>
              </div>

              {/* Save / Cancel */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

export default Profile;