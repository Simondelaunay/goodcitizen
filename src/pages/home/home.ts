import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {Profile} from "../../models/profile";
import {FirebaseObjectObservable} from "angularfire2/database-deprecated";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  profileData : Profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private toast: ToastController) {
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.uid) {
        this.toast.create({
          message: `Welcome to Good Citizen, ${data.email}`,
          duration: 3000
        }).present();

        this.afDatabase.object(`profile/${data.uid}`).valueChanges().subscribe((data: Profile)=>{
          this.profileData =  data;
        });
        console.log(this.profileData);
      }
      else {
        this.toast.create({
          message: `Could not find Auth details .dd.! `,
          duration: 3000
        }).present();
      }
    })
  }

}
