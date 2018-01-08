import {Component, Input, ElementRef} from '@angular/core';
import * as THREE from 'three';

var pai_distance1 = 300;
var globalPlanets = [];
var pai_distance2 = 100;
var saturn = [];
var inOrb = false;
var pai_cam_rotating = false;
var pai_cam_direction = null;
var controls;
var verA;
var veces = 0;
var camera = new THREE.Camera;
var scene = new THREE.Scene();
var verT;
var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer();
var pai_rot_num = 140;
var pai_forward_speed = 12;
var pai_cam_rotating = false;
var pai_cam_direction = null;

@Component({
    selector: 'scenegraph',
    template: '<div style="width:100%; height:100%"></div>'
})
export class SceneGraph {

    @Input()
    geometry: string;


    mesh: THREE.Mesh;
    animating: boolean;
    Points;
    constructor(private sceneGraphElement: ElementRef) {
    }

    ngAfterViewInit() {
        

        var HEIGHT = window.innerHeight;
        var WIDTH = window.innerWidth;

        camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.5, 2000);
        camera.position.z = 100;
        console.log(camera);


        var prevX = 0;
        var planets = [{
            "id": "9",
            "url": "http:\/\/www.4dhype.com\/stack.php?id=9",
            "texto": "Real Aliens? Real Spacecraft? Does the Extraterrestrial Hypothesis Still Hold Water?",
            "panels": [{
                "url": "..\/stack.php?id=9&line_id=21",
                "text": "Do Aliens really exist or is it just another conjured up lie?"
            },
            {
                "url": "..\/stack.php?id=9&line_id=22",
                "text": "Should We Believe in Flying Sorcery? "
            },
            {"url": "..\/stack.php?id=9&line_id=23", "text": "The NullHypothesis "},
            {"url": "..\/stack.php?id=9&line_id=24", "text": "Public Opinion "},
            {"url": "..\/stack.php?id=9&line_id=25", "text": "Are [some] UFOs the product of an extraterrestrial in        telligence? "},
            {"url": "..\/stack.php?id=9&line_id=26", "text": "The Wider and Wilder Picture"},
            {"url": "..\/stack.php?id=9&line_id=27", "text": "CattleMutilations "}]
        }]

        for (var i in planets) {
            var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
            var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
            var x = WIDTH / 8 * Math.random() * plusOrMinus1;
            var y = HEIGHT / 8 * Math.random() * plusOrMinus2;
            while (true) {
                if (Math.abs(prevX - x) > WIDTH / 32) {
                    break;
                }
                x = WIDTH / 8 * Math.random() * plusOrMinus1;
            }

            var randomColor = "#000000".replace(/0/g, function () {
                return (~~(Math.random() * 16)).toString(16);
            });
            var saturn1 = new Planet(planets[i].id, planets[i].texto, randomColor, x, y, -pai_distance1 * Math.random() - pai_distance2 * ((parseInt(i) < 1 ? 1 : parseInt(i)) * 2), planets[i].panels);
            globalPlanets.push(saturn1);

            //console.log(saturn1);
            saturn1.addAll(scene);
            saturn.push(saturn1);

            prevX = x;
        }

        //Particles
        var particleCount = 80000;
        var particles = new THREE.Geometry();

        for (var p = 0; p < particleCount; p++) {
            var pX = Math.random() * 2000 - 1000,
                pY = Math.random() * 2000 - 1000,
                pZ = -Math.random() * 6000 + 400,
                particle = new THREE.Vector3(pX, pY, pZ);
            particles.vertices.push(particle);
        }

        var pMaterial = new THREE.PointsMaterial({
            size: 1.25,
            map: new THREE.TextureLoader().load("assets/images/glow.png"),
            color: 0xFFFFFF,
            blending: THREE.AdditiveBlending,
            transparent: true

        });

        this.Points = new THREE.Points(particles, pMaterial);
        //Points.sortParticles = true;
        scene.add(this.Points);                
        
        // Controls
        controls = new FlyControls(renderer.domElement);
        //this.controls.domElement = container;
        controls.movementSpeed = 0.1;
        controls.rollSpeed = 0.1;
        controls.autoForward = false;
        controls.dragToLook = false;
        
        this.sceneGraphElement.nativeElement.childNodes[0].appendChild(renderer.domElement);
        
