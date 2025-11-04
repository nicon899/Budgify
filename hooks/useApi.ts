import { useAuth } from "@/contexts/AuthContext";
import { Category } from "@/types/Category";
import { Transaction } from "@/types/Transaction";

export const BASE_URL = "http://localhost:3000/api";

export function useApi() {
    const { actions: auth, token } = useAuth();

    const refreshToken = async () => {
        auth.refreshToken()
    }

    // CATEGORIES
    const getFirstLevelCategories = async (date: string | null = null) => {
        console.log(token)
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
        return res.json();
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

    const createCategory = async (category: Category) => {
        const res = await fetch(`${BASE_URL}/category`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'CREATE',
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
        const res = await fetch(`${BASE_URL}/category/${categoryId}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            method: 'DELETE',
        });
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
        return res.json();
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
        deleteTransaction
    };
}


