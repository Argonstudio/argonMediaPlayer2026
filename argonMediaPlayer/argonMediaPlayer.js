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
        
        // Переменная запишет точный URL папки (например: https://site.com)
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
                <!-- Основной блок плеера -->
                <div class="argon-player" id="argon-player-${index}">
                    <!-- Видео/Аудио вставится сюда через JS -->
                </div>

                <!-- Кастомный постер (фикс для Android 8) -->
                <div class="argon-custom-poster" id="argon-poster-${index}" 
                     style="background-image: url('${posterUrl}'); ${!posterUrl ? 'display:none;' : ''}">
                </div>
                
                <!-- Индикатор прогресса -->
                <div class="argon-indicator" id="argon-indicator-${index}">
                    <div class="argon-loading" id="argon-loading-${index}"></div>
                    <div class="argon-runner" id="argon-runner-${index}"></div>
                </div>
                
                <!-- Кнопка Play/Pause -->
                <button class="argon-switchPlayer argon-start" id="argon-switchPlayer-${index}"></button>
                
                <!-- Громкость -->
                <img class="argon-volumeImg" id="argon-volumeImg-${index}" src="${this.playerUrl}media/volume.png" alt="Громкость">
                
                <div class="argon-buttonsVolume">
                    <button class="argon-volumeMinus" id="argon-volumeMinus-${index}">-</button>
                    <button class="argon-volumePlus" id="argon-volumePlus-${index}">+</button>
                </div>

                <!-- Слой клика и Фулскрин -->
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
        if (mediaType === 'audio') {
            const audio = document.createElement('audio');
            audio.id = `argon-audio-${index}`;
            audio.src = mediaData.src;
            audio.preload = 'metadata';
            audio.playsInline = true;
            return audio;
        } else {
            const video = document.createElement('video');
            video.id = `argon-video-${index}`;
            video.src = mediaData.src;
            video.preload = 'metadata';
            video.playsInline = true;
            
            // Изначально скрываем само видео, чтобы не было видно "рывка" при старте
            video.style.opacity = '0';
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('x5-video-player-type', 'h5');
            
            return video;
        }
    }
    
    detectType(src) {
        const audioExtensions = ['.mp3', '.ogg', '.wav', '.aac', '.m4a', '.flac'];
        const lowerSrc = src.toLowerCase();
        for (const ext of audioExtensions) {
            if (lowerSrc.includes(ext)) return 'audio';
        }
        return 'video';
    }
    
    setupPlayerEvents(playerInstance) {
        const { mediaElement, elements, mediaType } = playerInstance;
        
        // Главный фикс для Android 8: убираем постер только когда видео РЕАЛЬНО начало играть
        mediaElement.addEventListener('playing', () => {
            if (mediaType === 'video' && elements.customPoster) {
                elements.customPoster.style.display = 'none';
                mediaElement.style.opacity = '1';
            }
        });

        // Если видео сброшено в начало - возвращаем постер
        mediaElement.addEventListener('ended', () => {
            if (mediaType === 'video' && elements.customPoster) {
                elements.customPoster.style.display = 'block';
                mediaElement.style.opacity = '0';
            }
            this.pause(playerInstance);
        });

        mediaElement.addEventListener('timeupdate', () => this.updateProgress(playerInstance));
        mediaElement.addEventListener('progress', () => this.updateLoading(playerInstance));
        mediaElement.addEventListener('durationchange', () => this.updateLoading(playerInstance));
        
        elements.switchPlayer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay(playerInstance);
        });
        
        elements.fonPlayer.addEventListener('click', (e) => {
            if (e.target !== elements.fullScreenPlayer) {
                this.togglePlay(playerInstance);
            }
        });
        
        elements.fullScreenPlayer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen(playerInstance);
        });
        
        elements.volumeMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            this.decreaseVolume(playerInstance);
        });
        
        elements.volumePlus.addEventListener('click', (e) => {
            e.stopPropagation();
            this.increaseVolume(playerInstance);
        });
        
        elements.volumeImg.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute(playerInstance);
        });
        
        this.setupSeeking(playerInstance);
    }
    
    setupSeeking(playerInstance) {
        const { elements, mediaElement } = playerInstance;
        const indicator = elements.indicator;
        
        const moveHandler = (clientX) => {
            const rect = indicator.getBoundingClientRect();
            let position = clientX - rect.left;
            this.changingCurrentTime(playerInstance, position);
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
    
    changingCurrentTime(playerInstance, newPosition) {
        const { mediaElement, elements } = playerInstance;
        const width = elements.indicator.clientWidth;
        if (newPosition < 0) newPosition = 0;
        if (newPosition > width) newPosition = width;
        
        if (mediaElement.duration) {
            mediaElement.currentTime = (newPosition / width) * mediaElement.duration;
            elements.runner.style.width = newPosition + "px";
        }
    }
    
    togglePlay(playerInstance) {
        playerInstance.mediaElement.paused ? this.play(playerInstance) : this.pause(playerInstance);
    }
    
    play(playerInstance) {
        this.players.forEach(p => {
            if (p !== playerInstance && !p.mediaElement.paused) this.pause(p);
        });
        
        playerInstance.mediaElement.play();
        playerInstance.isPlaying = true;
        playerInstance.elements.switchPlayer.className = 'argon-switchPlayer argon-pause';
    }
    
    pause(playerInstance) {
        playerInstance.mediaElement.pause();
        playerInstance.isPlaying = false;
        playerInstance.elements.switchPlayer.className = 'argon-switchPlayer argon-start';
    }
    
    updateProgress(playerInstance) {
        const { mediaElement, elements } = playerInstance;
        if (mediaElement.duration) {
            const pos = (mediaElement.currentTime / mediaElement.duration) * elements.indicator.clientWidth;
            elements.runner.style.width = pos + "px";
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
        if (!document.fullscreenElement) {
            if (el.requestFullscreen) el.requestFullscreen();
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        } else {
            document.exitFullscreen ? document.exitFullscreen() : (document.webkitExitFullscreen && document.webkitExitFullscreen());
        }
    }
}
