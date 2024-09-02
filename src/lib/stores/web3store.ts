import { writable } from 'svelte/store';
import Web3 from 'web3';

// Store untuk menyimpan informasi web3 dan akun pengguna
export const web3 = writable<Web3 | null>(null);
export const account = writable(null);

// Fungsi untuk menghubungkan wallet
export async function connectWallet() {
	if (window.ethereum) {
		try {
			// Minta pengguna untuk menghubungkan wallet mereka
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

			// Inisialisasi web3 dengan provider MetaMask
			const web3Instance = new Web3(window.ethereum);
			web3.set(web3Instance);

			// Set akun pengguna
			account.set(accounts[0]);

			// Event listener ketika akun berubah
			window.ethereum.on('accountsChanged', function (accounts) {
				account.set(accounts[0]);
			});

			// Event listener ketika jaringan berubah
			window.ethereum.on('chainChanged', () => {
				window.location.reload();
			});

			console.log('Wallet connected:', accounts[0]);
		} catch (error) {
			console.error('User rejected connection', error);
		}
	} else {
		console.error('MetaMask not found. Please install MetaMask.');
	}
}
