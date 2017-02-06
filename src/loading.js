import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

import {
  buildClientSchema,
  Source,
  concatAST,
  parse
} from 'graphql';

import glob from 'glob';

import { ToolError, logError } from './errors'

export function loadSchema(schemaPath) {
  if (!fs.existsSync(schemaPath)) {
    throw new ToolError(`Cannot find GraphQL schema file: ${schemaPath}`);
  }
  const schemaData = require(schemaPath);

  if (!schemaData.data && !schemaData.__schema) {
    throw new ToolError('GraphQL schema file should contain a valid GraphQL introspection query result');
  }
  return buildClientSchema((schemaData.data) ? schemaData.data : schemaData);
}

export function loadAndMergeQueryDocuments(inputPaths) {
  if (typeof inputPaths === "string") {
    glob(inputPaths, (err, files) => {
      if (err) throw new Error(err);
      inputPaths = files;
    })
  }
  const sources = inputPaths.map(inputPath => {
    const body = fs.readFileSync(inputPath, 'utf8')
    if (!body) {
      return null;
    }
    return new Source(body, inputPath);
  }).filter(source => source);

  return concatAST(sources.map(source => parse(source)));
}
