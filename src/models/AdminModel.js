import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate emails
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"], // Email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Enforce minimum password length
  },
  role: {
    type: String,
    enum: ["admin"], // Restrict role to "admin"
    default: "admin",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure there can only be one admin user in the database
AdminSchema.index(
  { role: 1 },
  { unique: true, partialFilterExpression: { role: "admin" } }
);

const AdminModel = mongoose.model("Admin", AdminSchema);

export default AdminModel;
