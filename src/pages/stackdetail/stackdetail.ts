import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {PROXY} from '../../providers/constants/constants';
import {LinedetailPage} from '../../pages/linedetail/linedetail';

@Component({
    selector: 'page-stackdetail',
    templateUrl: 'stackdetail.html',
})
export class StackdetailPage {

    cargar = false;
    mensaje = '';
    stack = {
        id: '',
        stack_title: '',
        category: '',
        total_hits: '',
        created_by: '',
        status: '',
        timestamp: '',        
    }
    lines = [];

    constructor(private alertCtrl: AlertController, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {

        let self = this;
        let auth = this.navParams.get('item');

        self.http.setDataSerializer('json');
        self.http.post(PROXY + '/stack_detail.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
            .then(data => {
                self.cargar = false;
                var tmp = JSON.parse(data.data);
                //self.mensaje += JSON.stringify(tmp);
                //self.mensaje += JSON.stringify(tmp[0]);
                self.stack = tmp[0];//JSON.parse(data.data[0]);
                self.http.post(PROXY + '/lines.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
                    .then(data => {
                        self.cargar = false;
                        var tmp = JSON.parse(data.data);
                        //self.mensaje += pru[0].id;
                        self.stack = tmp[0];//JSON.parse(data.data[0]);

                        var lines = JSON.parse(data.data);
                        for (var key in lines) {
                            self.lines.push({
                                id: lines[key].id,
                                title: lines[key].title,
                                description: lines[key].description,
                                timestamp: lines[key].timestamp,
                            });
                        }

                    })
                    .catch(error => {

                        self.presentAlert('Error!', JSON.stringify(error));
                        self.cargar = false;
                    });
            })
            .catch(error => {

                self.presentAlert('Error!', JSON.stringify(error));
                self.cargar = false;
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StackdetailPage');
    }


    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }
    openLine(line){
        
        this.navCtrl.push(LinedetailPage, {line:line});
    }
}
