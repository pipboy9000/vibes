
const base64JpegPrefix = "data:image/jpeg;base64,";
const config = require('./config').default;

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

async function generateThumbnail(imageData, maxWidth) {
  return new Promise(resolve => {
      let blob = window.dataURLtoBlob(base64JpegPrefix + imageData);
      let loadingImage = loadImage(
        blob,
        (canvas, data) => {
          let dataURL = canvas.toDataURL('image/jpeg');
          resolve(removeBase64Prefix(dataURL));
        }, {
          maxWidth: maxWidth,
          canvas: true
        }
      );
  });
}


async function uploadPicture(cordovaImageData) {
  var size = (cordovaImageData.length * 3) / 4;
  console.log(`Picture Size: ${size / 1024} KB`);


  let imageData = removeBase64Prefix(cordovaImageData);
  // TODO: change sizes to come from image with aspect ratio or some better method
  let thumbnailImageData = await generateThumbnail(imageData, config.photos.thumbnailMaxWidth);
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
  let urls = await Promise.all([fullUploadPromise, thumbnailUploadPromise]);
  // let results = await fullUploadPromise;
  return urls;
}

async function sendPic(localPictureAvailableCB) {
  console.log("setting camera options");
  /** TODO:
 * Warning: Using DATA_URL is not recommended! The DATA_URL destination
 * type is very memory intensive, even with a low quality setting. Using it
 * can result in out of memory errors and application crashes. Use FILE_URI
 * or NATIVE_URI instead.
 */

 /* function get_image_size_from_URI(imageURI) {
    // This function is called once an imageURI is rerturned from PhoneGap's camera or gallery function
    window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
      here put my image loading code, it should handle file object
        fileEntry.file(function(fileObject){
            // Create a reader to read the file
            var reader = new FileReader()

            // Create a function to process the file once it's read
            reader.onloadend = function(evt) {
                // Create an image element that we will load the data into
                var image = new Image()
                image.onload = function(evt) {
                    // The image has been loaded and the data is ready
                    var image_width = this.width
                    var image_height = this.height
                    console.log("IMAGE HEIGHT: " + image_height)
                    console.log("IMAGE WIDTH: " + image_width)
                    // We don't need the image element anymore. Get rid of it.
                    image = null
                }
                // Load the read data into the image source. It's base64 data
                image.src = evt.target.result
            }
            // Read from disk the data as base64
            reader.readAsDataURL(fileObject)
        }, function(){
            console.log("There was an error reading or processing this file.")
        })
    })
}*/
  const options = {
    quality: 0,
    destinationType: camera.DestinationType.DATA_URL,
    encodingType: camera.EncodingType.JPG,
    mediaType: camera.MediaType.PICTURE,
    saveToPhotoAlbum: true,
    correctOrientation: true,
    targetWidth: config.photos.maxWidth,
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
          uploadPicture(dataURL).then(urls => {
            console.log(urls)
            let result = {
              urls,
              width: canvas.width,
              height: canvas.height
            }
            resolve(result)
          }).catch(err => {
            console.error(err);
            reject(err);
          });
        }, {
          maxWidth: config.photos.maxWidth,
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
