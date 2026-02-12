let clickCount = 0;
const clickBtn = document.getElementById('clickBtn');
const counter = document.getElementById('counter');
const greeting = document.getElementById('greeting');

clickBtn.addEventListener('click', () => {
  clickCount++;
  counter.textContent = `Clicks: ${clickCount}`;
  
  // Change greeting based on clicks
  if (clickCount === 5) {
    greeting.textContent = 'Hello Hades! You are on fire! 🔥🔥';
  } else if (clickCount === 10) {
    greeting.textContent = 'Hello Hades! UNSTOPPABLE! 🔥🔥🔥';
  } else if (clickCount === 20) {
    greeting.textContent = 'Hello Hades! LEGENDARY! ⚡🔥⚡';
  }
});
