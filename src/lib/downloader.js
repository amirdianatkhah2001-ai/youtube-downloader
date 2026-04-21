(function initDownloaderLibrary(globalScope) {
  const YOUTUBE_ID_PATTERNS = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, 
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, 
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
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
    const fallback = 'https://example.com/download';
    const raw = typeof baseUrl === 'string' && baseUrl.trim() ? baseUrl.trim() : fallback;
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }

  function createDownloadUrl(baseUrl, videoUrl, format) {
    const normalizedBase = normalizeBaseUrl(baseUrl);
    const target = new URL(normalizedBase);

    if (!isYouTubeVideoUrl(videoUrl)) {
      throw new Error('A valid YouTube video URL is required.');
    }

    const selectedFormat = format === 'mp3' ? 'mp3' : 'mp4';
    target.searchParams.set('url', videoUrl);
    target.searchParams.set('format', selectedFormat);
    return target.toString();
  }

  const api = {
    extractYoutubeVideoId,
    isYouTubeVideoUrl,
    normalizeBaseUrl,
    createDownloadUrl
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalScope.DownloaderLib = api;
})(typeof window !== 'undefined' ? window : globalThis);
