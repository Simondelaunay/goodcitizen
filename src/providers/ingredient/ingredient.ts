import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

import * as io from 'socket.io-client';

import { Ingredient } from '../../models/ingredient';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class IngredientProvider {

  private baseUrl = 'https://nodegctest-simsimz.c9users.io';
  private socket  = io.connect(this.baseUrl);

  private url: string;

  constructor(public http: HttpClient) {
    this.url = this.baseUrl + '/ingredients';
  }

  get(): Observable<any> {
    return this.http.get(this.url);
  }

  getById(id): Observable<any> {
    return this.http.get(this.url + '/' + id);
  }

  create(ingredient: Ingredient): Observable<any> {
    return this.http.post(this.url, ingredient);
  }

  update(id, ingredient: Ingredient): Observable<any> {
    return this.http.put(this.url + '/' + id, ingredient);
  }

  deleteById(id): Observable<any> {
    // AVANT on supprimer mais cela n'est pas l'idéal puisque sinon on devrait supprimer pour chaque pizza qui possède cet ingredient, l'ingrédient
    return this.http.delete(this.url + '/' + id);
  }


  /* *** SOCKET *** */
  listenIngredientPost() {
    /* Evenement on add-pizza */
    console.log('Listen SOCKET Ingredient POST');
    let observable = new Observable(observer => {
        this.socket.on('[Ingredient][post]', (data) => {
          console.log('caca');
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  listenIngredientPut() {
    console.log('Listen SOCKET Ingredient PUT');
    /* Evenement on add-pizza */
    let observable = new Observable(observer => {
        this.socket.on('[Ingredient][put]', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  listenIngredientDelete() {
    console.log('Listen SOCKET Ingredient DELETE');
    /* Evenement on add-pizza */
    let observable = new Observable(observer => {
        this.socket.on('[Ingredient][delete]', (data) => {
          console.log('coucou');
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }



}
