const tg = window.Telegram?.WebApp || {
    initDataUnsafe: {},
    close: () => console.log("Закрытие приложения"),
    MainButton: {
        setText: () => {},
        show: () => {},
        onClick: (cb) => {}
    }
};

const nextButton = document.getElementById('nextButton');
const submitVotes = document.getElementById('submitVotes');
const clickSound = document.getElementById('clickSound');
const transitionSound = document.getElementById('transitionSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicModal = document.getElementById('musicModal');
const musicControl = document.getElementById('musicControl');
const musicControlButton = document.getElementById('musicControlButton');
const musicControlMenu = document.getElementById('musicControlMenu');
const selectedNominees = {};
const nominationOrder = [
    "Токсик",
    "Оператор",
    "Пара",
    "Прорыв",
    "Спокойный",
    "Воздухан",
    "Мем",
    "Канал",
    "Пропажа"
];
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
const infoPanel = document.querySelector('.info-panel');
const infoText = document.getElementById('info-text');
const closeInfo = document.querySelector('.close-info');
const thankYou = document.getElementById('thankYou');

function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Ошибка воспроизведения звука:', error));
    }
}

function switchTab(tabId) {
    const activeTab = document.querySelector('.tab.active');
    const newTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.remove('active');
    newTab.classList.add('active');
    playSound(transitionSound);
}

function scrollToNextNomination(currentRow) {
    const currentIndex = nominationOrder.indexOf(currentRow);
    const nextIndex = currentIndex + 1;
    if (nextIndex < nominationOrder.length) {
        const nextNomination = document.querySelector(`.nomination-frame[data-nomination="${nominationOrder[nextIndex]}"]`);
        if (nextNomination) {
            setTimeout(() => {
                nextNomination.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }
}

function changeMusic(trackSrc) {
    backgroundMusic.src = trackSrc;
    backgroundMusic.play().catch(error => console.error('Ошибка воспроизведения музыки:', error));
    musicModal.style.display = 'none';
    musicControlMenu.style.display = 'none';
}

menuButton.addEventListener('click', () => {
    playSound(clickSound);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        playSound(clickSound);
        const info = item.getAttribute('data-info');
        infoText.textContent = info === 'about' 
            ? 'Разработчик - Литнарович. Ведущие - Литнарович и Лукин!'
            : 'Выберите одного номинанта в каждой категории и отправьте голос!';
        infoPanel.style.display = 'flex';
        menu.style.display = 'none';
    });
});

closeInfo.addEventListener('click', () => {
    playSound(clickSound);
    infoPanel.style.display = 'none';
});

nextButton.addEventListener('click', () => {
    playSound(clickSound);
    musicModal.style.display = 'flex';
});

document.querySelectorAll('.music-modal .track-option').forEach(option => {
    option.addEventListener('click', () => {
        const trackSrc = option.getAttribute('data-track');
        changeMusic(trackSrc);
        switchTab('tab3');
        musicControl.style.display = 'block';
        setTimeout(() => {
            document.querySelector('.nomination-frame[data-nomination="Токсик"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
});

musicControlButton.addEventListener('click', () => {
    playSound(clickSound);
    musicControlMenu.style.display = musicControlMenu.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.music-control-menu .track-option').forEach(option => {
    option.addEventListener('click', () => {
        const trackSrc = option.getAttribute('data-track');
        changeMusic(trackSrc);
    });
});

const nominees = document.querySelectorAll('.nominee');
nominees.forEach(nominee => {
    const voteAction = nominee.querySelector('.vote-action');
    nominee.addEventListener('click', (e) => {
        e.preventDefault();
        if (!nominee.classList.contains('selected') && !nominee.classList.contains('flipped')) {
            playSound(clickSound);
            nominee.classList.add('flipped');
            setTimeout(() => nominee.classList.remove('flipped'), 4000);
        }
    });

    voteAction.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound(clickSound);
        const row = nominee.getAttribute('data-row');
        const nomineeId = nominee.getAttribute('data-nominee');
        selectedNominees[row] = nomineeId;
        nominee.classList.add('selected');
        nominee.classList.remove('flipped');
        document.querySelectorAll(`.nominee[data-row="${row}"]`).forEach(n => {
            if (n !== nominee) {
                n.style.pointerEvents = 'none';
                n.style.opacity = '0.5';
            }
        });
        checkAllVotes();
        scrollToNextNomination(row);
    });
});

function checkAllVotes() {
    const rows = new Set([...document.querySelectorAll('.nominee')].map(n => n.getAttribute('data-row')));
    const voteReminder = document.getElementById('voteReminder');
    if (rows.size === Object.keys(selectedNominees).length) {
        submitVotes.style.display = 'block';
        voteReminder.style.display = 'none';
        setTimeout(() => {
            submitVotes.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    } else {
        voteReminder.style.display = 'block';
        submitVotes.style.display = 'none';
    }
}

submitVotes.addEventListener('click', () => {
    playSound(clickSound);
    const userId = tg.initDataUnsafe.user?.id || 'Аноним';
    const username = tg.initDataUnsafe.user?.username || 'Аноним';
    sendVoteToTelegram(userId, username, selectedNominees);
    switchTab('tab5');
    thankYou.style.display = 'block';
    setTimeout(() => tg.close(), 3000);
});

function sendVoteToTelegram(userId, username, selectedNominees) {
    const botToken = '7896921651:AAHvSknX1BImERrKpfk_gAsG6fissqVcrfc';
    const chatId = '-1002626436094';
    const message = `@${username} проголосовал за:\n${Object.entries(selectedNominees).map(([row, nominee]) => `${row}: ${nominee}`).join('\n')}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
    .then(response => response.json())
    .then(data => console.log('Голос успешно отправлен:', data))
    .catch(error => console.error('Ошибка отправки голоса:', error));
}

tg.MainButton.setText("Закрыть");
tg.MainButton.show();
tg.MainButton.onClick(() => {
    playSound(clickSound);
    tg.close();
});
