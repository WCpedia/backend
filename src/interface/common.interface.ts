import { PrismaService } from '@src/core/database/prisma/services/prisma.service';

export interface IPaginationOptions {
  take: number;
  currentPage?: number;
  targetPage?: number;
  firstItemId?: number;
  lastItemId?: number;
}

export interface IPaginationParams {
  cursor: ICursor | null;
  skip: number | null;
  take: number | null;
}

export interface ICursor {
  id: number;
}

export interface IRegion {
  oneDepth: string;
  twoDepth: string;
  threeDepth: string;
}

export interface PrismaTransaction
  extends Omit<
    PrismaService,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  > {}
