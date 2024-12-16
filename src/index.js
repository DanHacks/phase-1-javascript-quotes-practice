document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const form = document.getElementById('new-quote-form');
    
    // Fetch and render quotes
    fetchQuotes();
  
    // Fetch quotes with likes
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then((response) => response.json())
        .then((quotes) => {
          quotes.forEach(renderQuote);
        });
    }
  
    // Render a single quote
    function renderQuote(quote) {
      const li = document.createElement('li');
      li.className = 'quote-card';
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
  
      // Like button functionality
      const likeButton = li.querySelector('.btn-success');
      likeButton.addEventListener('click', () => handleLike(quote, likeButton));
  
      // Delete button functionality
      const deleteButton = li.querySelector('.btn-danger');
      deleteButton.addEventListener('click', () => handleDelete(quote.id, li));
  
      quoteList.appendChild(li);
    }
  
    // Add new quote
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newQuote = document.getElementById('new-quote').value;
      const author = document.getElementById('author').value;
  
      const quoteData = {
        quote: newQuote,
        author: author,
      };
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      })
        .then((response) => response.json())
        .then((newQuote) => {
          renderQuote(newQuote);
          form.reset();
        });
    });
  
    // Handle like functionality
    function handleLike(quote, likeButton) {
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id }),
      })
        .then((response) => response.json())
        .then(() => {
          const likesSpan = likeButton.querySelector('span');
          likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
        });
    }
  
    // Handle delete functionality
    function handleDelete(quoteId, quoteElement) {
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE',
      }).then(() => {
        quoteElement.remove();
      });
    }
  });
  