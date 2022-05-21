import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export function translateLoader(http: HttpClient) {
  
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/', suffix: '/common.json'},
    {prefix: './assets/i18n/', suffix: '/home.json'},
    {prefix: './assets/i18n/', suffix: '/login.json'}
  ]);
}

@Injectable({
  providedIn: 'root'
})
export class MultiTranslateHttpLoader implements TranslateLoader {

  constructor(
    private http: HttpClient,
    public resources: { prefix: string, suffix: string }[]
  ) {}

  /**
   * Gets the translations from the server
   * @param lang
   * @returns {any}
   */
  public getTranslation(lang: string): any {
    return forkJoin(this.resources.map(config => {
      return this.http.get(`${config.prefix}${lang}${config.suffix}`);
    })).pipe(map(response => {
      return response.reduce((a, b) => {
        return Object.assign(a, b);
      });
    }));
  }
}