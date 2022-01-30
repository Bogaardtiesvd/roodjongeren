# Roodjongeren.nl

## Overview

The application consists of:

- A Strapi backend
- A NextJS frontend
- A Postgres database
- An Nginx reverse proxy

### Prerequisites

- Yarn
- Docker Compose

## Developing

### Starting a development stack

First, start Postgres and Nginx using Docker Compose. Go to the root directory and run:

```bash
docker-compose -f docker/roodjongeren_dev/docker-compose.yml up -d
```

Then start the Strapi backend. Go to `/backend` and run:

```bash
yarn install # Not needed if you have already installed the latest dependencies
yarn build # Not needed if you have already done this and made no major changes
yarn dev
```

To start the NextJS frontend, open another terminal session and go to `/frontend`. In there, run:

```bash
yarn install # Not needed if you have already installed the latest dependencies
yarn dev
```

Nginx will forward requests from, `localhost:80` to the NextJS and forward requests from `localhost:80/backend` to
Strapi.

To view the website, open `localhost`. To go to the Strapi admin console, open `localhost/backend/admin`.

## Deploying

### Starting a production stack

Deployment is the easiest through Docker. First test that the production is working locally. The .env-file you can find
under `/docker/roodjongeren_prod/` should allow for you to run the complete stack locally. Stop your development stack
and run the following command from the root directory to start the production stack:

```bash
docker-compose -f docker/roodjongeren_prod/docker-compose.yml up -d --build
```

This will boot up the entire stack in Docker containers, while only exposing port 80 of Nginx. Navigate to `localhost`
and `localhost/backend/admin` and ensure everything is working as expected.

When building images for production, it's recommended to add an additional .env-file called `.env.prod`. Do not add this
file to version control. Reference the .env-file with the `--env-file` flag when building the images for production.

### Pushing docker images

Push the docker images to a <ins>**private**</ins> repository. This is essential, to prevent secret in your .env-files
from being exposed. You can push the images using:

```bash
docker-compose -f docker/roodjongeren_prod/docker-compose.yml push
```

Besides the database, users can also upload media. These are stored in a volume bound
to `rood_strapi:/usr/src/app/public/uploads`, and should be backed up and restored together with the database.

To use these images pull them into your host instance and restart the Docker Compose stack using the `--no-build`
and `-d` flags.

### Backing Up & Restoring Database

You can back up a database from the host machine using the following command:

```bash
docker exec -t rood_postgres pg_dump -c -U rood rood > dump_rood.sql
```

To restore the backup of the database into a running Postgres container, use the following:

```bash
sudo cat dump_rood.sql | sudo docker exec -i rood_postgres psql -U postgres -d rood
```

## Planned improvements

- Fix HeaderLink active resetting when clicking on HeaderDropdown
- Fix black flashing pages on refresh
- Fix bug where you cannot access Strapi on the deployed environment
- Add HTTPS support
- Add aria labels for improved search engine support
- Add a WYSIWYG editor
- Add analytics