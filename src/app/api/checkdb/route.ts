import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db"
import City from "@/models/city";
import { isValidObjectId } from "mongoose";
// console.log(" API Route Hit: /api/cities");
import { ObjectId } from "mongodb"; // ✅ Correct import from MongoDB

export async function GET() {
    console.log("Inside GET Method");
    try {
        await connectToDatabase();
        const cities = await City.find({});
        console.log(" Fetched Cities:", cities);
        return NextResponse.json(cities);
    } catch (error) {
        console.error("❌ Error Fetching Cities:", error);

        return NextResponse.json({ message: "Failed to fetch cities" }, { status: 500 });
    }
}


export async function POST(req: Request) {
    console.log("Inside POST Method");
    try {
        await connectToDatabase();
        const { name } = await req.json();
        if (!name) {
            console.error("Validation Error: Missing name");

            return NextResponse.json({ message: "City name  are required" }, { status: 400 });
        }

        const newCity = new City({ name });
        console.log(`new city name = ${newCity.name}`);
        await newCity.save();

        return NextResponse.json(newCity, { status: 201 });
    } catch (error) {
        console.log(" Error Adding City:", error);

        return NextResponse.json({ message: "Error adding city" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "City ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    await City.deleteOne({ _id: id });

    return NextResponse.json({ message: "City deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
  