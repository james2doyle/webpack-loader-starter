const validateOptions = require('schema-utils');
const { getOptions } = require('loader-utils');

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

module.exports = function loader(source) {
  const callback = this.async();

  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  const output = source.replace(/\[name\]/g, options.name);

  const results = `module.exports = ${JSON.stringify(output)}`

  callback(null, results);
}
