/**
 * Puff-State v1.0.0
 * An ultra-lightweight, reactive, persistent state manager with automatic TTL expiration.
 * https://github.com/YOUR_USERNAME/puff-state
 * * License: MIT
 */
(function (global) {
  'use strict';

  // Internal Storage & Expiry Engine
  let puffCache = function (ns, n) {
    let config = Object.assign({
      defaultExpiry: 365 * 24 * 60 * 60 * 1000, // 365 days in ms
      storage: localStorage
    }, n);

    let state = null;
    try {
      state = new Map(JSON.parse(config.storage.getItem(ns)) || []);
    } catch (e) {
      state = new Map();
    }

    let save = () => config.storage.setItem(ns, JSON.stringify([...state.entries()]));

    let get = (k) => {
      let v = state.get(k) || {};
      v = v.e > Date.now() ? v.v : null;
      (!v && state.delete(k));
      return v;
    };

    return {
      set: (k, v, e = config.defaultExpiry) => {
        state.set(k, { v: v, e: Date.now() + e });
        save();
        return v;
      },
      get: (k) => get(k),
      size: () => state.size,
      clear: () => { state.clear(); save(); },
      clearExpireds: () => {
        state.keys().forEach(k => get(k));
      },
      keys: () => [...state.keys()]
    };
  };

  /**
   * Central Store Builder
   * Exposed globally for plug-and-play architecture.
   * * @param {string} name - The storage namespace (defaults to "puff-store")
   * @param {Object} config - Optional overrides for defaultExpiry or storage engine
   */
  global.createPuffStore = function (name = "puff-store", config) {
    let cache = puffCache(name, config);
    cache.clearExpireds();

    let state = new Map();

    let set = (k, v, dontFire, ttl) => {
      let s = state.get(k) || { v: null, e: new Set() };
      let c = cache.get(k);
      let oldVal = c;
      s.v = v;
      state.set(k, s);
      cache.set(k, v, ttl);

      if (!dontFire) {
        s.e.forEach((callback) => callback(s.v, oldVal));
      }
      return s.v;
    };

    return {
      // Hydrates cache into reactive memory map
      init: () => {
        cache.keys().forEach(k => set(k, cache.get(k)));
      },

      // Get all active keys
      keys: () => cache.keys(),

      // Get target key value
      getState: (k) => cache.get(k),

      // Set target key value & run tracking actions
      setState: (k, v, dontFire, ttl) => set(k, v, dontFire, ttl),

      // Registers listener actions for key updates
      subscribe: (k, callback) => {
        let s = state.get(k) || { v: null, e: new Set() };
        s.e.add(callback);
        state.set(k, s);

        // Unsubscribe clean-up trigger
        return () => s.e.delete(callback);
      }
    };
  };

})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);