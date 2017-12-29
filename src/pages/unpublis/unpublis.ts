import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {PROXY} from '../../providers/constants/constants';
import {StackPage} from '../../pages/stack/stack';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'page-unpublis',
    templateUrl: 'unpublis.html',
})
export class UnpublisPage {
    
    items:any = [];
    cargar = true;
    mensaje = '';
    icons = 'send';
    color = 'secondary';
    constructor(private alertCtrl: AlertController, private storage: Storage, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {

        this.items = [];        
        
        let self = this;
        
        this.storage.get('user').then((val) => {

            //self.mensaje += JSON.stringify(val);            
            let auth = {
                created_by:val.verf_data.id, 
                access_token:val.access_token,
                status:"unpublished"
            };
            self.http.setDataSerializer('json');
            self.http.post(PROXY + '/stacks_lines.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
                .then(data => {
                    self.cargar = false;
                    var stacks = JSON.parse(data.data);
                    for (var key in stacks) {                        
                        self.items.push({
                            stack_id:stacks[key].id,
                            access_token:val.access_token,
                            stack_title: stacks[key].stack_title,
                            timestamp: new Date(stacks[key].timestamp).toDateString(),                            
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
    
    changeColor(color){
        this.color = color;
    }
    
    ejecute(item){
        this.navCtrl.push(StackPage, {item:item});
    }

}
