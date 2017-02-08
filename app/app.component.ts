import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import any = jasmine.any;

@Component({
selector: 'app',
templateUrl: '/app/app.component.html'
})

export class AppComponent implements OnInit{
  config: any; // Конфигурация системы
  branches: any; // Массив с данными филиалов
  damask: any; // Для загрузки данных из Дамаска
  button = {green:{active: true, css: "active"},
            yellow:{active: true, css: "active"},
            red:{active: true, css: "active"}}; // Обьект кнофок фильтрации

  constructor() {}

  // Загрузка конфигурации системы
  getConfigs() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/config.json', false);
    xhr.send();
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      // console.log(xhr.responseText);
      this.config = JSON.parse(xhr.responseText);
    }
  }

  // Загрузка конфигурации филиалов
  getBranches() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/branches.json', false);
    xhr.send();
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      // console.log(xhr.responseText);
      this.branches = JSON.parse(xhr.responseText);
    }
  }

  // Загрузка данных из Дамаска
  getDamask(mode: boolean): any {
    let xhr = new XMLHttpRequest();
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

  // Поиск позиции филиала по ID
  searchPosition(m:any, s: any): number {
    for (let i=0; i < m.length; i++){
      if (m[i].id.toUpperCase() === s.toUpperCase()) {return i}
    }
  }

  // Сбрасывает статусы филиалов
  resetDamask() {
    for (let i=0; i < this.branches.length; i++){
      this.branches[i].inLine = -1;
      this.branches[i].status = 0;
      this.branches[i].css = "statusNo"
    }
  }

  // Обновление данных из Дамаска
  updateDamask(){
    let status = 0;
    let s = 0;
    this.resetDamask();
    for (let i=0; i < this.branches.length; i++){
      this.branches[i].work = this.damask[this.searchPosition(this.branches, this.branches[i].id)].work;
      this.branches[i].inLine = this.damask[this.searchPosition(this.branches, this.branches[i].id)].inLine;
      this.branches[i].averageTime = this.damask[this.searchPosition(this.branches, this.branches[i].id)].averageTime;
      if (this.branches[i].work > 0) {
        s = (this.branches[i].inLine * this.branches[i].averageTime) / this.branches[i].work;
        if (s <= this.config.statusGreen) {
          status = 1;
          this.branches[i].css = "statusGreen"
        } else if (s <= this.config.statusYellow) {
          status = 2;
          this.branches[i].css = "statusYellow"
        } else {
          status = 3;
          this.branches[i].css = "statusRed"
        }
        ;
        this.branches[i].status = status;
        this.branches[i].s = s;
      } else this.branches[i].status = status;
    }
  }

  // Обработчик фильтрации филиалов
  searchFilter(){
    for(let i = 0; i < this.branches.length; i++) {
      if ((this.branches[i].css == "statusGreen") && (this.button.green.active)) {
        this.branches[i].active = true;
      } else if ((this.branches[i].css == "statusYellow") && (this.button.yellow.active)) {
        this.branches[i].active = true;
      } else if ((this.branches[i].css == "statusRed") && (this.button.red.active)) {
        this.branches[i].active = true;
      } else if (this.branches[i].css == "statusNo") {
        this.branches[i].active = true;
      } else
        this.branches[i].active = false;
    }
  }

  // Обновление снапшотов (подмена кеша изображений)
  refreshCams(){
    for(let i = 0; i < this.branches.length; i++) {
      this.branches[i].imgpath2 = this.branches[i].imgpath + '?decache' + Math.random();
    }
  }

  // Обработчик клика ЗЕЛЕНОГО фильтра
  greenClick(){
    this.button.green.active = !this.button.green.active;
    if (this.button.green.css = ""){
      this.button.green.css = "active"
    } else {
      this.button.green.css = "";
    }
    this.searchFilter();
  }

  // Обработчик клика ЖЕЛТОГО фильтра
  yellowClick(){
    this.button.yellow.active = !this.button.yellow.active;
    if (this.button.yellow.css = ""){
      this.button.yellow.css = "active"
    } else {
      this.button.yellow.css = "";
    }
    this.searchFilter();
  }

  // Обработчик клика КРАСНОГО фильтра
  redClick(){
    this.button.red.active = !this.button.red.active;
    if (this.button.red.css = ""){
      this.button.red.css = "active"
    } else {
      this.button.red.css = "";
    }
    this.searchFilter();
  }

  // Инициализация системы
  ngOnInit() {
      this.getConfigs();
      this.getBranches();
      // this.getDamask(false);
      // this.searchFilter();
      // this.refreshCams();

      let timer = Observable.timer(0, this.config.refreshTime); //Создание таймера
      timer.subscribe(t=> {

        if (this.getDamask(false)) {this.updateDamask()};
        this.searchFilter();
        this.refreshCams();
        console.log(this.branches[3]);
      });
  }


}
