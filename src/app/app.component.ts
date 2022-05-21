import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LangList } from './utils/lang-list';
import { MultiTranslateHttpLoader } from './utils/multi-translate-http-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private langListService: LangList
  ) { }

  ngOnInit() {
    this.setDefaultLang();
  }

  setDefaultLang() {
    const browserLang = this.translate.getBrowserLang();
    const langList = this.langListService.getLangList();
    let codeLang = browserLang && langList.find(lang => lang.lang === browserLang) ? langList.find(lang => lang.lang === browserLang).code : langList[0].code;
    this.translate.setDefaultLang(codeLang);
    this.translate.use(codeLang);
  }
}
