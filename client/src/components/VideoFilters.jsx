import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import './VideoFilters.css';

const VideoFilters = () => {
    return (
        <div id="video-filters">
            
            <h3>Filters</h3>

            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Categories</FormLabel>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Cooking" />
                    <FormControlLabel control={<Checkbox />} label="DIY" />
                    <FormControlLabel control={<Checkbox />} label="Fitness" />
                    <FormControlLabel control={<Checkbox />} label="Travel" />
                </FormGroup>
            </FormControl>
        </div>
    )
}

export default VideoFilters;