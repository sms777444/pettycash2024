import { Transaction } from '../types';

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage: ${error}`);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage: ${error}`);
  }
};

export const getPeople = (): string[] => {
  return loadFromStorage('people', []);
};

export const addPerson = (person: string): string[] => {
  const people = getPeople();
  if (!people.includes(person)) {
    const updatedPeople = [...people, person];
    saveToStorage('people', updatedPeople);
    return updatedPeople;
  }
  return people;
};