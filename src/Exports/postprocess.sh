#!/usr/bin/bash
{
    cp src/Exports/index.html dist/index.html &&
    cp src/Yodaka/index.js dist/index.js &&
    cat dist/Main.js > dist/bundle.js && cat dist/index.js >> dist/bundle.js &&
    rm dist/Main.js && rm dist/index.js
}