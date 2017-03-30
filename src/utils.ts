import * as _ from 'lodash';
import { Project } from './storage';

export class utils {
  public getProjectIndex(project_list: Project[], project_name: string): number {
    return _.findIndex(project_list, (o) => {
      return o.name === project_name
    });;
  }
}