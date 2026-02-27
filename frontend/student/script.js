// ----------------------------
// CHEATING MONITORING VARIABLES
// ----------------------------
let cheatScore = 0;
let timeLeft = 60*60; // 60 minutes
let movementTime = 0;
let headAlertCount = 0;
let previousFrame = null;

// ----------------------------
// QUESTIONS
// ----------------------------
const questions = [
    {question:"1. What does AI stand for?", options:["Artificial Intelligence","Automated Interface","Applied Informatics","Advanced Internet"], answer:"Artificial Intelligence"},
    {question:"2. Which is a programming language used in AI?", options:["Python","HTML","CSS","Photoshop"], answer:"Python"},
    {question:"3. Machine learning is a subset of?", options:["AI","Networking","Database","Web Development"], answer:"AI"},
    {question:"4. What is supervised learning?", options:["Learning with labeled data","Learning without data","Learning from mistakes","Learning manually"], answer:"Learning with labeled data"},
    {question:"5. Which library is popular in Python for AI?", options:["TensorFlow","Bootstrap","React","Django"], answer:"TensorFlow"},
    {question:"6. What is NLP?", options:["Natural Language Processing","Network Learning Protocol","Node Linked Programming","Neural Logic Pattern"], answer:"Natural Language Processing"},
    {question:"7. What does a neural network mimic?", options:["Human brain","Computer hard drive","Network router","Operating system"], answer:"Human brain"},
    {question:"8. AI can be used for?", options:["Face recognition","Spam detection","Self-driving cars","All of the above"], answer:"All of the above"},
    {question:"9. What is reinforcement learning?", options:["Learning by rewards and penalties","Learning by observation","Learning from textbooks","Learning from simulations"], answer:"Learning by rewards and penalties"},
    {question:"10. Which is an AI-powered assistant?", options:["Siri","Notepad","Chrome","Excel"], answer:"Siri"},
    {question:"11. What does AI stand for?", options:["Artificial Intelligence","Automated Interface","Applied Informatics","Advanced Internet"], answer:"Artificial Intelligence"},
    {question:"12. Which is a programming language used in AI?", options:["Python","HTML","CSS","Photoshop"], answer:"Python"},
    {question:"13. Machine learning is a subset of?", options:["AI","Networking","Database","Web Development"], answer:"AI"},
    {question:"14. What is supervised learning?", options:["Learning with labeled data","Learning without data","Learning from mistakes","Learning manually"], answer:"Learning with labeled data"},
    {question:"15. Which library is popular in Python for AI?", options:["TensorFlow","Bootstrap","React","Django"], answer:"TensorFlow"},
    {question:"16. What is NLP?", options:["Natural Language Processing","Network Learning Protocol","Node Linked Programming","Neural Logic Pattern"], answer:"Natural Language Processing"},
    {question:"17. What does a neural network mimic?", options:["Human brain","Computer hard drive","Network router","Operating system"], answer:"Human brain"},
    {question:"18. AI can be used for?", options:["Face recognition","Spam detection","Self-driving cars","All of the above"], answer:"All of the above"},
    {question:"19. What is reinforcement learning?", options:["Learning by rewards and penalties","Learning by observation","Learning from textbooks","Learning from simulations"], answer:"Learning by rewards and penalties"},
    {question:"20. Which is an AI-powered assistant?", options:["Siri","Notepad","Chrome","Excel"], answer:"Siri"},
    // ... continue up to 50 questions (can copy previous list)
];

// ----------------------------
// LOGIN
// ----------------------------
function validateLogin(){
    const name = document.getElementById("name").value.trim();
    const regd = document.getElementById("regd").value.trim();
    const password = document.getElementById("password").value.trim();

    if(name===""||regd===""||password===""){
        document.getElementById("loginError").innerText="All fields are required!";
        return;
    }

    document.getElementById("loginError").innerText="";
    document.getElementById("login").classList.add("hidden");
    document.getElementById("instructions").classList.remove("hidden");
}

// ----------------------------
// EXAM START
// ----------------------------
let currentQuestion=0;

function startExam(){
    document.querySelector(".container").style.alignItems="flex-start";
    document.getElementById("instructions").classList.add("hidden");
    document.getElementById("exam").classList.remove("hidden");

    startCamera();
    startTimer();
    monitorAudio();
    renderQuestion();
}

