import React from 'react';
import { Link } from 'gatsby';
import usePosts from '../hooks/use-posts';

const pathJoin = (parts, separator = '/') => {
  const replace = new RegExp(separator + '{1,}', 'g');
  return parts.join(separator).replace(replace, separator);
};

const AllPosts = ({ pageContext }) => {
  const posts = usePosts();

  return (
    <div style={{ maxWidth: '90vw', width: 550, margin: '3rem auto' }}>
      <h1>A list of posts from different data sources</h1>
      {posts.map(post => {
        const path = pathJoin([pageContext.postSlugRoot, post.slug]);

        return (
          <article key={post.id}>
            <h2>
              <Link to={path}>{post.title}</Link>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <p>
              <Link to={path}>Read this post &rarr;</Link>
            </p>
          </article>
        );
      })}
    </div>
  );
};

export default AllPosts;
