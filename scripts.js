document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. HIỆU ỨNG ĐÁNH MÁY TAB TITLE --- */
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
        setTimeout(typeEffect, isDeleting ? 80 : 130);
    }
    typeEffect();

    /* --- 2. HỆ THỐNG CHUYỂN TAB ĐỒNG BỘ (NAVBAR & CARD) --- */
    const navItems = document.querySelectorAll('.nav-menu li');
    const innerPills = document.querySelectorAll('.inner-pill');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabContainerCard = document.getElementById('tabContainerCard');

    function switchTab(targetTabId, shouldScroll = false) {
        if (!targetTabId) return;

        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-tab') === targetTabId);
        });

        innerPills.forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-tab') === targetTabId);
        });

        tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === targetTabId);
        });

        if (shouldScroll && tabContainerCard) {
            const yOffset = -80;
            const y = tabContainerCard.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab, true);
        });
    });

    innerPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const targetTab = pill.getAttribute('data-tab');
            switchTab(targetTab, false);
        });
    });

    /* --- 3. TỰ ĐỘNG MỜ DẦN SAU 10 GIÂY KHÔNG TƯƠNG TÁC (DESKTOP & MOBILE) --- */
    let idleTimer;
    function resetIdleTimer() {
        if (document.body.classList.contains('idle-mode')) {
            document.body.classList.remove('idle-mode');
        }
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            document.body.classList.add('idle-mode');
        }, 10000);
    }

    ['mousemove', 'mousedown', 'touchstart', 'keypress', 'scroll'].forEach(evt => {
        window.addEventListener(evt, resetIdleTimer, { passive: true });
    });
    resetIdleTimer();

    /* --- 4. CHẾ ĐỘ KHÁCH / CHỦ VÀ MẬT KHẨU --- */
    const roleModal = document.getElementById('roleModal');
    const passwordModal = document.getElementById('passwordModal');
    const secretMenuLi = document.getElementById('secretMenuLi');
    const secretInnerPill = document.getElementById('secretInnerPill');
    const passInput = document.getElementById('passInput');
    const passError = document.getElementById('passError');

    window.selectRole = function(role) {
        if (roleModal) roleModal.style.display = 'none';
        if (role === 'guest') {
            if (secretMenuLi) secretMenuLi.style.display = 'none';
            if (secretInnerPill) secretInnerPill.style.display = 'none';
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
        if (passInput.value === 'Vinh23456f@@') {
            if (passwordModal) passwordModal.style.display = 'none';
            if (secretMenuLi) secretMenuLi.style.display = 'inline-block';
            if (secretInnerPill) secretInnerPill.style.display = 'inline-flex';
            if (passError) passError.style.display = 'none';
            switchTab('tab-secret', false);
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
