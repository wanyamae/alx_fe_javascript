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

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data =  await res.json();


    const serverQuotes = data.slice(0,5).map((item, idx) => ({
      id: item.id,
      text: item.title,
      author: `ServerUser${idx + 1}`,
      category: "Server",
      updatedAt: Date.now()
    }));
    handleSync(serverQuotes);
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
};

async function pushQuoteToServer(quote) {
  try {
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        " Content-Type" : "application/json"
      },
      body: JSON.stringify(quote)
  })
  const data = await res.json();
  console.log("Quote pushed to server:", data);
} catch (error) {
    console.error("Error pushing quote to server:", error);
}


// ====== SYNC & CONFLICT HANDLING ======
function handleSync(serverQuotes) {
  let conflictFound = false;

  serverQuotes.forEach(serverQuote => {
    const localQuote = quotes.find(q => q.id === serverQuote.id);

    if (!localQuote) {
      // If server has a new quote, add it locally
      quotes.push(serverQuote);
    } else if (serverQuote.updatedAt > localQuote.updatedAt) {
      // Conflict: server wins
      conflictFound = true;
      Object.assign(localQuote, serverQuote);
    }
  });

  saveQuotes();
  populateCategories();

  if (conflictFound) {
    notifyUser("Conflicts resolved: server data has been applied.");
  }
}

// ====== UI NOTIFICATIONS ======
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ====== QUOTE FUNCTIONS (same as before) ======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    displayQuote(filteredQuotes[randomIndex]);
  } else {
    document.getElementById("quoteDisplay").innerHTML =
      `<p>No quotes found for <strong>${selectedCategory}</strong>.</p>`;
  }
}

function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>- ${quote.author}</em></p>
    <p><small>[${quote.category}]</small></p>
  `;
}

function addQuote(text, author, category) {
  const newQuote = {
    id: Date.now(),
    text,
    author,
    category,
    updatedAt: Date.now()
  };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  pushQuoteToServer(newQuote);
  notifyUser("Quote added and synced!");
}

// ====== INIT ======
window.onload = function () {
  populateCategories();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", filterQuotes);

  // Sync with server every 20s
  setInterval(fetchServerQuotes, 20000);
};

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
