/**
 * UCSC Student Toolkit - Multi-page Script
 * Handles persistence for Dark Mode and Events across pages.
 */

// 1. Theme Module (Persisted)
const ThemeModule = (() => {
    const body = document.body;
    const themeBtn = document.getElementById('dark-mode-btn');

    const toggleTheme = () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeBtn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    const init = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeBtn.innerText = '☀️ Light Mode';
        }
        themeBtn.addEventListener('click', toggleTheme);
    };

    return { init };
})();

// 2. Events Module (Persisted)
const EventsModule = (() => {
    const input = document.getElementById('event-input');
    const addBtn = document.getElementById('add-event-btn');
    const list = document.getElementById('event-list');

    const loadEvents = () => {
        const savedEvents = JSON.parse(localStorage.getItem('events')) || [
            "Final Exam - Math (Mar 20)",
            "History Essay Due (Mar 22)",
            "Coding Bootcamp (Mar 25)"
        ];
        list.innerHTML = '';
        savedEvents.forEach(text => createEventElement(text));
    };

    const createEventElement = (text) => {
        const li = document.createElement('li');
        li.innerText = text;
        li.className = 'event-item';
        list.appendChild(li);
    };

    const addEvent = () => {
        const text = input.value.trim();
        if (text) {
            createEventElement(text);
            const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
            savedEvents.push(text);
            localStorage.setItem('events', JSON.stringify(savedEvents));
            input.value = '';
        }
    };

    const init = () => {
        if (!addBtn) return;
        loadEvents();
        addBtn.addEventListener('click', addEvent);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addEvent();
        });
    };

    return { init };
})();

// 3. GPA Calculator Module (Page specific)
const GPAModule = (() => {
    const container = document.getElementById('gpa-rows-container');
    const addBtn = document.getElementById('add-row-btn');
    const calcBtn = document.getElementById('calc-gpa-btn');
    const display = document.getElementById('gpa-display');

    if (!container) return { init: () => {} };

    const addRow = () => {
        const row = document.createElement('div');
        row.className = 'gpa-row';
        row.innerHTML = `
            <input type="text" placeholder="Course Name">
            <input type="number" class="course-credits" placeholder="Credits" min="1">
            <select class="course-grade">
                <option value="4">A</option>
                <option value="3">B</option>
                <option value="2">C</option>
                <option value="1">D</option>
                <option value="0">F</option>
            </select>
        `;
        container.appendChild(row);
    };

    const calculateGPA = () => {
        const credits = document.querySelectorAll('.course-credits');
        const grades = document.querySelectorAll('.course-grade');
        let totalWeightedPoints = 0;
        let totalCredits = 0;

        for (let i = 0; i < credits.length; i++) {
            const creditVal = parseFloat(credits[i].value);
            const gradeVal = parseFloat(grades[i].value);
            if (!isNaN(creditVal) && creditVal > 0) {
                totalWeightedPoints += (gradeVal * creditVal);
                totalCredits += creditVal;
            }
        }

        if (totalCredits > 0) {
            const gpa = totalWeightedPoints / totalCredits;
            display.innerText = `Result: ${gpa.toFixed(2)}`;
        } else {
            display.innerText = "Enter valid credits";
        }
    };

    const init = () => {
        addBtn.addEventListener('click', addRow);
        calcBtn.addEventListener('click', calculateGPA);
    };

    return { init };
})();

// 4. Timer Module (Page specific)
const TimerModule = (() => {
    let timerId = null;
    let secondsLeft = 1500;
    let isRunning = false;

    const display = document.getElementById('timer-display');
    const toggleBtn = document.getElementById('timer-toggle-btn');
    const resetBtn = document.getElementById('timer-reset-btn');

    if (!display) return { init: () => {} };

    const updateDisplay = () => {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (secondsLeft === 0) alert("Study session complete!");
    };

    const toggleTimer = () => {
        if (isRunning) {
            clearInterval(timerId);
            timerId = null;
            toggleBtn.innerText = 'Start';
        } else {
            timerId = setInterval(() => {
                if (secondsLeft > 0) {
                    secondsLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerId);
                }
            }, 1000);
            toggleBtn.innerText = 'Pause';
        }
        isRunning = !isRunning;
    };

    const init = () => {
        toggleBtn.addEventListener('click', toggleTimer);
        resetBtn.addEventListener('click', () => {
            clearInterval(timerId);
            timerId = null;
            isRunning = false;
            secondsLeft = 1500;
            toggleBtn.innerText = 'Start';
            updateDisplay();
        });
        updateDisplay();
    };

    return { init };
})();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    ThemeModule.init();
    EventsModule.init();
    GPAModule.init();
    TimerModule.init();
});
