<script lang="ts">
	import { user } from '$lib/auth';
	import { postEditTransaction, postDeleteTransaction, fetchTransactions, fetchCategories, type Transaction, type Categories } from './load';

	// #region Variables initialization
	const transactionsReq: Promise<Transaction[] | null> = fetchTransactions($user);

	let transactions = $state<Transaction[]>([]);
	let editedTransaction = $state<Transaction>({} as Transaction);

	let showDeleteConfirm = $state<number | null>(null);
	let isModalOpen = $state(false);
	let sortField = $state('date');
	let sortDirection = $state<'asc' | 'desc'>('desc');

	let categories = $state<string[] | undefined>([]);
	fetchCategories($user).then((data) => {
		categories = data?.categories;
	});
	// #endregion

	// #region Modal handling
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
		const form = e.target as HTMLFormElement;
		editedTransaction.date = form.date.value;
		transactions = transactions.map((t) => (t.id === editedTransaction.id ? editedTransaction : t));
		let receivedTransaction = postEditTransaction(editedTransaction, $user);
		// TODO: receive updated transaction
		closeModal();
	};
	//  #endregion

	// #region Helper functions
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	const formatAmount = (amount: string, currency: string, type: string) => {
		if (type === 'expense') {
			return `-${amount} ${currency}`;
		}
		return `${amount} ${currency}`;
	};
	// #endregion

	// #region Delete handling
	function handleDelete(transaction: Transaction) {
		if (showDeleteConfirm === transaction.id) {
			console.log('Deleting transaction:', transaction);
			postDeleteTransaction(transaction, $user);
			showDeleteConfirm = null;
		} else {
			showDeleteConfirm = transaction.id;
		}
	}

	function cancelDelete() {
		showDeleteConfirm = null;
	}
	// #endregion
</script>

