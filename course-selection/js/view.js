export function renderCourses(courses, containerId, selectedIds = new Set()) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  courses.forEach(course => {
    const div = document.createElement("div");
    div.classList.add("course-item");
    div.dataset.id = course.courseId;

    div.innerHTML = `
      <strong>${course.courseName}</strong><br>
      Type: ${course.required ? "Compulsory" : "Elective"}<br>
      Credit: ${course.credit}
    `;

    // if course is in selectedIds → add .selected
    if (selectedIds.has(course.courseId)) {
      div.classList.add("selected");
    }

    container.appendChild(div);
  });
}
