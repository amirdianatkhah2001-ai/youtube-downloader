const baseUrlInput = document.getElementById('base-url');
const saveButton = document.getElementById('save');
const message = document.getElementById('message');

function setMessage(text) {
  message.textContent = text;
}

function loadCurrentSetting() {
  chrome.storage.sync.get({ downloaderBaseUrl: DownloaderLib.DEFAULT_DOWNLOADER_BASE_URL }, (settings) => {
    baseUrlInput.value = settings.downloaderBaseUrl;
  });
}

saveButton.addEventListener('click', () => {
  const candidate = baseUrlInput.value.trim();

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Only http/https URLs are allowed.');
    }

    chrome.storage.sync.set({ downloaderBaseUrl: `${url.origin}${url.pathname}` }, () => {
      setMessage('Saved.');
    });
  } catch (error) {
    console.error(error);
    setMessage(error.message || 'Enter a valid http/https URL.');
  }
});

loadCurrentSetting();
