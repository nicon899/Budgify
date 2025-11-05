import { TemplateTransaction } from "./TemplateTransaction";

export type Template = {
    id: number;
    name: string;
    templateTransactions: TemplateTransaction[];
}