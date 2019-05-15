require('dotenv').config();

module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-blog',
      options: {
        path: '/',
        adapters: [
          { resolve: 'gatsby-adapter-blog-mdx' },
          {
            resolve: 'gatsby-adapter-blog-json',
            options: {
              pathToPosts: 'data',
            },
          },
        ],
      },
    },
  ],
};
