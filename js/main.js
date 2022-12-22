const showCaptions = [
    ['Горните инструкции на това наистина не', 'вероятно шоу бе написано в blockquote.'],
    ['audio и video таговете са ясни. Ще си вър', 'нете възможността за скролиране като свършат.'],
    ['С progress можем да наблюдаваме го', 'лемина от видеото сме изгледали до момента'],
    ['Meter ни дава забавна визуализация на звука.', ''],
    ['Оставащото време е output от ги', 'гантската дължината и текущото време на видеото.'],
    ['Времето на приключване е в тага time. В него сме сложили и datetime със ISO формат на датата', ''],
    ['За тези надписи се възползваме от ю', 'мрука на елемента template.'],
    ['Благодарение на всички тагове този ъп', 'сурд е възможен.'],
];

function init() {
    document.getElementById('show-song').onplay = function startShow() {
        const showProgress = document.getElementById('showProgress');
        const audioMeters = document.getElementById('audio-meters');
        const captionsContainer = document.getElementById('show-captions');
        const videoCurrentTime = document.getElementById('video-current-time');
        const videoRemaining = document.getElementById('video-remaining');
        const captionsTemplate = document.getElementById('show-caption-template');
        const audio = this;
        showProgress.max = Math.round(audio.duration);
        document.getElementById('video-length').innerHTML = audio.duration;

        const videoEndTimestmap = new Date(Math.round(audio.duration) + Date.now());
        document.getElementById('show-end-time').innerHTML = videoEndTimestmap;
        document.getElementById('show-end-time').setAttribute('datetime', videoEndTimestmap.toISOString());
        
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = null;
        let audioSource = null;

        audio.removeAttribute('controls');
        document.getElementById('showVideo').play();
        analyser = audioCtx.createAnalyser();
        audioSource = audioCtx.createMediaElementSource(this);

        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        showProgress.value = audio.currentTime;

        analyser.fftSize =32;
        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        const dataArray = new Uint8Array(bufferLength);

        const meters = document.querySelectorAll('.show-meter');
        console.log(meters)
        const visualizeInterval = setInterval(() => {
            analyser.getByteFrequencyData(dataArray);
            for (let i = 0; i < bufferLength / 2; i++) {
                meters[i].value = dataArray[i];
               // console.log(dataArray[i])
            }
        }, 10);
        
        const progressInterval = setInterval(() => {
            showProgress.value = audio.currentTime;
            videoCurrentTime.innerHTML = Math.round(audio.currentTime);
            videoRemaining.value = Math.round(audio.duration - audio.currentTime);

            if (audio.currentTime >= audio.duration) {
                clearInterval(progressInterval);
                clearInterval(visualizeInterval);
            }
        }, 1000);

        let captionsIndex = 0;
        const captionsInterval = setInterval(() => {
            if (captionsIndex === showCaptions.length) {
                clearInterval(captionsInterval);

                document.querySelector('#show-img img').style.display = 'block';

                return;
            }

            const p = captionsTemplate.content.cloneNode(true).querySelectorAll('p')[0]; //document.createElement("p");
            p.prepend('-'+showCaptions[captionsIndex][0]);
            p.append(showCaptions[captionsIndex][1]);
            captionsIndex++;
            captionsContainer.append(p);
        }, 3000);
        

        document.getElementById('showContainer').style.display = "block";
        window.scrollTo(0, document.getElementById('tag-combined').scrollHeight);
        document.getElementById('tag-combined').scrollIntoView()
        disableScroll();
    };

    const scrollItems = document.getElementsByClassName('tagShowcaseContainer');
    window.addEventListener("scroll", () => {
        for (const elem of scrollItems) {
            if (elem.offsetTop <= window.scrollY) {
                document.querySelectorAll('#navbar a').forEach((link) => {
                    link.classList.remove('active');
                });

                document.getElementById(`nav-${elem.id}`).classList.add('active');
            }
        }

    });

    document.querySelectorAll('.editableCode').forEach((elem) => {
        console.log()
        elem.getElementsByTagName('code')[0].addEventListener('input', function (e) {
            console.log(elem.getElementsByClassName('codeResult'))
            elem.getElementsByClassName('codeResult')[0].innerHTML = this.innerHTML.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        });
    });
}


function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
    // if any scroll is attempted, set this to the previous value
    window.onscroll = function(e) {

        console.log(e);
       // window.scrollTo(scrollLeft, scrollTop);
        document.getElementById('tag-combined').scrollIntoView();
    };

    window.onresize = function() {
        document.getElementById('tag-combined').scrollIntoView();
    };
}
  