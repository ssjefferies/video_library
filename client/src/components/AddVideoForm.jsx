import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './AddVideoForm.scss';

// make the submit button right-aligned and styled nicely
const AddVideoForm = () => {
    const { id: videoId } = useParams();
    const title = videoId ? 'Edit Video' : 'New Video';

    const [titleInput, setTitleInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');
    const [durationInput, setDurationInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [uploaderNameInput, setUploaderNameInput] = useState('');
    const [fileSizeInput, setFileSizeInput] = useState('');
    const [resolutionInput, setResolutionInput] = useState('');

    // error handling state
    const [errorMessage, setErrorMessage] = useState(null);
    // error state to contain a message for each field that has an error
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        // if editing an existing video, fetch its data
        if (videoId) {
            fetch(`${import.meta.env.VITE_VIDEO_LIBRARY_API_URL}/api/videos/${videoId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const video = data.data;
                setTitleInput(video.title || '');
                setDescriptionInput(video.description || '');
                setUrlInput(video.url || '');
                setThumbnailUrlInput(video.thumbnail_url || '');
                setDurationInput(video.duration || '');
                setCategoryInput(video.category || '');
                setTagsInput((video.tags || []).join(', '));
                setUploaderNameInput(video.uploader_name || '');
                setFileSizeInput(video.file_size || '');
                setResolutionInput(video.resolution || '');
            })
            .catch((error) => {
                console.error('Error fetching video data:', error);
                setErrorMessage('Error fetching video data. Please try again.');
            });
        }
    }, [videoId]);


    const handleSubmit = (e) => {
        e.preventDefault();
        // the title is required
        if (!titleInput.trim()) {
            // set error message
            setFieldErrors({ title: 'Title is required' });
            // show general error message for this
            setErrorMessage('Please fix the errors in the form before submitting.');
            return;
        }
        // construct video object
        const videoData = {
            title: titleInput,
            description: descriptionInput,
            url: urlInput,
            thumbnail_url: thumbnailUrlInput,
            duration: Number(durationInput),
            category: categoryInput,
            tags: tagsInput.split(',').map(tag => tag.trim()),
            uploader_name: uploaderNameInput,
            file_size: Number(fileSizeInput),
            resolution: resolutionInput,
        };
        console.log('Submitting video data:', videoData);

        // post to api/videos
        const method = videoId ? 'PUT' : 'POST';
        const url = videoId ?
            `${import.meta.env.VITE_VIDEO_LIBRARY_API_URL}/api/videos/${videoId}` :
            `${import.meta.env.VITE_VIDEO_LIBRARY_API_URL}/api/videos`;

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(videoData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Video added successfully:', data);
            // clear form
            setTitleInput('');
            setDescriptionInput('');
            setUrlInput('');
            setThumbnailUrlInput('');
            setDurationInput('');
            setCategoryInput('');
            setTagsInput('');
            setUploaderNameInput('');
            setFileSizeInput('');
            setResolutionInput('');
            // return to video list
            alert('Video added successfully!');
            window.location.href = '/';
        })
        .catch((error) => {
            console.error('Error adding video:', error);
            alert('Error adding video. Please try again.');
        });
    }

    const handleInputChange = (e, setter, maxLength) => {
        // enforce max length
        if (e.target.value.length > maxLength) {
            return;
        }
        // duration and file size should only accept numbers
        if (e.target.name === 'duration' || e.target.name === 'file-size') {
            const value = e.target.value;
            if (isNaN(value)) {
                return; // ignore non-numeric input
            }
        }
        setter(e.target.value);
    }

    return (
        <div id='video-form'>
            <header className="page-header">
                <h2>{title}</h2>
                <div className='page-description'>Please fill out the form below to {videoId ? 'edit' : 'add'} a video.</div>
            </header>

            {errorMessage && (
                <div className='error-message form-error'>
                    {errorMessage}
                </div>
            )}

            <form>
                <div className='input-group'>
                    <label for='title'>Title</label>
                    <input
                        value={titleInput}
                        onChange={(e) => handleInputChange(e, setTitleInput, 200)}
                        className={fieldErrors.title ? 'input-error' : ''}
                        type='text' id='title' name='title' placeholder='Title...' />
                    {fieldErrors.title && (
                        <span className='error-message'>{fieldErrors.title}</span>
                    )}
                </div>

                <div className='input-group'>
                    <label for='description'>Description</label>
                    <textarea
                        value={descriptionInput}
                        onChange={(e) => handleInputChange(e, setDescriptionInput, 1000)}
                        id='description' name='description' placeholder='Description...'></textarea>
                </div>

                <div className='input-group'>
                    <label for='url'>URL</label>
                    <input
                        value={urlInput}
                        onChange={(e) => handleInputChange(e, setUrlInput, 2048)}
                        type='url' id='url' name='url' placeholder='URL...' />
                </div>

                <div className='input-group'>
                    <label for='thumbnail-url'>URL</label>
                    <input
                        value={thumbnailUrlInput}
                        onChange={(e) => handleInputChange(e, setThumbnailUrlInput, 2048)}
                        type='url' id='thumbnail-url' name='thumbnail-url' placeholder='Thumbnail URL...' />
                </div>

                <div className='input-group'>
                    <label for="duration">Duration (in seconds)</label>
                    <input
                        value={durationInput}
                        onChange={(e) => handleInputChange(e, setDurationInput, 10)}
                        type='number' id='duration' name='duration' placeholder='Duration...' />
                </div>

                <div className='input-group'>
                    <label for='category'>Category</label>
                    <input
                        value={categoryInput}
                        onChange={(e) => handleInputChange(e, setCategoryInput, 200)}
                        type='text' id='category' name='category' placeholder='Category...' />
                </div>

                <div className='input-group'>
                    <label for='tags'>Tags (comma separated)</label>
                    <input
                        value={tagsInput}
                        onChange={(e) => handleInputChange(e, setTagsInput, 500)}
                        type='text' id='tags' name='tags' placeholder='Tags...' />
                </div>

                <div className='input-group'>
                    <label for='uploader-name'>Uploader Name</label>
                    <input
                        value={uploaderNameInput}
                        onChange={(e) => handleInputChange(e, setUploaderNameInput, 100)}
                        type='text' id='uploader-name' name='uploader-name' placeholder='Uploader Name...' />
                </div>

                <div className='input-group'>
                    <label for='file-size'>File Size (in bytes)</label>
                    <input
                        value={fileSizeInput}
                        onChange={(e) => handleInputChange(e, setFileSizeInput, 20)}
                        type='number' id='file-size' name='file-size' placeholder='File Size...' />
                </div>

                <div className='input-group'>
                    <label for='resolution'>Resolution (e.g., 1920x1080)</label>
                    <input
                        value={resolutionInput}
                        onChange={(e) => handleInputChange(e, setResolutionInput, 20)}
                        type='text' id='resolution' name='resolution' placeholder='Resolution...' />
                </div>

                <section className='form-footer'>
                    <button
                        onClick={handleSubmit}
                        type='submit' className='submit-button'>{videoId ? 'Update Video' : 'Add Video'}</button>
                </section>
            </form>
        </div>
    )
}

export default AddVideoForm;
