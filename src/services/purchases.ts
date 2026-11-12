import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/**
 * "A Little Better+": a one-time purchase for extra visual personalisation.
 *
 * The store isn't connected yet. Everything goes through `PurchaseProvider`,
 * so connecting it later (RevenueCat, or expo-iap directly) means writing one
 * provider and passing it to `setPurchaseProvider` at startup; no screen
 * changes. Until then the purchase shows as "coming soon".
 *
 * Never free-to-paid: the daily message, every collection, saving, reminders,
 * dark mode, accessibility, privacy controls and backups always stay free.
 * Offers are never tied to how someone says they feel.
 */
export const PLUS_PRODUCT_ID = 'alittlebetter.plus';

export type PurchaseResult = 'purchased' | 'cancelled' | 'unavailable' | 'error';

export interface PurchaseProvider {
  /** Localised price string from the store, or null if the store isn't reachable. */
  price(): Promise<string | null>;
  buy(): Promise<PurchaseResult>;
  /** True if a previous purchase was found. */
  restore(): Promise<boolean>;
}

const notConnected: PurchaseProvider = {
  price: async () => null,
  buy: async () => 'unavailable',
  restore: async () => false,
};

let provider: PurchaseProvider = notConnected;

export function setPurchaseProvider(next: PurchaseProvider): void {
  provider = next;
}

export function storeConnected(): boolean {
  return provider !== notConnected;
}

// --- Entitlement, cached on the device so it works offline ---

const KEY = 'alb:plus:v1';
let unlocked = false;
const listeners = new Set<() => void>();

function setUnlocked(value: boolean) {
  unlocked = value;
  listeners.forEach((l) => l());
  AsyncStorage.setItem(KEY, value ? '1' : '0').catch((err) => console.warn('[plus] could not save', err));
}

export async function loadPlus(): Promise<void> {
  try {
    unlocked = (await AsyncStorage.getItem(KEY)) === '1';
    listeners.forEach((l) => l());
  } catch (err) {
    console.warn('[plus] could not load', err);
  }
}

export function hasPlus(): boolean {
  return unlocked;
}

export function usePlus(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    hasPlus,
    hasPlus,
  );
}

export const getPlusPrice = () => provider.price();

export async function buyPlus(): Promise<PurchaseResult> {
  const result = await provider.buy();
  if (result === 'purchased') setUnlocked(true);
  return result;
}

export async function restorePlus(): Promise<boolean> {
  const found = await provider.restore();
  if (found) setUnlocked(true);
  return found;
}

/** Development builds only: try the unlocked experience without a store. */
export function setPlusForDevelopment(value: boolean): void {
  if (__DEV__) setUnlocked(value);
}
