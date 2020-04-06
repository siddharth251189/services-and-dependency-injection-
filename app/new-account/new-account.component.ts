import { Component } from '@angular/core';
import { LogingService } from '../loging-service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LogingService]
})
export class NewAccountComponent {

  constructor(private logService: LogingService, private accountService: AccountService) {
    this.accountService.statusUpdated.subscribe((status: string) => {
      alert('New Status: ' + status)
    })
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountService.addAccount(accountName, accountStatus)

  }
}
