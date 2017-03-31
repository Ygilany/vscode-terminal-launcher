import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from "vscode";

import { getConfig } from './config';
import { ProjectStorage } from './storage';

const homeDir = os.homedir();
const PROJECTS_FILE = `terminal-projects.json`;

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	const projectStorage: ProjectStorage = new ProjectStorage(getProjectFilePath());
	const errorLoading: string = projectStorage.load();

	vscode.commands.registerCommand(`extension.saveProject`, () => saveProject());
	vscode.commands.registerCommand(`extension.editProjects`, () => editProjects());

	function saveProject() {
		const projectName = vscode.workspace.rootPath.substr(vscode.workspace.rootPath.lastIndexOf("/") + 1);
		const projectPath = vscode.workspace.rootPath;

		const projectNameInputBoxOptions = {
			prompt: "Project Name",
			placeHolder: "Type a name for your project",
			value: projectName
		} as vscode.InputBoxOptions;

		vscode.window.showInputBox(projectNameInputBoxOptions)
			.then(_projectName => {
				if (typeof _projectName === "undefined") {
					return;
				}
				if (_projectName === "") {
					vscode.window.showWarningMessage("You must define a name for the project.");
					return;
				}

				const commandNameInputBoxOptions = {
					prompt: "Command Name",
					placeHolder: "Type a name for your command",
				} as vscode.InputBoxOptions;

				vscode.window.showInputBox(commandNameInputBoxOptions)
					.then(_commandName => {
						const commandScriptInputBoxOptions = {
							prompt: "Command Script",
							placeHolder: "Type your script command",
						} as vscode.InputBoxOptions;

						vscode.window.showInputBox(commandScriptInputBoxOptions)
							.then(_commandScript => {
								if (!projectStorage.exists(projectName)) {
									projectStorage.addToProjectList(_projectName, projectPath, _commandName, _commandScript);
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
										.then(option => {
											// nothing selected
											if (typeof option === "undefined") {
												return;
											}

											if (option.title === "Add Command") {
												vscode.window.showInputBox(commandNameInputBoxOptions)
													.then(commandName => {
														vscode.window.showInputBox(commandScriptInputBoxOptions)
															.then(commandScript => {
																projectStorage.addCommand(projectName, commandName, commandScript);
																projectStorage.save();
															});
													});

												vscode.window.showInformationMessage("Project saved!");
												return;
											} else {
												return;
											}
										});
								}
							});
					});
			});
	};

	function editProjects() {
		vscode.window.showInformationMessage(`edit Projects not implemented yet`);
	};

	function getProjectFilePath() {
		let projectFile: string;
		const projectsLocation: string = vscode.workspace.getConfiguration("ygilany").get < string > ("projectsLocation");
		console.log(projectsLocation);
		if (projectsLocation !== "") {
			console.log(`if 1`);

			projectFile = path.join(projectsLocation, PROJECTS_FILE);
		} else {
			console.log(`else 1`);

			const appdata = process.env.APPDATA || (process.platform === "darwin" ? process.env.HOME + "/Library/Application Support" : "/var/local");
			projectFile = path.join(appdata, "Code", "User", PROJECTS_FILE);
		}
		return projectFile;
	}
}