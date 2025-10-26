export type Category = {
    id: number;
    name: string;
    total: number;
    parentId: number | null;
    children?: Category[];
    transactions: any[];
}