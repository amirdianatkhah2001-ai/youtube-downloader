const statusText = document.getElementById('status');
const actionsSection = document.getElementById('actions');
const optionsButton = document.getElementById('open-options');
const actionButtons = Array.from(actionsSection.querySelectorAll('button'));

let activeVideoUrl = null;

function setStatus(message) {
  statusText.textContent = message;
}

function withChrome(callback) {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    setStatus('Preview mode: open this extension in your browser to use it.');
    return;
  }

  callback();
}

function readSettings(cb) {
  withChrome(() => {
    chrome.storage.sync.get({ downloaderBaseUrl: DownloaderLib.DEFAULT_DOWNLOADER_BASE_URL }, (settings) => {
      cb(settings.downloaderBaseUrl);
    });
  });
}

function showAvailableActions(videoUrl) {
  activeVideoUrl = videoUrl;
  actionsSection.classList.remove('hidden');
  setStatus('YouTube video detected. Choose a format:');
}

function showUnavailableState() {
  activeVideoUrl = null;
  actionsSection.classList.add('hidden');
  setStatus('Open a YouTube video page, then reopen this popup.');
}

function inspectActiveTab() {
  withChrome(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      const tabUrl = tab && tab.url ? tab.url : '';

      if (DownloaderLib.isYouTubeVideoUrl(tabUrl)) {
        showAvailableActions(tabUrl);
      } else {
        showUnavailableState();
      }
    });
  });
}

function handleDownloadClick(format) {
  if (!activeVideoUrl) {
    showUnavailableState();
    return;
  }

  readSettings((baseUrl) => {
    try {
      const downloadUrl = DownloaderLib.createDownloadUrl(baseUrl, activeVideoUrl, format);
      chrome.tabs.create({ url: downloadUrl });
    } catch (error) {
      setStatus(error.message || 'Invalid configuration or URL. Please check your settings.');
    }
  });
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleDownloadClick(button.dataset.format);
  });
});

optionsButton.addEventListener('click', () => {
  withChrome(() => {
    chrome.runtime.openOptionsPage();
  });
});

inspectActiveTab();
