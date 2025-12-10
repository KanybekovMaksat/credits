export interface SortDescriptor {
  field: string;
  order: number;
}

export interface PageCommonProps {
  pageIndex: number;
  pageSize: number;
}

export interface PageContextRequest<T> extends PageCommonProps {
  listSort?: SortDescriptor[];
  filter?: T;
}
export interface ErrorMessage {
  key: string;
  message: string;
}
export interface ResponseWithData<T> {
  data: T;
  success?: boolean;
  failure?: boolean;
  errors?: ErrorMessage[];
  total?: number;
  errorCode: number;
  message?: string;
}

export interface ResponseWithoutData {
  success?: boolean;
  failure?: boolean;
  message?: string;
  errors?: ErrorMessage[];
}
