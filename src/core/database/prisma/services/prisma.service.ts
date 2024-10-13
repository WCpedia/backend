import {
  INestApplication,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomInternalServerError } from '@exceptions/http/custom-internal-server-error';
import { PrismaExceptionEnum } from '@exceptions/http/enums/global.exception.enum';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    // this.$on('query', (e) => {
    //   console.log('Query: ' + e.query);
    //   console.log('Params: ' + e.params);
    //   console.log('Duration: ' + e.duration + 'ms');
    // });

    await this.cacheAllCategories();
    await this.cacheAllPlaceCategories();
    await this.cacheAllRegions();
  }

  async enableShutdownHook(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async cacheAllCategories() {
    this.logger.log(`Categories cache start`);

    const cacheKey = process.env.REDIS_CATEGORY_KEY;
    const lastCategoryIdKey = process.env.REDIS_LAST_CATEGORY_KEY;

    // 레디스에서 마지막 카테고리 ID 조회
    const lastCategoryId =
      await this.cacheManager.get<number>(lastCategoryIdKey);

    const categories = await this.category.findMany({
      ...(lastCategoryId && { where: { id: { gt: lastCategoryId } } }),
    });
    const newCategoryCounts = categories.length;
    if (!newCategoryCounts) {
      this.logger.log(`Categories cache end. No new categories.`);
      return;
    }

    // 새로운 카테고리를 캐시에 저장
    const operations = categories.map((category) =>
      this.cacheManager.set(`${cacheKey}/${category.name}`, category.id, {
        ttl: 0,
      }),
    );

    await Promise.all(operations);

    // 새로운 마지막 카테고리의 ID를 저장
    const newLastCategory = categories[newCategoryCounts - 1];
    await this.cacheManager.set(lastCategoryIdKey, newLastCategory.id);

    this.logger.log(`${newCategoryCounts} categories have been cached.`);
  }

  async cacheAllPlaceCategories() {
    this.logger.log(`PlaceCategories cache start`);
    const cacheKey = process.env.REDIS_PLACE_CATEGORY_KEY;
    const lastPlaceCategoryIdKey = process.env.REDIS_LAST_PLACE_CATEGORY_KEY;

    const lastCategoryId = await this.cacheManager.get<number>(
      lastPlaceCategoryIdKey,
    );

    const placeCategories = await this.placeCategory.findMany({
      ...(lastCategoryId && { where: { id: { gt: lastCategoryId } } }),
    });
    const newPlaceCategoryCounts = placeCategories.length;
    if (!newPlaceCategoryCounts) {
      this.logger.log(`PlaceCategories cache end. No new placeCategories.`);
      return;
    }

    const operations = placeCategories.map((placeCategory) =>
      this.cacheManager.set(
        `${cacheKey}/${placeCategory.fullCategoryIds}`,
        placeCategory.id,
        {
          ttl: 0,
        },
      ),
    );

    await Promise.all(operations);

    const newLastCategory = placeCategories[newPlaceCategoryCounts - 1];
    await this.cacheManager.set(lastPlaceCategoryIdKey, newLastCategory.id);

    this.logger.log(
      `${newPlaceCategoryCounts} placeCategories have been cached.`,
    );
  }

  async cacheAllRegions() {
    this.logger.log(`Regions cache start`);
    const cacheKey = process.env.REDIS_REGION_KEY;

    const regions = await this.region.findMany();
    const newRegionCounts = regions.length;
    if (!newRegionCounts) {
      throw new CustomInternalServerError(PrismaExceptionEnum.NO_DATA);
    }

    const operations = regions.map((region) =>
      this.cacheManager.set(
        `${cacheKey}/${region.administrativeDistrict}${region.district}`,
        region.id,
        {
          ttl: 0,
        },
      ),
    );

    await Promise.all(operations);

    this.logger.log(`${newRegionCounts} regions have been cached.`);
  }
}
