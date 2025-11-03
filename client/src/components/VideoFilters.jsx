import { useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import './VideoFilters.css';

const VideoFilters = ({ categories, setCategories }) => {
    
    // when any checkbox is changed
    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // add category to filters
            setCategories([...categories, value]);
        } else {
            // remove category from filters
            setCategories(categories.filter(cat => cat !== value));
        }
    }

    return (
        <div id="video-filters">
            
            <h3>Filters</h3>

            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Categories</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox value="Cooking" onChange={handleCategoryChange} />}
                        label="Cooking" 
                    />
                    <FormControlLabel
                        control={<Checkbox value="DIY" onChange={handleCategoryChange} />}
                        label="DIY"
                    />
                    <FormControlLabel
                        control={<Checkbox value="Education" onChange={handleCategoryChange} />}
                        value="Education"
                        label="Education"
                    />
                    <FormControlLabel
                        control={<Checkbox value="Entertainment" onChange={handleCategoryChange} />}
                        label="Entertainment"
                    />
                    <FormControlLabel
                        control={<Checkbox value="Fitness" onChange={handleCategoryChange} />}
                        label="Fitness"
                    />
                    <FormControlLabel
                        control={<Checkbox value="Travel" onChange={handleCategoryChange} />}
                        label="Travel"
                    />
                </FormGroup>
            </FormControl>
        </div>
    )
}

export default VideoFilters;