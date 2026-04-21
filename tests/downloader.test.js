const test = require('node:test');
const assert = require('node:assert/strict');
const {
  extractYoutubeVideoId,
  isYouTubeVideoUrl,
  createDownloadUrl
} = require('../src/lib/downloader');

test('extractYoutubeVideoId supports watch urls', () => {
  assert.equal(
    extractYoutubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    'dQw4w9WgXcQ'
  );
});

test('extractYoutubeVideoId supports shorts urls', () => {
  assert.equal(
    extractYoutubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    'dQw4w9WgXcQ'
  );
});

test('isYouTubeVideoUrl rejects non-video urls', () => {
  assert.equal(isYouTubeVideoUrl('https://www.youtube.com/'), false);
});

test('createDownloadUrl adds url and format query parameters', () => {
  const result = createDownloadUrl(
    'https://downloader.example/api',
    'https://youtu.be/dQw4w9WgXcQ',
    'mp3'
  );

  assert.match(result, /^https:\/\/downloader\.example\/api\?/);
  assert.match(result, /format=mp3/);
  assert.match(result, /url=https%3A%2F%2Fyoutu\.be%2FdQw4w9WgXcQ/);
});
