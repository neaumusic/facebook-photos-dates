Summary
--

puts album timestamps back into downloaded facebook images

my purpose was to import the photos in the Photos macOS app such that they're chronological

at first I thought this was exif data, but I just set photo 'creation time' 'date added' 'date modified' and they work great

How to Use
--

[download your facebook photos](https://www.facebook.com/help/1701730696756992?helpref=hc_global_nav) (there should be a folder 'photos_and_videos')

put a **COPY** of photos_and_videos in the /resources folder

run `yarn` and then `node index.js` (use [brew](https://brew.sh/) `brew install yarn` if you don't have it)

if the logs look fine, just uncomment `await utimes ...` lines in index.js and run it again with `node index.js`