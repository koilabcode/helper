#!/bin/bash

# Migrations run separately (not from Vercel build due to IPv6 limitations)
if [[ $VERCEL_ENV == "production"  ]] ; then
  pnpm run build
else
  pnpm run build
fi
