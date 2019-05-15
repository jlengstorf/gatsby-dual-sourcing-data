module.exports = options => ({
  plugins: [
    {
      resolve: 'gatsby-transformer-json',
      options: {
        typeName: 'PostsJson',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts-json',
        path: options.pathToPosts || 'posts',
      },
    },
  ],
});
