
import Pica from "pica";
const pica = Pica();

let firebase = null;
let firebaseStorage = null;
let camera = null;

function removePictureFromUploading(id) {
  self.uploadingPictures = self.uploadingPictures.filter(
    pic => pic.id !== id
  );
}

function uploadBase64(imageData, firebaseChild) {
  return new Promise(resolve => {
    //console.log("uploading imageData:" + imageData);
    try {
      var uploadTask = firebaseChild.putString(imageData, "base64");

      uploadTask.on(
        "state_changed",
        function(snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          var firebase = self.firebase;
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
        function(error) {
          // Handle unsuccessful uploads
          console.dir(error);
        },
        function() {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
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
    var canvas = document.getElementById("img-canvas"); // TODO: I know there's a better way to do this
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
            var imageData = self.removeBase64Prefix(reader.result);
            resolve(imageData);
          };
        });
    };
  });
}


function uploadPicture(cordovaImageData) {
  var size = (cordovaImageData.length * 3) / 4;
  console.log("Picture Size: " + size);
  // alert("Picture Size: " + size / 1024 + "KB");

  var self = this;
  const base64JpegPrefix = "data:image/jpeg;base64,";
  
  // imageData is either a base64 encoded string or a file URI
  // If it's base64 (DATA_URL):
  //let base64Image = 'data:image/jpeg;base64,' + imageData;
  console.log("getPicture success callback");

  generateThumbnail(cordovaImageData).then(thumbnailImageData => {
    var dateStr = new Date().getTime().toString();
    var fullUploadPromise = uploadBase64(
      cordovaImageData,
      self.firebaseStorage.child(dateStr).child("full")
    );

    var thumbnailUploadPromise = uploadBase64(
      thumbnailImageData,
      self.firebaseStorage.child(dateStr).child("thumb")
    );

    var localPicture = {
      id: dateStr,
      vibeId: self.vibe.id,
      imgUrl: base64JpegPrefix + cordovaImageData,
      thumbnailUrl: base64JpegPrefix + thumbnailImageData
    };
    self.uploadingPictures.unshift(localPicture);
    Promise.all([fullUploadPromise, thumbnailUploadPromise]).then(urls => {
      var picture = {
        vibeId: self.vibe.id,
        imgUrl: urls[0],
        thumbnailUrl: urls[1]
      };
      socket.newPicture({
        token: self.$store.getters.token,
        picture
      });
      removePictureFromUploading(dateStr);
    });
  });
}

function sendPic() {
  console.log("setting camera options");
  const options = {
    quality: 80,
    destinationType: camera.DestinationType.DATA_URL,
    encodingType: camera.EncodingType.JPEG,
    mediaType: camera.MediaType.PICTURE,
    correctOrientation: true
    // targetWidth: 200,
    // targetHeight: 200
  };

  camera.getPicture(
    cordovaImageData => uploadPicture(cordovaImageData),
    err => {
      // Handle error
      console.error("error in camera callback:");
      console.error(err);
    },
    options
  );
}

function removeBase64Prefix(base64Str) {
  return base64Str.substr(base64Str.indexOf(",") + 1);
}

function fileLoaded(e) {
  var files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  if (files && files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      uploadPicture(removeBase64Prefix(e.target.result));
    };
    reader.readAsDataURL(files[0]);
  }
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
