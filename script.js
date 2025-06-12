
        // Word list (simplified for demo)
        const wordList = [
            "the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog",
            "programming", "is", "fun", "when", "you", "get", "the", "hang", "of", "it",
            "javascript", "makes", "web", "development", "more", "interesting",
            "practice", "typing", "every", "day", "to", "improve", "your", "speed",
            "accuracy", "is", "more", "important", "than", "raw", "speed", "at", "first",
            "eventually", "you", "will", "develop", "both", "with", "consistent", "effort"
        ];
        
        // DOM Elements
        const wordsContainer = document.getElementById('words');
        const caret = document.getElementById('caret');
        const wpmDisplay = document.getElementById('wpm');
        const accuracyDisplay = document.getElementById('accuracy');
        const timeDisplay = document.getElementById('time');
        const restartBtn = document.getElementById('restart-btn');
        const modeButtons = document.querySelectorAll('.mode-btn');
        const themeBtn = document.getElementById('theme-btn');
        const themeSelector = document.getElementById('theme-selector');
        const closeThemeBtn = document.getElementById('close-theme');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        // Test state
        let testTime = 15;
        let timer;
        let startTime;
        let testActive = false;
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let correctChars = 0;
        let incorrectChars = 0;
        let totalKeyPresses = 0;
        
        // Themes
        const themes = {
            default: {
                'bg-color': '#1a1a1a',
                'main-color': '#e2b714',
                'caret-color': '#e2b714',
                'sub-color': '#646669',
                'text-color': '#d1d0c5',
                'error-color': '#ca4754',
                'error-extra-color': '#7e2a33'
            },
            dark: {
                'bg-color': '#0e0e0e',
                'main-color': '#d1d0c5',
                'caret-color': '#d1d0c5',
                'sub-color': '#4a4a4a',
                'text-color': '#d1d0c5',
                'error-color': '#ca4754',
                'error-extra-color': '#7e2a33'
            },
            light: {
                'bg-color': '#ffffff',
                'main-color': '#e2b714',
                'caret-color': '#e2b714',
                'sub-color': '#aaaaaa',
                'text-color': '#333333',
                'error-color': '#ca4754',
                'error-extra-color': '#7e2a33'
            },
            nord: {
                'bg-color': '#2e3440',
                'main-color': '#88c0d0',
                'caret-color': '#88c0d0',
                'sub-color': '#4c566a',
                'text-color': '#d8dee9',
                'error-color': '#bf616a',
                'error-extra-color': '#8f3d46'
            },
            solarized: {
                'bg-color': '#002b36',
                'main-color': '#268bd2',
                'caret-color': '#268bd2',
                'sub-color': '#586e75',
                'text-color': '#839496',
                'error-color': '#dc322f',
                'error-extra-color': '#9b221e'
            },
            matrix: {
                'bg-color': '#000000',
                'main-color': '#00ff41',
                'caret-color': '#00ff41',
                'sub-color': '#003b00',
                'text-color': '#00ff41',
                'error-color': '#ff0000',
                'error-extra-color': '#990000'
            }
        };
        
        // Initialize the test
        function initTest() {
            // Generate random words
            const testWords = [];
            for (let i = 0; i < 50; i++) {
                testWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
            }
            
            // Display words
            wordsContainer.innerHTML = '';
            testWords.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                if (index === 0) wordSpan.classList.add('active-word');
                
                word.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                });
                
                wordsContainer.appendChild(wordSpan);
                wordsContainer.appendChild(document.createTextNode(' '));
            });
            
            // Reset state
            currentWordIndex = 0;
            currentCharIndex = 0;
            correctChars = 0;
            incorrectChars = 0;
            totalKeyPresses = 0;
            testActive = false;
            
            // Update caret position
            updateCaretPosition();
            
            // Reset stats
            wpmDisplay.textContent = '0';
            accuracyDisplay.textContent = '100';
            timeDisplay.textContent = testTime;
        }
        
        // Update caret position
        function updateCaretPosition() {
            const activeWord = document.querySelector('.active-word');
            if (!activeWord) return;
            
            const chars = activeWord.querySelectorAll('span');
            if (chars.length === 0) return;
            
            const targetChar = currentCharIndex < chars.length ? chars[currentCharIndex] : chars[chars.length - 1];
            const rect = targetChar.getBoundingClientRect();
            const containerRect = wordsContainer.getBoundingClientRect();
            
            caret.style.left = `${rect.left - containerRect.left}px`;
            caret.style.top = `${rect.top - containerRect.top}px`;
        }
        
        // Start the test
        function startTest() {
            if (testActive) return;
            
            testActive = true;
            startTime = new Date().getTime();
            
            // Start timer
            timer = setInterval(() => {
                const currentTime = new Date().getTime();
                const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
                const remainingTime = testTime - elapsedSeconds;
                
                timeDisplay.textContent = remainingTime;
                
                if (remainingTime <= 0) {
                    endTest();
                }
            }, 1000);
        }
        
        // End the test
        function endTest() {
            clearInterval(timer);
            testActive = false;
            
            // Calculate final WPM and accuracy
            const elapsedMinutes = testTime / 60;
            const wpm = Math.round((correctChars / 5) / elapsedMinutes);
            const accuracy = totalKeyPresses > 0 ? Math.round((correctChars / totalKeyPresses) * 100) : 0;
            
            wpmDisplay.textContent = wpm;
            accuracyDisplay.textContent = accuracy;
            
            // Disable further input
            document.removeEventListener('keydown', handleKeyDown);
        }
        
        // Handle key presses
        function handleKeyDown(e) {
            if (!testActive && e.key !== 'Tab') {
                startTest();
            }
            
            // Ignore modifier keys
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            
            // Handle Tab key to restart
            if (e.key === 'Tab') {
                e.preventDefault();
                restartTest();
                return;
            }
            
            // Handle backspace
            if (e.key === 'Backspace') {
                handleBackspace();
                return;
            }
            
            // Ignore other non-character keys
            if (e.key.length > 1) return;
            
            // Get current word and characters
            const words = document.querySelectorAll('.word');
            if (currentWordIndex >= words.length) return;
            
            const currentWord = words[currentWordIndex];
            const chars = currentWord.querySelectorAll('span');
            
            // Check if we've reached the end of the word
            if (currentCharIndex >= chars.length) {
                // Space should move to next word
                if (e.key === ' ') {
                    moveToNextWord();
                }
                return;
            }
            
            // Check the typed character
            const currentChar = chars[currentCharIndex];
            const expectedChar = currentChar.textContent;
            
            totalKeyPresses++;
            
            if (e.key === expectedChar) {
                // Correct character
                currentChar.className = 'correct';
                correctChars++;
            } else {
                // Incorrect character
                currentChar.className = 'incorrect';
                incorrectChars++;
            }
            
            currentCharIndex++;
            updateCaretPosition();
            
            // Check if we've reached the end of the word
            if (currentCharIndex >= chars.length) {
                // If space is pressed immediately after, move to next word
                if (e.key === ' ') {
                    moveToNextWord();
                }
            }
        }
        
        // Handle backspace
        function handleBackspace() {
            if (currentCharIndex === 0) {
                // At start of word, can't backspace further
                return;
            }
            
            const words = document.querySelectorAll('.word');
            const currentWord = words[currentWordIndex];
            const chars = currentWord.querySelectorAll('span');
            
            currentCharIndex--;
            const char = chars[currentCharIndex];
            char.className = '';
        }
        
        // Move to next word
        function moveToNextWord() {
            const words = document.querySelectorAll('.word');
            
            // Remove active class from current word
            words[currentWordIndex].classList.remove('active-word');
            
            currentWordIndex++;
            currentCharIndex = 0;
            
            // Add active class to next word
            if (currentWordIndex < words.length) {
                words[currentWordIndex].classList.add('active-word');
            } else {
                // End of test
                endTest();
            }
            
            updateCaretPosition();
        }
        
        // Restart test
        function restartTest() {
            clearInterval(timer);
            initTest();
            document.addEventListener('keydown', handleKeyDown);
        }
        
        // Change theme
        function changeTheme(themeName) {
            const theme = themes[themeName];
            if (!theme) return;
            
            for (const [property, value] of Object.entries(theme)) {
                document.documentElement.style.setProperty(`--${property}`, value);
            }
            
            // Update restart button color
            restartBtn.style.backgroundColor = theme['main-color'];
            restartBtn.style.color = theme['bg-color'];
            
            // Close theme selector
            themeSelector.classList.add('hidden');
        }
        
        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            initTest();
            document.addEventListener('keydown', handleKeyDown);
        });
        
        restartBtn.addEventListener('click', restartTest);
        
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                testTime = parseInt(btn.dataset.time);
                timeDisplay.textContent = testTime;
                restartTest();
            });
        });
        
        themeBtn.addEventListener('click', () => {
            themeSelector.classList.remove('hidden');
        });
        
        closeThemeBtn.addEventListener('click', () => {
            themeSelector.classList.add('hidden');
        });
        
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                changeTheme(option.dataset.theme);
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', updateCaretPosition);
 