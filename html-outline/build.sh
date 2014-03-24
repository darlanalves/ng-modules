#!/bin/sh

buildfile="html-outline.js"

echo -n | tee $buildfile

echo "!function(){\n'use strict';\n" >> $buildfile

cat src/module.js >> $buildfile
echo "\n" >> $buildfile

cat src/HtmlOutlineService.js >> $buildfile
echo "\n" >> $buildfile

cat src/htmlOutlineDirective.js >> $buildfile
echo "\n" >> $buildfile

cat src/Matcher.js >> $buildfile
echo "\n" >> $buildfile

echo "}();" >> $buildfile

echo
