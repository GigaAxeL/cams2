import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";

import {Branch} from "./branch.model";
import {Config} from "./config.model";
import {BranchesService} from "./app.service";

var config = {"refreshTime": 0};

@Component({
selector: 'app',
templateUrl: '/app/app.component.html'
})

export class AppComponent implements OnInit{

  configs: Config;
  branches: Branch[];

  constructor(public branchesService: BranchesService) {}

  getConfigs():any {
    this.branchesService.getConfigs().then(
      (configs) => {
        this.configs = configs;
        config = configs;
        console.log("poeben inside promise: " + config.refreshTime);
        // return config;
      },
      (error) => {
        console.log('ERROR, MOTHERFUCKER, DO YOU SEE IT?')
      }
      );
    console.log("poeben outside promise: " + config.refreshTime);
  }

  getBranches() {
    this.branchesService.getBranches().then(branches => this.branches = branches);
  }

  ngOnInit(): any {
      config = this.getConfigs();
      console.log("PIZDA "+ config)
      this.getBranches();
      let timer = Observable.interval(15000);
      timer.subscribe();
  }


}
