import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LangList {

  private LANG_LIST : {lang: string, code: string}[] =  [{lang:'fr', code: 'fr-FR'}, {lang: 'en', code: 'fr-FR'}]
  
  public getLangList(): {lang: string, code: string}[] {
    return this.LANG_LIST;
  }
}