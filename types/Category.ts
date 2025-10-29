export type Category = {
    id: number;
    name: string;
    total: number;
    parentId: number | undefined;
    children?: Category[];
    transactions: any[];
}