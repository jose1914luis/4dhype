import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
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
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {

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
            self.http.setDataSerializer('json');
            self.http.post(PROXY + '/view_recalls.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
                .then(data => {
                    self.cargar = false;
                    var recalls = JSON.parse(data.data);
                    for (var key in recalls) {
                        self.items.push({
                            recall_id: recalls[key].id,
                            stack_id: recalls[key].stack_id,
                            access_token: val.access_token,
                            stack_title: recalls[key].stack_title,
                            timestamp: new Date(recalls[key].timestamp).toDateString(),
                        });
                    }
                })
                .catch(error => {

                    self.presentAlert('Error!', JSON.stringify(error));
                    self.cargar = false;
                });
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

        let alert = this.alertCtrl.create({
            title: 'Alert',
            message: 'Are you sure you want to delete this recall and related files?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.deleteStack(item);
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
        self.http.setDataSerializer('json');
        self.http.post(PROXY + '/delete_recall.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
            .then(data => {

                var tmp = JSON.parse(data.data);

                if (tmp[0] == true) {
                    self.ionViewDidLoad();
                }
            })
            .catch(error => {

                self.presentAlert('Error!', JSON.stringify(error));
                self.cargar = false;
            });
    }

    loadRecall(item) {

        this.navCtrl.push(StackdetailPage, {item: item});
    }

}
