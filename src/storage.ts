import fs = require("fs");
import {utils} from './utils';

const utils_obj = new utils();

export interface TerminalCommand {
  name: string;
  script: string;
};

export interface Project {
  name: string;
  root_path: string;
  commands: TerminalCommand[];
};

export interface ProjectList extends Array < Project > {};

class ProjectItem implements Project {

  public name: string;
  public root_path: string;
  public commands: TerminalCommand[];

  constructor(project_name: string, project_root_path: string, terminal_command: TerminalCommand) {
    this.name = project_name;
    this.root_path = project_root_path;
    this.commands.push(terminal_command);
  }
}

export class ProjectStorage {

  private projectList: ProjectList;
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
    this.projectList = < ProjectList > [];
  }

  public addToProjectList(project_name: string, root_path: string, command_name: string, command_script: string): void {
    let command: TerminalCommand = {
      name: command_name,
      script: command_script
    }
    this.projectList.push(new ProjectItem(project_name, root_path, command));
    return;
  }
  root_path

  public removeFormProjectList(project_name: string): Project {

    let index = utils_obj.getIndexWherePropertyIs(this.projectList, `name`, project_name);
    return this.projectList.splice(index, 1)[0];
  }

  public addCommand(project_name: string, command_name: string, command_script: string): void {
    let command: TerminalCommand = {
      name: command_name,
      script: command_script
    }
    let index = utils_obj.getIndexWherePropertyIs(this.projectList, `name`, project_name);

    this.projectList[index].commands.push(command);
  }

  public removeCommand(project_name: string, command_name: string): void {
    let project_index = utils_obj.getIndexWherePropertyIs(this.projectList, `name`, project_name);
    let command_index = utils_obj.getIndexWherePropertyIs(this.projectList[project_index].commands, `name`, command_name)

    this.projectList[project_index].commands.splice(command_index, 1);
    return;
  }

  public updateRootPath(project_name: string, path: string): void {
    let index = utils_obj.getIndexWherePropertyIs(this.projectList, `name`, project_name);

    this.projectList[index].root_path = path;
  }

  

  /**
   * Checks if exists a project with a given `name`
   * 
   * @param `name` The [Project Name](#Project.name) to search for projects
   *
   * @return `true` or `false`
   */
  public exists(name: string): boolean {
    let found: boolean = false;

    // for (let i = 0; i < this.projectList.length; i++) {
    for (let element of this.projectList) {
      // let element = this.projectList[i];
      if (element.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
        found = true;
      }
    }
    return found;
  }

  /**
   * Checks if exists a project with a given `rootPath`
   * 
   * @param `rootPath` The path to search for projects
   *
   * @return A [Project](#Project) with the given `rootPath`
   */
  public existsWithRootPath(rootPath: string): Project {
    // for (let i = 0; i < this.projectList.length; i++) {
    for (let element of this.projectList) {
      // let element = this.projectList[i];
      if (element.rootPath.toLocaleLowerCase() === rootPath.toLocaleLowerCase()) {
        return element;
      }
    }
  }

  /**
   * Returns the number of projects stored in `projects.json`
   * 
   * > The _dynamic projects_ like VSCode and Git aren't present
   *
   * @return The number of projects
   */
  public length(): number {
    return this.projectList.length;
  }

  /**
   * Loads the `projects.json` file
   *
   * @return A `string` containing the _Error Message_ in case something goes wrong. 
   *         An **empty string** if everything is ok.
   */
  public load( /*file: string*/ ): string {
    let items = [];

    // missing file (new install)
    if (!fs.existsSync(this.filename)) {
      this.projectList = items as ProjectList;
      return "";
    }

    try {
      items = JSON.parse(fs.readFileSync(this.filename).toString());

      // OLD format
      if ((items.length > 0) && (items[0].label)) {
        // for (let index = 0; index < items.length; index++) {
        for (let element of items) {
          // let element = items[index];
          this.projectList.push(new ProjectItem(element.label, element.description));
        }
        // save updated
        this.save();
      } else { // NEW format
        this.projectList = items as ProjectList;
        // this.projectList = <ProjectList>items;
      }
      return "";
    } catch (error) {
      return error.toString();
    }
  }

  /**
   * Reloads the `projects.json` file. 
   * 
   * > Using a forced _reload_ instead of a _watcher_ 
   *
   * @return `void`
   */
  public reload() {
    let items = [];

    // missing file (new install)
    if (!fs.existsSync(this.filename)) {
      this.projectList = items as ProjectList;
    } else {
      items = JSON.parse(fs.readFileSync(this.filename).toString());
      this.projectList = items as ProjectList;
    }
  }

  /**
   * Saves the `projects.json` file to disk
   * 
   * @return `void`
   */
  public save() {
    fs.writeFileSync(this.filename, JSON.stringify(this.projectList, null, "\t"));
  }

  /**
   * Maps the projects to be used by a `showQuickPick`
   * 
   * @return A list of projects `{[label, description]}` to be used on a `showQuickPick`
   */
  public map(): any {
    let newItems = this.projectList.map(item => {
      return {
        label: item.name,
        description: item.rootPath
      };
    });
    return newItems;
  }
}