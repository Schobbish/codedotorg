#!/bin/bash

# after you download app\ lab.zip, run this script to unzip it, replace the
# appropriate file (index.html) in this directory, do a find and replace, then
# delete `code.o`rg\ test.zip

cd $(dirname "$BASH_SOURCE")

unzip -q ~/Downloads/app\ lab.zip
mv app\ lab/index.html .

sed -i "" "s_\"applab_\"../applab_g" index.html
rm ~/Downloads/app\ lab.zip
rm -r app\ lab
