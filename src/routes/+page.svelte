<script lang="ts">
	import ArisanAbi from '@/abi/arisan.abi.json';
	import { Button } from '@/components/ui/button';
	import { account, connectWallet, web3 } from '@/stores/web3store';
	import { Toaster, toast } from 'svelte-sonner';
	import { writable } from 'svelte/store';
	import { persisted } from 'svelte-persisted-store';

	let arisanContract: any;
	const contractAddress = persisted(
		'arisanSmartContractAddress',
		'0xF1F1c8fd3c3C5afE508e94896aF1Ff1a1ad4fB94'
	);

	let errorMessage = '';
	let currentAccount: string | null;

	account.subscribe((value) => {
		currentAccount = value;
	});

	$: if (currentAccount) {
		currentAccount = (currentAccount || '')?.toLowerCase();
	}

	const contractDetail = writable<any>({});

	function loadSmartContractAddress() {
		arisanContract = new $web3.eth.Contract(ArisanAbi as any, $contractAddress);
		errorMessage = '';
		updateContractDetails();
	}

	$: if ($web3 && currentAccount) {
		console.log('Web3 is connected');
		loadSmartContractAddress();
	}

	function isNullAddress(address: string) {
		const nullAddress = '0x0000000000000000000000000000000000000000';
		return (address || '')?.toLowerCase() == (nullAddress || '')?.toLowerCase();
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
				? (winnerAddress || '')?.toLowerCase()()
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

	$: if (memberAddress) {
		memberAddress = (memberAddress || '')?.toLowerCase();
	}

	async function estimateGasForRegisterMember() {
		if (!$web3) return;
		const gasEstimate = await arisanContract.methods
			.registerMember(memberAddress)
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
				.registerMember(memberAddress)
				.send({ from: currentAccount, gas: gasEstimate });
			console.log('Member registered successfully:', result);
			console.log('Member registered successfully:', result.transactionHash);
			toast.success('Member registered successfully');
			memberAddress = '';
			loadMember();
		} catch (error) {
			console.error('Error registering member:', error);
			toast.error('Failed to register member');
			errorMessage = error.message;
		}
	}

	async function withdraw() {
		if (!$web3) return;
		try {
			const gasEstimate = await arisanContract.methods
				.withdraw()
				.estimateGas({ from: currentAccount });

			if (!gasEstimate) {
				toast.error('Failed to estimate gas');
				return;
			}
			const result = await arisanContract.methods
				.withdraw()
				.send({ from: currentAccount, gas: gasEstimate });
			console.log('Withdraw successfully:', result);
			console.log('Withdraw successfully:', result.transactionHash);
			toast.success('Withdraw successfully');

			updateContractDetails();
		} catch (error: any) {
			console.error('Error withdrawing:', error);
			if (error?.data?.data?.reason) {
				toast.error(error?.data?.data?.reason);
			} else {
				errorMessage = error.message;
			}
		}
	}

	async function pickWinner() {
		// Pick a winner
		if (!$web3) return;
		try {
			const gasEstimate = await arisanContract.methods
				.pickWinner()
				.estimateGas({ from: currentAccount });
			if (!gasEstimate) {
				toast.error('Failed to estimate gas');
				return;
			}
			const result = await arisanContract.methods
				.pickWinner()
				.send({ from: currentAccount, gas: gasEstimate });
			console.log('Pick a winner successfully:', result);
			console.log('Pick a winner successfully:', result.transactionHash);
			toast.success('Pick a winner successfully');
			updateContractDetails();
		} catch (error: any) {
			console.error('Error picking a winner:', error);
			if (error?.data?.data?.reason) {
				toast.error(error?.data?.data?.reason);
			} else {
				errorMessage = error.message;
			}
		}
	}

	let contributionAmount: number = 0;

	async function contribute() {
		if (!$web3) return;
		try {
			const contributionAmountInWei = $web3.utils.toWei(contributionAmount.toString(), 'ether');

			const gasEstimate = await arisanContract.methods
				.contribute(contributionAmount)
				.estimateGas({ from: currentAccount, value: contributionAmountInWei });
			if (!gasEstimate) {
				toast.error('Failed to estimate gas');
				return;
			}
			const result = await arisanContract.methods
				.contribute(contributionAmount)
				.send({ from: currentAccount, gas: gasEstimate, value: contributionAmountInWei });
			console.log('Contribute successfully:', result);
			console.log('Contribute successfully:', result.transactionHash);
			toast.success('Contribute successfully');
			contributionAmount = 0;
			updateContractDetails();
		} catch (error: any) {
			console.error('Error contributing:', error);
			if (error?.data?.data?.reason) {
				toast.error(error?.data?.data?.reason);
			} else {
				errorMessage = error.message;
			}
		}
	}
</script>

<Toaster expand richColors />

<div class="bg-gray-100 px-6 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-6 text-3xl font-bold">Arisan</h1>
		<div class="mt-2 text-red-500">{errorMessage}</div>

		{#if currentAccount}
			<div class="space-y-6 rounded-lg bg-white p-6 shadow-md">
				<div>
					<h2 class="mb-2 text-xl font-semibold">Contract Details</h2>
					<div class="mb-2 flex items-center">
						<p>
							Contract Address:{' '}
						</p>
						<input
							type="text"
							class="ml-4 w-full rounded-md border px-4 py-2"
							placeholder="Enter new contract address"
							bind:value={$contractAddress}
						/>
					</div>
					<Button
						class="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
						id="refreshButton"
						on:click={() => {
							loadSmartContractAddress();
							toast.success('Smart contract address updated');
						}}
					>
						Refresh
					</Button>
					<p class="mt-2">
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
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Withdraw</h2>
					<Button
						class="rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
						id="withdrawButton"
						on:click={withdraw}
					>
						Withdraw
					</Button>
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Pick a Winner</h2>
					<Button
						class="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
						id="pickWinnerButton"
						on:click={pickWinner}
					>
						Pick a Winner
					</Button>
				</div>
				<div>
					<h2 class="mb-2 text-xl font-semibold">Contribute</h2>
					<input
						type="number"
						class="mb-2 w-full rounded-md border px-4 py-2"
						placeholder="Enter contribution amount (ETH)"
						bind:value={contributionAmount}
						id="contributionInput"
					/>
					<Button
						class="rounded-md bg-purple-500 px-4 py-2 font-medium text-white hover:bg-purple-600"
						id="contributeButton"
						on:click={contribute}
					>
						Contribute
					</Button>
					<div class="mt-2 text-red-500">{errorMessage}</div>
				</div>
			</div>
		{:else}
			<Button on:click={connectWallet}>Connect Wallet</Button>
		{/if}
	</div>
</div>
