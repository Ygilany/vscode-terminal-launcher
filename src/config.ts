import { workspace } from 'vscode';

export interface Config {
    projectsLocation: string
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('terminal-project');

    return {
        projectsLocation: configuration.projectsLocation
    }
}