const fs = require('fs');
const url = require('url');
const moment = require('moment');

const { utimes } = require('utimes');

const nodeExiftool = require('node-exiftool');
const nodeExiftoolProcess = new nodeExiftool.ExiftoolProcess('/usr/local/bin/exiftool');

const ROOT = './resources/photos_and_videos';

(async () => {
  const albumFileNames = await fs.promises.readdir(`${ROOT}/album`);
  for (albumFileName of albumFileNames) {
    const albumDataString = await fs.promises.readFile(`${ROOT}/album/${albumFileName}`, 'utf8');
    const albumData = JSON.parse(albumDataString);
    const isValidAlbumData = !!albumData.photos.length;
    if (isValidAlbumData) {
      const albumFolderPath = albumData.cover_photo.uri.split('/')[1];

      // -- most photos (sometimes incorrect for cover photo)
      const imagePathTimestampEntries = albumData.photos.map(photoData => {
        const photoDataUriPathnameParts = url.parse(photoData.uri).pathname.split('/');
        const unformattedImageName = photoDataUriPathnameParts[photoDataUriPathnameParts.length - 1];
        const formattedImageName = (() => {
          const imageNameSuffix = unformattedImageName.split('_')[1];
          const parts = unformattedImageName.split('.');
          return `${parts[0]}_${imageNameSuffix}.${parts[1]}`;
        })();

        return [
          `${ROOT}/${albumFolderPath}/${formattedImageName}`,
          photoData.creation_timestamp * 1000
        ];
      });

      // -- cover photo
      const coverPhotoPath = albumData.cover_photo.uri.split('/')[2];
      imagePathTimestampEntries.push([
        `${ROOT}/${albumFolderPath}/${coverPhotoPath}`,
        albumData.cover_photo.creation_timestamp * 1000
      ]);


      // await nodeExiftoolProcess.open();

      console.log('\n', albumData.name, albumFileName, `${ROOT}/${albumFolderPath}`);
      for (const [imagePath, timestamp] of imagePathTimestampEntries) {
        console.log(imagePath, timestamp, moment.utc(timestamp).format('YYYY:MM:DD HH:MM:SS'));

        // await utimes(imagePath, {
        //   btime: timestamp,
        //   atime: timestamp,
        //   mtime: timestamp
        // }).catch(console.error)
      }


      // await nodeExiftoolProcess.close();
    }
  }
})()