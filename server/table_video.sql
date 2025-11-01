create table videos (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	description VARCHAR(1000),
	url VARCHAR(2048),
	thumbnail_url VARCHAR(2048),
	duration INT UNSIGNED,
	category VARCHAR(200),
	tags JSON,
	upload_date DATETIME NOT NULL,
	uploader_name VARCHAR(100),
	view_count INT UNSIGNED NOT NULL DEFAULT 0,
	file_size BIGINT UNSIGNED,
	resolution VARCHAR(20),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		ON UPDATE CURRENT_TIMESTAMP,
		
	INDEX idx_category (category),
	INDEX idx_title (title),
	INDEX idx_upload_date (upload_date),
	INDEX idx_uploader(uploader_name),
	INDEX idx_view_count (view_count),
	INDEX idx_category_upload (category, upload_date),
    INDEX idx_tags ((CAST(tags AS CHAR(100) ARRAY)))
)