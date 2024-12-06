import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure each category name is unique
        trim: true,   // Removes leading and trailing whitespaces
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time
    },
});

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;