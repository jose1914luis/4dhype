import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {UnpublisPage} from '../pages/unpublis/unpublis';
import {ListPage} from '../pages/list/list';
import {PanelPage} from '../pages/panel/panel';
import {RecallsPage} from '../pages/recalls/recalls';

import {OrbsPage} from '../pages/orbs/orbs';
//import * as textAgular from 'textangular';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;
    //rootPage: any = OrbsPage;

    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: PanelPage},
            {title: 'My Profile', component: ListPage},            
            {title: 'Unpublished Stacks', component: UnpublisPage},
            {title: 'My Recalls', component: RecallsPage},            
            {title: 'Logout', component: LoginPage}
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
