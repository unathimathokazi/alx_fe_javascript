// Initial quotes array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit is the one you set yourself.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" },
    { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  ];
  
  // Load last selected filter
  const lastCategory = localStorage.getItem('lastCategory') || 'all';
  
  // DOM Elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Populate categories on load
  populateCategories();
  filterQuotes();
  
  // Show Random Quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);
  
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerText = "No quotes in this category.";
      return;
    }
  
    const random = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerText = filteredQuotes[random].text;
  }
  
  // Add Quote
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
  
    if (!text || !category) {
      alert('Please enter both quote text and category.');
      return;
    }
  
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert('Quote added successfully!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
  
  // Save to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Populate Categories Dynamically
  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    categoryFilter.value = lastCategory;
  }
  
  // Filter Quotes by Category
  function filterQuotes() {
    localStorage.setItem('lastCategory', categoryFilter.value);
    showRandomQuote();
  }
  
  // Export to JSON
  function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();
  
    URL.revokeObjectURL(url);
  }
  
  // Import from JSON
  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON file.');
        }
      } catch (error) {
        alert('Error parsing JSON.');
      }
    };
    reader.readAsText(file);
  }
  