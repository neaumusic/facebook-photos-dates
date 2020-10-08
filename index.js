const fs = require('fs');
const url = require('url');

// const exiftool = require('node-exiftool');
// const exiftoolProcess = new exiftool.ExiftoolProcess();

const ROOT = './resources/photos_and_videos';

fs.readdir(`${ROOT}/album`, (error, albumFileNames) => {
  albumFileNames.forEach(albumFileName => {

    fs.readFile(`${ROOT}/album/${albumFileName}`, 'utf8', (error, albumDataString) => {
      const albumData = JSON.parse(albumDataString);
      const isValidAlbumData = !!albumData.photos.length;
      if (isValidAlbumData) {
        const albumFolderPath = albumData.cover_photo.uri.split('/')[1];

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

        console.log('\n', albumData.name, albumFileName, `${ROOT}/${albumFolderPath}`);
        for (const [imagePath, timestamp] of imagePathTimestampEntries) {
          console.log(imagePath, timestamp);
        }

      }
    });
  });
});

