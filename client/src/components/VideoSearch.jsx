const VideoSearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div id="video-search">
            <div class='input-group'>
                <label for="video-search-input">Search Videos</label>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search term..."
                    type="text"
                    id="video-search-input"
                    size="100"
                />
            </div>
        </div>
    )
}

export default VideoSearch;