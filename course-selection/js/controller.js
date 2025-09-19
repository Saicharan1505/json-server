import { getCourses } from "./model.js";
import { renderCourses } from "./view.js";

let courses = [];
let selectedIds = new Set();

async function init() {
  courses = await getCourses();
  renderCourses(courses, "available-list", selectedIds);
  updateTotalCredit();
  addCourseClickHandler();
}

function addCourseClickHandler() {
  const availableList = document.getElementById("available-list");

  availableList.addEventListener("click", (e) => {
    if (e.target.closest(".course-item")) {
      const courseId = parseInt(e.target.closest(".course-item").dataset.id);
      toggleCourse(courseId);
    }
  });
}

function toggleCourse(courseId) {
  const course = courses.find(c => c.courseId === courseId);
  if (!course) return;

  if (selectedIds.has(courseId)) {
    // unselect → remove id
    selectedIds.delete(courseId);
  } else {
    // calculate current total
    const currentTotal = getTotalCredit();
    if (currentTotal + course.credit > 18) {
      alert("You can only choose up to 18 credits in one semester");
      return;
    }
    selectedIds.add(courseId);
  }

  // re-render with updated selection
  renderCourses(courses, "available-list", selectedIds);
  updateTotalCredit();
}

function getTotalCredit() {
  return courses
    .filter(c => selectedIds.has(c.courseId))
    .reduce((sum, c) => sum + c.credit, 0);
}

function updateTotalCredit() {
  document.getElementById("total-credit").textContent =
    `Total Credit: ${getTotalCredit()}`;
}

init();
