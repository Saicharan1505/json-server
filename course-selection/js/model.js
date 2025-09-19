const API_URL = "http://localhost:4232/courseList";

export async function getCourses() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return await res.json();
  } catch (error) {
    console.error("Error in getCourses:", error);
    return [];
  }
}
