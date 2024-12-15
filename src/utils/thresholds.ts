import { loadFromStorage, saveToStorage } from './storage';
import { BalanceThresholds, DEFAULT_BALANCE_THRESHOLDS } from '../types';

export const getPersonThresholds = (person: string): BalanceThresholds => {
  const thresholds = loadFromStorage<Record<string, BalanceThresholds>>('personThresholds', {});
  return thresholds[person] || DEFAULT_BALANCE_THRESHOLDS;
};

export const setPersonThresholds = (person: string, thresholds: BalanceThresholds): void => {
  const allThresholds = loadFromStorage<Record<string, BalanceThresholds>>('personThresholds', {});
  allThresholds[person] = thresholds;
  saveToStorage('personThresholds', allThresholds);
};