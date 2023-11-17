
const quizData = [
    {question: "Which markup language structure all web pages on the internet?",
      a: "HTML",
      b: "Java",
      c: "JavaScript",
      d: "CSS",
      correct: "c",
    },
    {question: "Which one of these HTML tags creates a button?",
      a: "<btn>>",
      b: "<button>",
      c: "button",
      d: "<video>",
      correct: "b",
    },
    {question: "What do you think comes after the opening tag: <button>?",
      a: "closing",
      b: "<p>",
      c: "</button>",
      d: "<button>",
      correct: "c",
    },
    {question: "What does HTML stand for?",
      a: "Hyper Text Markup Language",
      b: "Home Tool Markup Language",
      c: "Hyperlinks Text Mark Language",
      d: "Hyper Text Markup Links",
      correct: "a",
    },
    {question: "Which of the following is an advantage of using JavaScript?",
      a: "less server interaction",
      b: "immediate feedback to visitors",
      c: "increased interactivity",
      d: "all of the above",
      correct: "d",
    },
  ];

  const timeLimit = 60 * 1000;
  const intro = document.getElementById('begin')
  const highScoresBtn = document.getElementById('high-score')
  const submitHighScoreBtn = document.getElementById('submit-score')
  const startBtn = document.getElementById('start-button')
  const timer = document.getElementById('quiz-timer')
  const submitBtn = document.getElementById('submit')
  const quiz = document.getElementById('quiz')
  const homeBtn = document.getElementById('return-button')
  const correctAnswers = document.getElementById('correct')
  const results = document.getElementById('results')
  const initials = document.getElementById('initials')
  const questionEl = document.getElementById('question')
  const answerEls = document.querySelectorAll('.answer')
  const a_text = document.getElementById('a')
  const b_text = document.getElementById('b')
  const c_text = document.getElementById('c')
  const d_text = document.getElementById('d')
  
  answerEls.forEach(answerEl => answerEl.addEventListener("click", setAnswer))
  highScoresBtn.addEventListener("click", showHighScores);
  homeBtn.addEventListener("click", returnHome);
  
  startBtn.addEventListener("click", startQuiz);
  
  let highScoreMaxCount = 5;
  let highScoreInitials
  let currentQuiz
  let score
  let timerValue
  let timerId
  let answer
  let rank
  
  function updateTimerText(ms) {
    if (ms === -1) {
      timer.innerText = '';
    }
    else if (ms > 0) {
      timer.innerText = 'Time Remaining: ' + (ms / 1000.0).toFixed(1) + ' seconds';
    }
    else {
      timer.innerText = "Time's up!"
    }
  }
  
  function updateTimer() {
    decrementTimer(100);
    updateTimerText(timerValue)
  }
  
  function startTimer() {
    timerValue = timeLimit;
    updateTimerText(timerValue)
    timerId = setInterval(updateTimer, 100);
  }
  
  function startQuiz() {
    currentQuiz = 0;
    score = 0;
    answer = null;
    quiz.style.display = "block";
    intro.style.display = "none";
    highScoresBtn.style.visibility = "hidden";
    deselectAnswers()
    const currentQuizData = quizData[currentQuiz]
    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d
  
    loadQuiz()
    startTimer()
  }
  function stopQuiz() {
    updateTimerText(-1);
    clearInterval(timerId);
  
    rank = 0
    let highScores = getHighScores();
    for (let highScore of highScores) {
      if (score > highScore.correct || rank == highScoreMaxCount)
        break;
      rank++;
    }
  
    correct.innerHTML = `
      You answered ${score} out of ${quizData.length} questions correctly
    `
    if (rank < highScoreMaxCount) {
      highScoreInitials = '';
      submitScore.innerHTML = 'Submit';
      initials.innerHTML = `
        <h2>Congratulations, you are currently ranked #${rank + 1}!</h2>
        <label>Please enter your initials here</label>
        <input id="high-score-input" maxlength="3"></input>
      `
    }
    else {
      initials.innerHTML = '';
      submitScore.innerHTML = 'View High Scores';
      submitScore.style.visibility = "visible";
    }
  
    quiz.style.display = "none";
    results.style.display = "block";
  }
  
  function submitScore() {
    scores.style.display = "block";
    quiz.style.display = "none";
    let initialsEl = document.getElementById('high-score-input');
    if (initialsEl) {
      setHighScore(rank, initialsEl.value, score);
    }
    updateHighScores();
    scores.style.display = "block";
    results.style.display = "none";
  }
  
  function updateHighScores() {
    let highScores = getHighScores();
    for (let rank = 1; rank <= highScoreMaxCount; rank++) {
      let scoreEl = document.getElementById('high-score-' + rank).getElementsByClassName('name')[0];
      let score = highScores[rank - 1];
      if (score) {
        scoreEl.innerHTML = rank + ') ' + score.initials + ' - ' + score.correct + '/' + quizData.length;
      }
      else {
        scoreEl.innerHTML = '';
      }
    }
  }
  
  function loadQuiz() {

    deselectAnswers()

    const currentQuizData = quizData[currentQuiz]

   questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d
  }
  
  function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false)
  }
  
  function setAnswer(e) {
    answer = e.target.id
  }

  function setHighScore(position, initials, correct) {
    let highScores = getHighScores();
    if (!highScores || !Array.isArray(highScores))
      highScores = [];
    highScores.splice(position, 0, { initials, correct })
    if (highScores.length > highScoreMaxCount)
      highScores.pop();
    localStorage.setItem('highscores', JSON.stringify(highScores))
  }
  function getHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highscores'));
    if (!highScores)
      highScores = []
    return highScores
  }
  function getHighScore(position) {
    let highScores = getHighScores();
    if (!highScores)
      return null
    if (highScores.length < position)
      return null
    return highScores[position]
  }
  function showHighScores() {
    updateHighScores();
    quiz.style.display = "none";
    highScoresBtn.style.visibility = "hidden";
    scores.style.display = "block";
    intro.style.display = "none";
  }
  
  function returnHome() {
    highScoresBtn.style.visibility = "visible";
    scores.style.display = "none";
    begin.style.display = "block";
  }

  function decrementTimer(value) {
    timerValue -= value;
    if (timerValue <= 0) {
      clearInterval(timerId);
      stopQuiz();
    }
  }
  
  submitBtn.addEventListener('click', () => {
    if  (answer === quizData[currentQuiz].correct) {
      score++;
    }
  
    answer = null
    
    currentQuiz++;
  if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      stopQuiz();
    }
  })