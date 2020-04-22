// require dependencies
const fs = require("fs");
const youtubedl = require("youtube-dl");
const { ipcRenderer } = require("electron");
const { dialog } = require("electron").remote;
const Store = require("electron-store");
const store = new Store();

let videoFilePath = "";

ipcRenderer.on("test", function (event, filePath) {
  videoFilePath = filePath;
  // set up app persistence in electron-store
  store.set("chosendownloadpath", filePath[0]);
});

// define file info

// on button click, get value of input
document
  .getElementById("download-button")
  .addEventListener("click", function () {
    // clear alerts to begin new download
    document.querySelector(".stats-container").innerHTML = "";
    document.querySelector(".download-alert").style.display = "none";
    document.getElementById("download-button").style.display = "none";
    document.getElementById("downloading").style.display = "block";
    let youtubelink = document.getElementById("youtube-link").value;
    console.log(youtubelink);
    const video = youtubedl(
      youtubelink,
      // Optional arguments passed to youtube-dl.
      ["--format", "best"],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname }
    );
    // Will be called when the download starts.
    video.on("info", function (info) {
      let statsContainer = document.querySelector(".stats-container");
      statsContainer.innerHTML += `<img src=${info.thumbnail} width='245' height='135' class='rounded mx-auto d-block mt-2'>`;
      // let thumbnail = document.querySelector(".thumbnail");
      statsContainer.innerHTML += `<h3 class="video-title"> ${info.title} </h3>`;
      console.log("Download started");
      console.log("filename: " + info._filename);
      console.log("size: " + info.size);
      console.log(info.thumbnail);
      // save video to specified download path
      video.pipe(
        fs.createWriteStream(
          `${store.get("chosendownloadpath")}/${info.title}.mp4`
        )
      );
      console.log("done");
      document.getElementById("downloading").style.display = "none";
      document.getElementById("download-button").style.display = "block";
      document.querySelector(".download-alert").style.display = "block";
      // setTimeout(function () {
      //   document.querySelector(".download-alert").style.display = "none";
      // }, 3000);
    });
  });

// append test
// while (document.getElementById("youtube-link").value === "") {
//   let statsContainer = document.querySelector(".stats-container");
//   statsContainer.innerHTML += "<h1>hehe hello </h1>";
// } else {
//   let statsContainer = document.querySelector(".stats-container");
//   statsContainer.innerHTML += "<h1>hehe oh no!  </h1>";
// }

// do {
//   let statsContainer = document.querySelector(".stats-container");
//   statsContainer.innerHTML += "<h1>hehe oh no!  </h1>";
// } while (document.getElementById("youtube-link").value != "");