// ----------------------------
// RENDER QUESTIONS
// ----------------------------
function renderQuestion(){
    const container=document.getElementById("questionContainer");
    const q=questions[currentQuestion];
    let html=`<h3>${q.question}</h3>`;
    q.options.forEach((opt,index)=>{
        html+=`<div><input type="radio" name="answer" id="opt${index}" value="${opt}"> <label for="opt${index}">${opt}</label></div>`;
    });
    html+=`<button onclick="nextQuestion()">Next</button>`;
    container.innerHTML=html;
}

function nextQuestion(){
    const selected=document.querySelector('input[name="answer"]:checked');
    if(!selected){ alert("Please select an answer"); return; }
    // save answer if needed: questions[currentQuestion].userAnswer = selected.value
    currentQuestion++;
    if(currentQuestion<questions.length){ renderQuestion(); }
    else{ submitExam(); }
}

// ----------------------------
// CAMERA & HEAD MOVEMENT
// ----------------------------
function startCamera(){
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(stream=>{
        const video=document.getElementById("webcam");
        video.srcObject=stream;
        video.onloadedmetadata=()=>{
            video.play();
            document.documentElement.requestFullscreen();
            startHeadMovementDetection();
        };
    })
    .catch(()=>{ document.getElementById("alert").innerText="Camera/Microphone permission required!"; });
}

function startHeadMovementDetection(){
    const video=document.getElementById("webcam");
    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");

    setInterval(()=>{
        if(video.videoWidth===0) return;

        canvas.width=video.videoWidth;
        canvas.height=video.videoHeight;
        ctx.drawImage(video,0,0);
        const currentFrame=ctx.getImageData(0,0,canvas.width,canvas.height);

        if(previousFrame){
            let diff=0;
            for(let i=0;i<currentFrame.data.length;i+=4){
                diff+=Math.abs(currentFrame.data[i]-previousFrame.data[i]);
            }
            let avgDiff=diff/(currentFrame.data.length/4);

            if(avgDiff>15){ movementTime++; } else { movementTime=0; }

            if(movementTime>=30){
                headAlertCount++;
                cheatScore+=20;
                updateRisk("⚠ Continuous head movement detected!");
                movementTime=0;
                if(headAlertCount>=3){
                    alert("Disqualified due to repeated head movement!");
                    submitExam();
                }
            }
        }
        previousFrame=currentFrame;
    },1000);
}

// ----------------------------
// AUDIO MONITOR
// ----------------------------
function monitorAudio(){
    navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream=>{
        const audioContext=new AudioContext();
        const analyser=audioContext.createAnalyser();
        const mic=audioContext.createMediaStreamSource(stream);
        mic.connect(analyser);
        analyser.fftSize=256;
        const data=new Uint8Array(analyser.frequencyBinCount);

        setInterval(()=>{
            analyser.getByteFrequencyData(data);
            let volume=data.reduce((a,b)=>a+b)/data.length;
            if(volume>60){ cheatScore+=5; updateRisk("⚠ Voice detected!"); }
        },3000);
    });
}

// ----------------------------
// TIMER & RISK DETECTION
// ----------------------------
function startTimer(){
    const timer=document.getElementById("timer");
    const interval=setInterval(()=>{
        let min=Math.floor(timeLeft/60);
        let sec=timeLeft%60;
        timer.innerText=String(min).padStart(2,'0')+":"+String(sec).padStart(2,'0');
        timeLeft--;
        if(timeLeft<=0){ clearInterval(interval); submitExam(); }
    },1000);
}

document.addEventListener("visibilitychange",()=>{
    if(document.hidden){ cheatScore+=10; updateRisk("⚠ Tab switching detected!"); }
});

document.addEventListener("fullscreenchange",()=>{
    if(!document.fullscreenElement){ cheatScore+=15; updateRisk("⚠ Fullscreen exited!"); }
});

document.addEventListener("contextmenu", e=>e.preventDefault());

function updateRisk(message){
    document.getElementById("alert").innerText=message;
    let level="Low";
    if(cheatScore>40) level="High";
    else if(cheatScore>20) level="Medium";
    document.getElementById("risk").innerText="Risk: "+level+" (Score: "+cheatScore+")";
}

// ----------------------------
// SUBMIT EXAM
// ----------------------------
function submitExam(){
    alert("Exam Submitted!\nFinal Cheat Score: "+cheatScore);
    location.reload();
}