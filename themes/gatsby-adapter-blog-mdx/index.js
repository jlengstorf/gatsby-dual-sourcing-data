const adapter = post => {
  if (post === null) {
    return post;
  }

  const frontmatter = post.frontmatter || {};
  const sourceType = post.internal ? post.internal.type : 'boop';

  return {
    id: post.id,
    title: frontmatter.title,
    slug: frontmatter.slug,
    date: frontmatter.date,
    content: '<p>Test</p>', //post.code.body,
    sourceType,
  };
};

const resolveAll = async (source, args, context, info) => {
  const allPosts = await context.nodeModel.runQuery({
    query: {
      filter: { fields: { sourceInstanceName: { eq: 'posts-mdx' } } },
    },
    type: 'Mdx',
  });

  return allPosts.map(adapter);
};

const resolveOne = async (_source, args, context, info) => {
  const post = await context.nodeModel.runQuery({
    query: {
      filter: {
        frontmatter: args,
        fields: { sourceInstanceName: { eq: 'posts-mdx' } },
      },
    },
    type: 'Mdx',
    firstOnly: true,
  });

  return adapter(post);
};

module.exports = {
  resolveAll,
  resolveOne,
};