        clock.start();
    }

    startAnimation() {
        let width = this.sceneGraphElement.nativeElement.childNodes[0].clientWidth;
        let height = this.sceneGraphElement.nativeElement.childNodes[0].clientHeight;
        renderer.setSize(width, height);
        this.animating = true;
        this.render();
    }

    stopAnimation() {
        this.animating = false;
    }

    render() {
        //mueve la camara hacia adelante
        var delta = clock.getDelta();
        if (!inOrb) {
            if (camera.position.z > -5000) {
                if (verA != undefined) {
                    var move = 1;
                    if (veces < move) {
                        if (verT != undefined) {
                            var diference = new THREE.Vector3(verA.x - verT.x, verA.y - verT.y, verA.z - verT.z);
                            camera.lookAt(new THREE.Vector3(verT.x + diference.x * veces, verT.y + diference.y * veces, verT.z));

                            //var camPos = camera.position;
                            //var camLookVec = controls.lookVector;
                            //camera.lookAt(camPos.x + camLookVec.x * 100, camPos.y + camLookVec.y * 100, camPos.z + camLookVec.z * 100);
                        } else {
                            camera.lookAt(new THREE.Vector3(verA.x * veces, verA.y * veces, verA.z));
                        }
                        veces += 0.01;
                    } else {
                        verT = verA.clone();
                        verA = undefined;
                        veces = 0;
                    }
                }
            }
            controls.update(delta);
        }

        renderer.render(scene, camera);
        if (this.animating) {requestAnimationFrame(() => {this.render()});};
    }

}



class Planet {

    id = '';
    panels = '';
    ringAdded = false;
    name = '';
    z;
    x;
    y;
    //    matPlanet = new THREE.MeshDepthMaterial({
    //        color: new THREE.Color(0xFFeeee),
    ////        roughness: 0.9,
    ////        emissive: new THREE.Color(0x000000),
    ////        transparent: true,
    ////        opacity: 0.8,
    ////        shading: THREE.FlatShading
    //    });
    //    
    matPlanet = new THREE.MeshBasicMaterial({color: 0xFFeeee, wireframe: false});
    mesh = new THREE.Object3D();
    ring = new THREE.Mesh();
    ring2 = new THREE.Mesh();
    nParticles = 0;
    pai_spin_speed = 0.007;
    pai_spin_speed2 = 0.021;
    sprite;
    sprite2;

    parameters = {
        radius: 15.5,
        speed: 0.000005,
        //speed: 0.0001,
        particles: 7,
        size: 2.5
    };

