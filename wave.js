/* wave.js - Final Polish */
var xlink = "http://www.w3.org/1999/xlink";
var imgUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/ripple512.png";

var settings = {
  waveDuration: 2.0,
  waveSize: 2,

  // This is your "Reference Intensity" for a standard 300px tall element.
  // The script will auto-scale this for smaller/larger elements.
  waveIntensity: 55
};

var rippleFilter = document.querySelector("#ripple-filter");
var mergeNode = document.querySelector("#merge-node");
var target = null;
var rippleDataURL = "";
var activeWaves = [];
var nextWaveDelay = null;

if (rippleFilter) {
  rippleFilter.setAttribute("color-interpolation-filters", "sRGB");
}

toBase64(imgUrl, function (data) {
  rippleDataURL = data;

  // 1. Check existing target on load
  var existingTarget = document.querySelector(".ripple-target");
  if (existingTarget) {
    target = existingTarget;
    initAndStart();
  }

  // 2. Watchdog for class changes
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        var element = mutation.target;
        if (element.classList.contains("ripple-target")) {
          if (target !== element) {
            stopRipple();
            target = element;
            initAndStart();
          }
        }
        else if (target === element && !element.classList.contains("ripple-target")) {
          stopRipple();
          target = null;
        }
      }
    });
  });

  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

  // 3. Handle Resize
  window.addEventListener("resize", function () {
    if (!target) return;
    stopRipple();
    initAndStart();
  });
});

function initAndStart() {
  // Only apply vertical offset fix to plain text elements (avoids breaking inputs)
  if (target.children.length === 0) {
    fixVerticalOffset();
  }
  startRipple();
}

function stopRipple() {
  if (nextWaveDelay) nextWaveDelay.kill();
  TweenMax.killAll();
  activeWaves = [];

  var images = rippleFilter.querySelectorAll("feImage");
  for (var i = 0; i < images.length; i++) {
    rippleFilter.removeChild(images[i]);
  }
  updateMergeNode();
}

function fixVerticalOffset() {
  if (!target) return;

  // Safety: Don't mess with inputs or complex elements
  if (target.querySelector("input") || target.tagName === "INPUT") return;

  var containerHeight = target.offsetHeight;
  var originalText = target.innerText;

  if (!originalText.trim()) return;

  if (!originalText.includes("<span")) {
    target.innerHTML = "<span>" + originalText + "</span>";
  }

  var span = target.querySelector("span");
  if (span) {
    var textHeight = span.offsetHeight;
    var topGap = (containerHeight - textHeight) / 2;
    target.style.top = "-" + topGap + "px";
  }
}

function startRipple() {
  if (!target) return;

  // 1. Get initial size
  var rect = target.getBoundingClientRect();
  var dim = Math.min(rect.width, rect.height);
  if (dim === 0) dim = 100; // safety fallback

  // 2. AUTO-SCALER FOR INTENSITY
  // If element is 300px, use 100% intensity. 
  // If element is 50px (Input), use ~16% intensity.
  // This makes the ripple look "Consistent" across all sizes.
  var scaleFactor = dim / 300;

  // Clamp scale so tiny elements don't get zero effect
  if (scaleFactor < 0.2) scaleFactor = 0.2;
  if (scaleFactor > 1.5) scaleFactor = 1.5;

  var actualIntensity = settings.waveIntensity * scaleFactor;

  // 3. Smooth Entry
  var dispMap = rippleFilter.querySelector("feDisplacementMap");
  TweenMax.fromTo(dispMap, 1.5,
    { attr: { scale: 0 } },
    { attr: { scale: actualIntensity }, ease: Power2.easeOut }
  );

  var visibleTime = settings.waveDuration / settings.waveSize;
  var interval = visibleTime * 0.35;

  function spawnWave() {
    if (!target) return;

    // MEASURE FRESH DIMENSIONS (Fixes "Origin Shift" when text changes)
    var freshRect = target.getBoundingClientRect();

    if (freshRect.width > 0 && freshRect.height > 0) {
      createAndAnimateWave(freshRect.width, freshRect.height);
    }

    nextWaveDelay = TweenMax.delayedCall(interval, spawnWave);
  }

  spawnWave();
}

function createAndAnimateWave(width, height) {
  var waveId = "ripple-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  var feImage = document.createElementNS("http://www.w3.org/2000/svg", "feImage");

  feImage.setAttribute("id", waveId);
  feImage.setAttribute("result", waveId);
  feImage.setAttribute("preserveAspectRatio", "none");
  feImage.setAttributeNS(xlink, "xlink:href", rippleDataURL);
  feImage.setAttribute("href", rippleDataURL);

  rippleFilter.insertBefore(feImage, mergeNode);
  activeWaves.push(waveId);
  updateMergeNode();

  // --- ORIGIN CALCULATION ---
  var centerX = width / 2;

  // YOUR STYLISTIC CHOICE: Origin is lower than center
  var centerY = (height / 2) + (height * 0.2);

  var maxDim = Math.max(width, height);
  var sizePx = maxDim * settings.waveSize;

  var jitterRange = width * 0.2;
  var jitterX = (Math.random() * jitterRange) - (jitterRange / 2);
  var jitterY = (Math.random() * jitterRange) - (jitterRange / 2);

  // Apply jitter
  var startX = centerX;
  var startY = centerY;

  // Calculate top-left corner for the expanding square
  var endX = (centerX - (sizePx / 2)) + jitterX;
  var endY = (centerY - (sizePx / 2)) + jitterY;

  var start = {
    attr: { x: startX, y: startY, width: 0, height: 0 }
  };

  var end = {
    attr: { x: endX, y: endY, width: sizePx, height: sizePx },
    ease: Linear.easeNone,
    onComplete: function () {
      try {
        rippleFilter.removeChild(feImage);
        var index = activeWaves.indexOf(waveId);
        if (index > -1) activeWaves.splice(index, 1);
        updateMergeNode();
      } catch (e) { }
    }
  };

  TweenMax.fromTo(feImage, settings.waveDuration, start, end);
}

function updateMergeNode() {
  while (mergeNode.firstChild) {
    mergeNode.removeChild(mergeNode.firstChild);
  }
  var bgNode = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
  bgNode.setAttribute("in", "neutral");
  mergeNode.appendChild(bgNode);

  activeWaves.forEach(function (id) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    node.setAttribute("in", id);
    mergeNode.appendChild(node);
  });
}

function toBase64(url, callback) {
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.height = this.height;
    canvas.width = this.width;

    ctx.drawImage(this, 0, 0);

    // Gradient Mask (Prevents Square Edges)
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = Math.min(centerX, centerY);

    var gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var dataURL = canvas.toDataURL("image/png");
    callback(dataURL);
  };
  img.src = url;
}