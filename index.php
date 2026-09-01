<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link type="text/css" rel="stylesheet" href="argonMediaPlayer/argonMediaPlayer.css">
</head>
<body>
    
    <!-- Плеер -->
    <div id="argonMediaPlayer"></div>
    
    <script src="argonMediaPlayer/argonMediaPlayer.js"></script>
    <script>
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
    </script>
</body>
</html>
