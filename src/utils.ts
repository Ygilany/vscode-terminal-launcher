import * as _ from 'lodash';
import { Project } from './storage';

export class Utils {
  public getIndexWherePropertyIs<T>(array:T[], property_name: string, value: string): number {
    return _.findIndex(array, (o) => {
      return o[property_name] === value;
    });;
  }
}