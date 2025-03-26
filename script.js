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
const selectedNominees = {};
const nominationOrder = [
    "Токсик", "Оператор", "Пара", "Прорыв", "Спокойный", 
    "Воздухан", "Мем", "Канал", "Пропажа"
];
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
const infoPanel = document.querySelector('.info-panel');
const infoText = document.getElementById('info-text');
const closeInfo = document.querySelector('.close-info');
const thankYou = document.getElementById('thankYou');
const adminPanel = document.querySelector('.admin-panel');
const adminPassword = document.getElementById('adminPassword');
const checkPassword = document.querySelector('.check-password');
const voteResults = document.getElementById('voteResults');
const closeAdmin = document.querySelector('.close-admin');
let votesData = {};
let currentChatId = '-4643837010'; // Замените на актуальный chatId

function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Ошибка:', error));
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

menuButton.addEventListener('click', () => {
    playSound(clickSound);
    console.log('Клик по кнопке меню, текущее состояние:', menu.style.display);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        playSound(clickSound);
        const info = item.getAttribute('data-info');
        console.log('Клик по пункту меню:', info);
        if (info === 'admin') {
            console.log('Открываем админ-панель:', adminPanel);
            if (adminPanel) {
                adminPanel.style.display = 'flex';
                infoPanel.style.display = 'none';
                adminPassword.style.display = 'block';
                checkPassword.style.display = 'block';
                voteResults.style.display = 'none';
                adminPassword.value = '';
                adminPassword.placeholder = 'Введите пароль';
                console.log('Состояние элементов внутри админ-панели:');
                console.log('adminPassword:', adminPassword, 'display:', adminPassword.style.display);
                console.log('checkPassword:', checkPassword, 'display:', checkPassword.style.display);
                console.log('voteResults:', voteResults, 'display:', voteResults.style.display);
                console.log('closeAdmin:', closeAdmin, 'display:', closeAdmin.style.display);
                console.log('Состояние infoPanel:', infoPanel.style.display);
                console.log('Состояние container:', document.querySelector('.container').style);
            } else {
                console.error('Админ-панель не найдена!');
            }
            menu.style.display = 'none';
        } else {
            console.log('Открываем инфо-панель:', infoPanel);
            if (infoPanel) {
                infoText.textContent = info === 'about' 
                    ? 'Разработчик - Литнарович. Ведущие - Литнарович и Лукин!'
                    : 'Выберите одного номинанта в каждой категории и отправьте голос!';
                infoPanel.style.display = 'flex';
                adminPanel.style.display = 'none';
            } else {
                console.error('Инфо-панель не найдена!');
            }
            menu.style.display = 'none';
        }
    });
});

closeInfo.addEventListener('click', () => {
    playSound(clickSound);
    infoPanel.style.display = 'none';
});

