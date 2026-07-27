export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiFailure = {
  success: false;
  data: null;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ApiErrorShape = {
  success?: false;
  message?: string;
};


