import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {PROXY} from '../../providers/constants/constants';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'page-unpublis',
    templateUrl: 'unpublis.html',
})
export class UnpublisPage {

    selectedItem: any;
    icons: string[];
    items: Array<{stack_title: string, timestamp: string}>;
    cargar = true;
    mensaje = '';

    constructor(private alertCtrl: AlertController, private storage: Storage, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {

        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');

        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];

        this.items = [];
        for (let i = 1; i < 11; i++) {
            
        }
        
        let self = this;
        
        this.storage.get('user').then((val) => {

            //self.mensaje += JSON.stringify(val);            
            let auth = {
                created_by:val.verf_data.id, 
                access_token:val.access_token,
                status:"unpublished"
            };
            self.http.setDataSerializer('json');
            self.http.post(PROXY + '/unpublished_stacks.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
                .then(data => {
                    self.cargar = false;
                    var stacks = JSON.parse(data.data);
                    for (var key in stacks) {                        
                        self.items.push({
                            stack_title: stacks[key].stack_title,
                            timestamp: new Date(stacks[key].timestamp).toDateString()+' '
                        });
                    }
                })
                .catch(error => {

                    self.presentAlert('Error!', JSON.stringify(error));
                    self.cargar = false;
                });
        });        
    }

    itemTapped(event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(UnpublisPage, {
            item: item
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
