import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PizzaFormPage } from './pizza-form';

@NgModule({
  declarations: [
    PizzaFormPage,
  ],
  imports: [
    IonicPageModule.forChild(PizzaFormPage),
  ],
})
export class PizzaFormPageModule {}
