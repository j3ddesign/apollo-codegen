import fs from 'fs'

import { ToolError, logError } from './errors'
import { loadSchema, loadAndMergeQueryDocuments } from './loading'
import { validateQueryDocument } from './validation'
import { compileToIR } from './compilation'
import serializeToJSON from './serializeToJSON'
import { generateSource as generateSwiftSource } from './swift'
import { generateSource as generateTypescriptSource } from './typescript'
import { generateSource as generateFlowSource } from './flow'

export default function generate(inputPaths, schemaPath, outputPath, target, options) {
  const schema = loadSchema(schemaPath);

  loadAndMergeQueryDocuments(inputPaths).then(document => {
    console.log('got document', document);
    validateQueryDocument(schema, document);

    const context = compileToIR(schema, document);
    Object.assign(context, options);

    let output;
    switch (target) {
      case 'json':
        output = serializeToJSON(context);
        break;
      case 'ts':
      case 'typescript':
        output = generateTypescriptSource(context);
        break;
      case 'flow':
        output = generateFlowSource(context);
        break;
      case 'swift':
      default:
        output = generateSwiftSource(context);
        break;
    }

    if (outputPath) {
      fs.writeFileSync(outputPath, output);
    } else {
      console.log(output);
    }
  });
}
