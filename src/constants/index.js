import dotenv from "dotenv";
dotenv.config();


export const uri = `mongodb+srv://${process.env.SHOEBOX_MONGODB_USERNAME}:${process.env.SHOEBOX_MONGODB_PASSWORD}@cluster0.ey5h3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
