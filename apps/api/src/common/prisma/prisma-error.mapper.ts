import { Prisma } from '@prisma/client';

export type PrismaErrorPayload = {
  code?: string;
  message: string;
  field?: string;
};

export const mapPrismaError = (err: unknown): PrismaErrorPayload => {
  const fallback: PrismaErrorPayload = {
    message: 'Database error',
  };

  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
    return fallback;
  }

  // https://www.prisma.io/docs/orm/reference/error-reference
  const code = err.code;

  // P2002 Unique constraint failed
  if (code === 'P2002') {
    const meta = err.meta as unknown as { target?: string[] } | undefined;
    const target = meta?.target?.[0];
    return {
      code,
      message: target
        ? `Unique constraint failed: ${target}`
        : 'Unique constraint failed',
      field: target,
    };
  }

  // P2025 Record not found
  if (code === 'P2025') {
    return {
      code,
      message: 'Record not found',
    };
  }

  // P2003 Foreign key constraint failed / relation failure
  if (code === 'P2003') {
    return {
      code,
      message: 'Relation failure',
    };
  }

  return {
    code,
    message: err.message || fallback.message,
  };
};