    constructor(id, name, color, x, y, z, panels) {
        this.id = id;
        this.panels = panels;
        this.name = name;
        this.z = x;
        this.x = y;
        this.y = z;

        let geomPlanet = new THREE.SphereGeometry(5, 32, 32);
        let planet = new THREE.Mesh(geomPlanet, this.matPlanet);

        var scale = 64;
        let spriteMap = new THREE.TextureLoader().load("assets/images/glow.png");
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            color: color
        });
        this.sprite = new THREE.Sprite(spriteMaterial);
        this.sprite.scale.set((scale - 45) * 1.5, (scale - 45) * 1.5, (scale - 45) * 1.5);

        let spriteMap2 = new THREE.TextureLoader().load("assets/images/red.png");
        let spriteMaterial2 = new THREE.SpriteMaterial({
            map: spriteMap2,
            color: color
        });
        this.sprite2 = new THREE.Sprite(spriteMaterial2);
        this.sprite2.scale.set((scale / 2 - 20) * 1.5, (scale / 2 - 20) * 1.5, (scale / 2 - 20) * 1.5);

        // Create a global mesh to hold the planet and the ring

        this.mesh.add(planet);

        planet.castShadow = true;
        planet.receiveShadow = true;

        // create the particles to populate the ring
        //this.updateParticlesCount();

        // update the position of the particles => must be moved to the loop
        //this.updateParticlesRotation();
    }

    addAll(scene) {

        //        this.mesh.position.x = this.x;
        //        this.mesh.position.y = this.y;
        //        this.mesh.position.z = this.z;
        //        console.log(this.mesh)
        /*this.mesh.x = this.x;
        this.mesh.y = this.y;
        this.mesh.z = this.z;*/
        //
        //        this.sprite.position.x = this.x;
        //        this.sprite.position.y = this.y;
        //        this.sprite.position.z = this.z;
        //
        //        this.sprite.name = "img";
        //        this.sprite2.name = "img";
        ////
        //        this.sprite2.position.x = this.x;
        //        this.sprite2.position.y = this.y;
        //        this.sprite2.position.z = this.z;

        scene.add(this.mesh);
        scene.add(this.sprite);
        scene.add(this.sprite2);
    }

    updateParticlesCount() {
        if (this.nParticles < this.parameters.particles) {
            for (var i = this.nParticles; i < this.parameters.particles; i++) {
                var p = new Particle(0.75, this.panels[i]);
                //                console.log(p.mesh);
                this.ring.add(p.mesh);
            }
        } else {
            while (this.nParticles > this.parameters.particles) {
                var m = this.ring.children[this.nParticles - 1];
                this.ring.remove(m);
                m.userData.po = null;
                this.nParticles--;
            }
        }
        this.nParticles = this.parameters.particles;
        var angleStep = Math.PI * 2 / this.nParticles;
        this.updateParticlesDefiniton(angleStep);
    }

    updateParticlesDefiniton(angleStep) {
        for (var i = 0; i < this.nParticles; i++) {

            //console.log(this.ring);
            //console.log(this.ring.children[i]);
            var m = this.ring.children[i];
            m.scale.set(this.parameters.size, this.parameters.size, this.parameters.size);

            // set a random distance
            m.userData.distance = this.parameters.radius;

            // give a unique angle to each particle
            m.userData.angle = angleStep * i;

            // set a speed proportionally to the distance
            m.userData.angularSpeed = this.parameters.speed;
        }
    }

    updateParticlesRotation() {
        // increase the rotation of each particle and update its position
        this.ring.rotateX(this.pai_spin_speed); // 0.010, truepai
        this.ring.rotateY(this.pai_spin_speed); // 0.010, truepai

        for (var i = 0; i < this.nParticles; i++) {

            //            console.log(this.ring);
            var m = this.ring.children[i];
            // increase the rotation angle around the planet
            m.userData.angle += this.pai_spin_speed2;

            // calculate the new position
            var posX = Math.cos(m.userData.angle) * m.userData.distance;
            var posZ = Math.sin(m.userData.angle) * m.userData.distance;

            m.position.x = posX;
            m.position.z = posZ;

            m.rotation.y = -m.userData.angle + Math.PI / 2;
        }
    }
}


class Particle {

    color1 = 0x101010;
    glowColor1 = 0x3333ff;
    transparent1 = false;
    opacity1 = 1;
    wireframe1 = false;
    sprite;
    mesh;
    constructor(size, text) {


        var geom = new THREE.BoxGeometry(size * 3, size * 4, size * 1);


        if (text.text == "-") {
            this.color1 = 0x101010;
            this.transparent1 = true;
            this.opacity1 = 0.6;
            this.glowColor1 = 0x101010;
            this.wireframe1 = true;
        }


        var material = new THREE.MeshStandardMaterial({
            color: this.color1,
            transparent: this.transparent1,
            opacity: this.opacity1,
            roughness: 0.9,//emissive: '0x101010',
            wireframe: this.wireframe1,
            shading: THREE.SmoothShading
        });

        var spriteMap = new THREE.TextureLoader().load("assets/images/glow.png");

        if (text.text == "-") {
            spriteMap = new THREE.TextureLoader().load("");
        }

        var spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            color: this.glowColor1
        });

        this.sprite = new THREE.Sprite(spriteMaterial);

        var scale = 3;
        this.sprite.scale.set(scale * 2, scale * 2, scale * 2);
        this.mesh = new THREE.Mesh(geom, material);

        var _this = this;
        this.mesh.addGlow = function () {
            _this.mesh.add(_this.sprite);
            _this.mesh.material.color.setHex(_this.glowColor1);
        };

        this.mesh.text = text.text;
        this.mesh.url = text.url;

        this.mesh.removeGlow = function () {
            _this.mesh.remove(_this.sprite);
            _this.mesh.material.color.setHex(_this.color1);
        };

        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.mesh.userData.po = this;
    };
}



class FlyControls {

    object;
    domElement;
    movementSpeed;
    rollSpeed;
    dragToLook;
    autoForward;
    tmpQuaternion;
    mouseStatus;
    moveState;
    moveVector;
    rotationVector;
    targetRotationVector;
    dRotationVector;
    direction;
    targetDirection;
    upVector;
    rotNum;
    handleEvent;
    keydown;
    dispose;
    getContainerDimensions;
    updateRotationVector;
    updateMovementVector;
    update;
    mouseclick;
    mouseup;
    mousemove;
    mousedown;
    keyup;
    renderer;
    camera;
    scene;
    veces = 0;
    parRot = true;
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    pai_rot_speed = new THREE.Vector3(0, 0, 0);

