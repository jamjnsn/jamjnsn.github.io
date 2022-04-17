---
title: Secure reverse proxy using Authelia and NGINX Proxy Manager and Docker
description: "Setting up Authelia and NGINX Proxy Manager to add TOTP and password protection to your hosted services."
date_posted: 2021-08-17
date_updated: 2021-08-20
published: true
cover_image:
canonical_url: false
slug: use-authelia-with-nginx-proxy-manager
tags: ['authelia', 'nginx', 'docker']
---

NGINX Proxy Manager is a fantastic GUI frontend for NGINX that simplifies the process of adding and managing hosts, as well as generating SSL certificates using Let's Encrypt. It's a great way to organize local services across physical devices, containers, and virtual machines.

While NGINX Proxy Manager does protect itself with a username and password, the same may not be true for every given service you're proxying. Additionally, it (and most other services) will not offer any options for Two-Factor Authentication (2FA). Enter [Authelia](https://github.com/authelia/authelia).

> Authelia is an open-source authentication and authorization server providing two-factor authentication and single sign-on (SSO) for your applications via a web portal. It acts as a companion for reverse proxies like nginx, Traefik or HAProxy to let them know whether requests should either be allowed or redirected to Authelia's portal for authentication.

This article assumes you have a reasonable familiarity with Docker, Docker Compose, NGINX, Let's Encrypt, and more. Basically, you need to know the specific things I know -- which isn't many things, but it is some things.

## Setup
We'll be using [docker-compose](https://docs.docker.com/compose/) for this setup, but this can of course be adapted to a variety of other configurations based on your needs. First, create a directory for this project:

```bash
mkdir ~/nginx-proxy-manager
cd ~/nginx-proxy-manager
```

### Secrets
Let's create a directory for our __secrets__. Docker secrets allow us to use sensitive data without entering it directly into our `docker-compose.yml`. Essentially, we will be mounting these files into our container where they can be read as environment variables by our `root` user.

```bash
mkdir .secrets
chmod 700 .secrets
```

Create the following `docker-compose.yml`:

```yaml
version: "2.1"

secrets:
  authelia_jwt_secret:
    file: .secrets/authelia_jwt_secret
  authelia_session_secret:
    file: .secrets/authelia_session_secret
  insecure_session_secret:
    file: .secrets/insecure_session_secret
  authelia_notifier_smtp_password:
    file: .secrets/authelia_notifier_smtp_password
  db_root_pwd:
    file: .secrets/db_root_pwd
  mysql_pwd:
    file: .secrets/mysql_pwd

networks:
  default:
    external:
      name: proxy

services:
  npm:
    container_name: nginx-proxy-manager
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    environment:
      DB_MYSQL_HOST: "db"
      DB_MYSQL_PORT: 3306
      DB_MYSQL_USER: "npm"
      DB_MYSQL_PASSWORD__FILE: /run/secrets/mysql_pwd
      DB_MYSQL_NAME: "npm"
      DISABLE_IPV6: 'true'
    volumes:
      - ./npm:/data
      - ./npm-conf:/data/nginx/custom
      - ./letsencrypt:/etc/letsencrypt
    secrets:
      - mysql_pwd
    depends_on:
      - db

  db:
    container_name: nginx-db
    image: jc21/mariadb-aria
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD__FILE: /run/secrets/db_root_pwd
      MYSQL_DATABASE: "npm"
      MYSQL_USER: "npm"
      MYSQL_PASSWORD__FILE: /run/secrets/mysql_pwd
    volumes:
      - ./mysql:/var/lib/mysql
    secrets:
          - db_root_pwd
      - mysql_pwd

  authelia:
    image: authelia/authelia:latest
    container_name: authelia
    environment:
      - TZ=America/Vancouver
      - AUTHELIA_JWT_SECRET_FILE=/run/secrets/authelia_jwt_secret
      - AUTHELIA_SESSION_SECRET_FILE=/run/secrets/authelia_session_secret
      - AUTHELIA_NOTIFIER_SMTP_PASSWORD_FILE=/run/secrets/authelia_notifier_smtp_password
    volumes:
      - ./authelia:/config
    secrets:
      - authelia_jwt_secret
      - authelia_session_secret
      - authelia_notifier_smtp_password
      - insecure_session_secret
    restart: unless-stopped
```

## NGINX Proxy Manager

You'll need to create a Proxy Host for your Authelia instance. Create a new Proxy Host (e.g. `auth.example.com`) and point it to your Authelia host, port, and protocol in the Details tab. Then, add the following to the Custom Configuration block on the Advanced tab:

```nginx
location / {
    set $upstream_authelia http://authelia:9091;
    proxy_pass $upstream_authelia;
    client_body_buffer_size 128k;

    #Timeout if the real server is dead
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;

    # Advanced Proxy Config
    send_timeout 5m;
    proxy_read_timeout 360;
    proxy_send_timeout 360;
    proxy_connect_timeout 360;

    # Basic Proxy Config
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $http_host;
    proxy_set_header X-Forwarded-Uri $request_uri;
    proxy_set_header X-Forwarded-Ssl on;
    proxy_redirect  http://  $scheme://;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_cache_bypass $cookie_session;
    proxy_no_cache $cookie_session;
    proxy_buffers 64 256k;

    # If behind reverse proxy, forwards the correct IP, assumes you're using Cloudflare. Adjust IP for your Docker network.
    set_real_ip_from 172.19.0.0/16;
    real_ip_header CF-Connecting-IP;
    real_ip_recursive on;
}
```

Finally, you can add the following snippet in the Advanced tab for a Proxy Host to protect it with Authelia:

```nginx
include /data/nginx/custom/authelia-server.conf;

location / {
    include /data/nginx/custom/authelia-location.conf;
    proxy_pass $forward_scheme://$server:$port ;
}
```
