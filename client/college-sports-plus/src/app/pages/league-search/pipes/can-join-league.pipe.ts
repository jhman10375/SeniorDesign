import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canJoinLeague',
  standalone: true,
})
export class CanJoinLeaguePipe implements PipeTransform {
  transform(value: any, currentLeagues: Array<string>): boolean {
    if (!currentLeagues.includes(value)) {
      return true;
    } else {
      return false;
    }
  }
}
