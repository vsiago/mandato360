document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const hashtagUrlInput = document.getElementById('hashtagUrl');
    const commentTextInput = document.getElementById('commentText');
    const dmTextInput = document.getElementById('dmText');
    const statusText = document.getElementById('statusText');

    chrome.storage.local.get(['botActive', 'botConfig'], (data) => {
        if (data.botConfig) {
            hashtagUrlInput.value = data.botConfig.hashtagUrl;
            commentTextInput.value = data.botConfig.commentText;
            dmTextInput.value = data.botConfig.dmText;
        }
        updateStatus(data.botActive);
    });

    function updateStatus(isActive) {
        statusText.textContent = isActive ? "Rodando na aba do IG" : "Parado";
        statusText.style.color = isActive ? "green" : "red";
    }

    startBtn.addEventListener('click', () => {
        const config = {
            hashtagUrl: hashtagUrlInput.value,
            commentText: commentTextInput.value,
            dmText: dmTextInput.value
        };

        chrome.storage.local.set({ botActive: true, botConfig: config }, () => {
            updateStatus(true);
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (!tabs[0].url.includes("instagram.com")) {
                    chrome.tabs.create({ url: config.hashtagUrl });
                } else {
                    chrome.tabs.update(tabs[0].id, { url: config.hashtagUrl });
                }
            });
        });
    });

    stopBtn.addEventListener('click', () => {
        chrome.storage.local.set({ botActive: false }, () => {
            updateStatus(false);
        });
    });
});
