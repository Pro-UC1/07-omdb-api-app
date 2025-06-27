// Get references to the form and results container
const searchForm = document.getElementById('search-form');
const movieResults = document.getElementById('movie-results');

// Get reference to the watchlist container in the HTML
const watchlistContainer = document.getElementById('watchlist');

// Load the watchlist from localStorage if it exists, or start with an empty array
let watchlist = [];
const savedWatchlist = localStorage.getItem('watchlist');
if (savedWatchlist) {
  // If there is a saved watchlist, use it
  watchlist = JSON.parse(savedWatchlist);
}

// Your OMDb API key (replace 'YOUR_API_KEY' with your actual key)
const API_KEY = '663b96d8'; // Example API key, replace with your own

// Function to save the watchlist to localStorage
function saveWatchlist() {
  // Convert the watchlist array to a string and save it
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// This function fetches movies from the OMDb API using a search query
const fetchMovies = async (query) => {
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

// Function to show the watchlist on the page
function renderWatchlist() {
  // If the watchlist is empty, show a message
  if (watchlist.length === 0) {
    watchlistContainer.innerHTML = 'Your watchlist is empty. Search for movies to add!';
    return;
  }

  // Otherwise, show the movies in the watchlist
  watchlistContainer.innerHTML = '';
  watchlist.forEach(movie => {
    // Create a card for each movie in the watchlist
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    // Use the movie's poster, or a placeholder if not available
    const poster = movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/250x350?text=No+Image';

    // Add the movie's poster, title, year, and a remove button to the card
    movieCard.innerHTML = `
      <img class="movie-poster" src="${poster}" alt="Poster of ${movie.Title}">
      <div class="movie-info">
        <div class="movie-title">${movie.Title}</div>
        <div class="movie-year">${movie.Year}</div>
      </div>
      <button class="remove-watchlist-btn">Remove</button>
    `;

    // Add the card to the watchlist section
    watchlistContainer.appendChild(movieCard);

    // Add event listener for the "Remove" button
    const removeBtn = movieCard.querySelector('.remove-watchlist-btn');
    removeBtn.addEventListener('click', function() {
      // Remove the movie from the watchlist array by imdbID
      watchlist = watchlist.filter(item => item.imdbID !== movie.imdbID);
      saveWatchlist(); // Save the updated watchlist
      renderWatchlist(); // Update the display
    });
  });
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
        <button class="add-watchlist-btn">Add to Watchlist</button>
      `;

      // 6. Add the movie card to the results container on the page
      movieResults.appendChild(movieCard);

      // 7. Add event listener for the "Add to Watchlist" button
      const addBtn = movieCard.querySelector('.add-watchlist-btn');
      addBtn.addEventListener('click', function() {
        // Check if the movie is already in the watchlist (by imdbID)
        const exists = watchlist.some(item => item.imdbID === movie.imdbID);
        if (!exists) {
          watchlist.push(movie);
          saveWatchlist(); // Save to localStorage
          renderWatchlist();
        }
      });
    });
  } else {
    // If no movies found, show a message
    movieResults.innerHTML = `<div class="no-results">No movies found. Try another search!</div>`;
  }
});

// When the user clicks "Add to Watchlist" on a movie card:
// - Check if the movie is already in the watchlist (no duplicates)
// - If not, add it to the watchlist array
// - Save the updated watchlist to localStorage
// - Show the updated watchlist on the page

// The watchlist is shown when the page loads
renderWatchlist();
