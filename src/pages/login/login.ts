import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {PROXY} from '../../providers/constants/constants';
import {PanelPage} from '../../pages/panel/panel';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    mensaje = '';
    loginData = {email: 'simpleraison@googlemail.com', password: 'testtest123', "autoLogin": true};
    cargar = false;
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad LoginPage');
    }

    doLogin() {

        let self = this;
        self.cargar = true;
        this.http.setDataSerializer('json');
        this.http.post(PROXY + '/index.php', btoa(JSON.stringify(self.loginData)), {'Content-Type': 'application/json;charset=UTF-8'})
            .then(data => {

                self.cargar = false;
                var user = JSON.parse(data.data);
                if (user.access_token != undefined && user.access_token != null && user.access_token != '') {
                    self.storage.set('user', user);
                    self.navCtrl.setRoot(PanelPage);
                } else {
                    self.presentAlert('Error!', 'Access Denied');
                    self.cargar = false;
                }
            })
            .catch(error => {
                self.presentAlert('Error!', JSON.stringify(error));
                self.cargar = false;
            });
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
