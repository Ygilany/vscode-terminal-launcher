import { workspace } from 'vscode';

export interface Config {
    projectsConfigurationsLocation: string
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('terminalLauncher');

    return {
        projectsConfigurationsLocation: configuration.projectsConfigurationsLocation
    } as Config;
}