# m-shop

A Marathon-based demo app for an e-Commerce site.

## Setup

* Vagrant/Playa
* Preparation (Mesos-DNS)
* Deployment
* Interaction

## Demo

From host:

    http PUT http://10.141.141.10:8080/v2/groups < mesos-dns/system.json
    http POST http://10.141.141.10:8080/v2/groups < m-shop.json

Redeployment:

    http PUT http://10.141.141.10:8080/v2/groups/m-shop < m-shop.json
    http DELETE http://10.141.141.10:8080/v2/groups/m-shop

Analytics:

* Wait some 2min in the beginning for the ELK stack to be set up
* perform a couple of interactions on `/m-shop/site/nginx` app (items, shop)
* in the Vagrant box, check logs `ls -al /tmp/m-shop/nginx`
* Index: `logstash-` and field name is `@timestamp`
* For Kibana some fields: `request`, `response`, `verb referrer` 

### Mesos-DNS

Set up on Playa Mesos with [config.js](mesos-dns/config.js) copied into Vagrant box at `/etc/mesos-dns/config.js`.

Note: group ID `/m-shop/site/webdis` in Marathon becomes FDN `webdis-site-m-shop.marathon.mesos`

In the Vagrant box:

    dig webdis-site-m-shop.marathon.mesos
    dig _webdis-site-m-shop._tcp.marathon.mesos SRV

    ; <<>> DiG 9.9.5-3ubuntu0.2-Ubuntu <<>> _webdis-site-m-shop._tcp.marathon.mesos SRV
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 62784
    ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

    ;; QUESTION SECTION:
    ;_webdis-site-m-shop._tcp.marathon.mesos. IN SRV

    ;; ANSWER SECTION:
    _webdis-site-m-shop._tcp.marathon.mesos. 60 IN SRV 0 0 31000 webdis-site-m-shop-46886-s0.marathon.mesos.

    ;; ADDITIONAL SECTION:
    webdis-site-m-shop-46886-s0.marathon.mesos. 60 IN A 10.141.141.10

    ;; Query time: 3 msec
    ;; SERVER: 127.0.0.1#53(127.0.0.1)
    ;; WHEN: Sun Jun 21 10:47:21 UTC 2015
    ;; MSG SIZE  rcvd: 216

### Build Website

    cd frontend-static/
    docker rmi mhausenblas/m-shop-nginx
    docker build -t mhausenblas/m-shop-nginx .
    docker push mhausenblas/m-shop-nginx

### ELK stack for analytics

Based on http://raulcd.com/elasticsearch-logstash-and-kibana-on-docker.html

See https://registry.hub.docker.com/u/raulcd/elk-docker/
