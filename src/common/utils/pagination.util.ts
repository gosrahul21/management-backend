export class PaginationUtil {
  static getSkipCount(paginationOption: {
    pageNo: string | number;
    limit: string | number;
  }) {
    const pageNo = parseInt(paginationOption.pageNo as string),
      limit = parseInt(paginationOption.limit as string);
    return (pageNo - 1) * limit;
  }

  static getLimitCount(paginationOption: { limit: string | number }) {
    const limit = parseInt(paginationOption.limit as string);
    return limit;
  }
}
