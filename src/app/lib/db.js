import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose || { conn: null, promise: null };
export async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "weatherApp",
            bufferCommands: false,
        }).then((mongoose) => {
            console.log("mongodb connected");
            return mongoose;
        }).catch((err) => {
            console.error("mongodb connection error", err);
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}