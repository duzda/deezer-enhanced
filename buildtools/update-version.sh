#!/bin/bash

# Just to make sure we are in the correct folder
cd $(dirname $(readlink -f ${BASH_SOURCE[0]}))

VERSION=error
while IFS= read -r line; do
    if [[ "$line" == *"version"* ]]; then
        split=(${line//\"/ })
        VERSION=${split[2]}
        break
    fi
done < ../package.json

sed -i -e "s/pkgver=.*/pkgver=${VERSION}/" ./aur-bin/PKGBUILD
sed -i -e "s/pkgrel=.*/pkgrel=1/" ./aur-bin/PKGBUILD
sed -i -e "s/pkgver=.*/pkgver=${VERSION}/" ./aur-git/PKGBUILD
sed -i -e "s/pkgrel=.*/pkgrel=1/" ./aur-git/PKGBUILD

cd aur-bin
makepkg --printsrcinfo > .SRCINFO

cd ..
cd aur-git
makepkg --printsrcinfo > .SRCINFO
