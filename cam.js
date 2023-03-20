
let captureCam1 = null;
let camera1 = null;
let capturing = false;
let width = 640;
let height = 480;
let fps = 60;

let outputCanvas1 = null;

let resultLabel;
let fpsLabel;
let currentFPS = 0;
let t0 = null;

// Main code

init();

// Functions

function init() {

	initGraphics();

}

function initGraphics() {

	function createOutputCanvas( w, h ) {
	
		outputCanvas1 = document.createElement( "canvas" );
		outputCanvas1.width = w;
		outputCanvas1.height = h;

		outputCanvas1.style.position = "absolute";
		outputCanvas1.style.width = w + "px";
		outputCanvas1.style.height = h + "px";
		outputCanvas1.style.top = "0px";
		outputCanvas1.style.left = "0px";
		document.body.append( outputCanvas1 );
			
		return outputCanvas1;

	}
	
	outputCanvas1 = createOutputCanvas( width, height );

	// Start capture button

	let button = document.createElement( 'button' );
	button.innerHTML = "Start camera";
	button.style.position = "absolute";
	button.style.top = "0px";
	button.style.left = "0px";
	button.addEventListener( 'click', () => {

		document.body.removeChild( button );
		initCameraCapture( width, height, fps,
		
		( w, h ) => {
		
			width = w;
			height = h;

		} );

	}, false );
	document.body.append( button );

	fpsLabel = document.createElement( 'div' );
	fpsLabel.style.color = "white";
	fpsLabel.innerHTML = "FPS = 0";
	fpsLabel.style.position = "absolute";
	fpsLabel.style.width = "120px";
	fpsLabel.style.height = "45px";
	fpsLabel.style.top = "250px";
	fpsLabel.style.left = "0px";
	document.body.appendChild( fpsLabel );
	
	resultLabel = document.createElement( 'div' );
	resultLabel.style.color = "white";
	resultLabel.innerHTML = "";
	resultLabel.style.position = "absolute";
	resultLabel.style.width = "120px";
	resultLabel.style.height = "45px";
	resultLabel.style.top = "300px";
	resultLabel.style.left = "0px";
	document.body.appendChild( resultLabel );

	onResizeWindow();

	function onResizeWindow() {
	
		outputCanvas1.style.position = "absolute";
		outputCanvas1.style.width = ( 0.5 * outputCanvas1.width ) + "px";
		outputCanvas1.style.height = ( 0.5 * outputCanvas1.height ) + "px";
		outputCanvas1.style.left = "0px";
		outputCanvas1.style.top = "0px";

		// Layout video image
/*
		let a = window.innerWidth * 0.5;
		let b = window.innerHeight;

		let aspect1 = widthCam1 / heightCam1;
		let aspect2 = widthCam2 / heightCam2;
		let aspectWindow = a / b;

		let width1 = b * aspect1;
		let height1 = b;
		if ( aspect1 > aspectWindow ) {

			width1 = a;
			height1 = a / aspect1;

		}

		let width2 = b * aspect2;
		let height2 = b;
		if ( aspect2 > aspectWindow ) {

			width2 = a;
			height2 = a / aspect2;

		}

		outputCanvas1.style.position = "absolute";
		outputCanvas1.style.width = width1 + "px";
		outputCanvas1.style.height = height1 + "px";

		outputCanvas2.style.position = "absolute";
		outputCanvas2.style.width = width2 + "px";
		outputCanvas2.style.height = height2 + "px";

		if ( aspect1 > aspectWindow ) {

			outputCanvas1.style.left = "0px";
			outputCanvas1.style.top = ( b - height1 ) / 2 + "px";

		}
		else {

			outputCanvas1.style.left = ( ( a - width1 ) / 2 ) + "px";
			outputCanvas1.style.top = "0px";

		}

		if ( aspect2 > aspectWindow ) {

			outputCanvas2.style.left = width1 + "px";
			outputCanvas2.style.top = ( b - height2 ) / 2 + "px";

		}
		else {

			outputCanvas2.style.left = ( width1 + ( a - width2 ) / 2 ) + "px";
			outputCanvas2.style.top = "0px";

		}
*/
	}

	window.addEventListener( 'resize', onResizeWindow, false );

}

function initCameraCapture( width, height, fps, callback ) {

	let numDetectedCams = 0;
	let cam1DeviceId = null;

let numCameras = 0;
	navigator.mediaDevices.enumerateDevices().then( ( devices ) => {
alert( "NUM DEVICES: " + devices.length );
		for ( let i = 0; i < devices.length; i ++ ) {

			let device = devices[ i ];

			if ( device.kind === 'videoinput' ) {
console.log( "CAMERA " + numCameras + ":" );
console.log( device );
numCameras ++;
				if ( numDetectedCams === 0 ) {

					cam1DeviceId = device.deviceId;
					numDetectedCams = 1;

				}
				else break;

			}
		
		}
alert( "NUM CAMERAS: " + numCameras );

return;

		if ( cam1DeviceId === null ) {
		
			console.log( "Could not find camera 1" );
		
		}

		camera1 = null;
		
		createCamera( width, height, fps, cam1DeviceId, ( result1 ) => {
		
			camera1 = result1.camera;
			captureCam1 = result1.capture;

		} );

	} );

	function createCamera( width, height, fps, id, callback ) {
	
		// Create camera
		let camera = document.createElement( "video" );
		camera.setAttribute( "width", width );
		camera.setAttribute( "height", height );
		
		let capture = new cv.VideoCapture( camera );
		
		let videoParams;
		
		if ( id !== null ) {
		
			videoParams = {
				deviceId: { exact: id }
			};
			
		}
		else {	

			videoParams = {
				width: width,
				height: height/*,
				frameRate: fps*/
			};
			
		}
		
		// Get permission from user to use the camera.
		navigator.mediaDevices.getUserMedia( {
			video: videoParams,
			audio: false
		} ).then( function( stream ) {
			camera.srcObject = stream;
			camera.onloadedmetadata = function( e ) {

				capturing = true;
				callback( { camera: camera, capture: capture } );

			};
		});

		captureFrame();

	}

}

function captureFrame() {

	outputCanvas1.getContext('2d').drawImage( camera1, 0, 0, width, height);

	// Calculate FPS
	let t1 = performance.now();
	if ( t0 !== null ) {

		let instantFPS = 1000 / ( t1 - t0 );
		
		if ( instantFPS < 1000 ) currentFPS = currentFPS * 0.9 + instantFPS * 0.1;
	
		fpsLabel.innerHTML = "FPS = " + ( currentFPS );
		
	}
	t0 = t1;

	// Loop this function.
	requestAnimationFrame( captureFrame );

}
