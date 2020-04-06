import { LogingService } from './loging-service';
import { Injectable, EventEmitter } from '@angular/core';
@Injectable()

export class AccountService {
  accounts = [
    {
      name: 'Master Account',
      status: 'active'
    },
    {
      name: 'Testaccount',
      status: 'inactive'
    },
    {
      name: 'Hidden Account',
      status: 'unknown'
    }
  ];
  statusUpdated = new EventEmitter<string>();
  constructor(private logService: LogingService) { }
  addAccount(name: string, status: string) {
    this.accounts.push({ name: name, status: status });
    this.logService.logStatusChanged(status)
  }
  updateStatus(id: number, status: string) {
    this.accounts[id].status = status;
    this.logService.logStatusChanged(status)
  }

}
