export type CategoryBody = {
    name: string;
    parentId: number | null;
    listIndex: number;
}

export type TemplateBody = {
    name: string;
}

export type TemplateTransactionBody = {
    name: string;
    value: number;
    detail: string;
    dateOffset: number;
    categoryId: number;
    templateId: number;
}