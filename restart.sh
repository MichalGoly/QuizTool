#!/bin/sh
# This file is only used during local development
docker-compose down
docker-compose build
docker-compose up
