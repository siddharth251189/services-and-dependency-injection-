# services and dependency injection

## What are the services why we need services

Angular is effectively VM-V front-end framework where components are the view-model and their templates are their views. Components should, like any good view model, be lean and handle only data presentation. As described by the official Angular documentation, “a component’s job is to enable the user experience and nothing more.”
To keep components lean, services handle discrete operational processes that are more involved than simple presentation. Typically, these are things like user input validation, console logging, server calls to the server, and any client-side data manipulation.
Angular Services are usually implemented through dependency injection. At the end of the day, that’s really just a fancy work for angular-specific module composition. When we talk about an injectable service class, we’re simply talking about common, service-oriented code that can be reused between separate components.

## Creating a Logging Service

We have a basic understanding that what is the services so let's create a service which will responsible for loging the new status.

A service is a simple type script class like below:

#### Example of an service

```typescript
export class LogingService {}
```

#### loging-service.ts

```typescript
export class LogingService {
  logStatusChanged(status: string) {
    console.log("A server status changed, new status: " + status);
  }
}
```

After creating any service if we want to use it then we need to inject it by dependency injection.

suppose we need to use this service in our new account component.so first we need to import this:

```typescript
import { LogingService } from "../loging-service";
```

After importing this we will add it into provider array:

```typescript
@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LogingService]
})
```

after that we will inject this in our component constructor function like below:

```typescript
constructor(private logService: LogingService) { }
```

## Creating a Data Service

As we know that To keep components lean, services handle discrete operational processes that are more involved than simple presentation.

So we will discrete the all the functional logic from our component and we will create a new service account service which will be responsible for getting,adding and updating the data.

In this process first we will create our account.service.ts file:

#### account.service.ts

```typescript
import { stringify } from "querystring";

export class AccountService {
  accounts = [
    {
      name: "Master Account",
      status: "active"
    },
    {
      name: "Testaccount",
      status: "inactive"
    },
    {
      name: "Hidden Account",
      status: "unknown"
    }
  ];
  addAccount(name: string, status: string) {
    this.accounts.push({ name: name, status: status });
  }
  updateStatus(id: number, status: string) {
    this.accounts[id].status = status;
  }
}
```

Now will remove all method and array from app.component.ts

#### Old app.component.ts

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  accounts = [
    {
      name: "Master Account",
      status: "active"
    },
    {
      name: "Testaccount",
      status: "inactive"
    },
    {
      name: "Hidden Account",
      status: "unknown"
    }
  ];

  onAccountAdded(newAccount: { name: string; status: string }) {
    this.accounts.push(newAccount);
  }

  onStatusChanged(updateInfo: { id: number; newStatus: string }) {
    this.accounts[updateInfo.id].status = updateInfo.newStatus;
  }
}
```

Now we will discrete the data and method so we will have our new app.component.ts like below:

#### New app.component.ts

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {}
```

In the process our first goal will be getting the data from our service like below:

#### app.component.ts

```typescript
import { Component, OnInit } from "@angular/core";
import { AccountService } from "./account.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [AccountService]
})
export class AppComponent implements OnInit {
  accounts: { name: string; status: string }[] = [];
  constructor(private accountService: AccountService) {}
  ngOnInit() {
    this.accounts = this.accountService.accounts;
  }
}
```

#### account.component.ts

```typescript
import { Component, Input } from "@angular/core";
import { AccountService } from "../account.service";
import { LogingService } from "../loging-service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
  providers: [LogingService, AccountService]
})
export class AccountComponent {
  @Input() account: { name: string; status: string };
  @Input() id: number;
  constructor(
    private logService: LogingService,
    private accountService: AccountService
  ) {}
  onSetTo(status: string) {
    this.accountService.updateStatus(this.id, status);
    this.logService.logStatusChanged(status);
  }
}
```

Next we will call our addAccount method for adding account:

#### account.component.ts

```typescript
import { Component } from "@angular/core";
import { LogingService } from "../loging-service";
import { AccountService } from "../account.service";

@Component({
  selector: "app-new-account",
  templateUrl: "./new-account.component.html",
  styleUrls: ["./new-account.component.css"],
  providers: [LogingService, AccountService]
})
export class NewAccountComponent {
  constructor(
    private logService: LogingService,
    private accountService: AccountService
  ) {}
  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountService.addAccount(accountName, accountStatus);
    this.logService.logStatusChanged(accountStatus);
  }
}
```

