import { useState } from "react";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

// convert seconds to minutes
const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

const VideoThumbnail = ({ video }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    // add duration as an overlay on the thumbnail
    return (
        <div className="video-thumbnail">
            <div className="thumbnail-image-container">
                {imageError ? (
                    <div className="thumbnail-placeholder"
                        title={video.title}
                    >
                        <OndemandVideoIcon />
                    </div>
                ) : (
                    <img 
                        src={video.thumbnail_url} 
                        alt={video.title} 
                        onError={handleImageError}
                    />
                )}
            </div>
            <div className="duration-overlay">
                {formatDuration(video.duration)}
            </div>
        </div>
    );
};

export default VideoThumbnail;