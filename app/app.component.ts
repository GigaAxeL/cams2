import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";

import {BranchesService} from "./app.service";
import any = jasmine.any;


@Component({
selector: 'app',
templateUrl: '/app/app.component.html'
})

export class AppComponent implements OnInit{
  config = {"refreshTime": 0};
  branches: any;

  constructor(public branchesService: BranchesService) {}

  getConfigs() {
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
  //   //   branch.imgpath = "images/noconnect.jpg";
  //   //    checkCams();
  //   deferred.resolve(false);
  // };
  // image.onload = function () {
  //   branch.active = true;
  //   branch.updTime = new Date().getTime();
  //   deferred.resolve(true);
  //
  // };
  // image.src = branch.imgpath;
  // // console.log("---1--->" + $scope.branches);
  //
  // return deferred.promise;
  // }


  ngOnInit() {
      this.getBranches();
      this.getConfigs();
      // console.log('--> ngOnInit() fired ' + typeof(this.config) + " = " + this.config.refreshTime);

      let timer = Observable.timer(0, this.config.refreshTime);
      timer.subscribe(t=> {
        console.log("huesos");
        this.getBranches();
      });
  }


}
