import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoFilters from "./VideoFilters";
import VideoSearch from "./VideoSearch";
import VideoList from "./VideoList";
import VideoGrid from "./VideoGrid";
import './Videos.css';

const VIDEO_LIBRARY_API_URL = import.meta.env.VITE_VIDEO_LIBRARY_API_URL;

const Videos = ({ 
    searchTerm, setSearchTerm,
    categories, setCategories,
    page, setPage,
    hasNextPage, setHasNextPage,
    limit,
    viewMode, setViewMode
}) => {
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState(null);
    const [errorMessage, setErroMessage] = useState(null);

    useEffect(() => {
        setPage(1); // reset to page 1 on new search
        // if no search term, set search results to empty
        if (!searchTerm.trim() && (!categories || categories.length === 0)) {
            setSearchResults([]);
            return;
        }

        // Debounce: wait 500ms after user stops typing
        const delaySearch = setTimeout(() => {
            fetchResults(true);
        }, 300)

        return () => clearTimeout(delaySearch);
    }, [searchTerm, categories]);

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
        if (location.state) {
            if (location.state.message) {
                setMessage(location.state.message);
                // Clear the state to prevent message on further navigations
            }
            if (location.state.errorMessage) {
                setErroMessage(location.state.errorMessage);
            }
            window.history.replaceState({}, document.title)
        }
    }, [location]);

    // fetch results when the page changes
    useEffect(() => {
        if (!searchTerm.trim() && (!categories || categories.length === 0)) {
            setSearchResults([]);
            return;
        }
        // Only fetch if page > 1 (page 1 is handled by the above useEffect)
        if (page > 1) {
            fetchResults(); // append results
        }
    }, [page]);

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

    // fetch next set of results and add them to the existing results
    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    }

    const fetchResults = async (clear) => {
        let params = searchTerm ? `term=${encodeURIComponent(searchTerm)}` : '';
        const categoryParams = categories.length > 0 ? `category=${categories.map(encodeURIComponent).join('&category=')}` : '';
        if (params && categoryParams) {
            params += `&${categoryParams}`;
        } else if (categoryParams) {
            params += categoryParams;
        }

        // add pagination params
        params += `${params ? '&' : ''}page=${clear ? 1 : page}&limit=${limit}`;
    
        try {
            const response = await fetch(
                `${VIDEO_LIBRARY_API_URL}/api/videos/search?${params}`
            )
            const results = await response.json();
            if (results?.data?.pagination) {
                setHasNextPage(results.data.pagination.hasNextPage);
            }

            if (clear || page === 1) {
                setSearchResults(results?.data || []);
            } else {
                setSearchResults(prevResults => ({
                    ...results.data,
                    videos: [...(prevResults.videos || []), ...(results.data.videos || [])]
                }));
            }
            
        } catch (error) {
            setErroMessage(error.message);
            setSearchResults([]);
        }
    }

    return (
        <div id="video-main">
            <VideoFilters
                categories={categories}
                setCategories={setCategories}
            />
            <div id="search-body">
                {message && <div className="success-message">{message}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <VideoSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <div className='view-modes'>
                    <button
                        className={viewMode === 'grid' ? 'active' : ''}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid View
                    </button>
                    <button
                        className={viewMode === 'list' ? 'active' : ''}
                        onClick={() => setViewMode('list')}
                    >
                        List View
                    </button>
                </div>
                {
                    viewMode === 'grid' ?
                        <VideoGrid
                            searchResults={searchResults}
                            handleDelete={handleDelete}
                            limit={limit}
                            handleNextPage={handleNextPage}
                            hasNextPage={hasNextPage}
                        /> : 
                        <VideoList
                            searchResults={searchResults}
                            handleDelete={handleDelete}
                            limit={limit}
                            handleNextPage={handleNextPage}
                            hasNextPage={hasNextPage}
                        />
                }
                
                
            </div>
        </div>
    )
}

export default Videos;