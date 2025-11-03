import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoFilters from "./VideoFilters";
import VideoSearch from "./VideoSearch";
import VideoList from "./VideoList";
import './Videos.css';

const VIDEO_LIBRARY_API_URL = import.meta.env.VITE_VIDEO_LIBRARY_API_URL;

const Videos = ({ searchTerm, setSearchTerm }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState(null);
    const [errorMessage, setErroMessage] = useState(null);

    useEffect(() => {
        // if no search term, set search results to empty
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        // Debounce: wait 500ms after user stops typing
        const delaySearch = setTimeout(() => {
            fetchResults();
        }, 500)

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    // set the video saved message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }
            , 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const location = useLocation();
    useEffect(() => {
        // Check if redirected from form with success message
        if (location.state && location.state.message) {
            setMessage(location.state.message);
            // Clear the state to prevent message on further navigations
            window.history.replaceState({}, document.title)
        }
    }, [location]);

    const handleDelete = async (id) => {
        try {
            await fetch(`${VIDEO_LIBRARY_API_URL}/api/videos/${id}`, {
                method: 'DELETE',
            });
            // Refresh results after deletion
            fetchResults();
        } catch (error) {
            setErroMessage(error.message);
        }
    }

    const fetchResults = async () => {
        try {
            const response = await fetch(
                `${VIDEO_LIBRARY_API_URL}/api/videos/search?term=${searchTerm}`
            )
            const results = await response.json();
            setSearchResults(results?.data || []);
        } catch (error) {
            setErroMessage(error.message);
            setSearchResults([]);
        }
    }

    return (
        <div id="video-main">
            <VideoFilters />
            <div id="search-body">
                {message && <div className="success-message">{message}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <VideoSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <VideoList
                    searchResults={searchResults}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    )
}

export default Videos;