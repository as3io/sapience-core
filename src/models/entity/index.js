const compose = require('stampit');
const Namespace = require('./namespace');
const SelfAware = require('../../composables/self-aware');
const ValuesProxy = require('../../composables/values-proxy');
const { string } = require('../../utils/cast-as');

const Entity = compose({
  /**
   *
   * @param {Object} opts
   * @param {string} opts.id The entity identifier. Will be stringified and trimmed.
   * @param {(string|object|array)} opts.ns The entity namespace.
   */
  init({ id, ns } = {}) {
    this.id = id;
    this.ns = ns;
  },

  /**
   * Defines property descriptors for this instance.
   * Allows for getters/setters and other options.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty}
   */
  propertyDescriptors: {
    id: {
      enumerable: true,
      set(v) { return this.setId(v); },
      get() { return this.getId(); },
    },
    ns: {
      enumerable: true,
      set(v) { return this.setNamespace(v); },
      get() { return this.getNamespace(); },
    },
  },

  /**
   * Instance methods.
   */
  methods: {
    /**
     * Gets the enitity identifier.
     *
     * @return {(string|undefined)}
     */
    getId() {
      return this.getValue('id');
    },

    /**
     * Gets the entity namespace.
     *
     * @return {Namepace}
     */
    getNamespace() {
      return this.getValue('ns');
    },

    /**
     * Determines if the entity is valid.
     * Requires an `id` and a valid `ns` value.
     *
     * @return {boolean}
     */
    isValid() {
      if (!this.ns.isValid()) return false;
      return Boolean(this.id);
    },

    /**
     * Sets the identifier to the entity.
     *
     * @param {*} id
     * @return {this}
     */
    setId(id) {
      this.setValue('id', Entity.coerceId(id));
      return this;
    },

    /**
     * Sets the namespace to the entity.
     *
     * @param {*} ns
     * @return {this}
     */
    setNamespace(ns) {
      this.setValue('ns', Entity.createNamespace(ns));
      return this;
    },

    /**
     * Converts the entity to a string.
     *
     * @return {string}
     */
    toString() {
      const parts = [];
      if (this.id) {
        parts.push(this.id);
      }
      if (!this.ns.isEmpty()) {
        parts.push('*');
        parts.push(this.ns.toString());
      }
      return parts.join('');
    },
  },

  /**
   * Static methods.
   */
  statics: {
    /**
     * Prepares an entity identifier, by coercing it to a string.
     * Empty values will be treated as `undefined`.
     *
     * @param {*} id
     * @return {(string|undefined)}
     */
    coerceId(id) {
      const cast = string(id);
      return cast.length ? cast : undefined;
    },

    /**
     * Creates an entity namespace instance.
     *
     * @param {(string|array|object)} ns
     * @return {Namespace}
     */
    createNamespace(ns) {
      if (typeof ns === 'string') {
        return Namespace.fromString(ns);
      } else if (Array.isArray(ns)) {
        return Namespace.make(...ns);
      }
      return Namespace(Object(ns));
    },

    /**
     * Converts a stringified namsespace into a Namespace object.
     *
     * Given the following string:
     * 1. `1234*bar` returns `{ id: '1234', ns: { z: undefined, b: undefined, n: 'bar' } }`
     * 2. `1234*foo.bar` returns `{ id: '1234', ns: { z: undefined, b: 'foo', n: 'bar' } }`
     *
     * All non-string values of `v` will return an empty (invalid) Entity.
     *
     * @param {string} v The stringified entity.
     * @return {Entity}
     */
    fromString(v) {
      if (typeof v !== 'string') return Entity();
      const args = v.split('*');
      return Entity({ id: args[0], ns: args[1] });
    },

    /**
     * Makes a new Entity instance with the provided identifier and namespace parameters.
     * The namespace can be partially specified, e.g.:
     * 1. make(id, name)
     * 2. make(id, base, name)
     * 3. make(id, zone, base, name)
     * 4. make(id, zone, null, name)
     *
     * @param {string} id
     * @param {..object} ns
     * @return {Entity}
     */
    make(id, ...ns) {
      return Entity({ id, ns });
    },
  },

}, ValuesProxy, SelfAware);

module.exports = Entity;
