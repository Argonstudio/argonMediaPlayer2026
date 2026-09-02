/*!
 * ArgonMediaPlayer v2.0.0
 * https://argon-studio.ru/
 * https://github.com/Argonstudio/argonMediaPlayer2026
 * 
 * Основан на Argon HTML5 Player (2016)
 * @author Ivan Voitkov
 * 
 * Copyright (c) 2026 Ivan Voitkov
 * Released under the MIT License
 */

class ArgonMediaPlayer {
    constructor(config = {}) {
        this.config = config;
        this.container = typeof config.container === 'string' 
            ? document.querySelector(config.container) 
            : config.container;
        this.mediaList = config.media || [];
        this.players = [];
        this.valueVolume = 1;
        
        const allScripts = document.getElementsByTagName('script');
        const currentScript = Array.from(allScripts).find(script => script.src.includes('argonMediaPlayer.js'));
        
        this.playerUrl = currentScript ? currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1) : '';
        
        this.init();
    }
    
    init() {
        this.createPlayers();
    }
    
    createPlayers() {
        this.container.innerHTML = '';
        this.players = [];
        
        this.mediaList.forEach((mediaData, index) => {
            const playerInstance = this.createSinglePlayer(mediaData, index);
            this.players.push(playerInstance);
        });
    }
    
    createSinglePlayer(mediaData, index) {
        const playerWrapper = document.createElement('div');
        playerWrapper.className = 'argon-player-wrapper';
        playerWrapper.dataset.index = index;
        
        const mediaType = mediaData.type || this.detectType(mediaData.src);
        const posterUrl = mediaData.poster || mediaData.image || '';
        
        playerWrapper.innerHTML = `
            <div class="argon-player-container ${mediaType === 'audio' ? 'argon-audio-mode' : ''}">
                <div class="argon-player" id="argon-player-${index}"></div>
                <div class="argon-custom-poster" id="argon-poster-${index}" 
                     style="background-image: url('${posterUrl}'); ${!posterUrl ? 'display:none;' : ''}">
                </div>
                <div class="argon-indicator" id="argon-indicator-${index}">
                    <div class="argon-loading" id="argon-loading-${index}"></div>
                    <div class="argon-runner" id="argon-runner-${index}"></div>
                </div>
                <button class="argon-switchPlayer argon-start" id="argon-switchPlayer-${index}"></button>
                <img class="argon-volumeImg" id="argon-volumeImg-${index}" src="${this.playerUrl}media/volume.png" alt="Громкость">
                <div class="argon-buttonsVolume">
                    <button class="argon-volumeMinus" id="argon-volumeMinus-${index}">-</button>
                    <button class="argon-volumePlus" id="argon-volumePlus-${index}">+</button>
                </div>
                <div class="argon-fonPlayer" id="argon-fonPlayer-${index}">
                    <button class="argon-fullScreenPlayer" id="argon-fullScreenPlayer-${index}"></button>
                </div>
            </div>
            <div class="argon-player-title">${mediaData.title || `Медиа ${index + 1}`}</div>
        `;
        
        this.container.appendChild(playerWrapper);
        
        const mediaElement = this.createMediaElement(mediaData, mediaType, index);
        const playerDiv = playerWrapper.querySelector(`#argon-player-${index}`);
        playerDiv.appendChild(mediaElement);
        
        const playerInstance = {
            index: index,
            mediaData: mediaData,
            mediaType: mediaType,
            mediaElement: mediaElement,
            wrapper: playerWrapper,
            elements: {
                player: playerDiv,
                customPoster: playerWrapper.querySelector(`#argon-poster-${index}`),
                switchPlayer: playerWrapper.querySelector(`#argon-switchPlayer-${index}`),
                fonPlayer: playerWrapper.querySelector(`#argon-fonPlayer-${index}`),
                fullScreenPlayer: playerWrapper.querySelector(`#argon-fullScreenPlayer-${index}`),
                indicator: playerWrapper.querySelector(`#argon-indicator-${index}`),
                loading: playerWrapper.querySelector(`#argon-loading-${index}`),
                runner: playerWrapper.querySelector(`#argon-runner-${index}`),
                volumeMinus: playerWrapper.querySelector(`#argon-volumeMinus-${index}`),
                volumePlus: playerWrapper.querySelector(`#argon-volumePlus-${index}`),
                volumeImg: playerWrapper.querySelector(`#argon-volumeImg-${index}`)
            },
            isPlaying: false
        };
        
        this.setupPlayerEvents(playerInstance);
        return playerInstance;
    }
    
    createMediaElement(mediaData, mediaType, index) {
        const el = document.createElement(mediaType === 'audio' ? 'audio' : 'video');
        el.id = `argon-media-${index}`;
        el.src = mediaData.src;
        el.preload = 'metadata';
        el.setAttribute('playsinline', '');
        el.setAttribute('webkit-playsinline', '');
        el.setAttribute('x5-video-player-type', 'h5');
        
        if (mediaType === 'video') {
            el.style.opacity = '0';
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.objectFit = 'cover';
        }
        return el;
    }
    
    detectType(src) {
        const audioExtensions = ['.mp3', '.ogg', '.wav', '.aac', '.m4a', '.flac'];
        const lowerSrc = src.toLowerCase();
        return audioExtensions.some(ext => lowerSrc.includes(ext)) ? 'audio' : 'video';
    }
    
    setupPlayerEvents(playerInstance) {
        const { mediaElement, elements, mediaType } = playerInstance;
        
        // 1. Синхронизация при начале проигрывания (в т.ч. в Fullscreen)
        mediaElement.addEventListener('play', () => {
            // Останавливаем другие плееры
            this.players.forEach(p => {
                if (p !== playerInstance && !p.mediaElement.paused) p.mediaElement.pause();
            });
            
            playerInstance.isPlaying = true;
            elements.switchPlayer.className = 'argon-switchPlayer argon-pause';
            
            if (mediaType === 'video') {
                // Скрываем постер
                if (elements.customPoster) {
                    elements.customPoster.style.display = 'none';
                }
                // Показываем видео
                mediaElement.style.opacity = '1';
            }
        });

        // 2. Синхронизация при паузе
        mediaElement.addEventListener('pause', () => {
            playerInstance.isPlaying = false;
            elements.switchPlayer.className = 'argon-switchPlayer argon-start';
        });

        // 3. Обработка выхода из полноэкранного режима (для старых браузеров)
        const fsEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
        fsEvents.forEach(evt => {
            document.addEventListener(evt, () => this.syncUI(playerInstance));
        });

        // Специально для старых iOS/Android (событие выхода из системного плеера)
        mediaElement.addEventListener('webkitendfullscreen', () => {
            this.syncUI(playerInstance);
        });

        // Остальные стандартные события
        mediaElement.addEventListener('timeupdate', () => this.updateProgress(playerInstance));
        mediaElement.addEventListener('progress', () => this.updateLoading(playerInstance));
        mediaElement.addEventListener('durationchange', () => this.updateLoading(playerInstance));
        mediaElement.addEventListener('ended', () => this.pause(playerInstance));
        
        elements.switchPlayer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay(playerInstance);
        });
        
        elements.fonPlayer.addEventListener('click', (e) => {
            if (e.target !== elements.fullScreenPlayer) this.togglePlay(playerInstance);
        });
        
        elements.fullScreenPlayer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen(playerInstance);
        });
        
        elements.volumeMinus.addEventListener('click', (e) => { e.stopPropagation(); this.decreaseVolume(playerInstance); });
        elements.volumePlus.addEventListener('click', (e) => { e.stopPropagation(); this.increaseVolume(playerInstance); });
        elements.volumeImg.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMute(playerInstance); });
        
        this.setupSeeking(playerInstance);
    }

    // Метод принудительной синхронизации интерфейса
    syncUI(playerInstance) {
        const { mediaElement, elements } = playerInstance;
        if (!mediaElement.paused) {
            elements.switchPlayer.className = 'argon-switchPlayer argon-pause';
            playerInstance.isPlaying = true;
        } else {
            elements.switchPlayer.className = 'argon-switchPlayer argon-start';
            playerInstance.isPlaying = false;
        }
    }
    
    setupSeeking(playerInstance) {
        const { elements, mediaElement } = playerInstance;
        const indicator = elements.indicator;
        
        const moveHandler = (clientX) => {
            const rect = indicator.getBoundingClientRect();
            let position = clientX - rect.left;
            const width = indicator.clientWidth;
            if (position < 0) position = 0;
            if (position > width) position = width;
            if (mediaElement.duration) {
                mediaElement.currentTime = (position / width) * mediaElement.duration;
            }
        };

        indicator.addEventListener('mousedown', (e) => {
            moveHandler(e.clientX);
            const onMouseMove = (me) => moveHandler(me.clientX);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), {once: true});
        });

        indicator.addEventListener('touchstart', (e) => {
            moveHandler(e.touches[0].clientX);
            const onTouchMove = (te) => moveHandler(te.touches[0].clientX);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', () => document.removeEventListener('touchmove', onTouchMove), {once: true});
        }, {passive: true});
    }
    
    togglePlay(playerInstance) {
        playerInstance.mediaElement.paused ? this.play(playerInstance) : this.pause(playerInstance);
    }
    
    play(playerInstance) {
        // Вызов play() спровоцирует событие 'play', которое обновит иконки через listener
        playerInstance.mediaElement.play().catch(e => console.log("Autoplay blocked"));
    }
    
    pause(playerInstance) {
        playerInstance.mediaElement.pause();
    }
    
    updateProgress(playerInstance) {
        const { mediaElement, elements } = playerInstance;
        if (mediaElement.duration) {
            const pos = (mediaElement.currentTime / mediaElement.duration) * 100;
            elements.runner.style.width = pos + "%";
        }
    }
    
    updateLoading(playerInstance) {
        const { mediaElement, elements } = playerInstance;
        if (mediaElement.buffered.length > 0 && mediaElement.duration) {
            const bufferedEnd = mediaElement.buffered.end(mediaElement.buffered.length - 1);
            elements.loading.style.width = (bufferedEnd / mediaElement.duration) * 100 + "%";
        }
    }
    
    decreaseVolume(playerInstance) {
        if (playerInstance.mediaElement.volume >= 0.2) playerInstance.mediaElement.volume -= 0.2;
        this.updateVolumeIcon(playerInstance);
    }
    
    increaseVolume(playerInstance) {
        if (playerInstance.mediaElement.volume <= 0.8) playerInstance.mediaElement.volume += 0.2;
        this.updateVolumeIcon(playerInstance);
    }
    
    toggleMute(playerInstance) {
        const el = playerInstance.mediaElement;
        if (el.volume > 0) {
            this.valueVolume = el.volume;
            el.volume = 0;
        } else {
            el.volume = this.valueVolume;
        }
        this.updateVolumeIcon(playerInstance);
    }
    
    updateVolumeIcon(playerInstance) {
        const vol = playerInstance.mediaElement.volume;
        playerInstance.elements.volumeImg.src = vol === 0 
            ? `${this.playerUrl}media/volumeNo.png` 
            : `${this.playerUrl}media/volume.png`;
    }
    
    toggleFullscreen(playerInstance) {
        if (playerInstance.mediaType !== 'video') return;
        const el = playerInstance.mediaElement;
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // Сначала запускаем видео
            this.play(playerInstance);
            
            // Затем открываем полноэкранный режим
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.webkitEnterFullscreen) {
                el.webkitEnterFullscreen(); // Фикс для старых iOS
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
}
