// 📜 Ensures that the script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("📜 JS Loaded Successfully!");

    // 🌦️ Event Listener for Weather Recommendation Button
    document.getElementById("get-weather-btn").addEventListener("click", getWeatherBasedRecommendation);

    // 📖 Load saved books from localStorage on page load
    loadBooks();
});

// 🌦️ Fetch Weather Data & Recommend a Book Genre
function getWeatherBasedRecommendation() {
    let city = document.getElementById("city-input").value.trim(); // Get user input for city

    if (!city) return alert("Please enter a city name."); // Ensure input is provided

    // Weather API (Replace with your actual API key)
    let apiKey = "7325WA9AQ6WJ64VG2EVPVKHDN"; 
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let condition = data.currentConditions?.conditions || "Unknown"; // Weather condition
            let temp = data.currentConditions?.temp || "N/A"; // Temperature
            let genre = getGenreRecommendation(condition); // Get genre based on weather

            // 🌍 Display Weather Condition and Genre Recommendation
            document.getElementById("weather-condition").innerText = `🌍 ${city}: ${condition} | ${temp}°C`;
            document.getElementById("weather-recommendation").innerText = `📖 Recommended Genre: ${genre}`;

            // 🎯 Fetch books based on recommended genre
            fetchBooksByGenre(genre);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

// 📚 Returns a book genre recommendation based on weather condition
function getGenreRecommendation(condition) {
    condition = condition.toLowerCase(); // Convert to lowercase for easier comparison

    if (condition.includes("rain")) return "Mystery";
    if (condition.includes("clear")) return "Adventure";
    if (condition.includes("cloud")) return "Sci-Fi";
    if (condition.includes("snow")) return "Historical Fiction";
    
    return "General"; // Default genre if condition doesn't match
}

// 📖 Fetch Books by Genre from Open Library API
function fetchBooksByGenre(genre) {
    let url = `https://openlibrary.org/search.json?subject=${genre}&limit=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let bookCollection = document.getElementById("book-collection");
            bookCollection.innerHTML = `<h2>📚 Books from "${genre}" Genre</h2>`; // Update heading

            data.docs.forEach(book => {
                let coverURL = book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/128x190?text=No+Cover"; // Placeholder if no cover found

                // 📖 Create Book Card
                let bookItem = document.createElement("div");
                bookItem.classList.add("book-card");
                bookItem.innerHTML = `
                    <img src="${coverURL}" class="book-cover">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author_name?.[0] || "Unknown"}</p>
                    <button onclick='addToLibrary("${book.title}", "${book.author_name?.[0] || "Unknown"}", "${genre}")'>Add to My Library</button>
                `;
                bookCollection.appendChild(bookItem);
            });
        })
        .catch(error => console.error("Error fetching books:", error));
}

// 📚 Add Book to Personal Library (LocalStorage)
function addToLibrary(title, author, genre) {
    let books = JSON.parse(localStorage.getItem("books")) || []; // Retrieve books or initialize empty array
    books.push({ title, author, genre, read: false }); // Add new book entry
    localStorage.setItem("books", JSON.stringify(books)); // Save back to localStorage
    loadBooks(); // Reload book list
}

// 📖 Load Books from Local Storage and Display
function loadBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || []; // Retrieve books
    let bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Clear existing list

    books.forEach((book, index) => {
        let bookItem = document.createElement("div");
        bookItem.classList.add("book-card");
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Status:</strong> ${book.read ? "Read ✅" : "Unread ❌"}</p>
            <button onclick="toggleReadStatus(${index})">${book.read ? "Mark as Unread" : "Mark as Read"}</button>
            <button onclick="deleteBook(${index})">Delete</button>
        `;
        bookList.appendChild(bookItem);
    });
}

// 🔎 Search for Books from Open Library API
function searchBooks() {
    let query = document.getElementById("search").value.trim();
    if (!query) return alert("Please enter a book name to search!");

    let url = `https://openlibrary.org/search.json?q=${query}&limit=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let bookCollection = document.getElementById("book-collection");
            bookCollection.innerHTML = `<h2>🔍 Search Results for "${query}"</h2>`;

            if (data.docs.length === 0) {
                bookCollection.innerHTML += `<p>No books found. Try a different search term.</p>`;
                return;
            }

            data.docs.forEach(book => {
                let coverURL = book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/128x190?text=No+Cover";

                let bookItem = document.createElement("div");
                bookItem.classList.add("book-card");
                bookItem.innerHTML = `
                    <img src="${coverURL}" class="book-cover">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author_name?.[0] || "Unknown"}</p>
                    <button onclick='addToLibrary("${book.title}", "${book.author_name?.[0] || "Unknown"}", "Unknown")'>Add to My Library</button>
                `;
                bookCollection.appendChild(bookItem);
            });
        })
        .catch(error => console.error("Error fetching books:", error));
}

// 🎯 Event Listener for Search Button
document.getElementById("search-btn").addEventListener("click", searchBooks);

// ✅ Toggle Read/Unread Status
function toggleReadStatus(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books[index].read = !books[index].read; // Toggle status
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

// ❌ Delete Book
function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1); // Remove book from array
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

// ✨ Wand Glow Effect (Magic Cursor Trail)
document.addEventListener("mousemove", function (e) {
    let glow = document.createElement("div");
    glow.classList.add("magic-glow");
    glow.style.left = `${e.pageX}px`;
    glow.style.top = `${e.pageY}px`;
    document.body.appendChild(glow);

    // Remove glow effect after animation
    setTimeout(() => {
        glow.remove();
    }, 500);
});
