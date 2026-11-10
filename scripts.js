document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. HIỆU ỨNG ĐÁNH MÁY (CHỈ XÓA ĐẾN KÝ TỰ '@') --- */
    const textToType = "@ᴠʏɴᴅᴜsᴋᴡɪɴᴛᴇʀ";
    let charIndex = textToType.length;
    let isDeleting = true;

    function typeEffect() {
        if (!isDeleting) {
            document.title = textToType.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === textToType.length) {
                setTimeout(() => { isDeleting = true; }, 1500);
            }
        } else {
            document.title = textToType.substring(0, charIndex);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
            }
        }

        const typingSpeed = isDeleting ? 80 : 130;
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    /* --- BẬT / TẮT CHẾ ĐỘ VIDEO NỀN BACKGROUND.MP4 --- */
    const videoBgToggle = document.getElementById('videoBgToggle');
    const bgVideo = document.getElementById('bgVideo');

    if (videoBgToggle && bgVideo) {
        videoBgToggle.addEventListener('click', () => {
            if (bgVideo.style.display === 'block') {
                bgVideo.style.display = 'none';
                bgVideo.pause();
                document.body.classList.remove('video-bg-active');
            } else {
                bgVideo.style.display = 'block';
                bgVideo.play().catch(e => console.log("Không thể phát video tự động:", e));
                document.body.classList.add('video-bg-active');
            }
        });
    }

    /* --- TỰ ĐỘNG MỜ DẦN & TÀNG HÌNH SAU 10 GIÂY KHÔNG DI CHUYỂN CHUỘT --- */
    let idleTimer;
    const IDLE_TIMEOUT = 10000; // 10 giây

    function resetIdleTimer() {
        if (document.body.classList.contains('idle-mode')) {
            document.body.classList.remove('idle-mode');
        }

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            document.body.classList.add('idle-mode');
        }, IDLE_TIMEOUT);
    }

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    resetIdleTimer();

    /* --- 1. CHẾ ĐỘ KHÁCH / CHỦ VÀ XÁC THỰC MẬT KHẨU --- */
    const roleModal = document.getElementById('roleModal');
    const passwordModal = document.getElementById('passwordModal');
    const secretMenuLi = document.getElementById('secretMenuLi');
    const secretSection = document.getElementById('secret-section');
    const passInput = document.getElementById('passInput');
    const passError = document.getElementById('passError');

    window.selectRole = function(role) {
        if (roleModal) roleModal.style.display = 'none';
        if (role === 'guest') {
            if (secretMenuLi) secretMenuLi.style.display = 'none';
            if (secretSection) secretSection.style.display = 'none';
        } else if (role === 'owner') {
            if (passwordModal) {
                passwordModal.style.display = 'flex';
                if (passInput) passInput.focus();
            }
        }
    };

    window.backToRoleModal = function() {
        if (passwordModal) passwordModal.style.display = 'none';
        if (roleModal) roleModal.style.display = 'flex';
        if (passError) passError.style.display = 'none';
        if (passInput) passInput.value = '';
    };

    window.verifyPassword = function() {
        if (!passInput) return;
        const enteredPass = passInput.value;
        if (enteredPass === 'Vinh23456f@@') {
            if (passwordModal) passwordModal.style.display = 'none';
            if (secretMenuLi) secretMenuLi.style.display = 'inline-block';
            if (secretSection) secretSection.style.display = 'block';
            if (passError) passError.style.display = 'none';
        } else {
            if (passError) passError.style.display = 'block';
        }
    };

    window.checkEnterKey = function(event) {
        if (event.key === 'Enter') {
            window.verifyPassword();
        }
    };
});
