# Argon Media Player

[English version below](#english-version)

JavaScript медиа проигрыватель, умеет воспроизводить видео и аудио. 

🔗 **Пример работы:** [argon-studio.ru/js_libs/argonMediaPlayer/](https://argon-studio.ru/js_libs/argonMediaPlayer/)

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



<a id="english-version"></a>
# Argon Media Player (English)

A JavaScript media player capable of playing both video and audio.

🔗 **Live Demo:** [argon-studio.ru/js_libs/argonMediaPlayer/](https://argon-studio.ru/js_libs/argonMediaPlayer/)

---

## 🛠 Installation & Usage

### 1. HTML Markup
Define a container element on your page where the player will be rendered:

```html
<!-- Player Container -->
<div id="argonMediaPlayer"></div>
```

### 2. JavaScript Initialization
Pass the container selector and an array of media files into the class constructor:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    window.player = new ArgonMediaPlayer({
        container: '#argonMediaPlayer',
        media: [
            {
                src: 'argonMediaPlayer/media/video/farada.mp4',    // path to video
                title: 'First Video',                              // title
                poster: 'argonMediaPlayer/media/video/farada.jpg'  // path to poster image
            }
        ]
    });
});
```

