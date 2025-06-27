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
    // data.Search is an array of movie objects returned from the API

    // 1. Get the array of movies from the API response
    const moviesArray = data.Search;

    // 2. Go through each movie in the array, one by one
    moviesArray.forEach(movie => {
      // 3. For each movie, create a new div element for the movie card
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';

      // 4. Check if the movie has a poster image
      // If not, use a placeholder image
      const poster = movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'https://via.placeholder.com/250x350?text=No+Image';

      // 5. Add the movie's poster, title, and year to the movie card
      movieCard.innerHTML = `
        <img class="movie-poster" src="${poster}" alt="Poster of ${movie.Title}">
        <div class="movie-info">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
        </div>
      `;

      // 6. Add the movie card to the results container on the page
      movieResults.appendChild(movieCard);
    });
  } else {
    // If no movies found, show a message
    movieResults.innerHTML = `<div class="no-results">No movies found. Try another search!</div>`;
  }
});
