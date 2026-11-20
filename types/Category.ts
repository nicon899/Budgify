export type Category = {
    id: number | 'total';
    name: string;
    total: number;
    parentId: number | null | undefined;
    children?: Category[];
    latestDate?: string;
    pathLabel?: string;
    listIndex?: number;
}