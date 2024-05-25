export type PaginatedResponse<T, K extends string = 'items'> = {
  [key in K]: T[];
} & {
  totalItemCount: number;
};

export interface IConvertedDate {
  convertedStartDate: Date;
  convertedEndDate: Date;
}
