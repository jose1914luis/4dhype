import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';
import {PanelPage} from '../../pages/panel/panel';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    mensaje = '';
    loginData = {email: 'test@gmail.com', password: 'a', "autoLogin": true};
    cargar = false;
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: Http, public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad LoginPage');
        this.doLogin();
    }

    doLogin() {

        let self = this;
        self.cargar = true;
       
        
        this.http.post(PROXY + '/index.php', btoa(JSON.stringify(self.loginData))).map(res => res.json()).subscribe(
            data => {//
                self.cargar = false;
                var user = data;
                if (user.access_token != undefined && user.access_token != null && user.access_token != '') {
                    self.storage.set('user', user);
                    self.navCtrl.setRoot(PanelPage);
                } else {
                    self.presentAlert('Error!', 'Access Denied');
                    self.cargar = false;
                }                
            },
            err => {
                self.presentAlert('Error!', JSON.stringify(err));
                self.cargar = false;
            }
        );

    }

    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }
}
