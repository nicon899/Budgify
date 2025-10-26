import { useAuth } from "@/contexts/AuthContext";

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

    return {
        getFirstLevelCategories,
        getCategoryById,
    };
}


