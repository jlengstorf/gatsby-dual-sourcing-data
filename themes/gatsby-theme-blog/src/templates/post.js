import React from 'react';
import { graphql, Link } from 'gatsby';

export const query = graphql`
  query($slug: String) {
    post(slug: { eq: $slug }) {
      id
      title
      slug
      content
      date
      sourceType
    }
  }
`;

const Post = ({ data: { post } }) => (
  <div style={{ maxWidth: '90vw', width: 550, margin: '3rem auto' }}>
    <h1>{post.title}</h1>
    <pre>{JSON.stringify(post, null, 2)}</pre>
    <Link to="/">&larr; back to home</Link>
  </div>
);

export default Post;
