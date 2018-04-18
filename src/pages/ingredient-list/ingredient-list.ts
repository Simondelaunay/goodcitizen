import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, ToastController } from 'ionic-angular';
import { IngredientProvider} from '../../providers/ingredient/ingredient';
import { Ingredient } from '../../models/ingredient';
import { IngredientDetailPage } from "../ingredient-detail/ingredient-detail";
import { IngredientFormPage } from "../ingredient-form/ingredient-form";

@Component({
  selector: 'page-ingredient-list',
  templateUrl: 'ingredient-list.html',
  providers: [IngredientProvider]
})
export class IngredientListPage {

  adminMode: boolean;
  listIngredient: Ingredient[];
  ingredientDetailPage: typeof IngredientDetailPage;
  ingredientFormPage: typeof IngredientFormPage;
  connection;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController,
              private ingredientProvider: IngredientProvider) {

    this.adminMode = this.navParams.data.admin ? this.navParams.data.admin : false;
    this.ingredientDetailPage = IngredientDetailPage;
    this.ingredientFormPage = IngredientFormPage;
    // Récupération des Ingredients
    this.ingredientProvider.get().subscribe((ingredient) => {
      this.listIngredient = ingredient;
    });
  }

  ionViewDidLoad() {

    // SOCKET.IO
    // POST
    this.connection = this.ingredientProvider.listenIngredientPost().subscribe((ingredient: any) => {
        this.listIngredient.unshift(ingredient);
        this.toastCtrl.create({
          message: `L'ingrédient : ${ingredient.name} a été ajouté !! `,
          duration: 3000,
          position: 'top'
        }).present();

      },
      () => console.error(`Un problème a été rencontré durant la récupération du nouvel ingredient.`)
    );
    // PUT
    this.connection = this.ingredientProvider.listenIngredientPut().subscribe((ingredient: any) => {
        // Mise à jour de l'ingrédient
        for (const i in this.listIngredient) {
          if (this.listIngredient[i]._id === ingredient._id) {
            this.listIngredient[i] = ingredient;
          }
        }
        this.toastCtrl.create({
          message: `L'ingrédient : ${ingredient.name} a été mis à jour !! `,
          duration: 3000,
          position: 'top'
        }).present();
      },
      () => console.error(`Un problème a été rencontré durant la récupération de l'ingrédient mis à jour.`)
    );
    // DELETE
    this.connection = this.ingredientProvider.listenIngredientDelete().subscribe((ingredient: any) => {
        this.listIngredient = this.listIngredient.filter(aIngredient => aIngredient._id !== ingredient._id);
        this.toastCtrl.create({
          message: `L'ingrédient : ${ingredient.name} a été retiré !! `,
          duration: 3000,
          position: 'top'
        }).present();
      },
      () => console.error(`Un problème a été rencontré durant la récupération de l'ingredient supprimé.`)
    );

  }

  deleteIngredient(id) {
    this.ingredientProvider.deleteById(id).subscribe(
      () => {
        this.listIngredient = this.listIngredient.filter(aIngredient => aIngredient._id !== id);

      },
      () => console.log('error')
    );

  }
  /***************************************/
  /* *** ACTION CLIQUE SUR UNE IMAGE *** */
  /***************************************/
  presentActionSheet(ingredient: Ingredient) {
    const actionSheet = this.actionSheetCtrl.create({
      title: `Actions sur l'ingrédient`,
      buttons: [
        {
          // ACTION ENREGISTRER
          text: 'Voir',
          icon: 'ios-eye',
          handler: () => {
            this.navCtrl.push(IngredientDetailPage, ingredient);
          }
        },
        {
          // ACTION ENREGISTRER
          text: 'Modifier',
          icon: 'ios-cog',
          handler: () => {
            this.navCtrl.push(IngredientFormPage, {ingredient: ingredient, update: true});
          }
        },
        {
          // ACTION SUPPRIMER
          text: 'Supprimer',
          icon: 'ios-trash',
          role: 'destructive',
          handler: () => {
            this.deleteIngredient(ingredient._id);
          }
        },
        {
          // ACTION QUITTER
          text: 'Annuler',
          icon: 'ios-close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

}
