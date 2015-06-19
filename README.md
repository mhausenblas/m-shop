# m-shop

A Marathon-based demo app for an e-Commerce site.

## Setup

* Vagrant/Playa
* Preparation (Mesos-DNS)
* Deployment
* Interaction

Todo:

Run SeDi under Marathon


## Demo

    http POST http://10.141.141.10:8080/v2/apps < mesos-dns/mesos-dns.json
    http POST http://10.141.141.10:8080/v2/groups < m-shop.json
    dig webdis-site-m-shop.marathon.mesos
    dig _webdis-site-m-shop._tcp.marathon.mesos SRV
    interactions (items, shop)
    l /tmp/m-shop/nginx

Enable CORS

    fields: request response verb referrer 
    time scale, new request 404, filter

Redeployment:

    http PUT http://10.141.141.10:8080/v2/groups/m-shop < m-shop.json

    http DELETE http://10.141.141.10:8080/v2/groups/m-shop

### Mesos-DNS

Set up on Playa Mesos with [config.js](mesos-dns/config.js) copied into Vagrant box at `/etc/mesos-dns/config.js`.

Note: group ID `/m-shop/site/webdis` in Marathon becomes FDN `webdis-site-m-shop.marathon.mesos`

### Build Website

    cd frontend-static/
    docker rmi mhausenblas/m-shop-nginx
    docker build -t mhausenblas/m-shop-nginx .
    docker push mhausenblas/m-shop-nginx
    
    
    

### ELK stack for analytics

Based on http://raulcd.com/elasticsearch-logstash-and-kibana-on-docker.html

See https://registry.hub.docker.com/u/raulcd/elk-docker/

Note:

* Wait some 2min in the beginning for the ELK stack to be set up
* Produce at least > 10kB logs in vagrant@mesos:/tmp/m-shop/nginx
* Index: `logstash-` and field name is `@timestamp`
