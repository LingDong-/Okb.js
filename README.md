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

Node:

```javascript
const Okb = require("./Okb");
```

## Files

- `okb/Okb.js` library source code.
- `okb/examples.js` usage examples, parsed by `okb/builddoc.js` and turned into  interactive webpage.
- `update.sh` shell script to generate `okb/docs/examples` and `okb/docs/api` and `okb/Okb-min.js`.
- `okb/docs` mainly contains generated code; don't read; don't modify manually.