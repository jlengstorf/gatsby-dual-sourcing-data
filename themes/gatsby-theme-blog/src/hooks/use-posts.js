import { graphql, useStaticQuery } from 'gatsby';

const usePosts = () => {
  const data = useStaticQuery(graphql`
    query {
      allPost {
        nodes {
          id
          title
          slug
          date
          content
          sourceType
        }
      }
    }
  `);

  return data.allPost.nodes;
};

export default usePosts;
