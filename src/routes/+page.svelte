<script lang="ts">
    import { user } from '$lib/auth';
    import { fetchDashboardData } from './load';
    
    const dashboardDataReq: Promise<any> = fetchDashboardData($user);

    // Helper function to format currency
    const formatCurrency = (amount: number | null, currency = 'UAH') => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    // Debug function
    dashboardDataReq.then(data => {
        console.log('Dashboard data received:', data);
    }).catch(err => {
        console.error('Dashboard data error:', err);
    });

    let categoriesShowAll = false;
    let vendorsShowAll = false;
</script>

<div class="p-4 container mx-auto">
    <h1 class="text-3xl font-bold mb-6">Financial Dashboard</h1>

    {#await dashboardDataReq}
        <div class="flex items-center justify-center h-64">
            <p class="text-gray-500">Loading dashboard data...</p>
        </div>
    {:then dashboardData}
        {#if dashboardData && dashboardData.data && dashboardData.data.basic_stats}
            <!-- Basic Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-[--surface] p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-200">Income</h3>
                    <p class="text-2xl font-bold text-green-600">
                        {formatCurrency(dashboardData.data.basic_stats.income.total)}
                    </p>
                    <p class="text-sm text-gray-500">
                        {dashboardData.data.basic_stats.income.count || 0} transactions
                    </p>
                </div>

                <div class="bg-[--surface] p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-200">Expenses</h3>
                    <p class="text-2xl font-bold text-red-600">
                        {formatCurrency(dashboardData.data.basic_stats.expenses.total)}
                    </p>
                    <p class="text-sm text-gray-500">
                        {dashboardData.data.basic_stats.expenses.count || 0} transactions
                    </p>
                </div>

                <div class="bg-[--surface] p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-200">Net Balance</h3>
                    <p class="text-2xl font-bold" class:text-green-600={dashboardData.data.basic_stats.net > 0} 
                       class:text-red-600={dashboardData.data.basic_stats.net < 0}>
                        {formatCurrency(dashboardData.data.basic_stats.net)}
                    </p>
                    <p class="text-sm text-gray-500">
                        {dashboardData.data.basic_stats.total_transactions || 0} total transactions
                    </p>
                </div>
            </div>

            <!-- Category Breakdown -->
            {#if dashboardData.data.expense_categories}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <!-- Expense Categories -->
                    <div class="bg-[--surface] py-4 rounded-lg shadow">
                        <div class="flex justify-between items-center mb-4 px-4">
                            <h3 class="text-lg font-semibold">Expense Categories</h3>
                            {#if dashboardData.data.expense_categories.length > 5}
                                <button class="inline-button" onclick={() => categoriesShowAll = !categoriesShowAll}>
                                    {categoriesShowAll ? 'Show less' : 'Show all'}
                                </button>
                            {/if}
                        </div>
                        <div class="space-y-1">
                            {#each dashboardData.data.expense_categories as category, index}
                                {#if categoriesShowAll || index < 5}    
                                    <div class="flex justify-between items-center even:bg-[--muted-surface] px-4 py-1">
                                        <span class="capitalize">{category.category || 'Uncategorized'}</span>
                                        <div class="text-right">
                                            <div class="font-semibold">{formatCurrency(category.total)}</div>
                                            <div class="text-sm text-gray-500">{category.count} transactions</div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>

                    <!-- Top Vendors -->
                    {#if dashboardData.data.top_vendors}
                        <div class="bg-[--surface] py-4 rounded-lg shadow">
                            <div class="flex justify-between items-center mb-4 px-4">
                                <h3 class="text-lg font-semibold">Top Vendors</h3>
                                {#if dashboardData.data.top_vendors.length > 5}
                                    <button class="inline-button" onclick={() => vendorsShowAll = !vendorsShowAll}>
                                        {vendorsShowAll ? 'Show less' : 'Show all'}
                                    </button>
                                {/if}
                            </div>
                            <div class="space-y-1">
                                {#each dashboardData.data.top_vendors as vendor, index}
                                    {#if vendorsShowAll || index < 5}    
                                        <div class="flex justify-between items-center even:bg-[--muted-surface] px-4 py-1">
                                            <span class="w-2/3 text-nowrap overflow-x-hidden text-ellipsis">{vendor.vendor || 'Unknown'}</span>
                                            <div class="text-right">
                                                <div class="font-semibold">{formatCurrency(vendor.total_spent)}</div>
                                                <div class="text-sm text-gray-500">{vendor.transaction_count} transactions</div>
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}

            <!-- Debug section -->
            <div class="mt-8 p-4 bg-[--surface] rounded">
                <h3 class="text-sm font-mono">Debug Data:</h3>
                <pre class="text-xs overflow-auto">{JSON.stringify(dashboardData, null, 2)}</pre>
            </div>

        {:else}
            <div class="bg-[--surface] border border-yellow-200 text-yellow-600 p-4 rounded-lg">
                <p>No dashboard data available</p>
            </div>
        {/if}
    {:catch error}
        <div class="bg-[--surface] border border-red-200 text-red-700 p-4 rounded-lg">
            <p>Error loading dashboard: {error}</p>
        </div>
    {/await}
</div>