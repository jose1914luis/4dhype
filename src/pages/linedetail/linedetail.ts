import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the LinedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

}
