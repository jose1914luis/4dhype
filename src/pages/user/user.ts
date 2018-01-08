import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {
    user = {
        first_name: '',
        last_name: '',
        email: '',
        username: ''
    }
    cargar = false;
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: Http, public navCtrl: NavController, public navParams: NavParams) {

        let self = this;
        self.cargar = true;
        this.storage.get('user').then((val) => {

            //self.mensaje += JSON.stringify(val);            
            let auth = {
                id: val.verf_data.id,
                access_token: val.access_token
            };
            self.http.post(PROXY + '/view_user.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
                data => {//
                    self.cargar = false;
                    self.user = data;
                },
                err => {
                    self.presentAlert('Error!', JSON.stringify(err));
                    self.cargar = false;
                }
            );
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserPage');
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
