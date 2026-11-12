import { createIdListStore } from './idListStore';

/**
 * Messages someone said helped ("Did this help?" → Yes). Device-only, never
 * sent anywhere: it lets the person see what tends to help them and keep
 * those messages close. Answering is always optional.
 */
const store = createIdListStore('alb:helped:v1', 'helped');

export const loadHelped = store.load;
export const getHelped = store.get;
export const addHelped = store.add;
export const removeHelped = store.remove;
export const mergeHelped = store.merge;
export const clearHelped = store.clear;
export const useHelped = store.useIds;
