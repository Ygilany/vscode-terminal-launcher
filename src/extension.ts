import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from "vscode";

import { Config, getConfig } from './config';
import {
	commandNameInputBoxOptions,
	commandScriptInputBoxOptions,
	projectNameInputBoxOptions
} from './inputBoxOptions';
import {
	Project,
	ProjectStorage,
	TerminalCommand
} from './storage';

const homeDir = os.homedir();
const PROJECTS_FILE = `terminal-projects.json`;

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	const configurations: Config = getConfig();
	const projectStorage: ProjectStorage = new ProjectStorage(getProjectFilePath());
	const errorLoading: string = projectStorage.load();

	vscode.commands.registerCommand(`terminalLauncher.saveProject`, () => saveProject());
	vscode.commands.registerCommand(`terminalLauncher.editProjects`, () => editProjects());
	vscode.commands.registerCommand(`terminalLauncher.runProject`, () => runProject());

	function saveProject(): void {
		const projectName = vscode.workspace.rootPath.substr(vscode.workspace.rootPath.lastIndexOf("/") + 1);
		const projectPath = vscode.workspace.rootPath;

		vscode.window.showInputBox(projectNameInputBoxOptions(projectName))
			.then(async _projectName => {
				if (typeof _projectName === "undefined") {
					return;
				}
				if (_projectName === "") {
					vscode.window.showWarningMessage("You must define a name for the project.");
					return;
				}

				if (!projectStorage.exists(projectName)) {					
					const commands: TerminalCommand[] = [];
					do {
						const __command: TerminalCommand = await getNewCommand();
						commands.push(__command);
					} while (await isDone());
					projectStorage.addToProjectList(_projectName, projectPath, commands);
					projectStorage.save();

					vscode.window.showInformationMessage("Project saved!");
				} else {
					const optionAddCommand = {
						title: "Add Command"
					} as vscode.MessageItem;
					const optionCancel = {
						title: "Cancel"
					} as vscode.MessageItem;

					vscode.window.showInformationMessage("Project already exists!", optionAddCommand, optionCancel)
						.then(async option => {
							// nothing selected
							if (typeof option === "undefined") {
								return;
							}

							if (option.title === "Add Command") {

							const commands: TerminalCommand[] = [];
							do {
								const __command: TerminalCommand = await getNewCommand();
								commands.push(__command);
							} while (await isDone());

								projectStorage.addCommands(projectName, commands);
								projectStorage.save();
								
								vscode.window.showInformationMessage("Project saved!");
								return;
							} else {
								return;
							}
						});
				}
			});
	};

	function editProjects(): void {
		vscode.workspace.openTextDocument(getProjectFilePath())
			.then(document => {
				vscode.window.showTextDocument(document);
			});
	};

	function getProjectFilePath(): string {
		let projectFile: string;
		const projectsLocation: string = configurations.projectsLocation;		

		if (projectsLocation !== "") {
			projectFile = path.join(projectsLocation, PROJECTS_FILE);
		} else {
			const appdata = process.env.APPDATA || (process.platform === "darwin" ? process.env.HOME + "/Library/Application Support" : "/var/local");
			projectFile = path.join(appdata, "Code", "User", PROJECTS_FILE);
		}
		
		return projectFile;
	}

	function runProject(): void {
		const workspacePath = vscode.workspace.rootPath;

		const project: Project = projectStorage.existsWithRootPath(workspacePath);
		let isFirstCommand: boolean = true;
		for (const command of project.commands) {
			const terminal = vscode.window.createTerminal(command.name);
			terminal.sendText(command.script);
			if (isFirstCommand) {
				terminal.show();
				isFirstCommand = false;
			}
		}
	}

	async function getNewCommand(): Promise<TerminalCommand> {
		const _commandName = await vscode.window.showInputBox(commandNameInputBoxOptions());
		const _commandScript = await vscode.window.showInputBox(commandScriptInputBoxOptions());
		
		const _command: TerminalCommand = {
			name: _commandName,
			script: _commandScript
		};
						
		return Promise.resolve(_command);
	}

	async function isDone(): Promise<boolean> {
		const optionYes = {
			title: "Yes"
		} as vscode.MessageItem;
		const optionNo = {
			title: "No"
		} as vscode.MessageItem;

		const selection = await vscode.window.showInformationMessage(
			`command is successfully added, do you need to add More?`,
			optionYes, optionNo
		);

		if (selection.title === `Yes`) {
			return Promise.resolve(true);
		}else {
			return Promise.resolve(false);
		}
	}
}