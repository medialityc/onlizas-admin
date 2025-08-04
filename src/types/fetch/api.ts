export interface CustomApiError {
  title?: string;
  status: number;
  detail?: string;
}

export class ApiError extends Error {
  title: string;

  status: number;

  detail: string;

  constructor(error: CustomApiError & object) {
    super();
    this.title = error.title ?? "";
    this.status = error.status;
    this.detail = error.detail ?? "";
  }

  toString() {
    return `${this.title} - ${this.status} - ${this.detail.toString()}`;
  }
}

export type ApiResponse<T> = {
  data?: T;
  error: boolean;
  status: number;
  message?: string;
} & CustomApiError;

export type ApiStatusResponse = {
  status: number;
};
