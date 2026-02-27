
function loginTeacher() {
    let name = document.getElementById("teacherName").value;
    let id = document.getElementById("teacherId").value;
    let pass = document.getElementById("teacherPass").value;

    if(name === "" || id === "" || pass === ""){
        alert("Please fill all details");
        return;
    }

    // Simple validation demo
    if(id === "Abhi" && pass === "123"){
        localStorage.setItem("teacherName", name);
        window.location.href = "teacher_dashboard.html";
    } else {
        alert("Invalid ID or Password");
    }
    

function startStudentExam() {
    // set a flag in localStorage
    localStorage.setItem("examStarted", "true");
    alert("Exam started for students!");
}

}

