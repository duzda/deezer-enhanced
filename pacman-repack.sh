#!/usr/bin/bash

# This script fixes permissions for .pacman, this should be
# done elsewhere, either in electron builder or forge maker,
# although this script is ugly, it's a fast fix.

set -o errexit
set -o nounset

if [[ $# -ne 1 ]]; then
    echo "Please supply Deezer version"
    exit 1
fi

VERSION=$1

(
    cd "./out/make" || exit 1
    mkdir "deezer-enhanced-${VERSION}"

    # Unpack tar.xf to folder
    tar --extract --file "deezer-enhanced-${VERSION}.pacman" --directory "deezer-enhanced-${VERSION}"

    # Remove old package
    rm "deezer-enhanced-${VERSION}.pacman"

    # Apply fix
    chmod 755 "deezer-enhanced-${VERSION}/opt/deezer-enhanced"

    # Package as a new package
    (
        cd "deezer-enhanced-${VERSION}" || exit 1
        tar --xz --create --file "../deezer-enhanced-${VERSION}.pacman" "usr" "opt" ".PKGINFO" ".MTREE" ".INSTALL"
    )
)
