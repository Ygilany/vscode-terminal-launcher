import * as vscode from 'vscode';

export function projectNameInputBoxOptions(_projectName: string): vscode.InputBoxOptions {
  return {
    prompt: "Project Name",
    placeHolder: "Type a name for your project",
    value: _projectName
  } as vscode.InputBoxOptions;
}
  
export function commandNameInputBoxOptions(): vscode.InputBoxOptions {
  return {
    prompt: "Command Name",
    placeHolder: "Type a name for your command",
  } as vscode.InputBoxOptions; 
}

export function commandScriptInputBoxOptions(): vscode.InputBoxOptions {
  return {
    prompt: "Command Script",
    placeHolder: "Type the command to run"
  } as vscode.InputBoxOptions;
}