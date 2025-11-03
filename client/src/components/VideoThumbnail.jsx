import { useState } from "react";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const VideoThumbnail = ({ video }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="video-thumbnail">
            {imageError ? (
                <div className="thumbnail-placeholder">
                    <OndemandVideoIcon style={{ fontSize: 50 }} />
                </div>
            ) : (
                <img 
                    src={video.thumbnail_url} 
                    alt={video.title} 
                    onError={handleImageError} 
                />
            )}
        </div>
    );
};

export default VideoThumbnail;