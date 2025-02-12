<script lang="ts">
	import { user } from '$lib/auth';
	import { postEditTransaction, fetchTransactions, type Transaction } from './load';

	const transactionsReq: Promise<Transaction[] | null> = fetchTransactions($user);

    let openModalEdit = false;

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
		// return new Date(dateString).toLocaleDateString('uk-UA', {
		// 	year: 'numeric',
		// 	month: 'short',
		// 	day: 'numeric',
		// 	hour: '2-digit',
		// 	minute: '2-digit'
		// });
	};

	// Format amount with currency
	const formatAmount = (amount: string, currency: string) => {
		return `${amount} ${currency}`;
	};

    function handleEdit(transaction: Transaction) {
        postEditTransaction(transaction, $user);
    }



    function handleDelete(transaction: Transaction) {
        console.log(transaction);
    }
</script>

{#await transactionsReq}
	<div class="flex h-64 items-center justify-center">
		<p class="text-gray-500">Loading your transactions...</p>
	</div>
{:then data}
	<div class="rounded-lg bg-[--surface] pt-4 shadow">
		{#if data === null || data.length === 0}
			<p class="px-4 text-3xl font-semibold text-gray-500">No transactions found.</p>
		{:else}
			<h3 class="border-b border-[--border] px-4 pb-2 text-3xl font-semibold text-[--foreground]">
				Recent Transactions
			</h3>

			<table class="w-full table-fixed text-sm">
				<thead>
					<tr class="border-b border-[--border] bg-[--surface]">
						<th class="h-12 w-28 px-4 text-center align-middle font-medium">
							<button class="inline-flex items-center gap-2 hover:text-blue-600">
								<!-- onclick={() => handleSort("date")} -->
								Date
							</button>
						</th>
						<th class="h-12 w-36 px-4 text-right align-middle font-medium">
							<button class="inline-flex items-center gap-2 hover:text-blue-600">
								<!-- on:click={() => handleSort("amount")} -->
								Amount
							</button>
						</th>
						<th class="h-12 w-36 px-4 text-left align-middle font-medium">Category</th>
						<th class="h-12 px-4 text-left align-middle font-medium">Description</th>
						<th class="h-12 w-36 px-4 text-left align-middle font-medium">Vendor</th>
						<th class="h-12 w-28 px-4 text-center align-middle font-medium">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data as transaction, index}
						{#if index < 5}
							<tr class="border-b border-[--border] transition-colors hover:bg-[--muted-surface]">
								<td class="p-4 text-center">{formatDate(transaction.date)}</td>
								<td
									class="p-4 text-right"
									class:text-red-500={transaction.type == 'expense'}
									class:text-green-500={transaction.type == 'income'}
								>
									{formatAmount(transaction.amount, transaction.currency)}
								</td>
								<td class="p-4">{transaction.category}</td>
								<td class="max-w-md truncate p-4" title={transaction.description || ''}>
									{transaction.description || '-'}
								</td>
								<td class="p-4">{transaction.vendor}</td>
								<td class="p-4 text-right">
									<div class="flex flex-col justify-end">
										<button
											class="button"
											onclick={() => openModalEdit = true}
										>
											Edit
										</button>
										<button
											class="button text-[--destructive] hover:text-[--destructive-hover]"
											onclick={() => handleDelete(transaction)}
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>

			<!-- {#each data as transaction, index}
				{#if index < 5}
					<div class="realtive flex flex-row items-center px-4 py-4 odd:bg-[--muted-surface]">
						<div class="flex w-72 shrink-0 flex-col">
							<h3 class="text-lg font-semibold text-gray-200">{transaction.vendor}</h3>

							{#if transaction.category}
								<p class="text-sm text-gray-500">{transaction.category}</p>
							{/if}
						</div>
						<div class="w-4"></div>
						<div class="w-56 shrink-0">
							{#if transaction.type === 'expense'}
								<p class="text-3xl font-bold text-red-600">
									-{transaction.amount}
								</p>
							{:else if transaction.type === 'income'}
								<p class="text-3xl font-bold text-green-600">
									{transaction.amount}
								</p>
							{/if}
						</div>
						<div class="w-4 flex-1"></div>

						<p class="text-sm text-gray-500">
							{parseDate(transaction.date)}
						</p>
                        <button class="button ml-4" on:click={() => console.log(transaction)}>
                            Edit
                        </button>
					</div>
				{/if}
			{/each} -->
		{/if}
	</div>

	<!-- Debug section -->
	<div class="mt-8 rounded bg-[--surface] p-4">
		<h3 class="font-mono text-sm">Debug Data:</h3>
		<pre class="overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
	</div>
{/await}
