<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { browser } from '$app/environment';
	import { account, connectWallet, web3 } from '@/stores/web3store';
	import ArisanAbi from '@/abi/arisan.abi.json';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Toaster, toast } from 'svelte-sonner';
	import { TransactionRevertedWithoutReasonError } from 'web3';

	let arisanContract: any;

	let errorMessage = '';
	let currentAccount: string | null;

	account.subscribe((value) => {
		currentAccount = value;
	});

	const contractDetail = writable<any>({});

	$: if ($web3 && currentAccount) {
		console.log('Web3 is connected');

		const contractAddress = '0xAb08A2846e3fe81A8d2cF4afd303FAdC6F1fC455';

		arisanContract = new $web3.eth.Contract(ArisanAbi as any, contractAddress);
		updateContractDetails();
	}

	function isNullAddress(address: string) {
		const nullAddress = '0x0000000000000000000000000000000000000000';
		return address.toLowerCase() == nullAddress.toLowerCase();
	}
	async function updateContractDetails() {
		if (!$web3) return;
		try {
			// Get owner address
			const ownerAddress = await arisanContract.methods.owner().call();
			$contractDetail.owner = ownerAddress;

			// Get arisan balance
			const balanceInWei = await arisanContract.methods.balance().call();
			const balanceInEther = $web3.utils.fromWei(balanceInWei, 'ether');

			$contractDetail.balance = balanceInEther;

			// get account balance
			if (currentAccount) {
				const accountBalance = await $web3.eth.getBalance(currentAccount);
				const accountBalanceInEther = $web3.utils.fromWei(accountBalance, 'ether');
				$contractDetail.accountBalance = accountBalanceInEther;
			}

			// Get winner address
			const winnerAddress = await arisanContract.methods.winner().call();
			$contractDetail.winner = !isNullAddress(winnerAddress)
				? winnerAddress
				: 'Arisan has not been won yet';

			loadMember();

			// Update connected address
		} catch (error) {
			errorMessage = (error as any).message;
		}
	}

	async function loadMember() {
		// Get members
		const members = await arisanContract.methods.getMembers().call();
		$contractDetail.members = members;
	}

	let memberAddress: string;

	async function estimateGasForRegisterMember() {
		if (!$web3) return;
		const gasEstimate = await arisanContract.methods
			.registerMember(memberAddress.toLowerCase())
			.estimateGas({ from: currentAccount });
		console.log('Estimated gas:', gasEstimate);
		return gasEstimate;
	}
	async function addMember() {
		if (!$web3) return;

		let gasEstimate: any;
		try {
			gasEstimate = await estimateGasForRegisterMember();
		} catch (error: any) {
			console.log(error?.data);
			if (error?.data?.data?.reason) {
				toast.error(error?.data?.data?.reason);
			}
			return;
		}
		try {
			if (!gasEstimate) {
				toast.error('Failed to estimate gas');
				return;
			}
			const result = await arisanContract.methods
				.registerMember(memberAddress.toLowerCase())
				.send({ from: currentAccount, gas: gasEstimate });
			console.log('Member registered successfully:', result);
			console.log('Member registered successfully:', result.transactionHash);
			toast.success('Member registered successfully');
			loadMember();
		} catch (error) {
			console.error('Error registering member:', error);
			toast.error('Failed to register member');
			errorMessage = error.message;
		}
	}
</script>

<Toaster richColors />

<div class="bg-gray-100 px-6 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl font-bold">Arisan</h1>
		{#if currentAccount}
			<div class="space-y-6 rounded-lg bg-white p-6 shadow-md">
				<div>
					<h2 class="mb-2 text-xl font-semibold">Contract Details</h2>
					<p>
						Owner:{' '}
						<span class="font-medium" id="owner"> {$contractDetail.owner} </span>
					</p>
					<p>
						Arisan Balance:{' '}
						<span class="font-medium" id="balance"> {$contractDetail.balance} </span>{' '}
						ETH
					</p>
					<p>
						Your Account Balance:{' '}
						<span class="font-medium" id="accountBalance">
							{$contractDetail.accountBalance}
						</span>{' '}
						ETH
					</p>
					<p>
						Winner:{' '}
						<span class="font-medium" id="winner"> {$contractDetail.winner} </span>
					</p>
					<p>
						Connected Address:{' '}
						<span class="font-medium" id="connectedAddress"> {currentAccount} </span>
					</p>
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Members</h2>
					<ul class="space-y-2" id="members">
						{#each $contractDetail.members || [] as member}
							<li>{member}</li>
						{/each}
					</ul>
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Add Member</h2>
					<input
						type="text"
						bind:value={memberAddress}
						class="mb-2 w-full rounded-md border px-4 py-2"
						placeholder="Enter member address"
						id="newMemberInput"
					/>
					<Button
						class="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
						id="addMemberButton"
						on:click={addMember}
					>
						Add Member
					</Button>
					<div class="mt-2 text-red-500">{errorMessage}</div>
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Withdraw</h2>
					<Button
						class="rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
						id="withdrawButton"
					>
						Withdraw
					</Button>
					<div class="mt-2 text-red-500">{errorMessage}</div>
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Pick a Winner</h2>
					<Button
						class="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
						id="pickWinnerButton"
					>
						Pick a Winner
					</Button>
					<div class="mt-2 text-red-500">{errorMessage}</div>
				</div>
			</div>
		{:else}
			<Button on:click={connectWallet}>Connect Wallet</Button>
		{/if}
	</div>
</div>
