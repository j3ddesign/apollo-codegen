'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interfaceDeclaration = interfaceDeclaration;
exports.propertyDeclaration = propertyDeclaration;
exports.propertyDeclarations = propertyDeclarations;

var _printing = require('../utilities/printing');

function interfaceDeclaration(generator, _ref, closure) {
  let interfaceName = _ref.interfaceName,
      extendTypes = _ref.extendTypes;

  generator.printNewlineIfNeeded();
  generator.printNewline();
  generator.print(`export interface ${interfaceName}`);
  if (extendTypes && extendTypes.length > 0) {
    generator.print(` extends ${extendTypes.join(', ')}`);
  }
  generator.pushScope({ typeName: interfaceName });
  generator.withinBlock(closure);
  generator.popScope();
}

function propertyDeclaration(generator, _ref2, closure) {
  let propertyName = _ref2.propertyName,
      typeName = _ref2.typeName,
      description = _ref2.description,
      isArray = _ref2.isArray,
      isNullable = _ref2.isNullable,
      inInterface = _ref2.inInterface,
      fragmentSpreads = _ref2.fragmentSpreads;

  generator.printOnNewline(description && `// ${description}`);
  if (closure) {
    generator.printOnNewline(`${propertyName}:`);
    if (isArray) {
      generator.print(' Array<');
    }
    if (fragmentSpreads && fragmentSpreads.length > 0) {
      generator.print(` ${fragmentSpreads.map(n => `${n}Fragment`).join(' & ')} &`);
    }
    generator.pushScope({ typeName: propertyName });
    generator.withinBlock(closure);
    generator.popScope();
    if (isArray) {
      generator.print(' >');
    }
    if (isNullable) {
      generator.print(' | null');
    }
  } else if (fragmentSpreads && fragmentSpreads.length > 0) {
    generator.printOnNewline(`${propertyName}: ${isArray ? 'Array<' : ''}${fragmentSpreads.map(n => `${n}Fragment`).join(' & ')}${isArray ? '>' : ''}`);
  } else {
    generator.printOnNewline(`${propertyName}: ${typeName}`);
  }
  generator.print(inInterface ? ';' : ',');
}

function propertyDeclarations(generator, properties) {
  if (!properties) return;
  properties.forEach(property => propertyDeclaration(generator, property));
}
//# sourceMappingURL=language.js.map