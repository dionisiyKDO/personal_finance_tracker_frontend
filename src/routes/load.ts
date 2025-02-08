import { type User } from '$lib/auth';
import { get } from 'svelte/store';

interface BasicStats {
    income: {
        total: number;
        avg: number;
        count: number;
        max: number;
        min: number;
    };
    expenses: {
        total: number;
        avg: number;
        count: number;
        max: number;
        min: number;
    };
    net: number;
    total_transactions: number;
}

interface CategoryBreakdown {
    category: string;
    total: number;
    count: number;
    avg: number;
}

interface MonthlyTrend {
    month: string;
    type: 'income' | 'expense';
    total: number;
    count: number;
}

interface CurrencyExposure {
    currency: string;
    total_amount: number;
    transaction_count: number;
    original_currency_count: number;
}

interface VendorAnalysis {
    vendor: string;
    total_spent: number;
    transaction_count: number;
    avg_transaction: number;
}

interface SpendingPatterns {
    hour_distribution: {
        hour: number;
        total: number;
        count: number;
    }[];
    dow_distribution: {
        dow: number;
        total: number;
        count: number;
    }[];
}

interface DashboardData {
    basic_stats: BasicStats;
    expense_categories: CategoryBreakdown[];
    income_categories: CategoryBreakdown[];
    monthly_trends: MonthlyTrend[];
    currencies: CurrencyExposure[];
    top_vendors: VendorAnalysis[];
    patterns: SpendingPatterns;
}

export async function fetchDashboardData(user: User | null): Promise<DashboardData | null> {
    try {
        if (!user) { return null; } 
        
        const response = await fetch('/api/dashboard-data/', {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}`, 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const data = await response.json();
            const error = data.error || "Failed to fetch dashboard data";
            console.log(error);
            return null; // Login failed
        }

        const data = await response.json() as DashboardData;
        return data;
        
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
}

