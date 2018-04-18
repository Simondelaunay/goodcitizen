import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Ingredient } from '../../models/ingredient';

@Component({
  selector: 'page-ingredient-detail',
  templateUrl: 'ingredient-detail.html'
})

export class IngredientDetailPage {
  ingredient: Ingredient;

  constructor(public navParams: NavParams) {
    this.ingredient = this.navParams.data;
  }

}
