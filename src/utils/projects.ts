import { loadFromStorage, saveToStorage } from './storage';

export const getProjects = (): string[] => {
  return loadFromStorage('projects', ['Default Project']);
};

export const addProject = (project: string): string[] => {
  const projects = getProjects();
  if (!projects.includes(project)) {
    const updatedProjects = [...projects, project];
    saveToStorage('projects', updatedProjects);
    return updatedProjects;
  }
  return projects;
};

export const deleteProject = (project: string): string[] => {
  const projects = getProjects();
  const updatedProjects = projects.filter(p => p !== project);
  saveToStorage('projects', updatedProjects);
  return updatedProjects;
};

export const editProject = (oldName: string, newName: string): string[] => {
  const projects = getProjects();
  const updatedProjects = projects.map(p => p === oldName ? newName : p);
  saveToStorage('projects', updatedProjects);
  return updatedProjects;
};