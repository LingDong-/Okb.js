![](https://cdn.glitch.com/9219e364-9a57-47d7-9120-c493e42e44e5%2Fokbbanner.png?1555771816778)

# Okb.js
Procedural generation toolkit for Javascript - noises, randomness, curves, and more

- [Examples](https://okb.glitch.me/docs/examples/index.html)
- [API documentation](https://okb.glitch.me/docs/api/index.html)

## Usage

Browser:

```html
<script src="https://okb.glitch.me/Okb.js"></script>
```

or minified:

```html
<script src="https://okb.glitch.me/Okb-min.js"></script>
```

**Note:** To reduce loading time, download the file and host it elsewhere. Since the project is still being developed, this also prevents breaking changes.

Node:

```javascript
const Okb = require("./Okb");
```

## Files

- `okb/Okb.js` library source code.
- `okb/examples.js` usage examples, parsed by `okb/builddoc.js` and turned into  interactive webpage.
- `update.sh` shell script to generate `okb/docs/examples` and `okb/docs/api` and `okb/Okb-min.js`.
- `okb/docs` mainly contains generated code; don't read; don't modify manually.

Source code managed on Glitch: [https://glitch.com/edit/#!/okb](https://glitch.com/edit/#!/okb)