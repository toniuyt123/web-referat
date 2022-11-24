const showCaptions = [
    'Горното описания беше написано в blockquote елемент.',
    'Наблюдавате това с помощта на audio и video елементите (нарочно аудиото на видеото е спряно за да използвам отдлено audio елемент).',
    'С progress наблюдаваме каква част от видеото сме изгледали до момента',
    'Meter ни показва забавна визуализация на звука.',
    ''
];

function init() {
    document.getElementById('show-song').onplay = function startShow() {
        const showProgress = document.getElementById('showProgress');
        const audioMeters = document.getElementById('audio-meters');
        const captionsContainer = document.getElementById('show-captions');
        const audio = this;
        showProgress.max = audio.duration;
        
        audio.removeAttribute('controls');
        document.getElementById('showVideo').play();
        showProgress.value = audio.currentTime;
        
        const progressInterval = setInterval(() => {
            showProgress.value = audio.currentTime;

            if (audio.currentTime === audio.duration) {
                clearInterval(progressInterval);
            }
        }, 1000);

        let captionsIndex = 0;
        const captionsInterval = setInterval(() => {
            if (captionsIndex === showCaptions.length) {
                clearInterval(captionsInterval);
                return;
            }

            const p = document.createElement("p");
            p.innerHTML = showCaptions[captionsIndex++];
            captionsContainer.append(p);
        }, 3000);
        

        document.getElementById('showContainer').style.display = "block";
        window.scrollTo(0, document.body.scrollHeight);
        //disableScroll();
    };
}


function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
    };
}
  