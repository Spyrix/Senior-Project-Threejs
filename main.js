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
	controls.rotateSpeed = 10.0;
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

	//Renderer
	renderer = new THREE.WebGLRenderer();
	//set height
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0x000000, 1 );
	//default background will be black, white border is b/c 

	var div = document.getElementById("myDiv");

	//adds the renderer as a child to whatever div html element
	div.appendChild(renderer.domElement);

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

function doAll(){
	init();
	animate();
	render();
	grabObjs();
	//demo();
}

function grabObjs(){

	$(document).ready(function ($) {
		var obj;
		//url should probably just be /data because that always points to an xml file
		$.ajax({
			url: 'liver.xml',
			type: 'get',
			dataType: 'xml',
			success: function(data) {
				//for each pair of node - oglmodel nodes do this
				$(data).find('OglModel').each(function() {
					var normals = $(this).attr('normal');
					var position = $(this).attr('position');
					var texcoords = $(this).attr('texcoords');
					var quads = $(this).attr('quads')
					var textureName = $(this).attr('texturename');
					var triangles = $(this).attr('triangles');

					//now to assemble the obj file
					var obj = "";
					var counter = 0;
					//add geometric verticies to obj
					if (position){
						var position2 = position.split(" ");

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
					}
					
					if (texcoords) {
						var texcoords2 = texcoords.split(" ");
						//add texture verticies to obj
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
								obj = obj + texcoords2[i] + " " + 0.00000 + "\n";
								counter = 0;
								continue;
							}
						}
					}
					var counter = 0;
					if (normals){
						var normals2 = normals.split(" ");
						//add the normals to the obj
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
					}
					var counter = 0;
					if (quads){
						var quads2 = quads.split(" ");
						//add quads to obj
						for (var i = 0; i < quads2.length; ++i){
							//for some reason, split() creates empty strings, so this snippetignores
							if(quads2[i] === ""){
								continue;
							}
							//if it if the beginning, add v at the beginning
							if(counter === 0){
								var f = "f ";
								var inter = parseInt(quads2[i])+1;
								var result = f + inter + "/" + inter + "/" + inter;
								obj = obj + result + " ";
								++counter;
								continue;
							}
							if (counter === 1){
								var inter = parseInt(quads2[i])+1;
								obj = obj + inter + "/"+inter+"/" + inter + " ";
								++counter;
								continue;
							}
							if(counter === 2){
								var inter = parseInt(quads2[i])+1;
								obj = obj + inter + "/"+inter+"/" + inter + " ";
								++counter;
								continue;
							}
							if(counter === 3){
								var inter = parseInt(quads2[i])+1;
								obj = obj + inter + "/"+inter+"/" + inter + "\n";
								counter = 0;
								continue;
							}
						}
					}
					var counter = 0;
					if(triangles) {
						var triangles2 = triangles.split(" ");
						for (var i = 0; i < triangles2.length; ++i){
							//for some reason, split() creates empty strings, so this snippetignores
							if(triangles2[i] === ""){
								continue;
							}
							//if it if the beginning, add v at the beginning
							if(counter === 0){
								var f = "f ";
								var inter = parseInt(triangles2[i])+1;
								var result = f + inter + "/"+inter+"/" + inter;
								obj = obj + result + " ";
								++counter;
								continue;
							}
							if (counter === 1){
								var inter = parseInt(triangles2[i])+1;
								obj = obj + inter + "/"+inter+"/" + inter + " ";
								++counter;
								continue;
							}
							if(counter === 2){
								var inter = parseInt(triangles2[i])+1;
								obj = obj + inter + "/"+inter+"/" + inter + "\n";
								counter = 0;
								continue;
							}
						}
					}
					
					//console.log(obj);
				
					var manager = new THREE.LoadingManager();
					
					var texture = new THREE.Texture();

					//take care of texture
					
					var loader = new THREE.ImageLoader( manager );
					loader.load( 'musclet.jpg', function ( image ) {

						texture.image = image;
						texture.needsUpdate = true;

					} );
					/*
					if(textureName){
						loader.load( textureName, function ( image ) {

						texture.image = image;
						texture.needsUpdate = true;

						} );
					}
					else {
						alert("No associated texture file with this object");
					}
					*/					

					var loader = new THREE.OBJLoader( manager );
					var object = loader.parse(obj);
					
					if(textureName) {
						object.traverse( function ( child ) {

							if ( child instanceof THREE.Mesh ) {

								child.material.map = texture;

							}

						} );
					}
					//object.material = new THREE.MeshPhongMaterial;
					//MeshPhongMaterial.material.map = texture;



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
		
	}); 

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function demo(){
		var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};


				var loader = new THREE.ImageLoader( manager );
				loader.load( 'HumanHeart-Color.jpg', function ( image ) {

					texture.image = image;
					texture.needsUpdate = true;

				} );

				// model

				var loader = new THREE.OBJLoader( manager );
				loader.load( 'HumanHeart.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material.map = texture;

						}

					} );

					scene.add( object );

				}, onProgress, onError );
}
