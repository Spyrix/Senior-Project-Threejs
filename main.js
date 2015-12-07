//setting up three.js
//remember to start up http-server before running for testing in cygwin

var camera, controls, scene, renderer;


//maybe add support for onwindow resize, and ondocumentmouse move as seen in objtest.js
//window.innerWidth

function init(){
	//initiate the scene

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 20;

	//essentially says that these TrackballControlls will control the camera
	controls = new THREE.TrackballControls( camera );

	//define certain speeds, reducing any to zero disables the functionality
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.5;

	//when there is a change, call render()
	controls.addEventListener('change', render);

	scene = new THREE.Scene();

	//Lights
	var ambient = new THREE.AmbientLight( 0x404040 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );


	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );
	//Renderer
	renderer = new THREE.WebGLRenderer();
	//set height
	renderer.setSize(window.innerWidth/3, window.innerHeight/3);
	renderer.setClearColor( 0x000000, 1 );
	//default background will be black, white border is b/c 
	//objLoadTest();
	//objLoadTest2();
	grabObj();
	document.body.appendChild(renderer.domElement);//adds a child to the html doc

	//window resizing
	window.addEventListener( 'resize', onWindowResize, false );
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
	//grabObj();
}

function grabObj(){
	$(document).ready(function ($) {
		var obj;
		//url should probably just be /data because that always points to an xml file
		$.ajax({
			url: '/kidney_hollow.xml',
			type: 'get',
			dataType: 'xml',
			success: function(data) {
				//for each pair of node - oglmodel nodes do this
				$(data).find('Node OglModel').each(function() {
					var normals = $(this).attr('normal');
					var position = $(this).attr('position');
					var texcoords = $(this).attr('texcoords');
					var quads = $(this).attr('quads')
					var triangles = $(this).attr('triangles');
					//now to assemble the obj file
					var position2 = position.split(" ");
					var texcoords2 = texcoords.split(" ");
					var normals2 = normals.split(" ");
					var quads2 = quads.split(" ");
					var triangles2 = triangles.split(" ");
					var obj = "";

					//add geometric verticies to obj
					var counter = 0;
					for (var i = 0; i < position2.length; ++i){
						//for some reason, split() creates empty strings, so this snippetignores
						if(position2[i] === ""){
							continue;
						}
						//if it if the beginning, add v at the beginning
						if(counter === 0){
							var v = "v ";
							var result = v + position2[i];
							obj = obj + result + " ";
							++counter;
							continue;
						}
						if (counter === 1){
							obj = obj + position2[i] + " ";
							++counter;
							continue;
						}
						if(counter === 2){
							obj = obj + position2[i] + "\n";
							counter = 0;
							continue;
						}
					}

					//add texture verticies to obj
					counter = 0;
					for (var i = 0; i < texcoords2.length; ++i){
						//for some reason, split() creates empty strings, so this snippetignores
						if(texcoords2[i] === ""){
							continue;
						}
						//if it if the beginning, add v at the beginning
						if(counter === 0){
							var v = "vt ";
							var result = v + texcoords2[i];
							obj = obj + result + " ";
							++counter;
							continue;
						}
						if (counter === 1){
							obj = obj + texcoords2[i] + " ";
							++counter;
							continue;
						}
						if(counter === 2){
							obj = obj + texcoords2[i] + "\n";
							counter = 0;
							continue;
						}
					}
					
					//add the normals to the obj
					counter = 0;
					for (var i = 0; i < normals2.length; ++i){
						//for some reason, split() creates empty strings, so this snippetignores
						if(normals2[i] === ""){
							continue;
						}
						//if it if the beginning, add v at the beginning
						if(counter === 0){
							var v = "vn ";
							var result = v + normals2[i];
							obj = obj + result + " ";
							++counter;
							continue;
						}
						if (counter === 1){
							obj = obj + normals2[i] + " ";
							++counter;
							continue;
						}
						if(counter === 2){
							obj = obj + normals2[i] + "\n";
							counter = 0;
							continue;
						}
					}
					
					//add quads to obj
					counter = 0;
					for (var i = 0; i < quads2.length; ++i){
						//for some reason, split() creates empty strings, so this snippetignores
						if(quads2[i] === ""){
							continue;
						}
						//if it if the beginning, add v at the beginning
						if(counter === 0){
							var f = "f ";
							var inter = parseInt(quads2[i])+1;
							var result = f + inter + "//" + inter;
							obj = obj + result + " ";
							++counter;
							continue;
						}
						if (counter === 1){
							var inter = parseInt(quads2[i])+1;
							obj = obj + inter + "//" + inter + " ";
							++counter;
							continue;
						}
						if(counter === 2){
							var inter = parseInt(quads2[i])+1;
							obj = obj + inter + "//" + inter + " ";
							++counter;
							continue;
						}
						if(counter === 3){
							var inter = parseInt(quads2[i])+1;
							obj = obj + inter + "//" + inter + "\n";
							counter = 0;
							continue;
						}
					}

					var manager = new THREE.LoadingManager();
					var loader = new THREE.OBJLoader( manager );
					var object = loader.parse(obj);
					scene.add(object);
					var bb = new THREE.Box3();
					bb.setFromObject(object);
					bb.center(controls.target);
					render();

					
				});
			
				//console.log(data);
			},
			error: function() {
				alert("Error, cannot find the xml file!");
				$('.kidney_hollow').text('Failed to find the appropriate xml file.');
			}
		}); 

		return obj;
	}); 
}

function objLoadTest(){
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
	render();
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
	render();
	/*
	End of OBJ loader
	*/
}

function objLoadTest2(){

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};

	var loader = new THREE.OBJLoader( manager );
	
	loader.load( 'Spleen.obj', function ( object ) {

		object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
				//So here I have changed the material of the object to a new material and defined new stuff for it
				child.material = new THREE.MeshPhongMaterial;
				//child.scale.set( 2, 1, 1 ); //this allows me to scale the size of the object
			}
		} );
		
		//object.applyMatrix( new THREE.Matrix4().makeTranslation( -5,-5,-5 ) );
		scene.add( object );
		camera.lookAt(object.position);
	}, onProgress, onError );
	render();
	/*
	var loader = new THREE.OBJLoader( manager ); 	
	var object = loader.parse('Spleen.obj');
	scene.add(object);*/
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}