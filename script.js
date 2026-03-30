document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://your-server-api.com/api';
    
    const joinSection = document.querySelector('.join-section') || document.body; 
    const nameInput = document.getElementById('user-name');
    const joinBtn = document.getElementById('join-btn');
    
    const resultSection = document.getElementById('result-section');
    const friendNameDisplay = document.getElementById('friend-name');
    const wishTextarea = document.getElementById('wish-input');
    const sendWishBtn = document.getElementById('send-wish-btn');
    const statusMessage = document.getElementById('status-message');

    if (joinBtn) {
        joinBtn.addEventListener('click', async () => {
            const userName = nameInput.value.trim();

            if (!userName) {
                alert('Пожалуйста, введите ваше имя!');
                return;
            }

            joinBtn.disabled = true;
            joinBtn.textContent = 'Загрузка...';

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: userName })
                });

                if (!response.ok) throw new Error('Ошибка сети');

                const data = await response.json();
                
                showResultSection(userName, data.friendName);

            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось подключиться к серверу. Попробуйте позже.');
                joinBtn.disabled = false;
                joinBtn.textContent = 'Участвовать / Получить подарок';
            }
        });
    }

    if (sendWishBtn) {
        sendWishBtn.addEventListener('click', async () => {
            const wishText = wishTextarea.value.trim();
            const userName = nameInput.value; 
            if (!wishText) {
                alert('Пожелание не может быть пустым!');
                return;
            }

            sendWishBtn.disabled = true;
            sendWishBtn.textContent = 'Отправка...';

            try {
                const response = await fetch(`${API_BASE_URL}/send-wish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        from: userName, 
                        wish: wishText 
                    })
                });

                if (!response.ok) throw new Error('Ошибка отправки');

                statusMessage.textContent = 'Пожелание отправлено! 🎉';
                statusMessage.style.color = 'green';
                wishTextarea.disabled = true;
                sendWishBtn.textContent = 'Отправлено';
                
                setTimeout(() => {
                    statusMessage.textContent = '';
                }, 3000);

            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось отправить пожелание.');
                sendWishBtn.disabled = false;
                sendWishBtn.textContent = 'Отправить пожелание';
            }
        });
    }


    function showResultSection(userName, friendName) {
        if (joinSection) joinSection.classList.add('hidden');
        
        if (resultSection) {
            resultSection.classList.remove('hidden');
            resultSection.classList.add('fade-in');
            
            const greeting = document.getElementById('greeting-text');
            if (greeting) {
                greeting.innerHTML = `Привет, <b>${userName}</b>!<br>Твой тайный друг: <span class="friend-name">${friendName}</span><br>Не забудь оставить пожелание!`;
            }
        }
    }
});
