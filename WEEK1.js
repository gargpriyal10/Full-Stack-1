
const questions = [
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "define", "dim"],
    answer: 1,
    explanation: "let declares a block-scoped variable in JavaScript."
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "slice()"],
    answer: 0,
    explanation: "push() adds one or more elements to the end of an array."
  },
  {
    question: "Which operator checks both value and type?",
    options: ["==", "=", "===", "!="],
    answer: 2,
    explanation: "The strict equality operator === checks value and type."
  },
  {
    question: "How do you write a single-line comment?",
    options: ["<!-- -->", "#", "//", "**"],
    answer: 2,
    explanation: "JavaScript uses // for single-line comments."
  },
  {
    question: "Which method converts JSON text into a JavaScript value?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.read()"
    ],
    answer: 1,
    explanation: "JSON.parse() converts valid JSON text into a JavaScript value."
  },
  {
    question: "Which value represents an intentional absence of a value?",
    options: ["undefined", "null", "false", "Both A and B"],
    answer: 3,
    explanation: "Both null and undefined represent absence, though their meanings differ."
  },
  {
    question: "Which array method creates a new array by transforming elements?",
    options: ["forEach()", "map()", "find()", "includes()"],
    answer: 1,
    explanation: "map() returns a new array containing transformed elements."
  },
  {
    question: "What is the result of typeof null?",
    options: ["null", "undefined", "object", "boolean"],
    answer: 2,
    explanation: "typeof null returns object due to a historical JavaScript quirk."
  },
  {
    question: "Which keyword creates a constant binding?",
    options: ["let", "var", "const", "static"],
    answer: 2,
    explanation: "const prevents reassignment of the binding."
  },
  {
    question: "Which function schedules code to run after a delay?",
    options: [
      "setTimeout()",
      "setInterval()",
      "delay()",
      "waitFor()"
    ],
    answer: 0,
    explanation: "setTimeout() schedules a callback to run after a specified delay."
  }
];

const $ = id => document.getElementById(id);

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerId = null;
let answered = false;
let wrongAnswers = [];

function startQuiz() {
  clearInterval(timerId);

  currentQuestion = 0;
  score = 0;
  timeLeft = 30;
  answered = false;
  wrongAnswers = [];

  $("quiz-screen").classList.remove("hidden");
  $("result-screen").classList.add("hidden");
  $("review-screen").classList.add("hidden");

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  if (currentQuestion >= questions.length) {
    showResults();
    return;
  }

  answered = false;
  timeLeft = 30;

  const q = questions[currentQuestion];

  $("question-count").textContent =
    `Q ${currentQuestion + 1}/${questions.length}`;

  $("score").textContent = `Score: ${score}`;
  $("question").textContent = q.question;
  $("feedback").textContent = "";
  $("next-btn").disabled = true;
  $("next-btn").textContent =
    currentQuestion === questions.length - 1
      ? "See Results →"
      : "Next Question →";

  $("progress-bar").style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  $("options").innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "option-btn";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => selectAnswer(index));
    $("options").appendChild(button);
  });

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  $("timer").textContent = `⏱ ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(timerId);
    if (!answered) {
      selectAnswer(-1);
    }
    return;
  }

  timeLeft--;

  if (timeLeft < 10) {
    $("timer").style.color = "#f87171";
  } else {
    $("timer").style.color = "#fbbf24";
  }
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;
  clearInterval(timerId);

  const q = questions[currentQuestion];
  const buttons = $("options").querySelectorAll(".option-btn");
  const isCorrect = selectedIndex === q.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === q.answer) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    score++;
    $("feedback").textContent = "✅ Correct! " + q.explanation;
    $("feedback").style.color = "#4ade80";
  } else {
    const yourAnswer =
      selectedIndex === -1
        ? "Time ran out"
        : q.options[selectedIndex];

    $("feedback").textContent =
      `${selectedIndex === -1 ? "⏰ Time's up!" : "❌ Incorrect."} ` +
      `Correct answer: ${q.options[q.answer]}. ${q.explanation}`;

    $("feedback").style.color = "#f87171";

    wrongAnswers.push({
      question: q.question,
      yourAnswer,
      correctAnswer: q.options[q.answer],
      explanation: q.explanation
    });
  }

  $("score").textContent = `Score: ${score}`;
  $("progress-bar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  $("next-btn").disabled = false;
}

function nextQuestion() {
  if (!answered) return;

  currentQuestion++;
  showQuestion();
}

function showResults() {
  clearInterval(timerId);

  $("quiz-screen").classList.add("hidden");
  $("result-screen").classList.remove("hidden");
  $("review-screen").classList.add("hidden");

  const percentage = Math.round((score / questions.length) * 100);

  $("final-score").textContent =
    `You scored ${score} out of ${questions.length} (${percentage}%).`;

  if (percentage >= 90) {
    $("rating").textContent = "🌟 Excellent! You're a JavaScript star!";
  } else if (percentage >= 70) {
    $("rating").textContent = "👏 Great job! Keep it up!";
  } else if (percentage >= 50) {
    $("rating").textContent = "👍 Good effort! A little more practice.";
  } else {
    $("rating").textContent = "💪 Keep learning. You'll get there!";
  }

  $("review-btn").textContent =
    wrongAnswers.length
      ? `Review Wrong Answers (${wrongAnswers.length})`
      : "No Wrong Answers — Perfect!";

  $("review-btn").disabled = wrongAnswers.length === 0;
}

function showReview() {
  $("result-screen").classList.add("hidden");
  $("review-screen").classList.remove("hidden");

  $("wrong-list").innerHTML = "";

  if (wrongAnswers.length === 0) {
    $("wrong-list").textContent =
      "Perfect score! You didn't get any questions wrong.";
    return;
  }

  wrongAnswers.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "wrong-card";

    const heading = document.createElement("h3");
    heading.textContent = `${index + 1}. ${item.question}`;

    const yourAnswer = document.createElement("p");
    yourAnswer.className = "wrong-text";
    yourAnswer.textContent = `Your answer: ${item.yourAnswer}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "correct-text";
    correctAnswer.textContent = `Correct answer: ${item.correctAnswer}`;

    const explanation = document.createElement("p");
    explanation.textContent = `Explanation: ${item.explanation}`;

    card.append(heading, yourAnswer, correctAnswer, explanation);
    $("wrong-list").appendChild(card);
  });
}

$("next-btn").addEventListener("click", nextQuestion);
$("restart-btn").addEventListener("click", startQuiz);
$("review-restart-btn").addEventListener("click", startQuiz);
$("review-btn").addEventListener("click", showReview);

startQuiz();
