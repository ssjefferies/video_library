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
        res.status(500).json({ error: 'Unable to Fetch videos' });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getVideoById = async(req, res) => {
    const { id } = req.params;
    
    try {
        const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.status(200).json({
            succes: true,
            data: rows[0]
        });
    }
    catch (error) {
        logger.error('Error fetching video by ID:', error);
        res.status(500).json({ error: 'Unable to fetch video' });
    }
};

const SELECT_COUNT = 'SELECT COUNT(*) as total FROM videos';
const SEARCH_QUERY_BASE = 'SELECT * FROM videos';
const SEARCH_QUERY_ORDER = ' ORDER BY upload_date DESC';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.searchVideos = async (req, res) => {
    const {term, category} = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    // Validate required parameters
    /*
    if (!req.query.page || !req.query.limit) {
        return res.status(400).json({ 
            error: 'Missing required pagination parameters',
            message: 'Both "page" and "limit" query parameters are required',
            example: '/api/videos?page=1&limit=20'
        });
    }*/

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
        if (Array.isArray(category)) {
            // multiple categories
            const categoryFilters = [];
            category.forEach(cat => {
                categoryFilters.push('category LIKE ?');
                params.push(`%${cat}%`);
            });
            filters.push('(' + categoryFilters.join(' OR ') + ')');
        } else {
            // single category
            filters.push('category LIKE ?');
            params.push(`%${category}%`);
        }
    }
 
    // WHERE
    // (term1 OR term2 OR term 3)
    // AND
    // (filter1 AND filter2 AND filter3 AND)
    //

    try {
        // Get total count
        /*
        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM videos'
        );
        const total = countResult[0].total;
        */

        let query = '';

        if (searchTerms) {
            query += " WHERE " +  searchTerms;
        }
        if (filters.length > 0) {
            query += searchTerms ? ' AND ' : ' WHERE ';
            query += ' (' + filters.join(' AND ') + ') ';
        } 
        query += SEARCH_QUERY_ORDER;

        // Get total count with same filters
        let countQuery = SELECT_COUNT + query;
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        // paging
        const pageNum = Math.max(1, Math.min(parseInt(page, 10) || 1, 10000));
        const limitNum = Math.max(1, Math.min(parseInt(limit, 10) || 20, 100));
        const offset = (pageNum - 1) * limitNum;
        query += ` LIMIT ${limitNum} OFFSET ${offset}`;
        
        // Get paged results
        let searchQuery = SEARCH_QUERY_BASE + query;

        const [rows] = await pool.execute(searchQuery, params);
        res.status(200).json({
            succes: true,
            data: {
                videos: rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: offset + limit < total,
                    hasPrevPage: page > 1
                }
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
        res.status(500).json({ error: 'Unable to create video '});
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} fields 
 * @returns 
 */
exports.updateVideo = async(req, res) => {
    const { id } = req.params;
    const fields = req.body;
    
    try {
        const setClause = Object.keys(fields)
            .map(key => `${key} = ?`)
            .join(', ');
        const params = [...Object.values(fields), id];

        const query = `UPDATE videos SET ${setClause} WHERE id = ?`;

        const [result] = await pool.execute(query, params);
        res.status(201).json({
            id: result.insertId,
            message: 'Video updated successfully'
        })
    } catch (error) {
        logger.error('Error updating video: ', error);
        res.status(500).json({ error: 'Unable to update video '});
    }
};

exports.deleteVideo = async(req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM videos WHERE id = ?', [id]);
        res.status(200).json({
            message: 'Video deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting video: ', error);
        res.status(500).json({ error: 'Unable to delete video' });
    }
};
