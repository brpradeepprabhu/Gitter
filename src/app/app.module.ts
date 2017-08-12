


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataTableModule, DialogModule, ButtonModule, TabViewModule, InputTextModule } from 'primeng/primeng';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { GitService } from "./git.service";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    DialogModule,
    InputTextModule,
    TabViewModule

  ],
  providers: [GitService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
