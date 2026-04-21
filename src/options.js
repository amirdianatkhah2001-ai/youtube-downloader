const baseUrlInput = document.getElementById('base-url');
const saveButton = document.getElementById('save');
const message = document.getElementById('message');

function setMessage(text) {
  message.textContent = text;
}

function loadCurrentSetting() {
  chrome.storage.sync.get({ downloaderBaseUrl: 'https://example.com/download' }, (settings) => {
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

    chrome.storage.sync.set({ downloaderBaseUrl: url.toString() }, () => {
      setMessage('Saved.');
    });
  } catch {
    setMessage('Enter a valid http/https URL.');
  }
});

loadCurrentSetting();
