const compose = require('stampit');
const { dasherized } = require('../../utils/cast-as');
const SelfAware = require('../../composables/self-aware');
const ValuesProxy = require('../../composables/values-proxy');

const { assign } = Object;

const Namespace = compose(ValuesProxy, {
  /**
   *
   * @param {Object} opts
   * @param {string} opts.z The namespace zone (tenant/org name).
   * @param {string} opts.b The namespace base (grouping name).
   * @param {string} opts.n The namespace name (model name).
   */
  init({ z, b, n } = {}) {
    this.z = z;
    this.b = b;
    this.n = n;
  },

  /**
   * Defines property descriptors for this instance.
   * Allows for getters/setters and other options.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty}
   */
  propertyDescriptors: {
    b: { enumerable: true, set(v) { return this.setBase(v); }, get() { return this.getBase(); } },
    n: { enumerable: true, set(v) { return this.setName(v); }, get() { return this.getName(); } },
    z: { enumerable: true, set(v) { return this.setZone(v); }, get() { return this.getZone(); } },
  },

  /**
   * Instance methods.
   */
  methods: {
    /**
     * Determines if this is an empty instance (missing the zone, base, and name).
     *
     * @return {boolean}
     */
    isEmpty() {
      return Boolean(!this.z && !this.b && !this.n);
    },

    /**
     * Validates the namespace.
     * At minimum, a `name` (`n`) must be specified
     *
     * @return {boolean}
     */
    isValid() {
      return Boolean(this.n);
    },

    /**
     * Gets a namespace property value.
     *
     * @param {string} name
     * @return {(string|undefined)}
     */
    get(name) {
      return this.getValue(name);
    },

    /**
     * Gets the base (`b`) value of the entity namespace.
     *
     * @return {(string|undefined)}
     */
    getBase() {
      return this.get('b');
    },

    /**
     * Gets the name (`n`) value of the entity namespace.
     *
     * @return {(string|undefined)}
     */
    getName() {
      return this.get('n');
    },

    /**
     * Gets the zone (`z`) value of the entity namespace.
     *
     * @return {(string|undefined)}
     */
    getZone() {
      return this.get('z');
    },

    /**
     * Prepares an entity namespace property value for setting.
     *
     * @param {*} value
     * @return {(string|undefined)}
     */
    prepare(value) {
      const cast = dasherized(value);
      return cast.length ? cast : undefined;
    },

    /**
     * Sets an entity namespace property value.
     *
     * @param {string} name
     * @param {*} value
     * @return {this}
     */
    set(name, value) {
      this.setValue(name, this.prepare(value));
      return this;
    },

    /**
     * Sets the base (`b`) value of the entity namespace.
     *
     * @param {string} base
     * @return {this}
     */
    setBase(base) {
      return this.set('b', base);
    },

    /**
     * Sets the name (`n`) value of the entity namespace.
     *
     * @param {string} name
     * @return {this}
     */
    setName(name) {
      return this.set('n', name);
    },

    /**
     * Sets the zone (`z`) value of the entity namespace.
     *
     * @param {string} zone
     * @return {this}
     */
    setZone(zone) {
      return this.set('z', zone);
    },

    /**
     * Converts the namespace to an array.
     *
     * @return {string[]}
     */
    toArray() {
      return [this.z, this.b, this.n];
    },

    /**
     * Converts the namespace to a string.
     *
     * Given the following object properties:
     * 1. `{ n: undefined, b: undefined, n: 'bar' }` returns `..bar`.
     * 2. `{ n: undefined, b: 'foo', n: 'bar' }` returns `.foo.bar`.
     * 3. `{ n: 'baz', b: 'foo', n: 'bar' }` returns `baz.foo.bar`.
     * 4. `{ n: 'baz', b: undefined, n: 'bar' }` returns `baz..bar`.
     * 5. `{ n: null, b: undefined, n: undefined }` returns `''`.
     * 6. `{ n: '', b: 'bar', n: '' }` returns `.bar.`.
     * 7. `{ n: 'baz', b: null, n: '' }` returns `baz..`.
     *
     * @return {string}
     */
    toString() {
      if (this.isEmpty()) return '';
      return this.toArray().join('.');
    },
  },

  /**
   * Static methods.
   */
  statics: {
    /**
     * Converts a stringified namsespace into a Namespace object.
     *
     * Given the following string:
     * 1. `bar` returns `{ z: undefined, b: undefined, n: 'bar' }`.
     * 2. `foo.bar` returns `{ z: undefined, b: 'foo', n: 'bar' }`.
     * 3. `baz.foo.bar` returns `{ z: 'baz', b: 'foo', n: 'bar' }`.
     * 4. `baz..bar` returns `{ z: 'baz', b: undefined, n: 'bar' }`.
     *
     * All non-string values of `v` will return an empty Namespace.
     *
     * @param {string} v The stringified namespace.
     * @return {Namespace}
     */
    fromString(v) {
      const args = typeof v === 'string' ? v.split('.') : [];
      return Namespace.make(...args);
    },

    /**
     * Makes a new Namspace instance with the provided namespace parameters.
     * Can be partially specified, e.g.:
     * 1. make(name)
     * 2. make(base, name)
     * 3. make(zone, base, name)
     * 4. make(zone, null, name)
     *
     * @return {Namespace}
     */
    make(...args) {
      const map = { 0: 'z', 1: 'b', 2: 'n' };
      while (args.length < 3) {
        args.unshift(undefined);
      }
      const opts = args.reduce((obj, val, idx) => {
        const key = map[idx];
        if (key) assign(obj, { [key]: val });
        return obj;
      }, {});
      return Namespace(opts);
    },
  },
}, SelfAware);

module.exports = Namespace;
