// Get references to the form and results container
const searchForm = document.getElementById('search-form');
const movieResults = document.getElementById('movie-results');

// Your OMDb API key (replace 'YOUR_API_KEY' with your actual key)
const API_KEY = 'YOUR_API_KEY';

// Listen for the form submit event
searchForm.addEventListener('submit', async function(event) {
  // Prevent the page from reloading
  event.preventDefault();

  // Get the search term from the input field
  const searchInput = document.getElementById('movie-search');
  const searchTerm = searchInput.value.trim();

  // If the search term is empty, do nothing
  if (!searchTerm) {
    movieResults.innerHTML = '';
    return;
  }

  // Build the OMDb API URL
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`;

  // Fetch data from the OMDb API
  const response = await fetch(url);
  const data = await response.json();

  // Clear previous results
  movieResults.innerHTML = '';

  // Check if movies were found
  if (data.Response === 'True') {
    // Loop through each movie and display its poster, title, and year
    data.Search.forEach(movie => {
      // Create a div for the movie card
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';

      // Use a placeholder image if poster is not available
      const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x350?text=No+Image';

      // Set the inner HTML of the movie card
      movieCard.innerHTML = `
        <img class="movie-poster" src="${poster}" alt="Poster of ${movie.Title}">
        <div class="movie-info">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
        </div>
      `;

      // Add the movie card to the results grid
      movieResults.appendChild(movieCard);
    });
  } else {
    // If no movies found, show a message
    movieResults.innerHTML = `<div class="no-results">No movies found. Try another search!</div>`;
  }
});
