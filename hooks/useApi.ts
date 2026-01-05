import { useAuth } from "@/contexts/AuthContext";
import { CategoryBody, TemplateBody, TemplateTransactionBody } from "@/types/ApiTypes";
import { Category } from "@/types/Category";
import { Template } from "@/types/Template";
import { TemplateTransaction } from "@/types/TemplateTransaction";
import { Transaction } from "@/types/Transaction";

export const BASE_URL = "http://217.154.162.22:3000/api";

export function useApi() {
    const { actions: auth, token } = useAuth();

    const refreshToken = async () => {
        auth.refreshToken()
    }

    // CATEGORIES
    const getFirstLevelCategories = async (date: string | null = null) => {
        const res = await fetch(`${BASE_URL}/category/firstLevel${date ? `?date=${date}` : ''}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        if (res.status === 200) {
            return res.json()
        }
        if (res.status === 401) {
            refreshToken()
        }
        return null;
    }

    const getCategoryById = async (categoryId: number, date: string | null = null) => {
        const res = await fetch(`${BASE_URL}/category/${categoryId}${date ? `?date=${date}` : ''}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        const category = await res.json();
        category.pathLabel = await getCategoryPathLabelById(categoryId);
        return category;
    }

    const getCategoryPathLabelById = async (categoryId: number, date: string | null = null) => {
        const resPathLabel = await fetch(`${BASE_URL}/category/${categoryId}/pathLabel`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        return await resPathLabel.json()
    }

    const getPossibleParents = async (categoryId: number) => {
        const res = await fetch(`${BASE_URL}/category/${categoryId}/possibleParents`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        return res.json();
    }

    const getAllCategories = async () => {
        const res = await fetch(`${BASE_URL}/category/withPathLabel`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        return res.json();
    }

    const createCategory = async (category: CategoryBody) => {
        const res = await fetch(`${BASE_URL}/category`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(category)
        });
        return res.json();
    }

    const updateCategory = async (category: Category) => {
        const res = await fetch(`${BASE_URL}/category/${category.id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'PATCH',
            body: JSON.stringify(category)
        });
        return res.json();
    }

    const deleteCategory = async (categoryId: number) => {
        console.log("Deleting category with ID:", categoryId);
        const res = await fetch(`${BASE_URL}/category/${categoryId}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'DELETE',
        });
        console.log("Delete Category Response:", res);
        return res.json();
    }

    const getLatestDate = async () => {
        const res = await fetch(`${BASE_URL}/transaction/latestDate`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        const latestDate = await res.json()
        return new Date(latestDate);
    }

    // TRANSACTIONS

    const getTransactionsOfCategory = async (categoryId: number, date: string | null = null) => {
        const res = await fetch(`${BASE_URL}/category/${categoryId}/transactions${date ? `?date=${date}` : ''}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET',
        });
        const data = await res.json();
        const transactions: Transaction[] = data.map(t => ({
            ...t,
            date: new Date(t.date)
        }))
        return transactions;
    }

    const createTransaction = async (transaction: Transaction) => {
        const res = await fetch(`${BASE_URL}/transaction`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(transaction)
        });
        return res.json();
    }

    const getTransactionById = async (id: number) => {
        const res = await fetch(`${BASE_URL}/transaction/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET'
        });
        const fetchedTransaction = await res.json();
        return { ...fetchedTransaction, date: new Date(fetchedTransaction.date) }
    }

    const updateTransaction = async (transaction: Transaction) => {
        const res = await fetch(`${BASE_URL}/transaction/${transaction.id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'PATCH',
            body: JSON.stringify(transaction)
        });
        return res.json();
    }

    const deleteTransaction = async (id: number) => {
        const res = await fetch(`${BASE_URL}/transaction/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'DELETE',
        });
        return res.json();
    }

    // TEMPLATES
    const getTemplates = async () => {
        const res = await fetch(`${BASE_URL}/template`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET'
        });
        return res.json();
    }

    const getTemplateById = async (id: number) => {
        const res = await fetch(`${BASE_URL}/template/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET'
        });
        return await res.json();
    }

    const createTemplate = async (template: TemplateBody) => {
        const res = await fetch(`${BASE_URL}/template`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(template)
        });
        return res.json();
    }

    const updateTemplate = async (template: Template) => {
        const res = await fetch(`${BASE_URL}/template/${template.id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'PATCH',
            body: JSON.stringify({ name: template.name })
        });
        return res.json();
    }

    const deleteTemplate = async (id: number) => {
        const res = await fetch(`${BASE_URL}/template/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'DELETE'
        });
        return await res.json();
    }

    const getTemplateTransactionById = async (id: number) => {
        const res = await fetch(`${BASE_URL}/template/transaction/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'GET'
        });
        return await res.json();
    }

    const createTemplateTransaction = async (templateTransaction: TemplateTransactionBody) => {
        const res = await fetch(`${BASE_URL}/template/transaction`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(templateTransaction)
        });
        return res.json();
    }

    const updateTemplateTransaction = async (templateTransaction: TemplateTransaction) => {
        const res = await fetch(`${BASE_URL}/template/transaction/${templateTransaction.id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'PATCH',
            body: JSON.stringify(templateTransaction)
        });
        return res.json();
    }

    const deleteTemplateTransaction = async (id: number) => {
        const res = await fetch(`${BASE_URL}/template/transaction/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'DELETE'
        });
        return await res.json();
    }

    return {
        getFirstLevelCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        getPossibleParents,
        getLatestDate,
        getTransactionsOfCategory,
        createTransaction,
        getTransactionById,
        updateTransaction,
        deleteTransaction,
        getAllCategories,
        getTemplates,
        getTemplateById,
        createTemplateTransaction,
        getCategoryPathLabelById,
        updateTemplate,
        createTemplate,
        getTemplateTransactionById,
        updateTemplateTransaction,
        deleteTemplateTransaction
    };
}


