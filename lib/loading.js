'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.loadSchema = loadSchema;
exports.loadAndMergeQueryDocuments = loadAndMergeQueryDocuments;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _graphql = require('graphql');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadSchema(schemaPath) {
  if (!_fs2.default.existsSync(schemaPath)) {
    throw new _errors.ToolError(`Cannot find GraphQL schema file: ${schemaPath}`);
  }
  const schemaData = require(schemaPath);

  if (!schemaData.data && !schemaData.__schema) {
    throw new _errors.ToolError('GraphQL schema file should contain a valid GraphQL introspection query result');
  }
  return (0, _graphql.buildClientSchema)(schemaData.data ? schemaData.data : schemaData);
}

function loadAndMergeQueryDocuments(inputPaths) {
  const getFileNames = inputPaths => {
    return new _promise2.default((resolve, reject) => {
      let allFiles = [];
      let checking = inputPaths.length;
      inputPaths.forEach(path => {
        (0, _glob2.default)(path, (err, files) => {
          if (err) throw new Error(err);
          allFiles = [].concat((0, _toConsumableArray3.default)(allFiles), (0, _toConsumableArray3.default)(files));
          checking--;
          if (!checking) {
            resolve(allFiles);
          }
        });
      });
    });
  };
  return getFileNames(inputPaths).then(files => {
    console.log('got files: ', files);
    const sources = files.map(path => {
      const inputPath = path;
      const body = _fs2.default.readFileSync(inputPath, 'utf8');
      if (!body) {
        return null;
      }
      return new _graphql.Source(body, inputPath);
    }).filter(source => source);
    return (0, _graphql.concatAST)(sources.map(source => (0, _graphql.parse)(source)));
  }).catch(e => console.error(e));
}
//# sourceMappingURL=loading.js.map