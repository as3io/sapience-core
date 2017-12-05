const compose = require('stampit');

module.exports = compose({
  properties: {
    values: {},
  },
  methods: {
    getValue(name) {
      return this.values[name];
    },
    setValue(name, value, strict = true) {
      if (!strict || (strict && Object.getOwnPropertyDescriptor(this, name))) {
        this.values[name] = value;
      }
      return this;
    },
  },
  propertyDescriptors: {
    values: { writable: true, enumerable: false, configurable: false },
  },
});
