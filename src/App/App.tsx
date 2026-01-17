import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../components/SearchBar/SearchBar';
import './App.css';
import MovieGrid from '../components/MovieGrid/MovieGrid';
import fetchMovies from '../services/movieService';
import { useState } from 'react';
import type { Movie } from '../types/movie';
import Loader from '../components/Loader/Loader';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import MovieModal from '../components/MovieModal/MovieModal';

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isLoader, setIsLoader] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSearch = async (query: string) => {
        try {
            setIsError(false);
            setIsLoader(true);
            setMovies([]);
            setSelectedMovie(null);
            const newMovies = await fetchMovies(query);
            setMovies(newMovies);
            if (newMovies.length === 0)
                toast.error('No movies found for your request.');
        } catch {
            setIsError(true);
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <SearchBar onSubmit={handleSearch} />
            {movies.length > 0 && (
                <MovieGrid
                    onSelect={movie => {
                        setSelectedMovie(movie);
                    }}
                    movies={movies}
                />
            )}
            {isLoader && <Loader />}
            {isError && <ErrorMessage />}
            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </>
    );
}

export default App;
