// require dependencies
const fs = require("fs");
const youtubedl = require("youtube-dl");
const { ipcRenderer } = require("electron");

// let videoFilePath = "";

ipcRenderer.on("test", function (event, filePath) {
  console.log(filePath);
  // on button click, get value of input
  document
    .getElementById("download-button")
    .addEventListener("click", function () {
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
        console.log("Download started");
        console.log("filename: " + info._filename);
        console.log("size: " + info.size);
        video.pipe(fs.createWriteStream(`${filePath}/${info.title}.mp4`));
        console.log("done");
        document.getElementById("downloading").style.display = "none";
        document.getElementById("download-button").style.display = "block";
        document.querySelector(".download-alert").style.display = "block";

        setTimeout(function () {
          document.querySelector(".download-alert").style.display = "none";
        }, 3000);
      });
    });
});

// // on button click, get value of input
// document
//   .getElementById("download-button")
//   .addEventListener("click", function () {
//     document.getElementById("download-button").style.display = "none";
//     document.getElementById("downloading").style.display = "block";
//     let youtubelink = document.getElementById("youtube-link").value;
//     console.log(youtubelink);
//     const video = youtubedl(
//       youtubelink,
//       // Optional arguments passed to youtube-dl.
//       ["--format", "best"],
//       // Additional options can be given for calling `child_process.execFile()`.
//       { cwd: __dirname }
//     );

//     // Will be called when the download starts.
//     video.on("info", function (info) {
//       console.log("Download started");
//       console.log("filename: " + info._filename);
//       console.log("size: " + info.size);
//       video.pipe(fs.createWriteStream(`./output/${info.title}.mp4`));
//       console.log("done");
//       document.getElementById("downloading").style.display = "none";
//       document.getElementById("download-button").style.display = "block";
//       document.querySelector(".download-alert").style.display = "block";

//       setTimeout(function () {
//         document.querySelector(".download-alert").style.display = "none";
//       }, 3000);
//     });
//   });