<!-- TODO: Update table on update and delete -->
{#await transactionsReq}
	<div class="flex h-64 items-center justify-center">
		<p class="text-gray-500">Loading your transactions...</p>
	</div>
{:then data}
	<!-- #region Table -->
	<div class="rounded-lg bg-[--surface] pt-4 shadow">
		{#if data === null || data.length === 0}
			<p class="px-4 text-3xl font-semibold text-gray-500">No transactions found.</p>
		{:else}
			<h3 class="border-b border-[--border] px-4 pb-2 text-3xl font-semibold text-[--primary-text]">
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
				<tbody class="divide-y divide-[--border] divide-solid">
					{#each data as transaction, index}
						{#if index < 5}
							<tr class="transition-colors hover:bg-[--muted-surface]">
								<td class="p-4 text-center">{formatDate(transaction.date)}</td>
								<td
									class="p-4 text-right font-semibold"
									class:text-red-500={transaction.type == 'expense'}
									class:text-green-500={transaction.type == 'income'}
								>
									{formatAmount(transaction.amount, transaction.currency, transaction.type)}
								</td>
								<td class="p-4">{transaction.category}</td>
								<td class="truncate p-4" title={transaction.description || ''}>
									{transaction.description || '-'}
								</td>
								<td class="p-4">{transaction.vendor}</td>
								<td class="p-4 text-right">
									<div class="flex flex-col items-center">
										<button class="button" onclick={() => openModal(transaction)}>Edit</button>
										<div class="delete-actions">
											{#if showDeleteConfirm === transaction.id}
												<!-- svelte-ignore a11y_no_static_element_interactions -->
												<div
													class="bottom absolute right-4 rounded-md border border-[--border] bg-[--surface] p-2 shadow-lg"
												>
													<p class="mb-2 text-sm">Delete this transaction?</p>
													<div class="flex justify-around gap-2">
														<button
															class="rounded px-2 py-1 text-xs hover:bg-[--muted-surface] transition-all duration-100 ease-in-out"
															onclick={cancelDelete}
														>
															Cancel
														</button>
														<button
															class="rounded bg-[--destructive] px-2 py-1 text-xs text-white hover:bg-[--destructive-hover] transition-all duration-100 ease-in-out"
															onclick={() => handleDelete(transaction)}
														>
															Confirm
														</button>
													</div>
												</div>
											{/if}
											<button
												class="button text-[--destructive] hover:text-[--destructive-hover]"
												onclick={() => handleDelete(transaction)}
											>
												Delete
											</button>
										</div>
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
	<!-- #endregion -->

	<!-- #region Modal -->
	{#if isModalOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->

		<!-- shadow background -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
			onclick={handleClickOutside}
		>
			<!-- Modal window -->
			<div class="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-[--surface] shadow-xl">
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-[--border] p-6">
					<h2 class="text-xl font-semibold">Edit Transaction</h2>

					<!-- Cross close button -->
					<button
						type="button"
						onclick={closeModal}
						class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border-0 border-solid border-[--border] bg-transparent text-sm text-[--primary-text] transition-all duration-100 ease-in-out hover:border hover:bg-[--muted-surface]"
					>
						<svg
							class="h-3 w-3"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
							/>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>

				<form onsubmit={handleSubmit} class="space-y-4 p-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- Date -->
						<div class="space-y-2">
							<label for="date" class="block text-sm font-medium">Date</label>
							<input
								type="datetime-local"
								id="date"
								value={new Date(editedTransaction.date).toISOString().slice(0, 16)}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
								required
							/>
						</div>

						<!-- Type -->
						<div class="space-y-2">
							<label for="type" class="block text-sm font-medium">Type</label>
							<select
								id="type"
								bind:value={editedTransaction.type}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
								required
							>
								<option value="income">Income</option>
								<option value="expense">Expense</option>
							</select>
						</div>

						<!-- Amount -->
						<div class="space-y-2">
							<label for="amount" class="block text-sm font-medium">Amount</label>
							<input
								type="number"
								id="amount"
								bind:value={editedTransaction.amount}
								step="0.01"
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
								required
							/>
						</div>

						<!-- Original Amount -->
						<div class="space-y-2">
							<label for="original_amount" class="block text-sm font-medium">Original Amount</label>
							<input
								type="number"
								id="original_amount"
								bind:value={editedTransaction.original_amount}
								step="0.01"
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
							/>
						</div>

						<!-- Currency -->
						<div class="space-y-2">
							<label for="currency" class="block text-sm font-medium">Currency</label>
							<input
								type="text"
								id="currency"
								bind:value={editedTransaction.currency}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
								required
							/>
						</div>

						<!-- Original Currency -->
						<div class="space-y-2">
							<label for="original_currency" class="block text-sm font-medium">OG Currency</label>
							<input
								type="text"
								id="original_currency"
								bind:value={editedTransaction.original_currency}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
							/>
						</div>

						<!-- Card -->
						<div class="space-y-2">
							<label for="card" class="block text-sm font-medium">Card</label>
							<input
								type="text"
								id="card"
								bind:value={editedTransaction.card}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
								required
							/>
						</div>

						<!-- Category -->
						<div class="space-y-2">
							<label for="category" class="block text-sm font-medium">Category</label>
							<select
								id="category"
								bind:value={editedTransaction.category}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
								required
							>
								<!-- TODO: multiselect -->
								{#each categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</div>

						<!-- Vendor -->
						<div class="space-y-2">
							<label for="vendor" class="block text-sm font-medium">Vendor</label>
							<input
								type="text"
								id="vendor"
								bind:value={editedTransaction.vendor}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
							/>
						</div>

						<!-- Transaction Source -->
						<div class="space-y-2">
							<label for="transaction_source" class="block text-sm font-medium">Source</label>
							<input
								type="text"
								id="transaction_source"
								bind:value={editedTransaction.transaction_source}
								class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
							/>
						</div>
					</div>

					<!-- Description -->
					<div class="space-y-2">
						<label for="description" class="block text-sm font-medium">Description</label>
						<textarea
							id="description"
							bind:value={editedTransaction.description}
							rows="3"
							class="w-full rounded-md border border-solid border-[--border] bg-[--input-background] px-3 py-2"
						></textarea>
					</div>

					<div class="flex justify-end gap-3 border-t pt-4" style="border-color: var(--border);">
						<button
							type="button"
							class="rounded-md border border-solid border-[--border] bg-[--muted-surface] px-4 py-2 text-sm font-medium transition-colors"
							onclick={closeModal}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="rounded-md border border-solid border-[--border] bg-[--primary] px-4 py-2 text-sm font-semibold text-[--primary-dark-text] transition-colors hover:bg-[--primary-hover]"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
	<!-- #endregion -->

	<!-- #region Debug section -->
	<div class="mt-8 rounded bg-[--surface] p-4">
		<h3 class="font-mono text-sm">Debug Data:</h3>
		<pre class="overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
	</div>
	<!-- #endregion -->
{/await}
