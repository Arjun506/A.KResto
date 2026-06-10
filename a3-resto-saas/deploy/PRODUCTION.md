# A3 Resto Production Deployment

## Environment

Set these values on the VPS or CI secret store:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/a3_resto
NEXT_PUBLIC_API_URL=https://api.example.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Docker

```bash
docker compose up --build -d
```

## PM2

```bash
cd apps/api && npm ci && npx prisma generate && npm run build
cd ../web && npm ci && npm run build
cd ../..
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
```

## SSL

Use Nginx with Certbot:

```bash
certbot --nginx -d example.com -d api.example.com
```

## CI/CD

Recommended pipeline:

1. Install dependencies.
2. Run API lint/build and Prisma validate.
3. Run web lint/build.
4. Build Docker images.
5. Deploy with compose or PM2 reload.
