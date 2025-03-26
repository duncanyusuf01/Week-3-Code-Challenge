document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("movie-list");
    const movieTitle = document.getElementById("movie-title");
    const movieDescription = document.getElementById("movie-description");
    const moviePoster = document.getElementById("movie-poster");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieShowtime = document.getElementById("movie-showtime");
    const ticketsLeft = document.getElementById("tickets-left");
    const buyTicketBtn = document.getElementById("buy-ticket");

    let selectedMovie = null; // Store selected movie

    // Fetch movies from JSON server
    fetch("http://localhost:3000/movies")
        .then(response => response.json())
        .then(movies => {
            movieList.innerHTML = ""; // Clear previous content
            movies.forEach(movie => {
                const listItem = document.createElement("li");
                listItem.textContent = movie.title;
                listItem.addEventListener("click", () => displayMovieDetails(movie));
                movieList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching movies:", error));

    //displaying a movie
    function displayMovie(movie) {
    function displayMovieDetails(movie) {
        selectedMovie = movie; // Store the selected movie
        movieTitle.textContent = movie.title;
        movieDescription.textContent = movie.description;
        moviePoster.src = movie.poster;
        movieRuntime.textContent = `Runtime: ${movie.runtime} minutes`;
        movieShowtime.textContent = `Showtime: ${movie.showtime}`;
        ticketsLeft.textContent = `Tickets Left: ${movie.tickets}`;

        // Disable button if tickets are sold out
        buyTicketBtn.disabled = movie.tickets === 0;
    }

    document.getElementById("buy-ticket").addEventListener("click", buyTicket);
//buying tickets
        function buyTicket() {
            let movie = movies.find(m => m.title === document.getElementById("movie-title").textContent);
        
            if (movie && movie.tickets > 0) {
                movie.tickets--;
                document.getElementById("tickets-left").textContent = `${movie.tickets} remaining tickets`;
        
                if (movie.tickets === 0) {
                    document.getElementById("buy-ticket").textContent = "Sold Out";
                    document.getElementById("buy-ticket").disabled = true;
                }
            }
        }
        

    buyTicketBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (!selectedMovie || selectedMovie.tickets === 0) return;

        // Decrease ticket count
        selectedMovie.tickets--;

        // Update UI
        ticketsLeft.textContent = `Tickets Left: ${selectedMovie.tickets}`;
        buyTicketBtn.disabled = selectedMovie.tickets === 0;

        // Send update to JSON server
        fetch(`http://localhost:3000/movies/${selectedMovie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets: selectedMovie.tickets })
        })
        .then(response => response.json())
        .then(updatedMovie => console.log("Updated Movie:", updatedMovie))
        .catch(error => console.error("Error updating ticket count:", error));
    });
}});
