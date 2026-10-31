/* Free Tools — shared helpers. Everything runs locally in the visitor's browser. */
(function () {
  "use strict";

  function fmtBytes(n) {
    if (n == null || isNaN(n)) return "—";
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1).replace(/\.0$/, "") + " KB";
    return (n / (1024 * 1024)).toFixed(2).replace(/\.?0+$/, "") + " MB";
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("That file could not be read as an image.")); };
      img.src = url;
    });
  }

  function canvasBlob(canvas, type, quality) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, type, quality); });
  }

  function download(blob, filename) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  function baseName(name) {
    var i = name.lastIndexOf(".");
    return i > 0 ? name.slice(0, i) : name;
  }

  /* Wire a drop zone + hidden file input. onFiles(FileList) fires on pick or drop. */
  function setupDrop(zone, input, onFiles) {
    zone.addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () {
      if (input.files && input.files.length) onFiles(input.files);
      input.value = "";
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("over"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("over"); });
    });
    zone.addEventListener("drop", function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) onFiles(files);
    });
  }

  function showErr(el, msg) {
    el.textContent = msg;
    el.classList.add("show");
  }
  function hideErr(el) { el.classList.remove("show"); }

  window.NonaTools = {
    fmtBytes: fmtBytes,
    loadImage: loadImage,
    canvasBlob: canvasBlob,
    download: download,
    baseName: baseName,
    setupDrop: setupDrop,
    showErr: showErr,
    hideErr: hideErr
  };
})();
