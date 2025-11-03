import VideoThumbnail from "./VideoThumbnail";
import { Link } from "react-router-dom";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import './videoGrid.scss';

const VideoCard = ({ video, handleDelete }) => {
    // convert seconds to minutes
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    return (
        <div className="video-card">
            <VideoThumbnail video={video} />
            <div className="video-info">
                <h4 className="video-title">{video.title}</h4>
                <p className="video-category">{video.category}</p>
                <p className="video-description">{video.description}</p>
                <p className="video-upload-date">Uploaded on: {new Date(video.upload_date).toLocaleDateString()}
                    &nbsp;by&nbsp;
                    <span className="uploader-name">{video.uploader_name}</span>
                </p>
                <p className="video-duration">Duration: {formatDuration(video.duration)}</p>
                <p className="video-tags">Tags: {(video.tags || []).join(', ')}</p>
                <p className="video-resolution">Resolution: {video.resolution}</p>
                <p className="video-file-size">File Size: {video.file_size} MB</p>
                <section className='form-footer'>
                    <button>
                        <Link to={`/form/${video.id}`}
                            aria-label="Edit Video"
                            title="Edit Video"
                        >
                            <EditOutlinedIcon className='edit-icon'/>
                            Edit
                        </Link>
                    </button>
                    <button
                        className="delete-button"
                        onClick={() => handleDelete(video.id)}
                    >
                        <CloseOutlinedIcon
                            className='delete-icon'
                            aria-label="Delete Video"
                            title="Delete Video"
                            onClick={() => handleDelete(video.id)}
                        />
                        Delete
                    </button>
                </section>
            </div>
        </div>
    );
};

const VideoGrid = ({
    searchResults,
    handleDelete,
    handleNextPage,
    hasNextPage,
    limit
}) => {
    // Component implementation
    return (
        <div className='video-grid'>
            {(searchResults?.videos || []).map((video) => (
                <VideoCard 
                    key={video.id} 
                    video={video} 
                    handleDelete={handleDelete} 
                />
            ))}
            {hasNextPage && (
                <div className="load-more-container">
                    <button 
                        className="load-more-button" 
                        onClick={handleNextPage}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    )
};

export default VideoGrid;