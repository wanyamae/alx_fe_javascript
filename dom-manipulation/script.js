let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams."},
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
    { text: "The only way to do great work is to love what you do."},
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston S. Churchill" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Get busy living or get busy dying.", author: "Stephen King" },
    { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", author: "Brian Tracy" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Success usually comes to those who are too busy to be looking for it"},
    { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Please add one!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const { text, category } = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${text}"</p><small>— ${category}</small>`;
}

// Save quotes array to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create a form for adding quotes dynamically
function createAddQuoteForm() {
    const form = document.createElement("form");
    form.innerHTML = `
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
    document.body.appendChild(form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const text = document.getElementById("newQuoteText").value.trim();
        const category = document.getElementById("newQuoteCategory").value.trim();

        if (text && category) {
            quotes.push({ text, category });
            saveQuotes(); // Save to localStorage
            alert("Quote added successfully!");
            form.reset();
            showRandomQuote(); // Show the new quote immediately
        }
    });
}

// Event listener
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize
showRandomQuote();
createAddQuoteForm();