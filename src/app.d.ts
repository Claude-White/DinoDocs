// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
	interface Window {
		HSStaticMethods: {
			autoInit(): void;
		};
	}
	interface Swapy {
		enable(enabled: boolean): void;
		onSwapStart(handler: SwapStartEventHandler): void;
		onSwap(handler: SwapEventHandler): void;
		onSwapEnd(handler: SwapEndEventHandler): void;
		onBeforeSwap(handler: BeforeSwapHandler): void;
		slotItemMap(): SlotItemMap;
		update(): void;
		destroy(): void;
	}
}
export {};
