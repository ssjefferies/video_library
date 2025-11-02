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
    const {term, category} = req.query;

    let searchTerms = '';
    const filters = [];
    const params = [];

    /**
     * General search term. Use this to search across
     * title, description, tags, and uploader.
     * Match these on 'any' ('OR')
     */
    if (term) {
        searchTerms = ` (title LIKE ? OR description LIKE ? OR uploader_name LIKE ? OR (JSON_SEARCH(tags, 'one', ?, NULL, '$[*]') IS NOT NULL)) `;
        params.push(`%${term}%`);
        params.push(`%${term}%`);
        params.push(`%${term}%`);
        params.push(`%${term}%`);
    }
    
    /**
     * The following fields are filters, so match on ALL ('AND')
     * title, description, tags, uploader, category, match
     */
    if (category) {
        filters.push('category LIKE ?');
        params.push(`%${category}%`);
    }
 
    // WHERE
    // (term1 OR term2 OR term 3)
    // AND
    // (filter1 AND filter2 AND filter3 AND)
    //

    try {
        let query = SEARCH_QUERY_BASE;

        if (searchTerms) {
            query += " WHERE " +  searchTerms;
        }
        if (filters.length > 0) {
            query += searchTerms ? ' AND ' : ' WHERE ';
            //const logicOperator = match == 'any' ? ' OR ' : ' AND ';
            query += ' (' + filters.join(' AND ') + ') ';
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
