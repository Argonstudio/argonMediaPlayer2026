JavaScript медиа проигрыватель, умеет воспроизводить видео и аудио. Пример работы https://argon-studio.ru/js_libs/argonMediaPlayer/

Для вывода нужно указать где выводить:

<!-- Плеер -->
<div id="argonMediaPlayer"></div>

И что выводить:

document.addEventListener('DOMContentLoaded', () => {
window.player = new ArgonMediaPlayer({
container: '#argonMediaPlayer',
media: [
{
src: 'argonMediaPlayer/media/video/farada.mp4', (ссылка на видео)
title: 'Первое видео', (заголовок)
poster: 'argonMediaPlayer/media/video/farada.jpg' (ссылка на постер)
},
{
src: 'argonMediaPlayer/media/video/farada.mp4', (ссылка на видео)
title: 'Первое видео', (заголовок)
poster: 'argonMediaPlayer/media/video/farada.jpg' (ссылка на постер)
},
{
src: 'argonMediaPlayer/media/video/farada.mp4', (ссылка на видео)
title: 'Первое видео', (заголовок)
poster: 'argonMediaPlayer/media/video/farada.jpg' (ссылка на постер)
}
]
});
});

