#!/bin/bash

# Packages are already built by postinstall, so we only need to run next build
# This cuts build time roughly in half
pnpm next build
