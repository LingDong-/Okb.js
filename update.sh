cd okb
node ../node_modules/minify/bin/minify.js Okb.js > Okb-min.js
rm -rf docs/api
node ../node_modules/documentation/bin/documentation.js build Okb.js -f html -o docs/api
rm -rf docs/examples
node builddoc.js