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

  // checkCams() {
  //   var i;
  //   for(i = 0; i < this.branches.length; i++) {
  //     var b = this.branches[i];
  //     this.isImage(b).then(function (test: any) {
  //       console.log(test);
  //     })
  //   }
  // }
  //
  // isImage(branch: any): Promise<any> {
  //
  // var image = new Image();
  //  image.src = branch.imgpath;
  //  return new Promise((resolve, reject) => {
  //    if (image.onload) {
  //      resolve(console.log("Cam " + branch + " connected..."));
  //    } else {
  //      reject(console.log("Cam " + branch + " no connect..."));
  //    }
  //  });

  // image.onerror = function () {
  //   branch.active = true;
  //      branch.imgpath = "images/noconnect.jpg";
  //       checkCams();
  //   deferred.resolve(false);
  // };
  // image.onload = function () {
  //   branch.active = true;
  //   branch.updTime = new Date().getTime();
  //   deferred.resolve(true);
  //
  // };
  // image.src = branch.imgpath;
  //  console.log("---1--->" + $scope.branches);
  //
  // return deferred.promise;
  // }


  ngOnInit() {
      this.getConfigs();
      this.getBranches();
      this.getDamask(false);

      console.log("viz is " + this.searchPos(this.branches,"VIZ"));

      // console.log('--> ngOnInit() fired ' + typeof(this.config) + " = " + this.config.damaskUrl);

      let timer = Observable.timer(0, this.config.refreshTime);
      timer.subscribe(t=> {
        if (this.getDamask(false)) {this.updateDamask()};
        console.log(this.branches[0]);
      });
  }


}
