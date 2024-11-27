SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = %L 
        GROUP BY articles.article_id
        