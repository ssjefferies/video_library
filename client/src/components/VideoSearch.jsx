const VideoSearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div id="video-search">
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos..."
                type="text"
                id="video-search-input"
                size="100"
            /> Search Videos
        </div>
    )
}

export default VideoSearch;