(function initDownloaderLibrary(globalScope) {
  const VIDEO_ID_CAPTURE_GROUP = '([a-zA-Z0-9_-]{11})';
  const DEFAULT_DOWNLOADER_BASE_URL = 'https://example.com/download';
  const YOUTUBE_ID_PATTERNS = [
    new RegExp(`[?&]v=${VIDEO_ID_CAPTURE_GROUP}`),
    new RegExp(`youtu\\.be\\/${VIDEO_ID_CAPTURE_GROUP}`),
    new RegExp(`youtube\\.com\\/shorts\\/${VIDEO_ID_CAPTURE_GROUP}`)
  ];

  function extractYoutubeVideoId(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }

    for (const pattern of YOUTUBE_ID_PATTERNS) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  function isYouTubeVideoUrl(url) {
    return Boolean(extractYoutubeVideoId(url));
  }

  function normalizeBaseUrl(baseUrl) {
    const raw = typeof baseUrl === 'string' && baseUrl.trim() ? baseUrl.trim() : DEFAULT_DOWNLOADER_BASE_URL;
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }

  function createDownloadUrl(baseUrl, videoUrl, format) {
    const normalizedBase = normalizeBaseUrl(baseUrl);
    const target = new URL(normalizedBase);

    if (!isYouTubeVideoUrl(videoUrl)) {
      throw new Error('A valid YouTube video URL is required.');
    }

    if (format !== 'mp3' && format !== 'mp4') {
      throw new Error('Format must be either "mp3" or "mp4".');
    }

    target.searchParams.set('url', videoUrl);
    target.searchParams.set('format', format);
    return target.toString();
  }

  const api = {
    extractYoutubeVideoId,
    isYouTubeVideoUrl,
    normalizeBaseUrl,
    createDownloadUrl,
    DEFAULT_DOWNLOADER_BASE_URL
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalScope.DownloaderLib = api;
})(typeof window !== 'undefined' ? window : globalThis);
