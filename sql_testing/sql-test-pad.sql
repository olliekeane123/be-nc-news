SELECT users.avatar_url, articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
                   CAST(COUNT(comments.article_id) AS INT) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            LEFT JOIN users ON articles.author = users.username
            GROUP BY articles.article_id, users.avatar_url
        