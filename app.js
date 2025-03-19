angular.module('movieApp', [])
    .controller('MovieController', function($http) {
        const ctrl = this;

        ctrl.movies = [];
        ctrl.genres = [];
        ctrl.favorites = [];
        ctrl.searchQuery = '';
        ctrl.selectedGenre = '';
        ctrl.currentPage = 1;
        ctrl.totalPages = 0;
        ctrl.loading = false;
        ctrl.errorMessage = '';
        ctrl.selectedMovie = {};
        ctrl.userLoggedIn = false;
        ctrl.username = '';
        ctrl.password = '';
        ctrl.authError = '';
        ctrl.newReview = '';
        ctrl.sortBy = 'title'; // Default sorting
        ctrl.actorDetails = {};
        ctrl.directorDetails = {};

        // User authentication
        ctrl.login = function() {
            if (ctrl.username && ctrl.password) {
                ctrl.userLoggedIn = true;
                ctrl.authError = '';
                ctrl.fetchMovies();
            } else {
                ctrl.authError = 'Please enter username and password.';
            }
        };

        ctrl.logout = function() {
            ctrl.userLoggedIn = false;
            ctrl.movies = [];
            ctrl.favorites = [];
            ctrl.searchQuery = '';
            ctrl.selectedGenre = '';
            ctrl.currentPage = 1;
        };

        // Fetch movies from API
        ctrl.fetchMovies = function() {
            ctrl.loading = true;
            ctrl.errorMessage = '';
            const apiKey = 'd29e9032'; // Replace with your OMDB API key
            const url = `https://www.omdbapi.com/?s=${ctrl.searchQuery}&page=${ctrl.currentPage}&apikey=${apiKey}`;
        
            $http.get(url)
                .then(function(response) {
                    if (response.data.Response === 'True') {
                        ctrl.movies = response.data.Search.map(movie => {
                            return {
                                ...movie,
                                imdbID: movie.imdbID // Ensure imdbID is properly set
                            };
                        });
                        ctrl.totalResults = response.data.totalResults;
                        ctrl.totalPages = Math.ceil(ctrl.totalResults / 10);
                    } else {
                        ctrl.errorMessage = response.data.Error;
                    }
                })
                .catch(function() {
                    ctrl.errorMessage = 'Error fetching data from API.';
                })
                .finally(function() {
                    ctrl.loading = false;
                });
        };
        

        // Search movies
        ctrl.searchMovies = function() {
            ctrl.currentPage = 1;
            ctrl.fetchMovies();
        };

        // Clear search
        ctrl.clearSearch = function() {
            ctrl.searchQuery = '';
            ctrl.selectedGenre = '';
            ctrl.currentPage = 1;
            ctrl.fetchMovies();
        };

        // Toggle favorite
        ctrl.toggleFavorite = function(movie) {
            const index = ctrl.favorites.findIndex(fav => fav.imdbID === movie.imdbID);
            if (index === -1) {
                ctrl.favorites.push(movie);
            } else {
                ctrl.favorites.splice(index, 1);
            }
        };

        // Check if a movie is favorite
        ctrl.isFavorite = function(movie) {
            return ctrl.favorites.some(fav => fav.imdbID === movie.imdbID);
        };

        // Get movie details
        ctrl.getMovieDetails = function(imdbID) {
            const apiKey = 'd29e9032'; // Replace with your OMDB API key
            const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
            $http.get(url)
                .then(function(response) {
                    console.log('API Response:', response.data); // Log the response
                    if (response.data.Response === 'True') {
                        ctrl.selectedMovie = response.data;
                        $('#movieDetailsModal').modal('show');
                    } else {
                        alert('Error: ' + response.data.Error); // Display error message
                    }
                })
                .catch(function() {
                    ctrl.errorMessage = 'Error fetching data from API.';
                });
        };
        

        // Add review
        ctrl.addReview = function(movie) {
            ctrl.selectedMovie = movie;
            $('#movieDetailsModal').modal('show');
        };

        // Submit review
        ctrl.submitReview = function() {
            if (ctrl.newReview) {
                ctrl.selectedMovie.reviews.push(ctrl.newReview);
                ctrl.newReview = '';
            }
        };

        // Get Director details
        ctrl.getDirectorDetails = function(director) {
            ctrl.directorDetails = { name: director, movies: [] };
            // Optionally, fetch director movies here
            alert('Director: ' + director);
        };

        // Get Actor details
        ctrl.getActorDetails = function(actors) {
            const actorList = actors.split(', ');
            ctrl.actorDetails = actorList.map(actor => ({ name: actor, movies: [] }));
            // Optionally, fetch actor movies here
            alert('Actors: ' + actors);
        };

        // Sort movies
        ctrl.sortMovies = function() {
            if (ctrl.sortBy === 'title') {
                ctrl.movies.sort((a, b) => a.Title.localeCompare(b.Title));
            } else if (ctrl.sortBy === 'year') {
                ctrl.movies.sort((a, b) => b.Year - a.Year);
            } else if (ctrl.sortBy === 'rating') {
                ctrl.movies.sort((a, b) => b.imdbRating - a.imdbRating);
            }
        };

        // Change page
        ctrl.changePage = function(page) {
            ctrl.currentPage = page;
            ctrl.fetchMovies();
        };

        // Share movie
        ctrl.shareMovie = function(movie) {
            const shareUrl = `https://www.imdb.com/title/${movie.imdbID}/`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Movie link copied to clipboard!');
            });
        };

        // Initialize genres (could also fetch dynamically)
        ctrl.genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
    });
