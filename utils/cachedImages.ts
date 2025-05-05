import cloudinary from "./cloudinary";

export default async function getResults() {
  return await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "asc")
    .max_results(600)
    .execute();
}