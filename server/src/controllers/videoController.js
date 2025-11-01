const pool = require('../database/mysql');
const logger = require('../utils/logging');

/**
 * Get videos (no paging)
 * TODO: set up a path for paging
 * @param {*} req 
 * @param {*} res 
 */
exports.getVideos = async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM videos ORDER BY upload_date DESC');
        res.status(200).json({
            succes: true,
            data: {
                count: rows.length,
                videos: rows
            }
        })
    } catch (error) {
        logger.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to Fetch videos' });
    }
}

const SEARCH_QUERY_BASE = 'SELECT * FROM videos';
const SEARCH_QUERY_ORDER = ' ORDER BY upload_date DESC';

exports.searchVideos = async (req, res) => {
    const {title, description, tags, uploader, category, match} = req.query;

    const conditions = [];
    const params = [];
    
    if (title) {
        conditions.push('title LIKE ?');
        params.push(`%${title}%`);
    }
    
    if (description) {
        conditions.push('description LIKE ?');
        params.push(`%${description}%`);
    }
    
    if (uploader) {
        conditions.push('uploader_name LIKE ?');
        params.push(`%${uploader}%`);
    }
    
    if (category) {
        conditions.push('category LIKE ?');
        params.push(`%${category}%`);
    }
    
    if (tags) {
        conditions.push('JSON_CONTAINS(tags, ?)');
        params.push(JSON.stringify(tags));
    }

    try {
        let query = SEARCH_QUERY_BASE;
        if (conditions.length > 0) {
            const logicOperator = match == 'any' ? ' OR ' : ' AND ';
            query += " WHERE " + conditions.join(logicOperator);
        } 
        query += SEARCH_QUERY_ORDER;

        const [rows] = await pool.execute(query, params);
        res.status(200).json({
            succes: true,
            data: {
                count: rows.length,
                videos: rows
            }
        });
    } catch (error) {
        logger.error('Error searching videos:', error);
        res.status(500).json({ error: 'Unable to search videos' });
    }
}

/**
 * Add a new video to the database
 * @param {*} req 
 * @param {*} res 
 */
exports.createVideo = async(req, res) => {
    // TODO: validate these fields
    const {
        title,
        description,
        url,
        thumbnail_url,
        duration,
        category,
        tags,
        uploader_name,
        file_size,
        resolution
    } = req.body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO videos 
            (title, description, url, thumbnail_url, duration, category, tags, 
                upload_date, uploader_name, file_size, resolution) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
            [title, description, url, thumbnail_url, duration, category, 
            JSON.stringify(tags), uploader_name, file_size, resolution]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Video created successfully'
        })
    } catch (error) {
        logger.error('Error creating video: ', error);
        res.status(500).json({ error: 'Failed to create video '});
    }
}
