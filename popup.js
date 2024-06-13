document.addEventListener('DOMContentLoaded', function () {
    const speedSlider = document.getElementById('speedSlider');
    const speedTextBox = document.getElementById('speedTextBox');
    const normalButton = document.getElementById('normalButton');
    const presetButtons = document.querySelectorAll('.preset');
    const defaultSpeed = 1.0;

    // Function to update the slider, textbox, and video playback rate
    function updatePlaybackRate(rate) {
        speedSlider.value = rate;
        speedTextBox.value = rate;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function (rate) {
                    document.getElementsByTagName('video')[0].playbackRate = rate;
                    console.log(`Playback rate set to ${rate}`);
                },
                args: [rate]
            });
        });
    }

    // Retrieve the current playback rate when the popup is opened
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function () {
                return document.getElementsByTagName('video')[0].playbackRate;
            },
        }, function (results) {
            if (results && results[0] && results[0].result) {
                updatePlaybackRate(results[0].result);
            } else {
                updatePlaybackRate(defaultSpeed);
            }
        });
    });

    speedSlider.addEventListener('input', function () {
        const rate = speedSlider.value;
        speedTextBox.value = rate;
        updatePlaybackRate(rate);
    });

    speedTextBox.addEventListener('input', function () {
        const rate = speedTextBox.value;
        speedSlider.value = rate;
        updatePlaybackRate(rate);
    });

    normalButton.addEventListener('click', function () {
        updatePlaybackRate(defaultSpeed);
    });

    presetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const speed = this.getAttribute('data-speed');
            updatePlaybackRate(speed);
        });
    });
});
