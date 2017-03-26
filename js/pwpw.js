var rndrr;
var msh = null;
var rng = null;
var mnOff = 0.0;
var mxOff = 128.0;
var offset = 0.0;
var pointerDown = false;
var anchorP = vec2.fromValues(128.0, 128.0);
var lastP = vec2.create();
var mn = vec2.fromValues(48.0, 48.0);
var sz = vec2.fromValues(256.0, 256.0);


function pwpw() {
  var cnvs = document.getElementById("lzrcnvs");
  rndrr = new lzr.rndrr(cnvs);

  // create rectangular mesh
  // msh = new lzr.msh();
  // msh.rgba = [1.0, 0.0, 0.0, 0.7]; // reddish
  // msh.vertices.push( vec2.clone(mn) );
  // msh.vertices.push( vec2.fromValues(mn[0], mn[1] + sz[1]) );
  // msh.vertices.push( vec2.fromValues(mn[0] + sz[0], mn[1]) );
  // msh.vertices.push( vec2.fromValues(mn[0] + sz[0], mn[1] + sz[1]) );
  // msh.triangles.push( [0, 1, 2] );
  // msh.triangles.push( [1, 3, 2] );
  // rndrr.mshs.push(msh);

  var mnb = vec2.fromValues(96.0, 128.0);
  var szb = vec2.fromValues(400.0, 600.0);
  var vmn = vec2.fromValues(100.0, 150.0);
  var vmx = vec2.fromValues(200.0, 350.0);
  var vbmn = vec2.fromValues(250.0, 200.0);
  var vbmx = vec2.fromValues(300.0, 500.0);

  var pn = new lzr.pn();
  pn.rgba = [0.0, 1.0, 0.0, 0.7]; // greenish
  pn.bndry.vrts.push( vec2.clone(mnb) );
  pn.bndry.vrts.push( vec2.fromValues(mnb[0], mnb[1] + szb[1]) );
  pn.bndry.vrts.push( vec2.fromValues(mnb[0] + szb[0], mnb[1] + szb[1]) );
  pn.bndry.vrts.push( vec2.fromValues(mnb[0] + (2 * szb[0]), mnb[1] + (szb[1]*0.5)) );
  pn.bndry.vrts.push( vec2.fromValues(mnb[0] + szb[0], mnb[1]) );
  var vd = new lzr.lp();
  vd.vrts.push( vec2.fromValues(mnb[0] + vmn[0], mnb[1] + vmn[1]) );
  vd.vrts.push( vec2.fromValues(mnb[0] + vmx[0], mnb[1] + vmn[1]) );
  vd.vrts.push( vec2.fromValues(mnb[0] + vmx[0], mnb[1] + vmx[1]) );
  pn.vds.push(vd);
  var vd = new lzr.lp();
  vd.vrts.push( vec2.fromValues(mnb[0] + vbmn[0], mnb[1] + vbmn[1]) );
  vd.vrts.push( vec2.fromValues(mnb[0] + vbmx[0], mnb[1] + vbmn[1]) );
  vd.vrts.push( vec2.fromValues(mnb[0] + vbmx[0], mnb[1] + vbmx[1]) );
  pn.vds.push(vd);
  rndrr.mshs.push(pn);

  rndrr.buff();

  for (var i = 0; i < pn.vertices.length; i++) {
    var r = new lzr.rng();
    r.rgba = [1.0, 0.0, i/pn.vertices.length, 0.5]; // reddish
    r.center = pn.vertices[i];
    r.radius = 16.0;
    r.weight = 6.0;
    r.segments = 32;
    rndrr.mshs.push(r);
  }

  for (var i = 0; i < pn.triangles.length; i++) {
    var t = pn.triangles[i];
    for (var j = 0; j < 3; j++) {
      var k = j + 1;
      if (k >= 3) k = 0;
      var l = new lzr.ln();
      l.weight = 6;
      l.rgba = [0.0, 0.0, 1.0, 0.5]; // blueish
      l.vertices.push( pn.vertices[t[j]] );
      l.vertices.push( pn.vertices[t[k]] );
      rndrr.mshs.push( l );
    }
  }

  // rng = new lzr.rng();
  // rng.rgba = [1.0, 0.0, 0.0, 0.7]; // reddish
  // rng.center = vec2.fromValues( 300, 500 );
  // rng.radius = 128.0;
  // rng.weight = 16.0;
  // rng.segments = 32;
  // rndrr.mshs.push(rng);

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousedown', onMouseDown, false );
  // document.addEventListener( 'mousemove', onMouseMove, false );
  // document.addEventListener( 'mouseup', onMouseUp, false );

  rndrr.buff(); // build mesh buffers, call after changing meshes
  rndrr.render(); // draw meshes
}

function onWindowResize() {
  rndrr.setResolution();
  rndrr.render();
}

function updatePosition() {
  offset = lastP[1] - anchorP[1];
  if( offset < mnOff ) offset = mnOff;
  if( offset > mxOff ) offset = mxOff;

  msh.vertices[0][1] = mn[1] + offset;

  rndrr.buff();
  rndrr.render();
}

function onMouseDown( event ) {
  pointerDown = true;

  event.preventDefault();

  var l = new lzr.ln();
  l.weight = 16;
  l.rgba = [0.0, 1.0, 1.0, 0.7]
  l.vertices.push( vec2.clone(anchorP) );

  anchorP[0] = rndrr.px2gl( event.clientX );
  anchorP[1] = rndrr.px2gl( event.clientY );

  console.log("down: ", anchorP);

  vec2.copy(rng.center, anchorP);

  l.vertices.push( vec2.clone(anchorP) );
  rndrr.mshs.push( l );

  rndrr.buff();
  rndrr.render();
}

function onMouseMove( event ) {
  if (pointerDown) {
    lastP[0] = rndrr.px2gl( event.clientX );
    lastP[1] = rndrr.px2gl( event.clientY );

    vec2.copy(rng.center, lastP);

    updatePosition();
  }
}

function onMouseUp( event ) {
  pointerDown = false;
}
