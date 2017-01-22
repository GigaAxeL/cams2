import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';

import { AppComponent }     from './app.component';
import { BranchesService }  from "./app.service";

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent ],
  providers:    [ BranchesService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

}
