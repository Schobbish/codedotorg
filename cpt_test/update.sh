#!/bin/bash

# after you download "code.org test.zip, run this script to unzip it, replace the
# appropriate file (index.html) in this directory, do a find and replace, then
# delete `code.o`rg\ test.zip

cd $(dirname "$BASH_SOURCE")

unzip -q ~/Downloads/"code.org test.zip"
mv "code.org test/index.html" .

sed -i "" "s_\"applab_\"../applab_g" index.html
rm ~/Downloads/"code.org test.zip"
rm -r "code.org test"
