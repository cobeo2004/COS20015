# migrations.sh
# 2025-10-01
# Author: Xuan Tuan Minh Nguyen
# Reference: https://nalanj.dev/posts/minimalist-postgresql-migrations/
# This file is used to migrate the database

#!/bin/bash
set -e

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

if [ -z ${DATABASE_URL+x} ];
then
  echo "DATABASE_URL must be set";
  exit 1;
fi;

if [ -z ${1+x} ] || [ ! -d $1 ];
then
  echo "Usage: migrate-all [dir]";
  exit 1;
fi;

files=$(find $1 -iname "*.sql" | sort);

for file in $files;
do
  psql $DATABASE_URL -1 -v ON_ERROR_STOP=1 -f $file;
  echo "Applied $file";
done;
