import { AxiosError } from 'axios';

export const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const detail = error.response?.data as { detail?: string } | undefined;
    if (detail?.detail) {
      return detail.detail;
    }
    if (typeof error.message === 'string' && error.message.length) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};