    constructor(domElement) {
        
        camera = camera;
        
        this.object = camera;

        this.domElement = (domElement !== undefined) ? domElement : document;
        if (domElement) this.domElement.setAttribute('tabindex', - 1);

        // API

        this.movementSpeed = 20.0;
        this.rollSpeed = 0.000;

        this.dragToLook = false;
        this.autoForward = false;

        // disable default target object behavior

        // internals

        this.tmpQuaternion = new THREE.Quaternion();

        this.mouseStatus = 0;

        this.moveState = {up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0};
        this.moveVector = new THREE.Vector3(0, 0, 0);
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.targetRotationVector = new THREE.Vector3(0, 0, 0);
        this.dRotationVector = new THREE.Vector3(0, 0, 0);
        
        this.direction = new THREE.Vector3(0, 0, -1);
        this.targetDirection = new THREE.Vector3(0, 0, -1);
        this.upVector = new THREE.Vector3(0, 1, 0);

        this.rotNum = 120;

        this.handleEvent = function (event) {

            if (typeof this[event.type] == 'function') {

                this[event.type](event);

            }

        };

        this.update = function (delta) {

            //console.log('moviendo');
                        
            var dx = (this.targetDirection.x - this.direction.x) / pai_rot_num;
            var dy = (this.targetDirection.y - this.direction.y) / pai_rot_num;
            var dz = (this.targetDirection.z - this.direction.z) / pai_rot_num;
            
            //console.log(delta);
//            console.log(dy);
//            console.log(dz);

            if (Math.abs(this.targetDirection.x - this.direction.x) <= Math.abs(this.pai_rot_speed.x * delta)
                && Math.abs(this.targetDirection.y - this.direction.y) <= Math.abs(this.pai_rot_speed.y * delta)
                && Math.abs(this.targetDirection.z - this.direction.z) <= Math.abs(this.pai_rot_speed.z * delta)) {
                this.direction.x = this.targetDirection.x;
                this.direction.y = this.targetDirection.y;
                this.direction.z = this.targetDirection.z;
                pai_cam_rotating = false;

            } else {
                this.direction.x = this.direction.x + this.pai_rot_speed.x * delta;
                this.direction.y = this.direction.y + this.pai_rot_speed.y * delta;
                this.direction.z = this.direction.z + this.pai_rot_speed.z * delta;

                pai_cam_rotating = true;
                //pai_forward_speed = pai_cam_speed;
            }

            //this.direction.normalize();
            pai_cam_direction = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z);

            var upVec = new THREE.Vector3();
            var r_xz = Math.sqrt(this.direction.x * this.direction.x + this.direction.z * this.direction.z);
            if (this.direction.y > 0) {
                upVec.y = r_xz;
                upVec.x = - this.direction.y * this.direction.x / r_xz;
                upVec.z = - this.direction.y * this.direction.z / r_xz;
            } else if (this.direction.y < 0) {
                upVec.y = r_xz;
                upVec.x = this.direction.y * this.direction.x / r_xz;
                upVec.z = this.direction.y * this.direction.z / r_xz;
            }

            var upVec2 = new THREE.Vector3(-upVec.x, -upVec.y, -upVec.z);
            var d1 = this.upVector.distanceTo(upVec);
            var d2 = this.upVector.distanceTo(upVec2);


            var moveMult = delta * pai_forward_speed;
            camera.position.x += this.direction.x * moveMult;
            camera.position.y += this.direction.y * moveMult;
            camera.position.z += this.direction.z * moveMult;
            //console.log(camera.position.x);


            if (d1 < d2) {
                this.upVector.set(upVec.x, upVec.y, upVec.z);
            }
            else {
                this.upVector.set(upVec2.x, upVec2.y, upVec2.z);
            }

            //console.log(upVec);
            //console.log(upVec2);
            //camara.up = this.upVector;
            camera.lookAt(new THREE.Vector3(camera.position.x + this.direction.x * 100, camera.position.y + this.direction.y * 100, camera.position.z + this.direction.z * 100));

        };


    }
}