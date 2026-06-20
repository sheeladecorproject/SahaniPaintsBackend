class PaginationData {
    limit: number | undefined;
    search: string | undefined;
    sort: string | undefined;
    lastCreatedAt: Date | undefined;
    lastId: string | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
}

export { PaginationData };
