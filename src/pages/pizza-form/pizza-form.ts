import {Component} from '@angular/core';
import {Validators, FormControl, FormGroup} from '@angular/forms';
import {NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import {Pizza} from '../../models/pizza';
import {PizzaProvider} from '../../providers/pizza/pizza';
import {IngredientProvider} from '../../providers/ingredient/ingredient';
import {ingredientToArrayIds} from '../../models/pizza';
import {PizzaListPage} from '../pizza-list/pizza-list';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import {Geolocation} from "@ionic-native/geolocation";


@Component({
  selector: 'page-pizza-form',
  templateUrl: 'pizza-form.html',
  providers: [PizzaProvider, IngredientProvider]
})
export class PizzaFormPage {

  pizza: Pizza;
  isLoading = false;
  title_form: string;

  listIngredient: any;
  selectedIngredients: any;

  base64textString: string;

  updateMode: boolean;

  private form: FormGroup;
  private lat: number;
  private long: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private pizzaProvider: PizzaProvider,
              private ingredientProvider: IngredientProvider,
              private camera: Camera,
              private DomSanitizer: DomSanitizer,
              private geolocation: Geolocation
              ) {

    this.updateMode = this.navParams.data.update ? this.navParams.data.update : false;
    if (this.updateMode) {
      this.pizza = this.navParams.data.pizza;
    } else {
      this.resetForm();
    }

  }

  resetForm(){
    this.pizza = {
      _id: '',
      name: '',
      description: '',
      img: '',
      ingredients: []
    };
    this.selectedIngredients = [];
  }


  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then(position => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
    });

    // ON charge la liste des INGREDIENTS
    this.ingredientProvider.get().subscribe(
      data => {
        this.listIngredient = data;
      },
      () => {
        this.listIngredient = [];
      }
    );

    // SI ON AJOUTE
    if (!this.updateMode) {
      this.title_form = 'Ajouter';
    } else {
      this.title_form = 'Modifier';
    }

    this.selectedIngredients = ingredientToArrayIds(this.pizza.ingredients);
    // On initialise le form
    this.form = new FormGroup({
      img: new FormControl(this.pizza.img),
      name: new FormControl(this.pizza.name, Validators.required),
      description: new FormControl(this.pizza.description, Validators.required),
      ingredients: new FormControl(this.selectedIngredients)
    });

  }

  /* *** Evenement onChange Image Pizza *** */
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.pizza.img = btoa(binaryString);
    this.form.patchValue({img: this.pizza.img});
  }

  onSubmit() {
    this.isLoading = true;
    // SI ON AJOUTE
    const pizza = { ...this.form.value, lat: this.lat, long: this.long };
    console.log(pizza, this.lat);

    if (!this.updateMode) {
      this.pizzaProvider.create(pizza).subscribe(
        () => {
          // J'ai retiré le toast ici puisqu'il sera reçu par le socket
          this.navCtrl.setRoot(PizzaListPage, {admin:true}, {animate: true, direction: 'foward'});
        },
        () => console.error(`Un problème est survenu lors de l'ajout de la pizza.`),

        () => this.isLoading = false
      );
    } else {
      // SI ON UPDATE
      this.pizzaProvider.update(this.pizza._id, pizza).subscribe(
        (pizza) => {
          // J'ai retieré le toast ici puisqu'il sera reçu par le socket
          this.navCtrl.setRoot(PizzaListPage, {admin:true}, {animate: true, direction: 'foward'});
        },
        () => console.log(`Un problème est survenu lors de a mise à jour de la pizza.`, 'Oups !'),
        () => this.isLoading = false
      );
    }

  }

  toggleIngredient(id) {
    const index = this.selectedIngredients.indexOf(id);
    if (index !== -1) {
      this.selectedIngredients.splice(index, 1);
    } else {
      this.selectedIngredients.push(id);
    }
  }

  openCamera(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imageData => {
      this.pizza.img = imageData;
      this.form.patchValue({img: imageData});
    });
  }

}
