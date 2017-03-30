import { workspace } from 'vscode';

export interface Config {
    rootDir: String
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('ygilany');

    return {
        rootDir: configuration.rootDir
    }
}