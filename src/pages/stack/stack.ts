import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';

@Component({
    selector: 'page-stack',
    templateUrl: 'stack.html',
})
export class StackPage {

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
        line_id: '',                        
        title: '',
        description: '',                        
    }
    lines = [];

    constructor(private alertCtrl: AlertController, private http: Http, public navCtrl: NavController, public navParams: NavParams) {


        let self = this;
        let auth = this.navParams.get('item');
        //add the firts line
        this.lines.push({
            id: '1',
            title: '',
            description: ''
        });



        self.http.post(PROXY + '/stack_lines.php', btoa(JSON.stringify(auth))).map(res => res.json()).subscribe(
                data => {//
                    self.cargar = false;
                    var tmp = data;                
                    //self.mensaje += pru[0].id;
                    self.stack = tmp[0];//JSON.parse(data.data[0]);
                },
                err => {
                    self.presentAlert('Error!', JSON.stringify(err));
                    self.cargar = false;
                }
            );
    }

    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }

    addLine() {
        let self = this;
        if (this.lines.length < 8) {
            this.lines.push({
                id: self.lines.length + 1,
                title: '',
                description: ''
            });
        }
    }

}
