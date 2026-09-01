JavaScript медиа проигрыватель, умеет воспроизводить видео и аудио. Пример работы https://argon-studio.ru/js_libs/argonMediaPlayer/

Для вывода нужно указать где выводить:

<!-- Плеер -->
<div id="argonMediaPlayer"></div>

И что выводить:

// Инициализация плеера с медиа
        document.addEventListener('DOMContentLoaded', () => {
            window.player = new ArgonMediaPlayer({
                container: '#argonMediaPlayer',
                media: [
                    {
                        src: 'argonMediaPlayer/media/video/farada.mp4',
                        title: 'Первое видео',
                        poster: 'argonMediaPlayer/media/video/farada.jpg'
                    },
                    {
                        src: 'argonMediaPlayer/media/video/videoTexnologii1.mp4',
                        title: 'Второе видео, тут может быть много текста, даже еще больше',
                        poster: 'argonMediaPlayer/media/video/imageTexnologii1.png'
                    },
                    {
                        src: 'argonMediaPlayer/media/video/raikin.mp3',
                        title: 'Аудио',
                        type: 'audio',
                        poster: 'argonMediaPlayer/media/video/raikin.jpg'
                    }
                ]
            });
        });
