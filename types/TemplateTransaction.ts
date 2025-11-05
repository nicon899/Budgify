export type TemplateTransaction = {
    id: number;
    name: string;
    value: number;
    detail: string;
    dateOffset: number;
    categoryId: number;
    executionDate?: Date;
    templateId?: number;
}