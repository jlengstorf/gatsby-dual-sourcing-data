const path = require('path');

exports.createPages = async ({ graphql, actions, reporter }, options) => {
  const postSlugRoot = options.path || '';
  const result = await graphql(`
    query {
      allPost {
        nodes {
          slug
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic('error building posts', result.errors);
  }

  result.data.allPost.nodes.map(post => {
    actions.createPage({
      path: path.join(postSlugRoot, post.slug),
      component: require.resolve('./src/templates/post.js'),
      context: {
        slug: post.slug,
      },
    });
  });

  // Create the post previews page.
  actions.createPage({
    path: postSlugRoot,
    component: require.resolve('./src/templates/all-posts.js'),
    context: {
      postSlugRoot,
    },
  });
};

exports.sourceNodes = ({ actions: { createTypes }, schema }) => {
  createTypes(`
    type Post implements Node {
      title: String!
      slug: String!
      content: String!
      date: Date!
      sourceType: String!
    }
  `);
};

const loadFromAdapters = ({
  adapters,
  method = 'resolveAll',
  source,
  args,
  context,
  info,
}) =>
  adapters.map(adapter => {
    const name = typeof adapter === 'string' ? adapter : adapter.resolve;
    const adapterResolvers = require(name);
    return adapterResolvers[method](source, args, context, info);
  });

exports.createResolvers = ({ createResolvers }, { adapters }) => {
  createResolvers({
    Query: {
      allPost: {
        type: 'PostConnection!',
        resolve: async (source, args, context, info) => {
          const method = 'resolveAll';
          const postsFromAdapters = loadFromAdapters({
            adapters,
            method,
            source,
            args,
            context,
            info,
          });

          const posts = await Promise.all(postsFromAdapters).then(postsArray =>
            postsArray.reduce((allPosts, posts) => [...allPosts, ...posts]),
          );

          return {
            nodes: posts,
          };
        },
      },
      post: {
        resolve: async (source, args, context, info) => {
          const method = 'resolveOne';
          const promises = loadFromAdapters({
            adapters,
            method,
            source,
            args,
            context,
            info,
          });

          const postArray = await Promise.all(promises);
          const post = postArray.find(Boolean);

          return post;
        },
      },
    },
  });
};
