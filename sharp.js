const { readdir } = require("fs").promises;
const fs = require("fs");
const sharp = require("sharp");

const source = "./source";
const dest = "./img";

const getFileList = async (dirName) => {
  let files = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
};
function getExtension(filename) {
  return filename.split(".").pop();
}

getFileList("source").then((files) => {
  files.forEach((file) => {
    let ext = getExtension(file);
    if (ext === "svg") {
      return;
    }

    let filePath = file.split("/");
    if (filePath.length === 3) {
      if (!fs.existsSync(`${dest}/${filePath[1]}`)) {
        fs.mkdirSync(`${dest}/${filePath[1]}`, { recursive: true });
      }
    }

    let sh = sharp(`${file}`);
    file = filePath.slice(1).join("/");
    let shwp = sharp(`${source}/${file}`);
    if (ext === "jpg" || "jpeg") {
      sh = sh.jpeg({ quality: 70 });
    }
    if (ext === "png") {
      sh = sh.png({ quality: 70 });
    }

    sh.toFile(`${dest}/${file}`, function (err, info) {
      console.log(info);
      if (err) {
        console.log(err);
      }
    });

    shwp
      .webp()
      .toFile(`${dest}/${file.split(".")[0]}.webp`, function (err, info) {
        console.log(info);
        if (err) {
          console.log(err);
        }
      });
  });
});
