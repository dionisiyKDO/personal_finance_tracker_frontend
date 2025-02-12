<script lang="ts">
	import { user } from '$lib/auth';
	import { postEditTransaction, fetchTransactions, type Transaction } from './load';

	const transactionsReq: Promise<Transaction[] | null> = fetchTransactions($user);

	let editTransaction: Transaction;
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

	// function handleEdit(event: Event) {
	// 	event.preventDefault();
	// 	const form = event.target as HTMLFormElement;
	// 	const transaction: Transaction = {
	// 		id: form.id.value,
	// 		date: new Date().toISOString(),
	// 		amount: form.amount.value,
	// 		currency: 'USD',
	// 		category: form.category.value,
	// 		description: form.description.value,
	// 		vendor: form.vendor.value,
	// 		type: 'expense'
	// 	};
	// 	postEditTransaction(transaction, $user);
	// }

	function handleDelete(transaction: Transaction) {
		console.log(transaction);
	}

    // fetch categories
	const categories = [
		'Food & Dining',
		'Shopping',
		'Transportation',
		'Bills & Utilities',
		'Entertainment',
		'Travel',
		'Healthcare',
		'Education',
		'Other'
	];

	let transactions = $state<Transaction[]>([]);
	let isModalOpen = $state(false);
	let editedTransaction = $state<Transaction>({} as Transaction);
	let sortField = $state('date');
	let sortDirection = $state<'asc' | 'desc'>('desc');

	// Modal handling
	const openModal = (transaction: Transaction) => {
		editedTransaction = { ...transaction };
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		transactions = transactions.map((t) => (t.id === editedTransaction.id ? editedTransaction : t));
		closeModal();
	};
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
										<button class="button" onclick={() => {isModalOpen = true; editedTransaction = transaction}}> Edit </button>
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
		{/if}
	</div>

	<!-- Edit Modal -->
	<!-- {#if openModalEdit}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-[--surface] rounded-lg shadow-lg p-4 w-96">
                <h3 class="text-2xl font-semibold">Edit Transaction</h3>
                <form onsubmit={handleEdit}>
                    <input type="hidden" name="id" value={transaction.id} />
                    <input type="text" placeholder="Date" />
                    <input type="text" placeholder="Amount" />
                    <input type="text" placeholder="Category" />
                    <input type="text" placeholder="Description" />
                    <input type="text" placeholder="Vendor" />
                    <button type="submit" class="button">Save</button>
                </form>
            </div>
        </div>
    {/if} -->
	<!-- Modal -->
	{#if isModalOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4"
			style="background-color: rgba(18, 18, 18, 0.5);"
			onclick={handleClickOutside}
		>
			<div
				class="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg shadow-xl"
				style="background-color: var(--surface);"
			>
				<div
					class="flex items-center justify-between border-b p-6"
					style="border-color: var(--border);"
				>
					<h2 class="text-xl font-semibold" style="color: var(--primary-text);">
						Edit Transaction
					</h2>
					<button
						class="rounded-full p-2 transition-colors"
						style="color: var(--primary-text); hover:background-color: var(--muted-background);"
						onclick={closeModal}
					>
						x
					</button>
				</div>

				<form onsubmit={handleSubmit} class="space-y-4 p-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- Date -->
						<div class="space-y-2">
							<label
								for="date"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Date</label
							>
							<input
								type="datetime-local"
								id="date"
								bind:value={editedTransaction.date}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
								required
							/>
						</div>

						<!-- Type -->
						<div class="space-y-2">
							<label
								for="type"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Type</label
							>
							<input
								type="text"
								id="type"
								bind:value={editedTransaction.type}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
								required
							/>
						</div>

						<!-- Amount -->
						<div class="space-y-2">
							<label
								for="amount"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Amount</label
							>
							<input
								type="number"
								id="amount"
								bind:value={editedTransaction.amount}
								step="0.01"
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
								required
							/>
						</div>

						<!-- Original Amount -->
						<div class="space-y-2">
							<label
								for="original_amount"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Original Amount</label
							>
							<input
								type="number"
								id="original_amount"
								bind:value={editedTransaction.original_amount}
								step="0.01"
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
							/>
						</div>

						<!-- Currency -->
						<div class="space-y-2">
							<label
								for="currency"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Currency</label
							>
							<input
								type="text"
								id="currency"
								bind:value={editedTransaction.currency}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
								required
							/>
						</div>

						<!-- Original Currency -->
						<div class="space-y-2">
							<label
								for="original_currency"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Original Currency</label
							>
							<input
								type="text"
								id="original_currency"
								bind:value={editedTransaction.original_currency}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
							/>
						</div>

						<!-- Card -->
						<div class="space-y-2">
							<label
								for="card"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Card</label
							>
							<input
								type="text"
								id="card"
								bind:value={editedTransaction.card}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
								required
							/>
						</div>

						<!-- Category -->
                        <!-- try multiselect -->
						<div class="space-y-2">
							<label
								for="category"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Category</label
							>
							<select
								id="category"
								bind:value={editedTransaction.category}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
								required
							>
								{#each categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</div>

						<!-- Vendor -->
						<div class="space-y-2">
							<label
								for="vendor"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Vendor</label
							>
							<input
								type="text"
								id="vendor"
								bind:value={editedTransaction.vendor}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
							/>
						</div>

						<!-- Transaction Source -->
						<div class="space-y-2">
							<label
								for="transaction_source"
								class="block text-sm font-medium"
								style="color: var(--primary-text);">Source</label
							>
							<input
								type="text"
								id="transaction_source"
								bind:value={editedTransaction.transaction_source}
								class="w-full rounded-md px-3 py-2"
								style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
							/>
						</div>
					</div>

					<!-- Description -->
					<div class="space-y-2">
						<label
							for="description"
							class="block text-sm font-medium"
							style="color: var(--primary-text);">Description</label
						>
						<textarea
							id="description"
							bind:value={editedTransaction.description}
							rows="3"
							class="w-full rounded-md px-3 py-2"
							style="background-color: var(--input-background); color: var(--primary-text); border: 1px solid var(--border);"
						></textarea>
					</div>

					<div class="flex justify-end gap-3 border-t pt-4" style="border-color: var(--border);">
						<button
							type="button"
							class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
							style="background-color: var(--muted-surface); color: var(--primary-text); border: 1px solid var(--border);"
							onclick={closeModal}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
							style="background-color: var(--primary); color: var(--primary-text); hover:background-color: var(--primary-hover);"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Debug section -->
	<div class="mt-8 rounded bg-[--surface] p-4">
		<h3 class="font-mono text-sm">Debug Data:</h3>
		<pre class="overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
	</div>
{/await}
