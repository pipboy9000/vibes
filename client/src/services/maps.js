function CustomUserInfoWindow(map) {
  //background
  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.width = '260px';
  div.style.height = '80px';
  div.style.background = 'white';
  div.style.borderRadius = '10px';
  div.style.boxShadow = '0 2px 4px 1px #00000025';
  div.style.visibility = 'hidden'
  div.style.left = -2 + 'px';
  div.style.top = -156 + 'px';
  div.style.zIndex = 2;
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
  profilePic.style.width = '65px';
  profilePic.style.minWidth = '65px';
  profilePic.style.borderRadius = "65px";
  // profilePic.style.border = "4px solid #3fb7f5"
  profilePic.style.height = '65px';
  profilePic.style.background = '#ddd';
  profilePic.style.marginLeft = '7px';
  this.profilePic = profilePic;
  overlay.appendChild(profilePic);

  //name
  var name = document.createElement('div');
  name.innerText = "REeeeally loonngg NAME!";
  name.style.marginLeft = '12px';
  name.style.marginRight = '8px';
  name.style.color = '#3fb7f5';
  name.style.fontSize = '28px';
  name.style.fontFamily = '"Pacifico", cursive';
  name.style.transform = 'translateY(-17px)';
  name.style.whiteSpace = 'nowrap';
  name.style.overflow = 'hidden';
  name.style.textOverflow = 'ellipsis';
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
  var pos = overlayProjection.fromLatLngToDivPixel(this.details.latLng);

  this.div.style.left = pos.x - 2 + 'px';
  this.div.style.top = pos.y - 156 + 'px';
}

CustomUserInfoWindow.prototype.open = function () {
  this.div.style.visibility = 'visible';
}

CustomUserInfoWindow.prototype.close = function () {
  this.div.style.visibility = 'hidden'
}

CustomUserInfoWindow.prototype.setDetails = function (details) {
  this.details = details;
  this.details.latLng = new google.maps.LatLng(details.location);
  this.profilePic.src = '';
  this.profilePic.src = 'https://graph.facebook.com/' + details.fbid + '/picture?type=square&width=70&height=70';
  this.details.name = details.name;
  this.render();
  this.draw();
}

export {
  CustomUserInfoWindow
}
