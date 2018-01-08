import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';
import {StackPage} from '../../pages/stack/stack';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'page-unpublis',
    templateUrl: 'unpublis.html',
})
export class UnpublisPage {

    items = [];
    cargar = true;
    mensaje = '';
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: Http, public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {

        this.items = [];

        let self = this;
        self.cargar = true;
        this.storage.get('user').then((val) => {

            //self.mensaje += JSON.stringify(val);            
            let auth = {
                created_by: val.verf_data.id,
                access_token: val.access_token,
                status: "unpublished"
            };

            this.http.post(PROXY + '/unpublished_stacks.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
                data => {//
                    self.cargar = false;
                    var stacks = data;
                    for (var key in stacks) {
                        self.items.push({
                            stack_id: stacks[key].id,
                            access_token: val.access_token,
                            stack_title: stacks[key].stack_title,
                            timestamp: new Date(stacks[key].timestamp).toDateString(),
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

        let alert = this.alertCtrl.create({
            cssClass: 'custom-alert',
            title: item.stack_title,
            message: 'What do you want to do?',
            buttons: [
                {
                    text: 'Publish',                    
                    handler: () => {
                        this.publishStack(item);
                    }
                },
                {
                    text: 'Edit',
                    handler: () => {
                        this.navCtrl.push(StackPage, {item: item});
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.deleteStack(item);
                    }
                },
                {
                    text: 'Cancel',
                    handler: () => {
                        console.log('cancel');
                    }
                }
            ]
        });
        alert.present();
    }

    deleteStack(item) {

        let self = this;
        let auth = {
            id: item.stack_id,
            access_token: item.access_token,
        };

        this.http.post(PROXY + '/delete_stack.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
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

    publishStack(item) {

        let self = this;
        let auth = {
            id: item.stack_id,
            access_token: item.access_token,
        };
        
        this.http.post(PROXY + '/publish_stack.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
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

}
