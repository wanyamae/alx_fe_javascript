// Load quotes from localStorage, or start with defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "Programming" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Motivation" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." , category: "Inspiration" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston S. Churchill" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" }
];

// Save quotes back into localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== CATEGORY FILTER HANDLING ======

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories

  // Reset options to default
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Add categories as <option>
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore previously selected category (if any)
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedCategory;
}

// Filter and display a quote based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  // Save selection in localStorage
  localStorage.setItem("selectedCategory", selectedCategory);

  // Filter quotes
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  // Display a random quote from filtered list
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    displayQuote(filteredQuotes[randomIndex]);
  } else {
    document.getElementById("quoteDisplay").innerHTML =
      `<p>No quotes found for <strong>${selectedCategory}</strong>.</p>`;
  }
}

// ====== QUOTE DISPLAY HANDLING ======

// Render a single quote
function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>- ${quote.author}</em></p>
    <p><small>[${quote.category}]</small></p>
  `;
}

// Show a random quote (from all)
function showNewQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  displayQuote(quotes[randomIndex]);
}

// ====== ADDING NEW QUOTES ======

// Add a new quote (with category)
function addQuote(text, author, category) {
  if (!text || !author || !category) {
    alert("Please fill in all fields.");
    return;
  }

  quotes.push({ text, author, category });
  saveQuotes();
  populateCategories(); // update categories if new one added
  alert("Quote added successfully!");
}

// ====== PAGE INITIALIZATION ======
window.onload = function () {
  populateCategories();   // load categories
  filterQuotes();         // show filtered (or last viewed) quote

  // Hook up "New Quote" button
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
};
