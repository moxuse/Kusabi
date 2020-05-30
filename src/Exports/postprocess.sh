#!/usr/bin/bash
{
    cp src/Exports/index.html dist/index.html &&
    cp src/Yodaka/index.js dist/index.js
    # $(npm bin)/uglifyjs dist/index.js dist/Main.js -o bundle.js
}