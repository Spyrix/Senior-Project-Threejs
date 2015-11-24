//setting up three.js
//remember to start up http-server before running for testing in cygwin
var camera, controls, scene, renderer;


//maybe add support for onwindow resize, and ondocumentmouse move as seen in objtest.js

function init(){
	/*
	Jquery stuff
	So what I am not thinking is that maybe this stuff is only called when a jquery request is made?
	*/
	//all jquery code goes inside a document ready function
	
	/*
	End jquery stuff
	*/

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 20;

	//essentially says that these TrackballControlls will control the camera
	controls = new THREE.TrackballControls( camera );

	//define certain speeds, reducing any to zero disables the functionality
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	//when there is a change, call render()
	controls.addEventListener('change', render);

	scene = new THREE.Scene();


	/*
	LOADING THE OBJS
	*/
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	//texture 

	var texture = new THREE.Texture();
	var bmap = new THREE.Texture();

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	//loading the texture
	var loader = new THREE.ImageLoader( manager );
	loader.load( 'HumanHeart-color.jpg', function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
	} );

	// the bumpmap


	var loader = new THREE.ImageLoader( manager );
	loader.load( 'HumanHeart-bump.jpg', function (image) {
			bmap.image = image;
			bmap.needsUpdate = true;
	} );

	// model

	var loader = new THREE.OBJLoader( manager );
	loader.load( 'HumanHeart.obj', function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {
				//So here I have changed the material of the object to a new material and defined new stuff for it
				child.material = new THREE.MeshPhongMaterial;
				child.material.map = texture;
				child.material.bumpmap = bmap;
				//child.scale.set( 2, 1, 1 ); //this allows me to scale the size of the object
			}

		} );

		scene.add( object );

	}, onProgress, onError );

	/*
	End of OBJ loader
	*/

	//Lights
	var ambient = new THREE.AmbientLight( 0x101030 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );
	//Renderer
	renderer = new THREE.WebGLRenderer();
	//set height
	renderer.setSize(window.innerWidth, window.innerHeight);

	//default background will be black, white border is b/c 

	document.body.appendChild(renderer.domElement);//adds a child to the html doc
}

function animate(){
	requestAnimationFrame( animate );
	controls.update();//updates controls from the mouse
}

function render(){
	renderer.render(scene, camera);//render this scene from the view of the camera
}

function doall(){
	init();
	animate();
	render();
}