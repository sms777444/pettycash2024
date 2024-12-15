import { loadFromStorage, saveToStorage } from './storage';

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

export const deletePerson = (person: string): string[] => {
  const people = getPeople();
  const updatedPeople = people.filter(p => p !== person);
  saveToStorage('people', updatedPeople);
  return updatedPeople;
};

export const editPerson = (oldName: string, newName: string): string[] => {
  const people = getPeople();
  const updatedPeople = people.map(p => p === oldName ? newName : p);
  saveToStorage('people', updatedPeople);
  return updatedPeople;
};