import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import connectDB from "./config/db";
import Claim from "./models/Claim";

dotenv.config();

const seedClaims = async () => {
  try {
    await connectDB();

    const filePath = path.join(
      process.cwd(),
      "data",
      "mockClaims.json"
    );

    const data = fs.readFileSync(filePath, "utf-8");
    const claims = JSON.parse(data);

    await Claim.deleteMany({});

    await Claim.insertMany(claims);

    console.log("Mock FRA claims inserted successfully!");
    console.log(`Total claims: ${claims.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedClaims();