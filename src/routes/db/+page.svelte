<script lang="ts">
    import { user } from '$lib/auth';
    import { fetchTransactions, type Transaction } from './load';

    const transactionsReq: Promise<Transaction[] | null> = fetchTransactions($user);
</script>


{#await transactionsReq}
    <div class="flex items-center justify-center h-64">
        <p class="text-gray-500">Loading your transactions...</p>
    </div>
{:then data} 
    <div class="bg-[--surface] pt-4 rounded-lg shadow">
        {#if data === null || data.length === 0}
            <p class="text-3xl font-semibold text-gray-500 px-4">No transactions found.</p>
        {:else}

            <h3 class="text-3xl font-semibold text-[--foreground] border-b border-[--border] pb-2 px-4">Recent Transactions</h3>
            {#each data as transaction, index}
                {#if index < 5}
                    <!-- TODO: spacing of row's cells -->
                    <div class="flex justify-between items-center odd:bg-[--muted-surface] px-4 py-4">
                        <h3 class="text-lg font-semibold text-gray-200">{transaction.vendor}</h3>
                        
                        {#if transaction.category}
                            <p class="text-sm text-gray-500">{transaction.category}</p>
                        {/if}
                        {#if transaction.type === 'expense'}
                            <p class="text-2xl font-bold text-red-600">
                                -{transaction.amount}
                            </p>
                        {:else if transaction.type === 'income'}
                            <p class="text-2xl font-bold text-green-600">
                                {transaction.amount}
                            </p>
                        {/if}
                        <p class="text-sm text-gray-500">
                            {transaction.date}
                        </p>
                    </div>
                {/if}
            {/each}
            
        {/if}
    </div>

    <!-- Debug section -->
    <div class="mt-8 p-4 bg-[--surface] rounded">
        <h3 class="text-sm font-mono">Debug Data:</h3>
        <pre class="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
{/await}