import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
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
        avatar: ''
    };
    constructor(private alertCtrl: AlertController, private storage: Storage, private camera: Camera, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {

        let self = this;
        this.http.setDataSerializer('json');
        this.storage.get('user').then((val) => {

            self.user.first_name = val.verf_data.first_name;
            self.user.last_name = val.verf_data.last_name;
            self.user.email = val.verf_data.email;
            self.user.password = val.verf_data.password;
            self.user.avatar = val.verf_data.avatar;
            self.mensaje += JSON.stringify(val.verf_data.avatar);

            let auth = {
                access_token: val.access_token,
                id: val.verf_data.id
            }
            self.http.post(PROXY + '/view_user_space_log.php', btoa(JSON.stringify(auth)), {'Content-Type': 'application/json;charset=UTF-8'})
                .then(data => {


                    self.cargar = false;
                    var time = JSON.parse(data.data);

                    self.user.tt_visited = time.tt_visited;
                    self.user.tt_spent = time.tt_spent;

                })
                .catch(error => {

                    self.presentAlert('Error!', JSON.stringify(error));
                    self.mensaje += JSON.stringify(error);
                });
        });
    }

    save() {

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
