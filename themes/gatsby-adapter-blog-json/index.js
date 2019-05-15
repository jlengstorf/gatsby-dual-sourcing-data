const adapter = post => {
  if (post === null) {
    return null;
  }

  const sourceType = post && post.internal ? post.internal.type : 'boop';
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.date,
    content: post.content,
    sourceType,
  };
};

const resolveAll = async (_source, _args, context, _info) => {
  const allPosts = await context.nodeModel.getAllNodes({
    type: 'PostsJson',
  });

  return allPosts.map(adapter);
};

const resolveOne = async (_source, args, context, _info) => {
  const post = await context.nodeModel.runQuery({
    query: {
      filter: args,
    },
    type: 'PostsJson',
    firstOnly: true,
  });

  return adapter(post);
};

module.exports = {
  resolveAll,
  resolveOne,
};
