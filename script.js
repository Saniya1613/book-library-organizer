document.addEventListener("DOMContentLoaded", function () {
    console.log("📜 JS Loaded Successfully!");

    // 🌦️ Event Listener for Weather
    document.getElementById("get-weather-btn").addEventListener("click", getWeatherBasedRecommendation);

    loadBooks();
});

// 🌦️ Fetch Weather and Recommend Genres + Fetch Books for That Genre
function getWeatherBasedRecommendation() {
    let city = document.getElementById("city-input").value.trim();
    if (!city) return alert("Please enter a city name.");

    let apiKey = "7325WA9AQ6WJ64VG2EVPVKHDN"; // Replace with your API key
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let condition = data.currentConditions?.conditions || "Unknown";
            let temp = data.currentConditions?.temp || "N/A";
            let genre = getGenreRecommendation(condition);

            document.getElementById("weather-condition").innerText = `🌍 ${city}: ${condition} | ${temp}°C`;
            document.getElementById("weather-recommendation").innerText = `📖 Recommended Genre: ${genre}`;

            // 🎯 Fetch Books Based on Recommended Genre
            fetchBooksByGenre(genre);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

// 📚 Get Genre Recommendation Based on Weather
function getGenreRecommendation(condition) {
    condition = condition.toLowerCase();
    if (condition.includes("rain")) return "Mystery";
    if (condition.includes("clear")) return "Adventure";
    if (condition.includes("cloud")) return "Sci-Fi";
    if (condition.includes("snow")) return "Historical Fiction";
    return "General"; // Default
}

// 📖 Fetch Books by Genre from Open Library
function fetchBooksByGenre(genre) {
    let url = `https://openlibrary.org/search.json?subject=${genre}&limit=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let bookCollection = document.getElementById("book-collection");
            bookCollection.innerHTML = `<h2>📚 Books from "${genre}" Genre</h2>`;

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
                    <button onclick='addToLibrary("${book.title}", "${book.author_name?.[0] || "Unknown"}", "${genre}")'>Add to My Library</button>
                `;
                bookCollection.appendChild(bookItem);
            });
        })
        .catch(error => console.error("Error fetching books:", error));
}

// 📚 Add Book to Personal Library
function addToLibrary(title, author, genre) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push({ title, author, genre, read: false });
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

// 📖 Load Books from Local Storage
function loadBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

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

// 🔎 Search for Books from Open Library
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
    books[index].read = !books[index].read;
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

// ❌ Delete Book
function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}
document.addEventListener("mousemove", function (e) {
    let glow = document.createElement("div");
    glow.classList.add("magic-glow");
    glow.style.left = `${e.pageX}px`;
    glow.style.top = `${e.pageY}px`;
    document.body.appendChild(glow);

    setTimeout(() => {
        glow.remove();
    }, 500);
});

