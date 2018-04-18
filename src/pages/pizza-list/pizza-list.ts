import { Component } from '@angular/core';
import {ActionSheetController, NavController, NavParams, ToastController} from 'ionic-angular';
import { PizzaProvider } from '../../providers/pizza/pizza';
import { Pizza } from '../../models/pizza';
import { PizzaDetailPage } from "../pizza-detail/pizza-detail";
import { PizzaFormPage } from "../pizza-form/pizza-form";

@Component({
  selector: 'page-pizza-list',
  templateUrl: 'pizza-list.html',
  providers: [PizzaProvider]
})
export class PizzaListPage {

  adminMode: boolean;
  listPizza: Pizza[];
  pizzaDetailPage: typeof PizzaDetailPage;
  pizzaFormPage: typeof PizzaFormPage;
  connection;


  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController,
              private pizzaProvider: PizzaProvider) {

    this.adminMode = this.navParams.data.admin ? this.navParams.data.admin : false;
    this.pizzaDetailPage = PizzaDetailPage;
    this.pizzaFormPage = PizzaFormPage;
    // Récupération des Pizzas
    this.connection = this.pizzaProvider.get().subscribe((pizza) => {
      this.listPizza = pizza;
    });
  }

  ionViewDidLoad() {

    // SOCKET.IO
    // POST
    this.connection = this.pizzaProvider.listenPizzaPost().subscribe((pizza: any) => {
        this.listPizza.unshift(pizza);
        this.toastCtrl.create({
          message: `Découvrez la nouvelle Pizza : ${pizza.name} !! `,
          duration: 3000,
          position: 'top'
        }).present();
      },
      () => {
        console.error(`Un problème a été rencontré durant la récupération de la nouvelle pizza.`, 'Oups !');
      }
    );
    // PUT
    this.connection = this.pizzaProvider.listenPizzaPut().subscribe((pizza: any) => {
        // Mise à jour de l'ingrédient
        for (const i in this.listPizza) {
          if (this.listPizza[i]._id === pizza._id) {
            this.listPizza[i] = pizza;
          }
        }
        this.toastCtrl.create({
          message: `La Pizza : ${pizza.name} a été améliorée !! `,
          duration: 3000,
          position: 'top'
        }).present();
      },
      () => {
        console.error(`Un problème a été rencontré durant la récupération de la pizza mise à jour.`);
      }
    );
    // DELETE
    this.connection = this.pizzaProvider.listenPizzaDelete().subscribe((pizza: any) => {
        this.listPizza = this.listPizza.filter(aPizza => aPizza._id !== pizza._id);
        this.toastCtrl.create({
          message: `La Pizza : ${pizza.name} a été supprimée !! `,
          duration: 3000,
          position: 'top'
        }).present();
      },
      () => {
        console.error(`Un problème a été rencontré durant la récupération de la pizza supprimée.`);
      }
    );


  }

  deletePizza(id) {
    this.connection = this.pizzaProvider.deleteById(id).subscribe(
      () => {
        this.listPizza = this.listPizza.filter(aPizza => aPizza._id !== id);

      },
      () => console.log('error')
    );

  }
  /***************************************/
  /* *** ACTION CLIQUE SUR UNE IMAGE *** */
  /***************************************/
  presentActionSheet(pizza: Pizza) {
    const actionSheet = this.actionSheetCtrl.create({
      title: `Action sur la Pizza`,
      buttons: [
        {
          // ACTION ENREGISTRER
          text: 'Voir',
          icon: 'ios-eye',
          handler: () => {
            this.navCtrl.push(PizzaDetailPage, pizza);
          }
        },
        {
          // ACTION ENREGISTRER
          text: 'Modifier',
          icon: 'ios-cog',
          handler: () => {
            this.navCtrl.push(PizzaFormPage, {pizza: pizza, update: true});
          }
        },
        {
          // ACTION SUPPRIMER
          text: 'Supprimer',
          icon: 'ios-trash',
          role: 'destructive',
          handler: () => {
            this.deletePizza(pizza._id);
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
  redirectAdminPizzas(){
    this.navCtrl.setRoot(PizzaListPage, {admin:true}, {animate: true, direction: 'foward'});
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
