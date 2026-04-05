import fs from "fs";
import path from "path";

export default async function getInstallerName(mobileNumber) {
  try {
    const filePath = path.join(process.cwd(), "public", "user.json");

    const file = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(file);
    const user = data.find((u) => u.mobileNumber === mobileNumber);

    return user?.name || null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
