import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {PROXY} from '../../providers/constants/constants';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    mensaje = '';
    loginData = {username: 'simpleraison@googlemail.com', password: 'testtest123'}
    constructor(private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad LoginPage');
    }

    doLogin() {

        let self = this;
        let params = {
            email: this.loginData.username,
            password: this.loginData.password,
        }
        this.http.post(PROXY + 'rest_api/', params, {})
            .then(data => {
                self.mensaje += JSON.stringify(data);
                console.log(data.status);
                console.log(data.data); // data received by server
                console.log(data.headers);

            })
            .catch(error => {
                self.mensaje += JSON.stringify(error);
                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);

            });
    }

}