nextButton.addEventListener('click', () => {
    playSound(clickSound);
    switchTab('tab3');
    setTimeout(() => {
        document.querySelector('.nomination-frame[data-nomination="Токсик"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
    console.log('Всего категорий:', rows.size);
    console.log('Выбрано категорий:', Object.keys(selectedNominees).length);
    if (rows.size === Object.keys(selectedNominees).length) {
        submitVotes.style.display = 'block';
        voteReminder.style.display = 'none';
        setTimeout(() => {
            submitVotes.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    } else {
        submitVotes.style.display = 'none';
        voteReminder.style.display = 'block';
    }
}

submitVotes.addEventListener('click', () => {
    playSound(clickSound);
    const userId = tg.initDataUnsafe.user?.id || 'TestUser123';
    const username = tg.initDataUnsafe.user?.username || 'TestUser';
    console.log('User ID:', userId);
    console.log('Username:', username);
    console.log('Selected Nominees:', selectedNominees);

    if (Object.keys(selectedNominees).length === 0) {
        console.error('Ошибка: Нет выбранных номинантов');
        alert('Пожалуйста, выберите номинантов во всех категориях!');
        return;
    }

    const result = sendVoteToTelegram(userId, username, selectedNominees);
    if (result && typeof result.then === 'function') {
        result
            .then(() => {
                console.log('Голосование успешно отправлено');
                switchTab('tab5');
                thankYou.style.display = 'block';
                setTimeout(() => {
                    console.log('Закрытие приложения');
                    tg.close();
                }, 3000);
            })
            .catch(error => {
                console.error('Ошибка при отправке голосов:', error);
                alert('Произошла ошибка при отправке голосов. Попробуйте еще раз.');
            });
    } else {
        console.error('sendVoteToTelegram не вернул промис:', result);
        alert('Произошла ошибка: функция отправки не работает корректно.');
    }
});

function sendVoteToTelegram(userId, username, selectedNominees) {
    const botToken = '7896921651:AAHvSknX1BImERrKpfk_gAsG6fissqVcrfc';
    const message = `@${username} проголосовал за:\n${Object.entries(selectedNominees)
        .map(([row, nominee]) => `${row}: ${nominee}`)
        .join('\n')}`;

    console.log('Отправляемое сообщение:', message);

    const fetchPromise = fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: currentChatId, text: message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Ответ от Telegram:', data);
        if (data.ok) {
            if (!votesData) votesData = {};
            Object.entries(selectedNominees).forEach(([row, nominee]) => {
                if (!votesData[row]) votesData[row] = {};
                if (!votesData[row][nominee]) votesData[row][nominee] = [];
                votesData[row][nominee].push(username);
            });
            return data;
        } else {
            if (data.description.includes('group chat was upgraded to a supergroup chat') && data.parameters?.migrate_to_chat_id) {
                console.log('Чат обновлен, новый chatId:', data.parameters.migrate_to_chat_id);
                currentChatId = data.parameters.migrate_to_chat_id;
                return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: currentChatId, text: message })
                })
                .then(response => response.json())
                .then(retryData => {
                    if (retryData.ok) {
                        if (!votesData) votesData = {};
                        Object.entries(selectedNominees).forEach(([row, nominee]) => {
                            if (!votesData[row]) votesData[row] = {};
                            if (!votesData[row][nominee]) votesData[row][nominee] = [];
                            votesData[row][nominee].push(username);
                        });
                        return retryData;
                    } else {
                        throw new Error('Telegram API вернул ошибку при повторном запросе: ' + retryData.description);
                    }
                });
            }
            throw new Error('Telegram API вернул ошибку: ' + data.description);
        }
    })
    .catch(error => {
        console.error('Ошибка в fetch:', error);
        throw error;
    });

    console.log('sendVoteToTelegram возвращает промис:', fetchPromise);
    return fetchPromise;
}

function sendResultsToTelegram() {
    const botToken = '7896921651:AAHvSknX1BImERrKpfk_gAsG6fissqVcrfc';
    const chatId = currentChatId || '-4643837010';

    let resultText = 'Итоги голосования:\n';
    nominationOrder.forEach(nomination => {
        resultText += `\n${nomination}:\n`;
        const nominees = document.querySelectorAll(`.nominee[data-row="${nomination}"]`);
        nominees.forEach(nominee => {
            const nomineeId = nominee.getAttribute('data-nominee');
            const voters = votesData[nomination] && votesData[nomination][nomineeId] ? votesData[nomination][nomineeId] : [];
            resultText += `${nomineeId} - ${voters.length} голосов (${voters.length > 0 ? voters.join(', ') : 'Никто не проголосовал'})\n`;
        });
    });
    const message = resultText || 'Пока нет голосов.';

    console.log('Отправляем результаты в Telegram:', message);

    return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Результаты отправлены в Telegram:', data);
        if (!data.ok) {
            throw new Error('Telegram API вернул ошибку: ' + data.description);
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке результатов:', error);
        throw error;
    });
}

checkPassword.addEventListener('click', () => {
    playSound(clickSound);
    console.log('Проверяем пароль:', adminPassword.value);
    if (adminPassword.value === '20309080') {
        adminPassword.style.display = 'none';
        checkPassword.style.display = 'none';
        voteResults.style.display = 'block';
        voteResults.textContent = 'Результаты отправляются в Telegram...';

        sendResultsToTelegram()
            .then(() => {
                voteResults.textContent = 'Результаты успешно отправлены в Telegram!';
            })
            .catch(error => {
                voteResults.textContent = 'Ошибка при отправке результатов: ' + error.message;
            });
    } else {
        adminPassword.value = '';
        adminPassword.placeholder = 'Неверный пароль!';
    }
});

closeAdmin.addEventListener('click', () => {
    playSound(clickSound);
    adminPanel.style.display = 'none';
    adminPassword.style.display = 'block';
    checkPassword.style.display = 'block';
    voteResults.style.display = 'none';
    adminPassword.value = '';
});

tg.MainButton.setText("Закрыть");
tg.MainButton.show();
tg.MainButton.onClick(() => {
    playSound(clickSound);
    tg.close();
});

