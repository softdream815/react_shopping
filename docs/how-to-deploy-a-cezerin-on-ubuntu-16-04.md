# How to deploy a Cezerin on Ubuntu 16.04

I'll use DigitalOcean to deploy Cezerin.

1. Click **Create droplet**
 - Choose an image: `Ubuntu 16.04.4 x64`
 - Choose a size: `2 GB (RAM), 1 vCPU, 50 GB (SSD)`
 - Choose a datacenter region: `San Francisco`

2. SSH to droplet

3. [Install Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
```shell
sudo apt-get update
```
```shell
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```
```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
```shell
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```
```shell
sudo apt-get update
```
```shell
sudo apt-get install docker-ce
```

5. Run MongoDB
```shell
docker run --name store-db -v /var/www/store-db:/data/db -d mongo:latest
```

6. Run Cezerin
```shell
docker run -d \
--name store \
--link store-db:db \
-p 80:80 \
-e DB_HOST=db \
-e DB_PORT=27017 \
-e DB_NAME=shop \
-v /var/www/store/content:/var/www/cezerin/public/content \
cezerin/cezerin:latest
```
Check logs
```shell
docker logs store
```

6. Add default data to MongoDB
```shell
docker exec -it store-db mongo shop
```
Copy and paste
```js
db.pages.insertMany([
  {slug: '', meta_title: 'Home', enabled: true, is_system: true},
  {slug: 'checkout', meta_title: 'Checkout', enabled: true, is_system: true},
  {slug: 'checkout-success', meta_title: 'Thank You!', enabled: true, is_system: true},
  {slug: 'cart', meta_title: 'Cart', enabled: true, is_system: true},
  {slug: 'login', meta_title: 'Login', enabled: true, is_system: true},
  {slug: 'logout', meta_title: 'Logout', enabled: true, is_system: true},
  {slug: 'register', meta_title: 'Register', enabled: true, is_system: true},
  {slug: 'account', meta_title: 'Account', enabled: true, is_system: true}
]);
db.pages.createIndex({ enabled: 1 });
db.pages.createIndex({ slug: 1 });
db.productCategories.createIndex({ enabled: 1 });
db.productCategories.createIndex({ slug: 1 });
db.products.createIndex({ slug: 1 });
db.products.createIndex({ enabled: 1 });
db.products.createIndex({ category_id: 1 });
db.products.createIndex({ sku: 1 });
db.products.createIndex({'attributes.name' : 1, 'attributes.value' : 1});
db.products.createIndex({
  'name': 'text',
  'description': 'text'
}, { default_language: 'english', name: 'textIndex' });
db.customers.createIndex({ group_id: 1 });
db.customers.createIndex({ email: 1 });
db.customers.createIndex({ mobile: 1 });
db.customers.createIndex({
  'full_name': 'text',
  'addresses.address1': 'text'
}, { default_language: 'english', name: 'textIndex' });
db.orders.createIndex({ draft: 1 });
db.orders.createIndex({ number: 1 });
db.orders.createIndex({ customer_id: 1 });
db.orders.createIndex({ email: 1 });
db.orders.createIndex({ mobile: 1 });
db.orders.createIndex({
  'shipping_address.full_name': 'text',
  'shipping_address.address1': 'text'
}, { default_language: 'english', name: 'textIndex' });
```

7. Setup domain with [CloudFlare](https://www.cloudflare.com)  
 - Get droplet IP on DigitalOcean
![DigitalOcean IP Address](./images/do-ip.png)

 - Add `A` and `CNAME` to DNS on CloudFlare
![CloudFlare DNS](./images/cf-dns.png)
 - Set SSL to `Flexible` on CloudFlare
![CloudFlare SSL](./images/cf-ssl.png)

 - Turn on `Always use HTTPS` on CloudFlare
![CloudFlare Always HTTPS](./images/cf-alway-https.png)

8. Turn off Developer Mode  
By default Cezerin is in developer mode. This means you can access API and Dashboard without access tokens.  
To turn off developer mode, you need to do:

 - Add access token in Dashboard or MongoDB
 - Set SMTP server from Dashboard or in `config/server.js`
 - Remove `developerMode` from `config/server.js`
 - Remove `developerMode` from `config/admin.js`
 - `npm run build`
 - `pm2 reload api`
