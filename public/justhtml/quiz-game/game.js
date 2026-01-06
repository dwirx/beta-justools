// Quiz Game Logic
let currentQuestion = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const counterEl = document.getElementById('question-counter');
const quizContainer = document.getElementById('quiz-container');
const scoreContainer = document.getElementById('score-container');
const finalScoreEl = document.getElementById('final-score');

function loadQuestion() {
  answered = false;
  resultEl.textContent = '';
  resultEl.className = 'result';
  
  const q = quizQuestions[currentQuestion];
  counterEl.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  questionEl.textContent = q.question;
  
  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;
  
  const q = quizQuestions[currentQuestion];
  const buttons = optionsEl.querySelectorAll('.option-btn');
  
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add('correct');
    } else if (i === index && index !== q.correct) {
      btn.classList.add('incorrect');
    }
  });
  
  if (index === q.correct) {
    score++;
    resultEl.textContent = '✓ Correct!';
    resultEl.className = 'result correct';
  } else {
    resultEl.textContent = '✗ Wrong answer';
    resultEl.className = 'result incorrect';
  }
  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

function showResults() {
  quizContainer.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  
  const percentage = Math.round((score / quizQuestions.length) * 100);
  let emoji = '';
  
  if (percentage === 100) emoji = '🏆';
  else if (percentage >= 80) emoji = '🌟';
  else if (percentage >= 60) emoji = '👍';
  else if (percentage >= 40) emoji = '📚';
  else emoji = '💪';
  
  finalScoreEl.textContent = `${emoji} You scored ${score} out of ${quizQuestions.length} (${percentage}%)`;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quizContainer.classList.remove('hidden');
  scoreContainer.classList.add('hidden');
  loadQuestion();
}

// Start the quiz
loadQuestion();
