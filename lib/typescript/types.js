'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeNameFromGraphQLType = typeNameFromGraphQLType;

var _printing = require('../utilities/printing');

var _changeCase = require('change-case');

var _graphql = require('graphql');

const builtInScalarMap = {
  [_graphql.GraphQLString.name]: 'string',
  [_graphql.GraphQLInt.name]: 'number',
  [_graphql.GraphQLFloat.name]: 'number',
  [_graphql.GraphQLBoolean.name]: 'boolean',
  [_graphql.GraphQLID.name]: 'string'
};

function typeNameFromGraphQLType(context, type, bareTypeName) {
  let nullable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  if (type instanceof _graphql.GraphQLNonNull) {
    return typeNameFromGraphQLType(context, type.ofType, bareTypeName, false);
  }

  let typeName;
  if (type instanceof _graphql.GraphQLList) {
    typeName = `Array< ${typeNameFromGraphQLType(context, type.ofType, bareTypeName, true)} >`;
  } else if (type instanceof _graphql.GraphQLScalarType) {
    typeName = builtInScalarMap[type.name] || (context.passthroughCustomScalars ? type.name : _graphql.GraphQLString);
  } else {
    typeName = bareTypeName || type.name;
  }

  return nullable ? typeName + ' | null' : typeName;
}
//# sourceMappingURL=types.js.map