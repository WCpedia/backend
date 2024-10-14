import { AreaName } from '@api/common/constants/const/area.const';
import { RecommendationType } from '@api/common/constants/enum/enum';

export type PaginatedResponse<T, K extends string = 'items'> = {
  [key in K]: T[];
} & {
  totalItemCount: number;
};

export interface IConvertedDate {
  convertedStartDate: Date;
  convertedEndDate: Date;
}

export interface IRegionType {
  administrativeDistrict?: string;
  district?: string;
  area?: (typeof AreaName)[keyof typeof AreaName];
  x?: number;
  y?: number;
}

export interface ILocationOptions {
  administrativeDistrict?: string;
  district?: string;
  area?: (typeof AreaName)[keyof typeof AreaName];
  recommendationType?: RecommendationType;
}
