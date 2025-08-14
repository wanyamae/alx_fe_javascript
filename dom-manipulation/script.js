// ---------- Constants ----------
const STORAGE_KEY = "quotes";

// ---------- Defaults ----------
const defaultQuotes = [
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

// ---------- State ----------
let quotes = loadQuotesFromLocal() || [...defaultQuotes];

// ---------- Storage ----------
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotesFromLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.error("Failed to parse stored quotes", e);
    return null;
  }
}

// ---------- UI Elements ----------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ---------- Rendering ----------
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Please add one!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, author } = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${text}"</p>
    <small>— ${author || "Unknown"}</small>
  `;
}

// ---------- Import/Export ----------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("File must contain an array of quotes");
      quotes.push(...imported.filter(q => q.text));
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ---------- Add Quote Form ----------
function createAddQuoteForm() {
  const form = document.createElement("form");
  form.innerHTML = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" required />
      <input id="newQuoteAuthor" type="text" placeholder="Enter author" />
      <button type="submit">Add Quote</button>
    </div>
  `;
  document.body.appendChild(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = document.getElementById("newQuoteText").value.trim();
    const author = document.getElementById("newQuoteAuthor").value.trim();

    if (text) {
      quotes.push({ text, author });
      saveQuotes();
      alert("Quote added successfully!");
      form.reset();
      showRandomQuote();
    }
  });
}

function exportQuotes() {
    if (!quotes.length) {
        alert("No quotes to export.");
        return;
    }
}

const json = JSON.stringify(quotes, null, 2);
const blob = new Blob([json], { type: "application/json" });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const filename = `quotes-${timestamp}.json`;
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = filename;
link.click();

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear all options except "All"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Extract unique categories from quotes array
  const categories = [...new Set(quotes.map(q => q.category).filter(Boolean))];

  // Add each category as an option
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastCategory;
}

URL.revokeObjectURL(link.href);

// ---------- Init ----------
newQuoteBtn.addEventListener("click", showRandomQuote);
showRandomQuote();
createAddQuoteForm()