// Store courses
let courses = [];

/* -----------------------------
   SINGLE SCORE FUNCTION
------------------------------*/
function calculateSingle() {
    let name = document.getElementById("name").value;
    let score = Number(document.getElementById("score").value);
    let result = document.getElementById("singleResult");

    if (!name || score === "") {
        result.innerHTML = "⚠️ Fill all fields";
        return;
    }

    let grade = getGrade(score);

    result.innerHTML = `
        <p><b>Name:</b> ${name}</p>
        <p><b>Score:</b> ${score}</p>
        <p><b>Grade:</b> ${grade.letter}</p>
        <p><b>Remark:</b> ${grade.remark}</p>
    `;
}

/* -----------------------------
   ADD COURSE FOR GPA
------------------------------*/
function addCourse() {
    let course = document.getElementById("course").value;
    let unit = Number(document.getElementById("unit").value);
    let score = Number(document.getElementById("courseScore").value);

    if (!course || !unit || !score) {
        alert("Please fill all course fields");
        return;
    }

    courses.push({ course, unit, score });

    displayCourses();

    document.getElementById("course").value = "";
    document.getElementById("unit").value = "";
    document.getElementById("courseScore").value = "";
}

/* -----------------------------
   DISPLAY COURSES
------------------------------*/
function displayCourses() {
    let list = document.getElementById("courseList");
    list.innerHTML = "<h4>Courses Added:</h4>";

    courses.forEach((c, index) => {
        list.innerHTML += `
            <p>${index + 1}. ${c.course} | Unit: ${c.unit} | Score: ${c.score}</p>
        `;
    });
}

/* -----------------------------
   GPA CALCULATION
------------------------------*/
function calculateGPA() {

    if (courses.length === 0) {
        document.getElementById("gpaResult").innerHTML =
            "⚠️ Please add at least one course";
        return;
    }

    let totalPoints = 0;
    let totalUnits = 0;

    courses.forEach(c => {
        let grade = getGrade(c.score);
        totalPoints += grade.point * c.unit;
        totalUnits += c.unit;
    });

    let gpa = totalPoints / totalUnits;

    document.getElementById("gpaResult").innerHTML = `
        <h3>GPA: ${gpa.toFixed(2)}</h3>
    `;
}

/* -----------------------------
   GRADE SYSTEM
------------------------------*/
function getGrade(score) {
    if (score >= 80) return { letter: "A", point: 5, remark: "Excellent" };
    else if (score >= 60) return { letter: "B", point: 4, remark: "Very Good" };
    else if (score >= 50) return { letter: "C", point: 3, remark: "Good" };
    else if (score >= 40) return { letter: "D", point: 2, remark: "Fair" };
    else if (score >= 30) return { letter: "E", point: 1, remark: "Pass" };
    else return { letter: "F", point: 0, remark: "Fail" };
}

/* -----------------------------
   DOWNLOAD REPORT
------------------------------*/
function downloadPDF() {

    console.log(window.jspdf);
    if (courses.length === 0) {
        alert("Please add at least one course first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Student GPA Report", 20, 20);

    let y = 40;

    courses.forEach((c, index) => {
        let grade = getGrade(c.score);

        doc.text(
            `${index + 1}. ${c.course} | Unit: ${c.unit} | Score: ${c.score} | Grade: ${grade.letter}`,
            20,
            y
        );

        y += 10;
    });

    let totalPoints = 0;
    let totalUnits = 0;

    courses.forEach(c => {
        let grade = getGrade(c.score);
        totalPoints += grade.point * c.unit;
        totalUnits += c.unit;
    });

    let gpa = totalPoints / totalUnits;

    doc.text(`Final GPA: ${gpa.toFixed(2)}`, 20, y + 10);

    doc.save("GPA_Report.pdf");
}