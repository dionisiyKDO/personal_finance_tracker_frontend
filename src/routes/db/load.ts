import { type User } from '$lib/auth';

export interface Transaction {
    id: number
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

