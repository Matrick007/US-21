from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext

# Токен вашего бота
TOKEN = '7896921651:AAHvSknX1BImERrKpfk_gAsG6fissqVcrfc'

# Функция, которая будет вызываться при команде /start
def start(update: Update, context: CallbackContext) -> None:
    # Текст, который будет отправлен
    text = "Привет! Нажимай снизу и голосу!"
    
    # Фото, которое будет отправлено
    photo_url = "21.jpg"
    
    # Ссылка на мини-приложение
    link = "https://matrick007.github.io/US-21/"
    
    # Создаем кнопку с ссылкой
    keyboard = [[InlineKeyboardButton("Открыть мини-приложение", url=link)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # Отправляем фото с текстом и кнопкой
    update.message.reply_photo(photo=photo_url, caption=text, reply_markup=reply_markup)

def main() -> None:
    # Создаем Updater и передаем ему токен вашего бота
    updater = Updater(TOKEN)

    # Получаем диспетчер для регистрации обработчиков
    dispatcher = updater.dispatcher

    # Регистрируем обработчик команды /start
    dispatcher.add_handler(CommandHandler("start", start))

    # Запускаем бота
    updater.start_polling()

    # Работаем до тех пор, пока не будет нажата комбинация Ctrl+C
    updater.idle()

if __name__ == '__main__':
    main()