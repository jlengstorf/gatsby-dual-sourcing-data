module.exports = options => ({
  plugins: [
    {
      resolve: 'gatsby-mdx',
      options: {
        defaultLayout: require.resolve('./src/templates/post.js'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts-mdx',
        path: options.pathToPosts || 'posts',
      },
    },
  ],
});
