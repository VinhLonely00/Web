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

    /* --- 2. AVATAR DẠNG BÓNG DI CHUYỂN ĐƯỢC (CHUỘT & CẢM ỨNG) --- */
    const ball = document.getElementById('floatingAvatarBall');
    const ballTrigger = document.getElementById('ballProfileTrigger');
    const avatarPopover = document.getElementById('avatarPopover');
    const closePopoverBtn = document.getElementById('closePopoverBtn');

    if (ball) {
        let posX = 24;
        let posY = window.innerHeight - 110;
        let velX = 0;
        let velY = 0;
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let lastPointerX = 0;
        let lastPointerY = 0;
        let movedDistance = 0;

        function getBounds() {
            const rect = ball.getBoundingClientRect();
            const size = rect.width || 74;
            const margin = 10;
            return {
                minX: margin,
                minY: margin + 60,
                maxX: Math.max(margin, window.innerWidth - size - margin),
                maxY: Math.max(margin + 60, window.innerHeight - size - margin)
            };
        }

        function applyBallTransform() {
            ball.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        }

        function clampAndInitPosition() {
            const b = getBounds();
            if (posX === 24 && posY === window.innerHeight - 110) {
                posX = Math.max(b.minX, window.innerWidth - (ball.offsetWidth || 74) - 24);
                posY = Math.max(b.minY, Math.min(b.maxY, window.innerHeight - (ball.offsetHeight || 74) - 28));
            } else {
                posX = Math.max(b.minX, Math.min(b.maxX, posX));
                posY = Math.max(b.minY, Math.min(b.maxY, posY));
            }
            applyBallTransform();
        }

        clampAndInitPosition();

        ball.addEventListener('pointerdown', (e) => {
            if (e.target.closest('#ballProfileTrigger')) return;
            isDragging = true;
            movedDistance = 0;
            velX = 0;
            velY = 0;
            ball.classList.add('dragging');
            ball.setPointerCapture(e.pointerId);

            dragOffsetX = e.clientX - posX;
            dragOffsetY = e.clientY - posY;
            lastPointerX = e.clientX;
            lastPointerY = e.clientY;
        });

        ball.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const b = getBounds();
            const nextX = e.clientX - dragOffsetX;
            const nextY = e.clientY - dragOffsetY;

            movedDistance += Math.hypot(e.clientX - lastPointerX, e.clientY - lastPointerY);
            velX = (e.clientX - lastPointerX) * 0.65;
            velY = (e.clientY - lastPointerY) * 0.65;
            lastPointerX = e.clientX;
            lastPointerY = e.clientY;

            posX = Math.max(b.minX, Math.min(b.maxX, nextX));
            posY = Math.max(b.minY, Math.min(b.maxY, nextY));
            applyBallTransform();
        });

        function endDrag(e) {
            if (!isDragging) return;
            isDragging = false;
            ball.classList.remove('dragging');
            if (e && ball.hasPointerCapture(e.pointerId)) {
                ball.releasePointerCapture(e.pointerId);
            }
            if (movedDistance < 6 && avatarPopover) {
                avatarPopover.classList.toggle('open');
            }
        }

        ball.addEventListener('pointerup', endDrag);
        ball.addEventListener('pointercancel', endDrag);

        function physicsStep() {
            if (!isDragging && (Math.abs(velX) > 0.08 || Math.abs(velY) > 0.08)) {
                const b = getBounds();
                posX += velX;
                posY += velY;

                if (posX <= b.minX) {
                    posX = b.minX;
                    velX = -velX * 0.65;
                } else if (posX >= b.maxX) {
                    posX = b.maxX;
                    velX = -velX * 0.65;
                }

                if (posY <= b.minY) {
                    posY = b.minY;
                    velY = -velY * 0.65;
                } else if (posY >= b.maxY) {
                    posY = b.maxY;
                    velY = -velY * 0.65;
                }

                velX *= 0.92;
                velY *= 0.92;
                applyBallTransform();
            }
            requestAnimationFrame(physicsStep);
        }
        requestAnimationFrame(physicsStep);

        window.addEventListener('resize', clampAndInitPosition);
    }

    if (ballTrigger && avatarPopover) {
        ballTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarPopover.classList.toggle('open');
        });
    }

    if (closePopoverBtn && avatarPopover) {
        closePopoverBtn.addEventListener('click', () => {
            avatarPopover.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (
            avatarPopover &&
            avatarPopover.classList.contains('open') &&
            !e.target.closest('#avatarPopover') &&
            !e.target.closest('#floatingAvatarBall')
        ) {
            avatarPopover.classList.remove('open');
        }
    });

    /* --- 3. TRẠNG THÁI THANH ĐỊNH HƯỚNG --- */
    const navItems = document.querySelectorAll('.nav-menu li');
    const tabContainerCard = document.getElementById('tabContainerCard');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const exploreBtn = document.getElementById('exploreBtn');

    function setActiveNavAndTab(targetTabId, scrollTargetId = null) {
        if (!targetTabId) return;

        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-tab') === targetTabId);
        });

        const matchingPanel = document.getElementById(targetTabId);
        if (matchingPanel && tabContainerCard) {
            tabContainerCard.style.display = 'block';
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === targetTabId);
            });
            const yOffset = -80;
            const y = tabContainerCard.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
            if (tabContainerCard) tabContainerCard.style.display = 'none';
            if (scrollTargetId) {
                const el = document.getElementById(scrollTargetId);
                if (el) {
                    const yOffset = -80;
                    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            const scrollTarget = item.getAttribute('data-scroll');
            setActiveNavAndTab(targetTab, scrollTarget);
        });
    });

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const hobbiesGrid = document.getElementById('hobbiesGrid');
            if (hobbiesGrid) {
                const yOffset = -90;
                const y = hobbiesGrid.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    }

    /* --- 4. TỰ ĐỘNG MỜ DẦN SAU 10 GIÂY KHÔNG TƯƠNG TÁC (DESKTOP & MOBILE) --- */
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

    /* --- 5. CHẾ ĐỘ KHÁCH / CHỦ VÀ MẬT KHẨU --- */
    const roleModal = document.getElementById('roleModal');
    const passwordModal = document.getElementById('passwordModal');
    const secretMenuLi = document.getElementById('secretMenuLi');
    const passInput = document.getElementById('passInput');
    const passError = document.getElementById('passError');

    window.selectRole = function(role) {
        if (roleModal) roleModal.style.display = 'none';
        if (role === 'guest') {
            if (secretMenuLi) secretMenuLi.style.display = 'none';
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
            if (passError) passError.style.display = 'none';
            setActiveNavAndTab('tab-secret');
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
