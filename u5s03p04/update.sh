#!/bin/bash

# after you download my-app.zip, run this script to unzip it, replace the
# appropriate file (index.html) in this directory, do a find and replace, then
# delete my-app.zip

cd $(dirname "$BASH_SOURCE")

unzip -q ~/Downloads/my-app.zip
mv my-app/index.html .

sed -i "" "s_\"applab_\"../applab_g" index.html
rm ~/Downloads/my-app.zip
rm -r my-app
