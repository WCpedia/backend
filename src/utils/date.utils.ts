export class DateUtils {
  static getUTCStartAndEndOfDay(): { startOfDay: Date; endOfDay: Date } {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // UTC 기준 오늘의 시작 시간 설정

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999); // UTC 기준 오늘의 종료 시간 설정

    return { startOfDay, endOfDay };
  }
}
