import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';
import {Storage} from '@ionic/storage';
import {UserPage} from '../../pages/user/user';



@Component({
    selector: 'page-friend',
    templateUrl: 'friend.html',
})
export class FriendPage {
    items = [];
    cargar = true;
    mensaje = '';
    icons = 'send';
    color = 'secondary';
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: Http, public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {

        this.items = [];

        let self = this;
        self.cargar = true;
        this.storage.get('user').then((val) => {

            //self.mensaje += JSON.stringify(val);            
            let auth = {
                id: val.verf_data.id,
                access_token: val.access_token
            };
            self.http.post(PROXY + '/view_users_browsed_with.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
                data => {//
                    self.cargar = false;
                    var recalls = data;
                    for (var key in recalls) {
                        self.items.push({
                            browse_date: recalls[key].browse_date,
                            user_id: recalls[key].user_id,
                            access_token: val.access_token,
                            first_name: recalls[key].first_name,
                            last_name: recalls[key].last_name,
                            stack_title: recalls[key].stack_title
                        });
                    }
                },
                err => {
                    self.presentAlert('Error!', JSON.stringify(err));
                    self.cargar = false;
                }
            );
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

    ejecute(item) {
        
        let self = this;
        let auth = {
            id: item.user_id,
            access_token: item.access_token,
        };
        self.http.post(PROXY + '/view_user.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
            data => {//
                var tmp = data;
                self.navCtrl.push(UserPage, data)
            },
            err => {
                self.presentAlert('Error!', JSON.stringify(err));
                self.cargar = false;
            }
        );
    }


}
