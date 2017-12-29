import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {PROXY} from '../../providers/constants/constants';

@Component({
    selector: 'page-stack',
    templateUrl: 'stack.html',
})
export class StackPage {

    cargar = true;
    mensaje = '';
    stack = {
        category: '',
        created_by: '',
        description: '',
        id: '',
        line_id: '',
        stack_title: '',
        status: '',
        timestamp: '',
        title: '',
        total_hits: ''
    }
    
    constructor(private alertCtrl: AlertController, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {
        
        let self = this;        
        let auth = this.navParams.get('item');
        self.mensaje += JSON.parse(auth);
        
        self.http.setDataSerializer('json');
        self.http.post(PROXY + '/unpublished_stacks.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
            .then(data => {
                self.cargar = false;
                self.mensaje += JSON.parse(data.data);
                self.stack = JSON.parse(data.data);                
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
