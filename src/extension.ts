import * as vscode from 'vscode';
import { getConfig } from './config';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
   
    let disposable = vscode.commands.registerCommand('extension.FireDev', () => {

        let configurations = getConfig();
        console.log(configurations)
        if (configurations.rootDir === vscode.workspace.rootPath){
            
            let terminalObj = vscode.window.createTerminal(`application`);
            terminalObj.sendText(`npm run dev`);
            terminalObj.show();
            vscode.window.createTerminal(`transpile`).sendText(`npm run babel-dev`);
        } else {
            vscode.window.showInformationMessage(`we're not in the right folder` + configurations.rootDir);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}