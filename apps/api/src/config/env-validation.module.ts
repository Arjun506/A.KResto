import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

/**
 * Environment configuration module
 * Validates all environment variables on app startup
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3001),
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'debug')
          .default('info'),
        THROTTLE_TTL: Joi.number().default(60000),
        THROTTLE_LIMIT: Joi.number().default(10),

        // Database
        DATABASE_URL: Joi.string().required(),
        DATABASE_POOL_MIN: Joi.number().default(5),
        DATABASE_POOL_MAX: Joi.number().default(20),

        // Redis
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().optional().allow(''),
        REDIS_TLS: Joi.string().valid('true', 'false').default('false'),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('24h'),

        // KMS Cryptographic Keys (Required in production)
        SAAS_MASTER_ENCRYPTION_KEY: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        SAAS_BLIND_INDEX_KEY: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        // Email
        SENDGRID_API_KEY: Joi.string().optional(),
        SENDER_EMAIL: Joi.string().email().optional(),

        // SMS
        TWILIO_ACCOUNT_SID: Joi.string().optional(),
        TWILIO_AUTH_TOKEN: Joi.string().optional(),
        TWILIO_PHONE_NUMBER: Joi.string().optional(),

        // OpenAI
        OPENAI_API_KEY: Joi.string().optional(),
        OPENAI_MODEL: Joi.string().default('gpt-4-turbo'),

        // Stripe
        STRIPE_SECRET_KEY: Joi.string().optional(),
        STRIPE_WEBHOOK_SECRET: Joi.string().optional(),

        // Razorpay
        RAZORPAY_SECRET_KEY: Joi.string().optional(),
        RAZORPAY_WEBHOOK_SECRET: Joi.string().optional(),

        // Sentry
        SENTRY_DSN: Joi.string().optional(),

        // Frontend
        NEXT_PUBLIC_API_URL: Joi.string().optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class EnvConfigModule {}
