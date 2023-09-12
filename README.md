# Configuration

## Files

- service bundles (index.js, package.json, etc)
- Dockerfile
- docker-compose.yml

## Docker Compose Commands

Initially start a instance, you may stop by `ctrl` + `c`

```
docker compose up
```

You can connect service by port which you config in the service to listen such as `3000`

## Start by Scaling Command

Before start you must 
- remove `posts` from `docker-compose.yml`
- remove `container_name` from `docker-compose.yml` because `docker-compose` will config own itself
by command below

```
docker compose up --scale [service_name]=[number_of_instance_you_need]
```

exp.

```
docker compose up --scale api=5
```

Right now you get 5 instances running, but how do the external aplication know which one instance they should connect to? In this case you need using NGINX

Remove all instances with

```
docker compose down
```

You can build and run all instances to be background with this command

```
docker compose up --scale [service_name]=[number_of_instance_you_need] -d --build
```

## Reverse Proxy and Load Balancer (NGINX)

Add another service in `docker-compose.yml`

```
services:
  ...

  nginx:
      image: nginx:latest
      volumes:
        - ./conf.d:/etc/nginx/conf.d
      depends_on:
        - api_test
      ports:
        - 8080:4000

```

In part of 

```
      volumes:
        - ./conf.d:/etc/nginx/conf.d
```

first `conf.d` you can change to any, it should be same as the folder which contain `nginx.conf` and the path after that (`:/etc/nginx/conf.d`) must be fixed the example

You config external port is `80` and internal to connect service is `3000`

Next, create folder `conf.d` and file `nginx.conf` inside it

config reverse proxy by type inside the file with

```
server {
  listen 4000;
  location / {
    proxy_pass http://localhost:3000;
  }
}
```

It means listening external request at port `8080` and forward to EGINX at port `4000`

Then EGINX forward to url of service at port `3000` (AKA Reverse Proxy)

You can change the ports all that you want

## Testing

Send request at port `8080`

```
http://localhost:8080
```

You may get response like

```
{"message":"Hello from 07e2ada3ef6c","hostname":"07e2ada3ef6c"}
```

And if refresh, the hostname will change
Because of `Load Balancer` takes request to all instances by round rolling
