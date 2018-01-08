import { ViewChild, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SceneGraph } from '../../components/scenegraph/scenegraph'

/**
 * Generated class for the OrbsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orbs',
  templateUrl: 'orbs.html',
})
export class OrbsPage {


  @ViewChild('scenegraph')
  sceneGraph: SceneGraph;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.sceneGraph.startAnimation();
  }

  ionViewDidLeave() {
    this.sceneGraph.stopAnimation();
  }

}
