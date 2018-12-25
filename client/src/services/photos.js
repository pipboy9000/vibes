
import Pica from "pica";
const pica = Pica();
const base64JpegPrefix = "data:image/jpeg;base64,";
const EXIF = require('exif-js')

let firebase = null;
let firebaseStorage = null;
let camera = null;

function removeBase64Prefix(base64Str) {
  return base64Str.substr(base64Str.indexOf(",") + 1);
}

function uploadBase64(imageData, firebaseChild) {
  return new Promise(resolve => {
    //console.log("uploading imageData:" + imageData);
    try {
      var uploadTask = firebaseChild.putString(imageData, "base64");

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        function (error) {
          // Handle unsuccessful uploads
          console.dir(error);
        },
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("Uploaded a blob or file!");
              console.log("got downloadURL: ", downloadURL);
              resolve(downloadURL);
            });
        }
      );
    } catch (errr) {
      console.error(errr);
    }
  });
}

function generateThumbnail(cordovaImageData) {
  return new Promise(resolve => {

    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 150;
    var ctx = canvas.getContext("2d");

    var image = new Image();
    image.src = base64JpegPrefix + cordovaImageData;
    image.onload = function() {
      ctx.drawImage(image, 0, 0);
      pica
        .resize(image, canvas)
        .then(result => pica.toBlob(result, "image/jpeg", 0.9))
        .then(blob => {
          console.log("resized to canvas & created blob!");
          console.log(blob);
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            var imageData = removeBase64Prefix(reader.result);
            //var imageData = reader.result;
            resolve(imageData);
          };
        });
    };

  });
}


async function uploadPicture(cordovaImageData) {
  var size = (cordovaImageData.length * 3) / 4;
  console.log("Picture Size: " + size);
  // alert("Picture Size: " + size / 1024 + "KB");
  
  // imageData is either a base64 encoded string or a file URI
  // If it's base64 (DATA_URL):
  //let base64Image = 'data:image/jpeg;base64,' + imageData;
  console.log("getPicture success callback");
  
  let imageData = removeBase64Prefix(cordovaImageData);
  let thumbnailImageData = await generateThumbnail(imageData);

  var dateStr = new Date().getTime().toString();
  var fullUploadPromise = uploadBase64(
    imageData,
    firebaseStorage.child(dateStr).child("full")
  );

  var thumbnailUploadPromise = uploadBase64(
    thumbnailImageData,
    firebaseStorage.child(dateStr).child("thumb")
  );

  // var thumbnailUploadPromise = uploadBase64(
  //   thumbnailImageData,
  //   firebaseStorage.child(dateStr).child("thumb")
  // );

  // var localPicture = {
  //   id: dateStr,
  //   vibeId: self.vibe.id,
  //   imgUrl: base64JpegPrefix + cordovaImageData,
  //   thumbnailUrl: base64JpegPrefix + thumbnailImageData
  // };
  // self.uploadingPictures.unshift(localPicture);
  let results = await Promise.all([fullUploadPromise, thumbnailUploadPromise]);
  // let results = await fullUploadPromise;
  return results;
}

async function sendPic(localPictureAvailableCB) {
  console.log("setting camera options");
  const options = {
    quality: 0,
    destinationType: camera.DestinationType.DATA_URL,
    encodingType: camera.EncodingType.JPG,
    mediaType: camera.MediaType.PICTURE,
    saveToPhotoAlbum: true,
    correctOrientation: true,
    //targetWidth: 200,
    // targetHeight: 200
  };

  return new Promise((resolve, reject) => {
    camera.getPicture(
      cordovaImageData => {
        localPictureAvailableCB(cordovaImageData);
        uploadPicture(cordovaImageData).then(results => {
          console.log(results);
          resolve(results);
        }).catch(err => {
          console.error(err);
          reject(err);
        });
      },
      err => {
        // Handle error
        console.error("error in camera callback:");
        console.error(err);
        reject(err);
      },
      options
    );
  });
}

async function fileLoaded(e, localPictureAvailableCB) {
  return new Promise((resolve, reject) => {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    if (files && files[0]) {
      // var reader = new FileReader();
      // reader.onload = function (e) {
      //   var exif = EXIF.readFromBinaryFile(this.result);
      //   // https://stackoverflow.com/questions/19463126/how-to-draw-photo-with-correct-orientation-in-canvas-after-capture-photo-by-usin/37750456
      //   //let imageData = removeBase64Prefix(e.target.result);
      //   //localPictureAvailableCB(imageData);
      //   uploadPicture(this.result, exif).then(results => {
      //     console.log(results)
      //     resolve(results)
      //   }).catch(err => {
      //     console.error(err);
      //     reject(err);
      //   });
      // };
      // reader.readAsArrayBuffer(files[0]);
      let file = files[0];
      EXIF.getData(file,function() {
        var orientation = EXIF.getTag(this,"Orientation");
        var can = document.createElement("canvas");
        var ctx = can.getContext('2d');
        var thisImage = new Image;
        thisImage.onload = function() {
          can.width  = thisImage.width;
          can.height = thisImage.height;
          ctx.save();
          var width  = can.width;  var styleWidth  = can.style.width;
          var height = can.height; var styleHeight = can.style.height;
          if (orientation) {
            if (orientation > 4) {
              can.width  = height; can.style.width  = styleHeight;
              can.height = width;  can.style.height = styleWidth;
            }
            switch (orientation) {
            case 2: ctx.translate(width, 0);     ctx.scale(-1,1); break;
            case 3: ctx.translate(width,height); ctx.rotate(Math.PI); break;
            case 4: ctx.translate(0,height);     ctx.scale(1,-1); break;
            case 5: ctx.rotate(0.5 * Math.PI);   ctx.scale(1,-1); break;
            case 6: ctx.rotate(0.5 * Math.PI);   ctx.translate(0,-height); break;
            case 7: ctx.rotate(0.5 * Math.PI);   ctx.translate(width,-height); ctx.scale(-1,1); break;
            case 8: ctx.rotate(-0.5 * Math.PI);  ctx.translate(-width,0); break;
            }
          }
      
          ctx.drawImage(thisImage,0,0);
          
          ctx.restore();
          var dataURL = can.toDataURL('image/jpeg');
          localPictureAvailableCB(dataURL);
          uploadPicture(dataURL).then(results => {
            console.log(results)
            resolve(results)
          }).catch(err => {
            console.error(err);
            reject(err);
          });
          // at this point you can save the image away to your back-end using 'dataURL'
        }
      
        // now trigger the onload function by setting the src to your HTML5 file object (called 'file' here)
        thisImage.src = URL.createObjectURL(file);
      
      });
    }
  });
}

function init(_camera, _firebase, _firebaseStorage) {
  camera = _camera;
  firebase = _firebase;
  firebaseStorage = _firebaseStorage;
}

export default {
  fileLoaded,
  sendPic,
  init
};
