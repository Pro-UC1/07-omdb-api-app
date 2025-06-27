// Get references to the form and results container
const searchForm = document.getElementById('search-form');
const movieResults = document.getElementById('movie-results');

 
 

// This function fetches movies from the OMDb API using a search query
const fetchMovies = async (query) => {
  // Your OMDb API key (replace 'YOUR_API_KEY' with your actual key)
  const API_KEY = '663b96d8'; // Example API key, replace with your own

  // Build the OMDb API URL using the query parameter
  // Use encodeURIComponent to safely encode the search query
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

  // Fetch data from the OMDb API
  const response = await fetch(url);

  // Convert the response to JSON format
  const data = await response.json();

  // Return the data to use later
  return data;
}

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

  // Fetch movies using the fetchMovies function
  const data = await fetchMovies(searchTerm);

  // Clear previous results
  movieResults.innerHTML = '';

  // Check if the API response contains the 'Search' property (movies found)
  if (data.Search) {
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
