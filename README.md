JavaScript медиа проигрыватель, умеет воспроизводить видео и аудио. Пример работы https://argon-studio.ru/js_libs/argonMediaPlayer/

## 🛠 Подключение и использование

### 1. HTML разметка
Для вывода плеера нужно указать контейнер на странице:

```html
<!-- Плеер -->
<div id="argonMediaPlayer"></div>
```

### 2. Инициализация в JavaScript
Передайте в класс селектор контейнера и массив с медиафайлами:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    window.player = new ArgonMediaPlayer({
        container: '#argonMediaPlayer',
        media: [
            {
                src: 'argonMediaPlayer/media/video/farada.mp4',    // ссылка на видео
                title: 'Первое видео',                             // заголовок
                poster: 'argonMediaPlayer/media/video/farada.jpg'  // ссылка на постер
            },
            {
                src: 'argonMediaPlayer/media/video/farada.mp4',    // ссылка на видео
                title: 'Второе видео',                             // заголовок
                poster: 'argonMediaPlayer/media/video/farada.jpg'  // ссылка на постер
            },
            {
                src: 'argonMediaPlayer/media/video/farada.mp4',    // ссылка на видео
                title: 'Третье видео',                             // заголовок
                poster: 'argonMediaPlayer/media/video/farada.jpg'  // ссылка на постер
            }
        ]
    });
});
```

