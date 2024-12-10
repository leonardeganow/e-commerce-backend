import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        trim: true,  
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;