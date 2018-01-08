import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Wizard1Page} from '../../pages/wizard1/wizard1';

@Component({
    selector: 'page-panel',
    templateUrl: 'panel.html',
})
export class PanelPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PanelPage');
    }

    goTo(item) {
        this.navCtrl.push(Wizard1Page);
    }

}
