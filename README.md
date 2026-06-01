# 💨 Puff-State

An ultra-lightweight (~1KB), plug-and-play, reactive state management library with persistent storage and automatic TTL (Time-To-Live) expiration. 

No complex boilerplate, no messy configurations. Just drop it in and play. When data expires, it vanishes into a puff of smoke!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Size: Less than 1 KB](https://img.shields.io/badge/Size-~1KB-yellow.svg)

## ✨ Features

* 🚀 **Zero Setup:** Plug-and-play via CDN or NPM.
* 💾 **Automatic Persistence:** Syncs seamlessly with `localStorage` out of the box.
* ⏳ **Built-in TTL (Time-To-Live):** Set custom expiration lifespans on individual state keys.
* 🔮 **Reactive Pub/Sub:** UI elements can subscribe to specific keys and update automatically when state shifts.
* 🧼 **Auto-Purging:** Dynamically wipes expired cache entries to keep the client storage completely clean.


## 📦 Installation

### Via CDN (Direct Browser Usage)
Perfect for vanilla JS projects, static sites, or quick scripts. Add this script tag to your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.min.js"></script>
```

## 🚀 Quick Start
```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.min.js"></script>
<script>
  // 1. Initialize your persistent store
  const store = createPuffStore("user-preferences");

  // 2. Subscribe reactively to specific changes
  const unsubscribe = store.subscribe("theme", (newTheme, oldTheme) => {
    console.log(`Theme shifted from ${oldTheme} to ${newTheme}`);
    document.body.className = newTheme;
  });

  // 3. Sync existing data from localStorage
  store.init();

  // 4. Update state with an explicit 1-hour expiration lifespan (in milliseconds)
  store.setState("theme", "dark-mode", false, 60 * 60 * 1000);
</script>
```

## 🛠️ API Reference

### `createPuffStore(name, config)`

Creates an isolated, persistent state store bucket.

* `name` *(string, default: "puff-store")*: The key namespace inside local storage.
* `config` *(object)*: Adjust configuration (e.g., passing `storage: sessionStorage`).

### `store.setState(key, value, dontFire, ttl)`

Updates a state property and broadcasts updates to all active listeners.

* `key` *(string)*: Property identifier.
* `value` *(any)*: Serialized payload data.
* `dontFire` *(boolean)*: Pass true to change the data silently without notifying subscribers.
* `ttl` *(number)*: Lifespan of this key update in milliseconds.

### `store.subscribe(key, callback)`

Listens to changes for a specific key. Returns an unsubscription function.

* `callback` signature: `(newValue, oldValue) => void`

### `store.getState(key)`

Returns the current valid state value or `null` if expired/missing.

## 📄 License

MIT © [Sumit Karn](https://github.com/sumitkarn12)
