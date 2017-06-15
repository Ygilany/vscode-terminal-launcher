import { workspace } from 'vscode';

import path = require('path');

export interface Config {
    projectsConfigurationsLocation: string
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('terminalLauncher');

    return {
        projectsConfigurationsLocation: configuration.projectsConfigurationsLocation || path.join(__dirname, `../../`)
    } as Config;
}