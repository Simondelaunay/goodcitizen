import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { PizzaListPage } from "../pizza-list/pizza-list";
import {IngredientListPage} from '../ingredient-list/ingredient-list';

@Component({
  selector: 'page-administration',
  templateUrl: 'administration.html',
})
export class AdministrationPage {

  pizzaListPage: typeof PizzaListPage;
  rootParams: any;

  constructor(private navCtrl: NavController) {
    this.rootParams = {admin : true};
  }

  ionViewDidLoad() {
    this.pizzaListPage = PizzaListPage;

  }
  redirectAdminPizzas(){
    this.navCtrl.setRoot(PizzaListPage, {admin:true}, {animate: true, direction: 'foward'});
  }
  redirectAdminIngredients(){
    this.navCtrl.setRoot(IngredientListPage, {admin:true}, {animate: true, direction: 'foward'});
  }

}
