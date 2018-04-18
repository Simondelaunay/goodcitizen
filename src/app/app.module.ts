import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';

import { PizzaProvider } from '../providers/pizza/pizza';
import { PizzaListPage } from '../pages/pizza-list/pizza-list';
import { PizzaDetailPage } from '../pages/pizza-detail/pizza-detail';
import { AdministrationPage } from '../pages/administration/administration';
import { PizzaFormPage } from '../pages/pizza-form/pizza-form';
import {MapPage} from '../pages/basket/basket';
import {ProfilPage} from '../pages/profil/profil';
import {HomePage} from "../pages/home/home";

import {GoogleMaps} from "@ionic-native/google-maps";
import { HttpClientModule } from '@angular/common/http';
import {IngredientListPage} from '../pages/ingredient-list/ingredient-list';
import {IngredientFormPage} from '../pages/ingredient-form/ingredient-form';
import {IngredientDetailPage} from '../pages/ingredient-detail/ingredient-detail';

import {IonicStorageModule} from '@ionic/storage';
import {AngularFireModule} from "angularfire2";
import { FIREBASE_CREDENTIALS } from "./firebase.credentials";
import {LoginPage} from "../pages/login/login";
import {AngularFireAuthModule} from "angularfire2/auth";
import {RegisterPage} from "../pages/register/register";
import {RegisterPageModule} from "../pages/register/register.module";
import {HomePageModule} from "../pages/home/home.module";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {ProfilPageModule} from "../pages/profil/profil.module";


@NgModule({
  declarations: [
    MyApp,
    AdministrationPage,
    PizzaListPage,
    PizzaFormPage,
    PizzaDetailPage,
    IngredientListPage,
    IngredientFormPage,
    IngredientDetailPage,
    MapPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule,
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RegisterPageModule,
    HomePageModule,
    ProfilPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AdministrationPage,
    PizzaFormPage,
    PizzaListPage,
    PizzaDetailPage,
    IngredientListPage,
    IngredientFormPage,
    IngredientDetailPage,
    MapPage,
    HomePage,
    ProfilPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PizzaProvider,
    GoogleMaps,
    Camera,
    Geolocation
  ]
})
export class AppModule {}
