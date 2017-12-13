const compose = require('stampit');
const uuid = require('uuid/v4');
const Entity = require('./entity');
const Namespace = require('./entity/namespace');
const { APP_NAME } = require('../constants');

const User = compose(Entity, {
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
