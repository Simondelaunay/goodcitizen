import {Component} from '@angular/core';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {NavController, NavParams, ToastController } from 'ionic-angular';
import {Ingredient} from '../../models/ingredient';
import {IngredientProvider} from '../../providers/ingredient/ingredient';
import {IngredientListPage} from '../ingredient-list/ingredient-list';


@Component({
  selector: 'page-ingredient-form',
  templateUrl: 'ingredient-form.html',
  providers: [IngredientProvider]
})
export class IngredientFormPage {

  ingredient: Ingredient;
  isLoading = false;
  title_form: string;

  updateMode: boolean;

  private form: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private ingredientProvider: IngredientProvider) {

    this.updateMode = this.navParams.data.update ? this.navParams.data.update : false;
    if (this.updateMode) {
      this.ingredient = this.navParams.data.ingredient;
    } else {
      this.resetForm();
    }

  }

  resetForm(){
    this.ingredient = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      weight: ''
    };
  }


  ionViewDidLoad() {

    // SI ON AJOUTE
    if (!this.updateMode) {
      this.title_form = 'Ajouter';
    } else {
      this.title_form = 'Modifier';
    }

    // On initialise le form
    this.form = new FormGroup({
      weight: new FormControl(this.ingredient.weight, Validators.required),
      name: new FormControl(this.ingredient.name, Validators.required),
      description: new FormControl(this.ingredient.description, Validators.required),
      price: new FormControl(this.ingredient.price, Validators.required)
    });


  }


  onSubmit() {
    this.isLoading = true;
    // SI ON AJOUTE
    if (!this.updateMode) {
      this.ingredientProvider.create(this.form.value).subscribe(
        () => {
          this.navCtrl.setRoot(IngredientListPage, {admin:true}, {animate: true, direction: 'foward'});
        },
        () => console.error(`Un problème est survenu lors de l'ajout de l'ingrédient.`),

        () => {
          this.isLoading = false;
        }
      );
    } else {
      // SI ON UPDATE
      this.ingredientProvider.update(this.ingredient._id, this.form.value).subscribe(
        () => {
          this.navCtrl.setRoot(IngredientListPage, {admin:true}, {animate: true, direction: 'foward'});
        },
        () => console.error(`Un problème est survenu lors de a mise à jour de l'ingrédient.`, 'Oups !'),
        () => this.isLoading = false
      );
    }

  }

}
