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
* 🚀 **Zero Boilerplate Auto-Hydration:** The store automatically syncs and purges expired keys on creation. No manual `.init()` function required!
* 💾 **Direct Cache Sourcing:** Single-source architecture reads directly from storage, completely eliminating redundant in-memory tracking maps and lowering RAM overhead.
* 🧼 **Falsy Value Safety:** Fixed a type-coercion bug. Valid falsy values like `0`, `false`, and `""` (empty strings) are now preserved safely instead of being accidentally deleted.

## 📦 Installation

### Via CDN (Direct Browser Usage)
Perfect for vanilla JS projects, static sites, or quick scripts. Add this script tag to your HTML:

**Minified Script Tag**
```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.min.js"></script>
```
**Non-Minified Script Tag**
```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.js"></script>
```
**Minified CDN Link**
```html
https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.min.js
```
**Non-Minified CDN Link**
```html
https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.js
```
## ⚠️ Breaking Changes & Notes

If you are upgrading from a version prior to `v1.2.0`, please note the following optimizations:

* **`.init()` is now a No-Op:** You no longer need to call `store.init()` to hydrate your data. The store automatically self-hydrates and self-clears expired keys on instantiation. The `init()` function is kept purely for backwards compatibility so your code won't break, but you can safely remove it.
* **Falsy Value Bug Fix:** In previous versions, storing values like `0`, `false`, or `""` (empty strings) would accidentally trigger the internal garbage disposal system and delete the key. As of `v1.2.0`, these are handled as completely valid states and are preserved safely.

## 🚀 Quick Start
```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/puff-state@latest/dist/puff-state.js"></script>
<script>
  // 1. Instantly creates and auto-hydrates the store
  const store = createPuffStore("app-session");

  // 2. Map structural triggers reactively
  store.subscribe("theme", (nextValue, previousValue) => {
    console.log(`Swapped settings from ${previousValue} to ${nextValue}`);
  });

  // 3. Mutate fields with custom lifespans (15 seconds)
  store.setState("theme", "emerald-lux", false, 15000);
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

## 🛑 Technical Limitations & Caveats

To ensure optimal performance and stability when integrating `Puff-State` into production environments, please review the following architectural behaviors:

* **⚡ Synchronous Storage Bottlenecks:** State reads hit browser disk storage (`localStorage`) synchronously on every single `getState()` call or subscriber verification loop. 
  * *Warning:* Avoid binding `Puff-State` updates to high-frequency events like `onMouseMove`, `onScroll`, or rapid text inputs (`onChange`), as the synchronous disk I/O will cause noticeable UI stuttering.
* **🧼 `store.keys()` Triggers Side-Effects:** Calling `.keys()` is not a pure read operation. It actively forces a scan over the entire store, purging expired items and committing updates to disk under the hood.
  * *Warning:* Be aware that simply inspecting the array of active keys will automatically trigger a background cache garbage-collection cycle and a file-save routine.
* **📦 Shallow JSON Serialization Limits:** Data persistence relies entirely on standard `JSON.stringify()`, which does not support complex, non-primitive JavaScript data types.
  * *Warning:* Custom classes, `Date` objects, `Map`, `Set`, and functions will lose their prototypes or be wiped out during serialization. Additionally, storing circular objects will throw a fatal error and crash the execution thread.
* **⚠️ Unhandled Quota Exceeded Crashes:** The library does *not* internally catch or suppress browser storage limits when writing updates to disk.
  * *Warning:* If a user's browser hits its hard capacity threshold (typically _~5MB_ for `localStorage`), `setState()` will throw an unhandled `QuotaExceededError` and stop execution if not caught externally.
* **🧱 Deprecated `init()` Hook:** The `.init()` hook exposed on the store instance is an empty, non-functional placeholder kept strictly for backwards compatibility.
  * *Warning:* Cache hydration now happens automatically upon store instantiation. Calling `store.init()` manually does absolutely nothing.

## 📄 License

MIT © [Sumit Karn](https://github.com/sumitkarn12)
