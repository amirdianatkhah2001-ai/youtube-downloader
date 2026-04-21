const test = require('node:test');
const assert = require('node:assert/strict');
const {
  extractYoutubeVideoId,
  isYouTubeVideoUrl,
  createDownloadUrl,
  normalizeBaseUrl,
  DEFAULT_DOWNLOADER_BASE_URL
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

test('isYouTubeVideoUrl accepts watch and short urls', () => {
  assert.equal(isYouTubeVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), true);
  assert.equal(isYouTubeVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'), true);
  assert.equal(isYouTubeVideoUrl('https://youtu.be/dQw4w9WgXcQ'), true);
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

test('createDownloadUrl throws for non-youtube urls', () => {
  assert.throws(() => {
    createDownloadUrl('https://downloader.example/api', 'https://example.com/video', 'mp4');
  }, /valid YouTube video URL/);
});

test('createDownloadUrl throws for invalid format', () => {
  assert.throws(() => {
    createDownloadUrl('https://downloader.example/api', 'https://youtu.be/dQw4w9WgXcQ', 'wav');
  }, /Format must be either "mp3" or "mp4"/);
});

test('normalizeBaseUrl trims trailing slash and uses fallback default', () => {
  assert.equal(normalizeBaseUrl('https://downloader.example/api/'), 'https://downloader.example/api');
  assert.equal(normalizeBaseUrl(''), DEFAULT_DOWNLOADER_BASE_URL);
});
