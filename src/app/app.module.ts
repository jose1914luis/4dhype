import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {LoginPage} from '../pages/login/login';
import {PanelPage} from '../pages/panel/panel';
import {UnpublisPage} from '../pages/unpublis/unpublis';
import {StackPage} from '../pages/stack/stack';
import {StackdetailPage} from '../pages/stackdetail/stackdetail';
import {LinedetailPage} from '../pages/linedetail/linedetail';
import {FriendPage} from '../pages/friend/friend';
import {RecallsPage} from '../pages/recalls/recalls';
import {OrbsPage} from '../pages/orbs/orbs';
import {Wizard1Page} from '../pages/wizard1/wizard1';
import {UserPage} from '../pages/user/user';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HTTP} from '@ionic-native/http';
import { HttpModule } from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import {Camera} from '@ionic-native/camera';
import { SceneGraph } from '../components/scenegraph/scenegraph';



@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        LoginPage,
        PanelPage,
        UnpublisPage,
        StackPage,
        RecallsPage,
        StackdetailPage,
        LinedetailPage,
        FriendPage,
        OrbsPage,
        Wizard1Page,
        SceneGraph,
        UserPage
    ],
    imports: [
        HttpModule,
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        LoginPage,
        PanelPage,
        UnpublisPage,
        StackPage,
        RecallsPage,
        StackdetailPage,
        LinedetailPage,
        FriendPage,
        OrbsPage,
        Wizard1Page,
        UserPage
    ],
    providers: [
        Camera,
        StatusBar,
        HTTP,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
