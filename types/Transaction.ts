export type Transaction = {
    id: number;
    name: string;
    value: number;
    detail: string;
    date: Date;
    categoryId: number | null;
}

export type TransactionMeta = {
    pages: number;
    loadedPages: number;
    total: number;
}