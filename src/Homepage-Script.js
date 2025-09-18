    <script>
    // --- Bottom Nav Tab Switch ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabScreens = document.querySelectorAll('.tab-screen');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = item.getAttribute('data-tab');
        navItems.forEach(i => i.classList.remove('active'));
        tabScreens.forEach(tab => tab.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        });
    });

    const streakCountEl = document.getElementById('streak-count');
    const starCountEl = document.getElementById('star-count');

    let stars = parseInt(localStorage.getItem('stars')) || 0;
    let streak = parseInt(localStorage.getItem('streak')) || 0;
    let lastDate = localStorage.getItem('lastLessonDate') || '';

    streakCountEl.textContent = streak;
    starCountEl.textContent = stars;

    document.querySelectorAll('[data-lesson]').forEach(link => {
        const lessonKey = link.getAttribute('data-lesson');

        // Dim if previously visited
        if (localStorage.getItem('lesson_' + lessonKey)) {
        link.classList.add('visited');
        const textElement = link.nextElementSibling;
        if (textElement) textElement.classList.add('visited');
        }

        link.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        const alreadyCompleted = localStorage.getItem('lesson_' + lessonKey);

        if (lastDate !== today) {
            // FIRST TIME STREAK!
            if (streak === 0) {
            showStreakPopup();
            }

            streak += 1;
            localStorage.setItem('streak', streak);
            localStorage.setItem('lastLessonDate', today);
            streakCountEl.textContent = streak;
        }

        if (!alreadyCompleted) {
            stars += 15;
            localStorage.setItem('stars', stars);
            starCountEl.textContent = stars;
            localStorage.setItem('lesson_' + lessonKey, 'completed');
            link.classList.add('visited');
            const textElement = link.nextElementSibling;
            if (textElement) textElement.classList.add('visited');
        }
        });
    });

    function showStreakPopup() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.background = 'rgba(255, 255, 255, 0.9)';
        popup.style.display = 'flex';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '1000';

        popup.innerHTML = `
        <div style="text-align: center;">
            <img src="images/fire-icon.png" style="width: 100px; height: 100px;" alt="Streak!"/>
            <h2 style="font-family: 'Poppins'; font-size: 24px; color: #333;">🔥 You started your streak!</h2>
        </div>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
        popup.remove();
        }, 2500);
    }
  </script>

<script>
  const flashcardCategories = [
    { id: 'vowels', name: 'Vowels', icon: 'images/icons/vowels.png' },
  ];

  let currentDeck = [];
  let currentCardIndex = 0;
  let isFlipped = false;
  let reverseMode = false;
  let shownTutorial = localStorage.getItem('shownFlashcardTutorial');

  function showFlashcards(categoryId) {
    currentDeck = [...flashcards[categoryId]];
    currentCardIndex = 0;
    isFlipped = false;

    document.getElementById('flashcardGrid').style.display = 'none';
    document.getElementById('flashcardViewer').style.display = 'block';
    updateCard();

if (!shownTutorial) {
  document.getElementById('flashcard-tutorial').style.display = 'flex';
}

    document.getElementById('flashcard').focus();
  }

function updateCard() {
  const flashcardEl = document.getElementById('flashcard');
  const inner = flashcardEl.querySelector('.flashcard-inner');
  
  // Reset transform
  inner.style.transition = "none";
  inner.style.transform = "rotateY(0deg)";
  void inner.offsetWidth; // force reflow
  inner.style.transition = "transform 0.6s";
  
  isFlipped = false;

  const card = currentDeck[currentCardIndex];
  document.querySelector('.flashcard-front').textContent = reverseMode ? card.back : card.front;
  document.querySelector('.flashcard-back').textContent = reverseMode ? card.front : card.back;
}

function flipCard() {
  const flashcardEl = document.getElementById('flashcard');
  const inner = flashcardEl.querySelector('.flashcard-inner');

  if (!isFlipped) {
    inner.style.transform = "rotateY(180deg)";
    isFlipped = true;
  } else {
    inner.style.transform = "rotateY(360deg)";
    setTimeout(() => {
      inner.style.transition = "none";
      inner.style.transform = "rotateY(0deg)";
      void inner.offsetWidth;
      inner.style.transition = "transform 0.6s";
    }, 600);
    isFlipped = false;
  }
}

  function markKnown() {
    animateSwipe('right');
    currentDeck.splice(currentCardIndex, 1);
    if (currentDeck.length === 0) return exitFlashcards();
    if (currentCardIndex >= currentDeck.length) currentCardIndex = 0;
    isFlipped = false;
    setTimeout(updateCard, 300);
  }

  
  function markUnknown() {
    animateSwipe('left');
    const card = currentDeck[currentCardIndex];
    currentDeck.push(card); // add to end
    currentDeck.splice(currentCardIndex, 1);
    if (currentDeck.length === 0) return exitFlashcards();
    if (currentCardIndex >= currentDeck.length) currentCardIndex = 0;
    isFlipped = false;
    setTimeout(updateCard, 300);
  }

  function toggleReverse() {
    reverseMode = !reverseMode;
    document.getElementById('reverseState').textContent = reverseMode ? 'On' : 'Off';
    isFlipped = false;
    updateCard();
  }

  function exitFlashcards() {
    document.getElementById('flashcardViewer').style.display = 'none';
    document.getElementById('flashcardGrid').style.display = 'grid';
  }

  function animateSwipe(direction) {
    const card = document.getElementById('flashcard');
    card.style.transition = 'transform 0.3s ease';
    card.style.transform = direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
    setTimeout(() => {
      card.style.transition = 'none';
      card.style.transform = 'translateX(0)';
    }, 300);
  }

  document.addEventListener('keydown', (e) => {
    if (document.getElementById('flashcardViewer').style.display !== 'none') {
      if (e.code === 'Space') flipCard();
      else if (e.code === 'ArrowRight') markKnown();
      else if (e.code === 'ArrowLeft') markUnknown();
    }
  });

  const flashcardGrid = document.getElementById('flashcardGrid');
  flashcardCategories.forEach(category => {
    const card = document.createElement('div');
    card.className = 'flashcard-card';
    card.innerHTML = `
      <img src="${category.icon}" alt="${category.name}" />
      <span>${category.name}</span>
    `;
    card.onclick = () => showFlashcards(category.id);
    flashcardGrid.appendChild(card);
  });

  const flashcards = {
    vowels: [
      { front: "অ", back: "ô" },
      { front: "আ", back: "aa" },
      { front: "ই", back: "i" },
      { front: "ঈ", back: "ii" },
      { front: "উ", back: "u" },
      { front: "ঊ", back: "uu" },
      { front: "ঋ", back: "ṙ" },
      { front: "ঌ", back: "æ" },
      { front: "ঐ", back: "oi" },
      { front: "ও", back: "oh" },
      { front: "ঔ", back: "ou" },

    ],
  };

    quiz: [
      {
        question: "What did the Panta Buri take with her?",
        options: ["jackfruit", "mango", "banana"],
        answer: "jackfruit"
      },
      {
        question: "Who did Panta Buri try to complain to?",
        options: ["son", "mayor", "king"],
        answer: "king"
      },
      {
        question: "What was inside the oven?",
        options: ["bell", "catfish", "razor"],
        answer: "bell"
      }
    ]


    let currentStoryKey = '';

function openStory(key) {
  currentStoryKey = key;
  const story = stories[key];
  document.getElementById('story-text').textContent = story.text;
  document.getElementById('story-list').style.display = 'none';
  document.getElementById('story-reader').style.display = 'block';
  document.getElementById('story-quiz').style.display = 'none';
}

function showQuiz() {
  const story = stories[currentStoryKey];
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  story.quiz.forEach((q, index) => {
    const div = document.createElement('div');
    div.classList.add("quiz-block");
    div.innerHTML = `
      <p class="quiz-question">${q.question}</p>
      ${q.options.map(opt => `
        <div class="quiz-option" onclick="selectOption(${index}, '${opt}', this)">${opt}</div>
      `).join('')}
    `;
    container.appendChild(div);
  });
  document.getElementById('story-reader').style.display = 'none';
  document.getElementById('story-quiz').style.display = 'block';
}

let selectedAnswers = {};

function selectOption(qIndex, value, el) {
  selectedAnswers[qIndex] = value;
  // clear other selections
  const options = el.parentNode.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  el.classList.add('selected');
}

function submitAnswers() {
  const story = stories[currentStoryKey];
  let score = 0;
  story.quiz.forEach((q, index) => {
    if (selectedAnswers[index] === q.answer) score++;
  });

  // Show result inside page instead of alert
  const resultBox = document.getElementById('quiz-result');
  resultBox.textContent = `You got ${score} out of ${story.quiz.length} correct! 🎉`;

  // Give stars as before
  let currentStars = parseInt(localStorage.getItem('stars') || '0');
  currentStars += score * 5;
  localStorage.setItem('stars', currentStars);
  starCountEl.textContent = currentStars;

  // (Optional) Stay on quiz screen so user can see result
  // If you want to automatically go back to the story list after a delay:
  setTimeout(() => {
    document.getElementById('story-list').style.display = 'block';
    document.getElementById('story-reader').style.display = 'none';
    document.getElementById('story-quiz').style.display = 'none';
    resultBox.textContent = ""; // clear for next time
  }, 3000);
}

</script>

<div id="flashcard-tutorial" style="display:none;">
  <div class="tutorial-backdrop"></div>
  <div class="tutorial-content">
    <h2>Flashcard Tutorial</h2>
    <ul>
      <li>▶ Press <b>SPACE</b> to flip.</li>
      <li>➡ Right Arrow: click if knew the answer</li>
      <li>⬅ Left Arrow: click if you didn't know the answer</li>
      <li>🔁 Use <b>Reverse</b> to flip sides.</li>
    </ul>
    <button onclick="closeTutorial()">Got it!</button>
  </div>
</div>

<div id="flashcard-tutorial" style="display:none;">
  <div class="tutorial-backdrop"></div>
  <div class="tutorial-content">
    <h2>How to Use Flashcards</h2>
    <ul>
      <li>Press <b>Space</b> to flip</li>
      <li>Press <b>→</b> if you knew it</li>
      <li>Press <b>←</b> if you didn’t</li>
    </ul>
    <button onclick="closeTutorial()">Got it</button>
  </div>
</div>

<script>
function closeTutorial() {
  document.getElementById('flashcard-tutorial').style.display = 'none';
  localStorage.setItem('shownFlashcardTutorial', 'yes');
}
</script>

</body>
</html>