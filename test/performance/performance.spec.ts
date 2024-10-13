import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function measureExecutionTime(
  fn: () => Promise<void>,
  iterations: number = 100,
): Promise<number> {
  let totalTime = 0;

  for (let i = 0; i < iterations; i++) {
    // 데이터 삭제 (시간 측정에 포함되지 않음)
    await prisma.placeToArea.deleteMany();

    // 성능 측정 시작
    const start = process.hrtime();
    await fn();
    const end = process.hrtime(start);
    const elapsedTime = end[0] * 1000 + end[1] / 1e6;
    totalTime += elapsedTime;
  }

  return totalTime / iterations;
}

async function assignPlacesToAreasWithoutBoundingBox() {
  await prisma.$executeRaw`
    INSERT INTO "PlaceToArea" ("placeId", "areaId")
    SELECT p.id, a.id
    FROM "Place" p, "Area" a
    WHERE ST_Contains(a.polygon, ST_SetSRID(ST_Point(p.x, p.y), 4326))
    ON CONFLICT ("placeId", "areaId") DO NOTHING;
  `;
}

async function assignPlacesToAreasWithBoundingBox() {
  await prisma.$executeRaw`
    INSERT INTO "PlaceToArea" ("placeId", "areaId")
    SELECT p.id, a.id
    FROM "Place" p, "Area" a
    WHERE 
      p.x BETWEEN a."minX" AND a."maxX"
      AND p.y BETWEEN a."minY" AND a."maxY"
      AND ST_Contains(a.polygon, ST_SetSRID(ST_Point(p.x, p.y), 4326))
    ON CONFLICT ("placeId", "areaId") DO NOTHING;
  `;
}

describe('Performance Tests', () => {
  beforeAll(async () => {
    // 초기 설정이 필요하다면 여기에 추가
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Performance Comparison', async () => {
    const withoutBoundingBoxTime = await measureExecutionTime(
      assignPlacesToAreasWithoutBoundingBox,
    );

    const withBoundingBoxTime = await measureExecutionTime(
      assignPlacesToAreasWithBoundingBox,
    );

    console.table([
      {
        Method: 'Without Bounding Box',
        'Average Time (ms)': withoutBoundingBoxTime.toFixed(2),
      },
      {
        Method: 'With Bounding Box',
        'Average Time (ms)': withBoundingBoxTime.toFixed(2),
      },
    ]);
  }, 30000);
});
