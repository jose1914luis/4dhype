import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';
import {Storage} from '@ionic/storage';
import {StackdetailPage} from '../../pages/stackdetail/stackdetail';

@Component({
    selector: 'page-recalls',
    templateUrl: 'recalls.html',
})
export class RecallsPage {

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
            self.http.post(PROXY + '/view_recalls.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
                data => {//
                    self.cargar = false;
                    var recalls = data;
                    for (var key in recalls) {
                        self.items.push({
                            recall_id: recalls[key].id,
                            stack_id: recalls[key].stack_id,
                            access_token: val.access_token,
                            stack_title: recalls[key].stack_title,
                            timestamp: new Date(recalls[key].timestamp).toDateString(),
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

    changeColor(color) {
        this.color = color;
    }

    ejecute(item) {

        let self = this;
        let alert = this.alertCtrl.create({
            cssClass: 'custom-alert',
            title: item.stack_title,
            message: 'What do you want to do?',
            buttons: [
                
                {
                    text: 'View',
                    handler: () => {
                        self.loadRecall(item);
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        self.deleteStack(item);
                    }
                },
                {
                    text: 'Cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    deleteStack(item) {

        let self = this;
        let auth = {
            id: item.recall_id,
            access_token: item.access_token,
        };
        self.http.post(PROXY + '/delete_recall.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
                data => {//
                    var tmp = data;

                    if (tmp[0] == true) {
                        self.ionViewDidLoad();
                    }
                },
                err => {
                    self.presentAlert('Error!', JSON.stringify(err));
                    self.cargar = false;
                }
            );
    }

    loadRecall(item) {

        this.navCtrl.push(StackdetailPage, {item: item});
    }

}
