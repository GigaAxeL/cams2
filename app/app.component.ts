import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {BranchesService} from "./app.service";
import any = jasmine.any;

@Component({
selector: 'app',
templateUrl: '/app/app.component.html'
})

export class AppComponent implements OnInit{
  config: any;
  branches: any;
  damask: any;
  greenButton = {active: true, css: "active"};
  yellowButton = {active: true, css: "active"};
  redButton = {active: true, css: "active"};

  constructor(public branchesService: BranchesService) {}

  getConfigs() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/config.json', false);
    xhr.send();
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      // console.log(xhr.responseText);
      this.config = JSON.parse(xhr.responseText);
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
      this.branches = JSON.parse(xhr.responseText);
    }
  }

  getDamask(mode: boolean): any {
    var xhr = new XMLHttpRequest();
    this.resetDamask();
    xhr.open('GET', this.config.damaskUrl, mode);
    xhr.send();
    // xhr.onreadystatechange = function() { // (3)
    //    if (xhr.readyState != 4) return;
       if (xhr.status != 200) {
         console.log(xhr.status + ': ' + xhr.statusText);
         return 0;
       } else {
         // console.log(xhr.responseText);
         this.damask = JSON.parse(xhr.responseText);
         return 1;
       }
    // }
  }

  // Поиск позиции
  searchPos(m:any, s: any): number {
    for (var i=0; i < m.length; i++){
      if (m[i].id.toUpperCase() === s.toUpperCase()) {return i}
    }
  }

  resetDamask() {
    for (var i=0; i < this.branches.length; i++){
      this.branches[i].inLine = -1;
      this.branches[i].status = 0;
      this.branches[i].css = "statusNo"
    }
  }

  updateDamask(){
    var status = 0;
    var s = 0;
    for (var i=0; i < this.branches.length; i++){
      this.branches[i].work = this.damask[this.searchPos(this.branches, this.branches[i].id)].work;
      this.branches[i].inLine = this.damask[this.searchPos(this.branches, this.branches[i].id)].inLine;
      this.branches[i].averageTime = this.damask[this.searchPos(this.branches, this.branches[i].id)].averageTime;
      s = (this.branches[i].inLine * this.branches[i].averageTime)/this.branches[i].work;
      if (s < this.config.statusGreen){status = 1; this.branches[i].css = "statusGreen"} else
        if (s < this.config.statusYellow){status = 2;this.branches[i].css = "statusYellow"} else {status = 3; this.branches[i].css = "statusRed"};
      this.branches[i].status = status;
      this.branches[i].s = s;
    }
  }

  searchFilter(){
    for(var i = 0; i < this.branches.length; i++) {
      if ((this.branches[i].css == "statusGreen") && (this.greenButton.active)) {
        this.branches[i].active = true;
      } else if ((this.branches[i].css == "statusYellow") && (this.yellowButton.active)) {
        this.branches[i].active = true;
      } else if ((this.branches[i].css == "statusRed") && (this.redButton.active)) {
        this.branches[i].active = true;
      } else
        this.branches[i].active = false;
    }
  }

  refreshCams(){
    for(var i = 0; i < this.branches.length; i++) {
      var b = this.branches[i];
      this.isImage(b);
      // this.noConnect(b);
    }
  }

  isImage(branch: any){
    for(var i = 0; i < this.branches.length; i++) {
      // if (this.branches[i].connect) {
        branch.imgpath2 = branch.imgpath + '?decache' + Math.random();
    //   } else
    //     branch.connected = true;
    }
  }

  noConnect(branch: any){
    this.branches[this.searchPos(this.branches,branch)].connected = false;
    this.branches[this.searchPos(this.branches,branch)].imgpath2 = "image/noconnect.jpg";
  }
  greenClick(){
    if (this.greenButton.active){
      this.greenButton.active = false;
      this.greenButton.css = "";
    } else {
      this.greenButton.active = true;
      this.greenButton.css = "active";
    }
    this.searchFilter();
  }

  yellowClick(){
    if (this.yellowButton.active){
      this.yellowButton.active = false;
      this.yellowButton.css = "";
    } else {
      this.yellowButton.active = true;
      this.yellowButton.css = "active";
    }
    this.searchFilter();
  }

  redClick(){
    if (this.redButton.active){
      this.redButton.active = false;
      this.redButton.css = "";
    } else {
      this.redButton.active = true;
      this.redButton.css = "active";
    }
    this.searchFilter();
  }

  ngOnInit() {
      this.getConfigs();
      this.getBranches();
      this.getDamask(false);
      this.refreshCams();
      this.searchFilter();

      console.log("viz is " + this.searchPos(this.branches,"VIZ"));

      // console.log('--> ngOnInit() fired ' + typeof(this.config) + " = " + this.config.damaskUrl);

      let timer = Observable.timer(0, this.config.refreshTime);
      timer.subscribe(t=> {
        this.refreshCams();
        if (this.getDamask(false)) {this.updateDamask()};
        console.log(this.branches[0]);
      });
  }


}
