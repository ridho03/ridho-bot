/* eslint-disable no-console */
const axios = require('axios').default;

const wallpaper = new Promise((resolve, reject) => {
  axios
    .get('https://source.unsplash.com/random')
    .then((response) => {
      resolve(response.request.res.responseUrl);
    })
    .catch((error) => reject(error));
});
module.exports.wallpaper = wallpaper;