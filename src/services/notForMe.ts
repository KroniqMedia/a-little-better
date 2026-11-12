import { createIdListStore } from './idListStore';

/**
 * Messages someone marked "This one isn't for me". Stored only on this
 * device, never with a reason. They are left out of collections (not of the
 * shared daily message), and their tones come up a little less often.
 * Fully reversible from Settings.
 */
const store = createIdListStore('alb:not-for-me:v1', 'not-for-me');

export const loadNotForMe = store.load;
export const getNotForMe = store.get;
export const addNotForMe = store.add;
export const removeNotForMe = store.remove;
export const mergeNotForMe = store.merge;
export const clearNotForMe = store.clear;
export const useNotForMe = store.useIds;
