import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';


@Component({
    selector: 'page-linedetail',
    templateUrl: 'linedetail.html',
})
export class LinedetailPage {

    line = {title: '', timestamp: '', description: ''};
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.line = this.navParams.get('line');         
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LinedetailPage');
    }

    collapse(){

    }

}
