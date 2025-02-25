import { type User } from '$lib/auth';

export interface Categories {
    categories: string[]
}

export async function fetchCategories(user: User | null): Promise<Categories | null> {
    try {
        if (!user) { return null; } 
        
        const isStandalone = window.location.port !== '8000';
        const apiBase = isStandalone ? 'http://localhost:8000' : '';
        
        const response = await fetch(`${apiBase}/api/transactions/categories/`, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}`, 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const data = await response.json();
            const error = data.error || "Failed to fetch categories";
            console.log(error);
            return null;
        }

        const data = await response.json() as Categories;
        return data;
        
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
}

export interface Transaction {
    id: number | null
    date: string
    type: string
    amount: string
    card: string
    category: string
    description: any
    currency: string
    original_amount: string
    original_currency: string
    balance_after_transaction: string
    vendor: string
    transaction_source: string
    created_at: string
    updated_at: string
    user: number
}

export async function fetchTransactions(user: User | null): Promise<Transaction[] | null> {
    try {
        if (!user) { return null; } 
        
        const isStandalone = window.location.port !== '8000';
        const apiBase = isStandalone ? 'http://localhost:8000' : '';
        
        const response = await fetch(`${apiBase}/api/transactions/`, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}`, 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const data = await response.json();
            const error = data.error || "Failed to fetch transactions";
            console.log(error);
            return null;
        }

        const data = await response.json() as Transaction[];
        return data;
        
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
}

export async function postEditTransaction(transaction: Transaction, user: User | null): Promise<Transaction | null> {
    try {
        if (!user) { return null; } 
        
        const isStandalone = window.location.port !== '8000';
        const apiBase = isStandalone ? 'http://localhost:8000' : '';
        
        const response = await fetch(`${apiBase}/api/transactions/${transaction.id}/`, {
            method: 'PUT',
            headers: { Authorization: `Token ${user.token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            const data = await response.json();
            const error = data.error || "Failed to edit transaction";
            console.log(error);
            return null;
        }

        const data = await response.json() as Transaction;
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
}

export async function postDeleteTransaction(transaction: Transaction, user: User | null): Promise<Boolean | null> {
    try {
        if (!user) { return null; } 
        
        const isStandalone = window.location.port !== '8000';
        const apiBase = isStandalone ? 'http://localhost:8000' : '';
        
        const response = await fetch(`${apiBase}/api/transactions/${transaction.id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Token ${user.token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            const data = await response.json();
            const error = data.error || "Failed to delete transaction";
            console.log(error);
            return null;
        }
        
        return true;
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
}