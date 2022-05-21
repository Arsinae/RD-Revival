import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DynamicLocaleId } from '../utils/dynamic-locale';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    { provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [TranslateService] },
  ]
})
export class HomeModule { }
