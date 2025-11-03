
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import './VideoList.scss';

const VideoList = ({ searchResults, handleDelete }) => {
    return (
        <div id="video-list">
            <TableContainer component={Paper}>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{width: "50px", maxWidth: '50px'}}></TableCell>
            <TableCell align="left" sx={{width: "200px", maxWidth: '250px'}}>Title</TableCell>
            <TableCell align="left">Url</TableCell>
            <TableCell align="left">Thumbnail Url</TableCell>
            <TableCell align="left">Duration</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="left">Upload Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(searchResults?.videos || []).map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left">
                    <div  style={{ display: 'flex' }}>
                        <Link to={`/form/${row.id}`}
                            aria-label="Edit Video"
                            title="Edit Video"
                        >
                            <EditOutlinedIcon className='edit-icon'/>
                        </Link>
                        <CloseOutlinedIcon
                            className='delete-icon'
                            aria-label="Delete Video"
                            title="Delete Video"
                            onClick={() => handleDelete(row.id)}
                        />
                    </div>
                </TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">{row.url}</TableCell>
                <TableCell align="left">{row.thumbnail_url}</TableCell>
                <TableCell align="left">{row.duration}</TableCell>
                <TableCell align="left">{row.category}</TableCell>
                <TableCell align="left">{row.upload_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    )
}

export default VideoList;

/*

"searchResults": {
        "count": 4,
        "videos": [
            {
                "id": 4,
                "title": "Building a Raised Garden Bed from Scratch",
                "description": "Complete tutorial on constructing a durable raised garden bed using cedar planks. Includes materials list, cutting measurements, assembly instructions, and soil filling tips. Perfect weekend project for beginners!",
                "url": "https://cdn.example.com/videos/raised-garden-bed-diy.mp4",
                "thumbnail_url": "https://cdn.example.com/thumbs/raised-garden-bed-diy.jpg",
                "duration": 895,
                "category": "DIY",
                "tags": [
                    "diy",
                    "gardening",
                    "woodworking",
                    "home-improvement",
                    "outdoor",
                    "tutorial"
                ],
                "upload_date": "2025-11-01T22:45:08.000Z",
                "uploader_name": "DIY Dan",
                "view_count": 0,
                "file_size": 456392704,
                "resolution": "1920x1080",
                "created_at": "2025-11-01T22:45:08.000Z",
                "updated_at": "2025-11-01T22:45:08.000Z"
            },
            {
                "id": 3,
                "title": "Exploring Hidden Gems of Kyoto, Japan",
                "description": "Join me as I discover the lesser-known temples, traditional tea houses, and serene bamboo forests of Kyoto. Away from the tourist crowds, experience authentic Japanese culture and breathtaking scenery.",
                "url": "https://cdn.example.com/videos/kyoto-travel-vlog.mp4",
                "thumbnail_url": "https://cdn.example.com/thumbs/kyoto-travel-vlog.jpg",
                "duration": 1245,
                "category": "Travel",
                "tags": [
                    "travel",
                    "japan",
                    "kyoto",
                    "vlog",
                    "culture",
                    "adventure",
                    "temples"
                ],
                "upload_date": "2025-11-01T22:44:57.000Z",
                "uploader_name": "Wanderlust Adventures",
                "view_count": 0,
                "file_size": 672137216,
                "resolution": "3840x2160",
                "created_at": "2025-11-01T22:44:57.000Z",
                "updated_at": "2025-11-01T22:44:57.000Z"
            },
            {
                "id": 2,
                "title": "30-Minute HIIT Workout for Fat Burning",
                "description": "High-intensity interval training session designed to boost metabolism and burn calories. No equipment needed - perfect for home workouts. Includes warm-up and cool-down stretches.",
                "url": "https://cdn.example.com/videos/hiit-workout-30min.mp4",
                "thumbnail_url": "https://cdn.example.com/thumbs/hiit-workout-30min.jpg",
                "duration": 1800,
                "category": "Fitness",
                "tags": [
                    "fitness",
                    "hiit",
                    "workout",
                    "cardio",
                    "home-workout",
                    "fat-burning"
                ],
                "upload_date": "2025-11-01T22:44:48.000Z",
                "uploader_name": "FitLife Coach Sarah",
                "view_count": 0,
                "file_size": 945815552,
                "resolution": "1920x1080",
                "created_at": "2025-11-01T22:44:48.000Z",
                "updated_at": "2025-11-01T22:44:48.000Z"
            },
            {
                "id": 1,
                "title": "How to Make Authentic Italian Carbonara",
                "description": "Master the classic Roman pasta dish with this step-by-step guide. Learn the secrets to creamy, perfectly emulsified carbonara using just eggs, pecorino, guanciale, and black pepper - no cream needed!",
                "url": "https://cdn.example.com/videos/italian-carbonara-recipe.mp4",
                "thumbnail_url": "https://cdn.example.com/thumbs/italian-carbonara-recipe.jpg",
                "duration": 720,
                "category": "Cooking",
                "tags": [
                    "cooking",
                    "italian",
                    "pasta",
                    "carbonara",
                    "recipe",
                    "dinner"
                ],
                "upload_date": "2025-11-01T22:44:19.000Z",
                "uploader_name": "Chef Maria Rossi",
                "view_count": 0,
                "file_size": 387973120,
                "resolution": "1920x1080",
                "created_at": "2025-11-01T22:44:19.000Z",
                "updated_at": "2025-11-01T22:44:19.000Z"
            }
        ]
    }

*/