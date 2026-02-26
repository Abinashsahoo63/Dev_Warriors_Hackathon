function login() {
    let role = document.getElementById("role").value;

    if(role === "student") {
        window.location.href = "student.html";
    } else {
        window.location.href = "teacher.html";
    }
}

// Webcam Access
if(document.getElementById("webcam")) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("webcam").srcObject = stream;
        });
}

// Timer
let time = 3600; // 60 minutes

setInterval(() => {
    if(document.getElementById("timer")) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").innerHTML =
            "Time Left: " + minutes + ":" + seconds;

        time--;

        if(time <= 0) {
            alert("Time Up! Auto Submitting...");
            submitExam();
        }
    }
}, 1000);

// Prevent Tab Switching
document.addEventListener("visibilitychange", function() {
    if(document.hidden) {
        alert("Warning! Tab switching detected.");
    }
});

function submitExam() {
    alert("Exam Submitted Successfully!");
}