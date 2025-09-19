import { getCourses } from "./model.js";
import { renderCourses } from "./view.js";

let courses = [];
let selectedIds = new Set();
let confirmed = false; // track if user confirmed selection

async function init() {
  courses = await getCourses();
  renderCourses(courses, "available-list", selectedIds);
  updateTotalCredit();
  addCourseClickHandler();
  addSelectButtonHandler();
}

function addCourseClickHandler() {
  const availableList = document.getElementById("available-list");

  availableList.addEventListener("click", (e) => {
    if (confirmed) return; // lock if already confirmed
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
    selectedIds.delete(courseId); // unselect
  } else {
    const currentTotal = getTotalCredit();
    if (currentTotal + course.credit > 18) {
      alert("You can only choose up to 18 credits in one semester");
      return;
    }
    selectedIds.add(courseId);
  }

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

function addSelectButtonHandler() {
  const selectBtn = document.getElementById("select-btn");
  const selectedList = document.getElementById("selected-list");

  selectBtn.addEventListener("click", () => {
    const totalCredits = getTotalCredit();
    if (totalCredits === 0) {
      alert("Please select at least one course before submitting.");
      return;
    }

    const confirmMsg = `You have chosen ${totalCredits} credits for this semester. You cannot change once you submit. Do you want to confirm?`;
    if (confirm(confirmMsg)) {
      // Move selected courses to Selected Courses bucket
      const chosenCourses = courses.filter(c => selectedIds.has(c.courseId));
      renderCourses(chosenCourses, "selected-list", new Set(chosenCourses.map(c => c.courseId)));

      // Lock selection
      confirmed = true;
      selectBtn.disabled = true;
    }
  });
}

init();
