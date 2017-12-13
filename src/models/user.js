const compose = require('stampit');
const uuid = require('uuid/v4');
const Entity = require('./entity');
const Namespace = require('./entity/namespace');
const { APP_NAME } = require('../constants');

const User = compose(Entity, {
  /**
   * Defines property descriptors for this instance.
   * Allows for getters/setters and other options.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty}
   */
  propertyDescriptors: {
    anon: {
      enumerable: true,
      set() { }, // Do not allow set.
      get() { return this.isAnonymous(); },
    },
  },
  methods: {
    /**
     * Determines if this User instance is considered anonymous (internally).
     *
     * @return {boolean}
     */
    isAnonymous() {
      const ns = User.getAnonNamespace();
      return ns.z === this.ns.z && ns.b === this.ns.b && ns.n === this.ns.n;
    },
  },
  /**
   * Static methods.
   */
  statics: {
    /**
     * Creates a new User from an Entity string.
     *
     * @return {User}
     */
    fromString() {
      return User(Entity.fromString(...arguments));
    },

    /**
     * Makes a new User from an Entity list of args.
     *
     * @return {User}
     */
    make() {
      return User(Entity.make(...arguments));
    },

    /**
     * Creates a new, anonymous user.
     *
     * @return {User}
     */
    createAnon() {
      const ns = User.getAnonNamespace();
      return User({ id: uuid(), ns });
    },

    /**
     * Get/creates an anonymous namespace instance.
     *
     * @return {Namespace}
     */
    getAnonNamespace() {
      return Namespace.make(APP_NAME.toLowerCase(), 'anon', 'user');
    },
  },
});

module.exports = User;
