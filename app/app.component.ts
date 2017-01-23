import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";

import {BranchesService} from "./app.service";


@Component({
selector: 'app',
templateUrl: '/app/app.component.html'
})

export class AppComponent implements OnInit{
  config = {};
  branches: any;

  constructor(public branchesService: BranchesService) {}

  getConfigs():any {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/config.json', false);
    xhr.send();
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      // console.log(xhr.responseText);
      this.config = JSON.parse(xhr.response);
    }
  }

  getBranches() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/branches.json', false);
    xhr.send();
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      // console.log(xhr.responseText);
      this.branches = JSON.parse(xhr.response);
    }
  }

  ngOnInit(): any {
      this.getBranches();
      this.getConfigs();
      // console.log('--> ngOnInit() fired ' + typeof(this.config) + " = " + this.config.refreshTime);

      // let timer = Observable.interval(15000);
      // timer.subscribe();
  }


}
