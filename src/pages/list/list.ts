import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {PROXY} from '../../providers/constants/constants';
import {Storage} from '@ionic/storage';
import {Camera, CameraOptions} from '@ionic-native/camera';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {


    cargar = true;
    mensaje = '';
    user = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        tt_spent: '',
        tt_visited: '',
        avatar: '',
        access_token: '',
        id: ''
    };

    constructor(private alertCtrl: AlertController, private storage: Storage, private camera: Camera, private http: Http, public navCtrl: NavController, public navParams: NavParams) {

        let self = this;
        this.storage.get('user').then((val) => {

            self.user.first_name = val.verf_data.first_name;
            self.user.last_name = val.verf_data.last_name;
            self.user.email = val.verf_data.email;
            self.user.password = val.verf_data.password;
            self.user.avatar = val.verf_data.avatar;
            //self.mensaje += JSON.stringify(val.verf_data.avatar);

            self.user.access_token = val.access_token;
            self.user.id = val.verf_data.id;

            self.http.post(PROXY + '/view_user_space_log.php', btoa(JSON.stringify(self.user))).map(res => res.json()).subscribe(
                data => {
                    self.cargar = false;
                    var time = data;

                    self.user.tt_visited = time.tt_visited;
                    self.user.tt_spent = time.tt_spent;
                },
                err => {
                    self.presentAlert('Error!', JSON.stringify(err));
                    self.cargar = false;
                }
            );
        });
    }

    save() {
        let self = this;
        self.http.post(PROXY + '/user_profile.php', self.user).map(res => res.json()).subscribe(
            data => {
                self.cargar = false;
                var val = data;
                if (val) {
                    self.presentAlert('Great!', 'Your profile was update');

                } else {
                    self.presentAlert('Error!', "Your profile wasn't update");
                }
            },
            err => {
                self.presentAlert('Error!', JSON.stringify(err));
                self.cargar = false;
            }
        );
    }

    change_avatar() {
        var self = this;

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: true
        }

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            self.cargar = true;
            //let base64Image = 'data:image/jpeg;base64,' + imageData;
            //self.user.image = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + imageData);


        }, (err) => {

            self.presentAlert('Error!', JSON.stringify(err, Object.getOwnPropertyNames(err)));
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
