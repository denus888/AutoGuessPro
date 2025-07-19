document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const gameSection = document.getElementById('game-section');
    const carImage = document.getElementById('carImage');
    const optionsContainer = document.getElementById('optionsContainer');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const nextButton = document.getElementById('nextButton');
    const heroSection = document.querySelector('.hero'); // Added to hide hero section

    let currentCarIndex = 0;
    let cars = []; // This will be populated from a "database"

    // Simulate a database of car brands and images
    const carDatabase = [
        { name: 'Mercedes-Benz', image: 'mers.jpg' },
        { name: 'Bmw', image: 'bmw.jpg' },
        { name: 'Audi', image: 'audi.jpg' },
        { name: 'Tesla', image: 'tesla.jpg' },
        { name: 'Porsche', image: 'porsche.jpg' },
        { name: 'Ferrari', image: 'ferrari.jpg' },
        { name: 'Lamborghini', image: 'lam.jpg' },
        { name: 'Toyota', image: 'to.jpg' },
        { name: 'Honda', image: honda.jpg' },
        { name: 'Ford', image: 'ford.jpg' },
        { name: 'Nissan', image: 'nissan.jpg' },
        { name: 'Volkswagen', image: 'Volkswagen.jpg' },
        { name: 'Hyundai', image: 'Hyundai.jpg' },
        { name: 'Kia', image: 'kia.jpg' },
        { name: 'Volvo', image: 'volvo.jpg' },
    ];

    // Function to shuffle an array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateOptions(correctCar) {
        let options = [correctCar.name];
        let availableCars = carDatabase.filter(car => car.name !== correctCar.name);
        availableCars = shuffleArray(availableCars);

        for (let i = 0; options.length < 4; i++) {
            if (availableCars[i]) {
                options.push(availableCars[i].name);
            } else {
                // Fallback if not enough unique options (unlikely with this small dataset)
                options.push(`Placeholder Option ${options.length + 1}`);
            }
        }
        return shuffleArray(options);
    }

    function displayCar() {
        if (currentCarIndex >= cars.length) {
            endGame();
            return;
        }

        const car = cars[currentCarIndex];

        // Add fade-out class to current image
        carImage.classList.add('fade-out');

        setTimeout(() => {
            carImage.src = car.image;
            carImage.alt = `Зображення автомобіля ${car.name}`;
            carImage.onload = () => {
                // Remove fade-out and add fade-in after new image loads
                carImage.classList.remove('fade-out');
                carImage.classList.add('fade-in');
                setTimeout(() => {
                    carImage.classList.remove('fade-in');
                }, 300); // Duration of fade-in transition
            };

            optionsContainer.innerHTML = '';
            const options = generateOptions(car);
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('btn', 'option-button');
                button.textContent = option;
                button.addEventListener('click', () => handleOptionClick(option, car.name));
                optionsContainer.appendChild(button);
            });

            feedbackMessage.textContent = '';
            feedbackMessage.classList.remove('correct-text', 'wrong-text');
            nextButton.classList.add('hidden');
            enableOptions();
        }, 300); // Match this with fade-out transition duration
    }

    function handleOptionClick(selectedOption, correctOption) {
        const buttons = optionsContainer.querySelectorAll('.option-button');
        disableOptions(); // Disable all options after one is clicked

        if (selectedOption === correctOption) {
            feedbackMessage.textContent = 'Правильно! 👍';
            feedbackMessage.classList.add('correct-text');
            // Highlight the correct button
            buttons.forEach(button => {
                if (button.textContent === selectedOption) {
                    button.classList.add('correct');
                }
            });
        } else {
            feedbackMessage.textContent = `Неправильно. Це ${correctOption}. 👎`;
            feedbackMessage.classList.add('wrong-text');
            // Highlight the selected wrong button and the correct one
            buttons.forEach(button => {
                if (button.textContent === selectedOption) {
                    button.classList.add('wrong');
                } else if (button.textContent === correctOption) {
                    button.classList.add('correct');
                }
            });
        }
        nextButton.classList.remove('hidden');
    }

    function disableOptions() {
        optionsContainer.querySelectorAll('.option-button').forEach(button => {
            button.disabled = true;
        });
    }

    function enableOptions() {
        optionsContainer.querySelectorAll('.option-button').forEach(button => {
            button.disabled = false;
            button.classList.remove('correct', 'wrong');
        });
    }

    function startGame() {
        cars = shuffleArray([...carDatabase]); // Use a copy to shuffle
        currentCarIndex = 0;
        heroSection.classList.add('hidden'); // Hide the hero section
        gameSection.classList.remove('hidden'); // Show the game section
        displayCar();
    }

    function endGame() {
        gameSection.innerHTML = `
            <div class="container game-card" style="text-align: center; padding: 50px;">
                <h3>Гра Завершена!</h3>
                <p>Ви вгадали всі доступні марки автомобілів. Дякуємо за гру!</p>
                <button id="restartButton" class="btn btn-primary">Зіграти Ще Раз</button>
            </div>
        `;
        document.getElementById('restartButton').addEventListener('click', startGame);
    }

    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', () => {
        currentCarIndex++;
        displayCar();
    });
});
