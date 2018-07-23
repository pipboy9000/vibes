function CustomUserInfoWindow(map) {
  //background
  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.width = '260px';
  div.style.height = '80px';
  div.style.background = 'white';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 2px 4px 1px #00000025';
  this.div = div;

  //triangle
  var triangle = document.createElement('div');
  triangle.style.position = 'absolute';
  triangle.style.height = '0';
  triangle.style.width = '0';
  triangle.style.borderStyle = 'solid';
  triangle.style.borderColor = 'white transparent';
  triangle.style.borderWidth = '80px 20px 0px 20px';
  triangle.style.filter = 'drop-shadow(8px 12px 5px #0002)';
  triangle.style.transform = 'rotate(60deg)';
  triangle.style.top = '40px';
  triangle.style.left = '30px';
  div.appendChild(triangle);

  //white background to hide the triangle's shadow
  var overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.background = 'white';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.borderRadius = '5px';
  div.appendChild(overlay);

  //profile pic
  var profilePic = document.createElement('img');
  profilePic.style.width = '70px';
  profilePic.style.height = '70px';
  profilePic.style.background = '#ddd';
  profilePic.style.marginLeft = '5px';
  this.profilePic = profilePic;
  overlay.appendChild(profilePic);

  //name
  // color: #8fd9ff;
  // font-size: 28px;
  // margin-left: 10px;
  // font-family: "Pacifico", cursive;
  var name = document.createElement('div');
  name.innerText = "Dan Levin";
  name.style.marginLeft = '8px';
  name.style.color = '#8fd9ff';
  name.style.fontSize = '28px';
  name.style.fontFamily = '"Pacifico", cursive';
  name.style.transform = 'translateY(-20px)';
  
  this.name = name;
  overlay.appendChild(name);

  this.setMap(map)
}

CustomUserInfoWindow.prototype = new google.maps.OverlayView();

CustomUserInfoWindow.prototype.onAdd = function () {
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(this.div);
}

CustomUserInfoWindow.prototype.render = function () {
  this.name.innerText = this.details.name;
}

CustomUserInfoWindow.prototype.draw = function () {

  if (!this.details)
    return;

  var overlayProjection = this.getProjection();
  var pos = overlayProjection.fromLatLngToDivPixel(this.details.location);

  this.div.style.left = pos.x - 2 + 'px';
  this.div.style.top = pos.y - 156 + 'px';
}

CustomUserInfoWindow.prototype.show = function () {
  this.div.style.visibility = 'visible';
}

CustomUserInfoWindow.prototype.hide = function () {
  this.div.style.visibility = 'hidden'
}

CustomUserInfoWindow.prototype.setDetails = function (details) {

  this.details = details;
  this.profilePic.src = 'https://graph.facebook.com/' + details.fbid + '/picture?type=square&width=70&height=70';

  var self = this;

  FB.api(
    '/' + details.fbid,
    'GET', {},
    function (response) {
      debugger;
      console.log(response);
      self.details.name = response.name;
      self.render();
      self.draw();
    });
}

export {
  CustomUserInfoWindow
}
