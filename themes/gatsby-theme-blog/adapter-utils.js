const { findOne, findManyPaginated } = require('gatsby/dist/schema/resolvers');
const { GraphQLDate } = require('gatsby/dist/schema/types/date');
const { getPagination } = require('gatsby/dist/schema/types/pagination');
const { getSortInput } = require('gatsby/dist/schema/types/sort');
const { getFilterInput } = require('gatsby/dist/schema/types/filter');

const { SchemaComposer, InterfaceTypeComposer } = require('graphql-compose');

exports.addConnectionTypes = (typeDefs, createTypes, schema) => {
  const schemaComposer = new SchemaComposer();

  schemaComposer.addAsComposer(GraphQLDate);

  const postITC = InterfaceTypeComposer.createTemp(typeDefs, schemaComposer);

  const sortInputTC = getSortInput({ schemaComposer, typeComposer: postITC });
  const filterInputTC = getFilterInput({
    schemaComposer,
    typeComposer: postITC,
  });
  const paginationTC = getPagination({ schemaComposer, typeComposer: postITC });

  sortInputTC.setTypeName('PostAdapterSort');
  filterInputTC.setTypeName('PostAdapterFilter');

  createTypes([
    schemaComposer.getAnyTC('SortOrderEnum').getType(),
    schemaComposer.getAnyTC('StringQueryOperatorInput').getType(),
    schemaComposer.getAnyTC('DateQueryOperatorInput').getType(),
    // schemaComposer.getAnyTC('BooleanQueryOperatorInput').getType(),
    schemaComposer.getAnyTC('PageInfo').getType(),
    postITC.getType(),
    sortInputTC.getType(),
    filterInputTC.getType(),
    paginationTC.getType(),
  ]);

  createTypes(
    schema.buildObjectType({
      name: 'Post',
      args: {
        filter: 'PostAdapterFilter',
      },
      fields: {
        id: { type: 'ID!' },
        title: { type: 'String!' },
        slug: { type: 'String!' },
        content: { type: 'String!' },
        date: { type: 'Date!' },
        source: { type: 'String!' },
      },
      interfaces: ['Node', 'PostAdapter'],
    }),
  );
};

exports.addConnectionResolvers = createResolvers => {
  createResolvers({
    Query: {
      allPost: {
        type: 'PostConnection',
        args: {
          filter: 'PostAdapterFilter',
          sort: 'PostAdapterSort',
          skip: 'Int',
          limit: 'Int',
        },
        resolve: async (source, args, context, info) => {
          const mdx = await findManyPaginated('Mdx')({
            source,
            args,
            context,
            info,
          });
          console.log(mdx.nodes);
          return findManyPaginated('Post')({ source, args, context, info });
        },
      },
      post: {
        type: 'Post',
        args: {
          id: 'StringQueryOperatorInput',
        },
        resolve: (source, args, context, info) =>
          findOne('Post')({ source, args, context, info }),
      },
    },
  });
};
