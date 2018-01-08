import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from '../../pages/login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    
      this.navCtrl.setRoot(LoginPage);
  }
  
  goToLogin(){
      this.navCtrl.setRoot(LoginPage);
  }

}
