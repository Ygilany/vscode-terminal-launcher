import { workspace } from 'vscode';

export interface Config {
    projectsLocation: string
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('terminalProject');

    return {
        projectsLocation: configuration.projectsLocation
    } as Config;
}