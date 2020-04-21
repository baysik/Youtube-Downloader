// require dependencies
const fs = require("fs");
const youtubedl = require("youtube-dl");

// on button click, get value of input
document
  .getElementById("download-button")
  .addEventListener("click", function () {
    document.getElementById("download-button").style.visibility = "hidden";
    document.getElementById("downloading").style.visibility = "visible";
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
      video.pipe(fs.createWriteStream(`./output/${info.title}.mp4`));
      console.log("done");
      document.getElementById("downloading").style.visibility = "hidden";
      document.getElementById("download-button").style.visibility = "visible";
    });
  });