After doing all this efforts we will find that our new status is logging in the console but it is not showing on template.

We are facing this issue because angular service work on hierarchical injector method so we need to remove AccountService from the provider of both files:

#### account.component.ts

```typescript
import { Component, Input } from "@angular/core";
import { AccountService } from "../account.service";
import { LogingService } from "../loging-service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
  providers: [LogingService]
})
export class AccountComponent {
  @Input() account: { name: string; status: string };
  @Input() id: number;
  constructor(
    private logService: LogingService,
    private accountService: AccountService
  ) {}
  onSetTo(status: string) {
    this.accountService.updateStatus(this.id, status);
    this.logService.logStatusChanged(status);
  }
}
```

#### account.component.ts

```typescript
import { Component } from "@angular/core";
import { LogingService } from "../loging-service";
import { AccountService } from "../account.service";

@Component({
  selector: "app-new-account",
  templateUrl: "./new-account.component.html",
  styleUrls: ["./new-account.component.css"],
  providers: [LogingService]
})
export class NewAccountComponent {
  constructor(
    private logService: LogingService,
    private accountService: AccountService
  ) {}
  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountService.addAccount(accountName, accountStatus);
    this.logService.logStatusChanged(accountStatus);
  }
}
```

In this example we are calling our AccountService in app component provider.We can call our AccountService in app.module.ts also.

## Injecting Services into Services

In this part how we can inject a service into other.Here we are going to inject loging service into account service.

First we will add our service into app.module.ts

#### app.module.ts

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AccountComponent } from "./account/account.component";
import { NewAccountComponent } from "./new-account/new-account.component";
import { LogingService } from "./loging-service";
import { AccountService } from "./account.service";

@NgModule({
  declarations: [AppComponent, AccountComponent, NewAccountComponent],
  imports: [BrowserModule, FormsModule],
  providers: [AccountService, LogingService],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Now when code will be runed then an error will accur and for resolve this error we need to add @Injectable() metadata in account.service.
We use @Injectable() were we want inject the service.

## Using Services for Cross-Component Communication

By Services we can easly can do cross-component communication.Before learning this concept we ware doing lots off code like using output and EventEmitter but by services we not need to do hardwork.
let's see how we can fire an evnet by services.

First we will make an event in our service file.

#### account.service.ts

```typescript
import { LogingService } from "./loging-service";
import { Injectable, EventEmitter } from "@angular/core";
@Injectable()
export class AccountService {
  accounts = [
    {
      name: "Master Account",
      status: "active"
    },
    {
      name: "Testaccount",
      status: "inactive"
    },
    {
      name: "Hidden Account",
      status: "unknown"
    }
  ];

  statusUpdated = new EventEmitter<string>(); //This is the custom event

  constructor(private logService: LogingService) {}
  addAccount(name: string, status: string) {
    this.accounts.push({ name: name, status: status });
    this.logService.logStatusChanged(status);
  }
  updateStatus(id: number, status: string) {
    this.accounts[id].status = status;
    this.logService.logStatusChanged(status);
  }
}
```

Now we will emit this custom event in account.component.ts and listen this event into new-account.component.ts.

#### account.component.ts

```typescript
import { Component, Input } from "@angular/core";
import { AccountService } from "../account.service";
import { LogingService } from "../loging-service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent {
  @Input() account: { name: string; status: string };
  @Input() id: number;
  constructor(
    private logService: LogingService,
    private accountService: AccountService
  ) {}
  onSetTo(status: string) {
    this.accountService.updateStatus(this.id, status);
    this.accountService.statusUpdated.emit(status);
  }
}
```

Subscribe the event

#### new-account.component.ts

```typescript
import { Component } from "@angular/core";
import { LogingService } from "../loging-service";
import { AccountService } from "../account.service";

@Component({
  selector: "app-new-account",
  templateUrl: "./new-account.component.html",
  styleUrls: ["./new-account.component.css"],
  providers: [LogingService]
})
export class NewAccountComponent {
  constructor(
    private logService: LogingService,
    private accountService: AccountService
  ) {
    this.accountService.statusUpdated.subscribe((status: string) => {
      alert("New Status: " + status);
    });
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountService.addAccount(accountName, accountStatus);
  }
}
```
