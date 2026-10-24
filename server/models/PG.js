import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    pgName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    sharing: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    ownerName: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // User account that created this listing
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PG = mongoose.model("PG", pgSchema);

export default PG;