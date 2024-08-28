import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

import { writable, type Writable } from 'svelte/store';

export function getNestedWritable(store: Writable<any>, path: string): Writable<any> {
	const pathArray = path.split('.');

	const { subscribe, set } = writable(undefined, (set) => {
		store.subscribe((obj) => {
			let value = obj;
			for (const key of pathArray) {
				value = value[key];
				if (value === undefined) break;
			}
			set(value);
		});
	});

	return {
		subscribe,
		update(updater) {
			store.update((obj) => {
				let value = obj;
				for (let i = 0; i < pathArray.length - 1; i++) {
					value = value[pathArray[i]];
				}
				value[pathArray[pathArray.length - 1]] = updater(value[pathArray[pathArray.length - 1]]);
				return obj;
			});
		},
		set: (newValue: any) => {
			store.update((obj) => {
				let value = obj;
				for (let i = 0; i < pathArray.length - 1; i++) {
					value = value[pathArray[i]];
				}
				value[pathArray[pathArray.length - 1]] = newValue;
				return obj;
			});
		}
	};
}

export function getNestedValue(obj: Record<string, any>, path: string) {
	const keys = path.split('.');
	let result = obj;

	for (const key of keys) {
		if (result && result[key] !== undefined) {
			result = result[key];
		} else {
			return undefined; // Jika tidak ada nilai, kembalikan undefined
		}
	}

	return result;
}

