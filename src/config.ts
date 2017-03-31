import { workspace } from 'vscode';

export interface Config {
    projectsLocation: string
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('ygilany');

    return {
        projectsLocation: configuration.projectsLocation
    }
}