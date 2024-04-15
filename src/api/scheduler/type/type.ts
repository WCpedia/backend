import { Prisma } from '@prisma/client';

export type TopReviewerWithCount = Prisma.PickArray<
  Prisma.PlaceReviewGroupByOutputType,
  'userId'[]
> & {
  _count: {
    userId: number;
  };
};
