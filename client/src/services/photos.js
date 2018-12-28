
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

async function generateThumbnail(cordovaImageData, width, height) {
  return new Promise(resolve => {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");

    var image = new Image();
    image.src = base64JpegPrefix + cordovaImageData;
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
      resizeImage(image, canvas).then(resolve); // TODO: catch
    }
  });
}

function resizeImage(image, canvas) {
  return new Promise(resolve => {
    //TODO: add catches
    pica
      .resize(image, canvas)
      .then(result => pica.toBlob(result, "image/jpeg", 0.9))
      .then(blob => {
        console.log("resized to canvas & created blob!");
        console.log(blob);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var imageData = removeBase64Prefix(reader.result);
          //var imageData = reader.result;
          resolve(imageData);
        };
      });
  });
}


async function uploadPicture(cordovaImageData) {
  var size = (cordovaImageData.length * 3) / 4;
  console.log(`Picture Size: ${size / 1024} KB`);


  let imageData = removeBase64Prefix(cordovaImageData);
  // TODO: change sizes to come from image with aspect ratio or some better method
  let thumbnailImageData = await generateThumbnail(imageData, 150, 200);

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
      let file = files[0];
      loadImage(
        file,
        (canvas, data) => {
          var dataURL;
          localPictureAvailableCB(null);
          dataURL = canvas.toDataURL('image/jpeg');
          uploadPicture(dataURL).then(results => {
            console.log(results)
            resolve(results)
          }).catch(err => {
            console.error(err);
            reject(err);
          });
        }, {
          maxWidth: 1000,
          orientation: true,
          canvas: true
        }
      );
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
