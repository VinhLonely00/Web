document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. THU GỌN / MỞ RỘNG SIDEBAR MENU --- */
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    /* --- 2. XỬ LÝ DARK / LIGHT MODE --- */
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.body.removeAttribute('data-theme');
                themeIcon.className = 'fa-solid fa-moon';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fa-solid fa-sun';
            }
        });
    }

    /* --- 3. XỬ LÝ PLAYLIST NHẠC (ĐƯỜNG DẪN MP3 LOCAL & PHÁT LẦN LƯỢT) --- */
    const playlist = [
        { title: "Bài Hát 1", artist: "Ca Sĩ A", src: "mp3/song1.mp3" },
        { title: "Bài Hát 2", artist: "Ca Sĩ B", src: "mp3/song2.mp3" },
        { title: "Bài Hát 3", artist: "Ca Sĩ C", src: "mp3/song3.mp3" }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;
    const audio = new Audio();
    audio.volume = 0.8; // Mặc định âm lượng chuẩn

    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function loadSong(index) {
        if (songTitle && songArtist) {
            songTitle.innerText = playlist[index].title;
            songArtist.innerText = playlist[index].artist;
            audio.src = playlist[index].src;
        }
    }

    function playSong() {
        audio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.className = 'fa-solid fa-pause';
        }).catch(err => {
            console.log("Không thể phát nhạc tự động hoặc chưa có file nhạc trong mp3/: ", err);
        });
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.className = 'fa-solid fa-play';
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(currentSongIndex);
            if (isPlaying) playSong();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(currentSongIndex);
            if (isPlaying) playSong();
        });
    }

    /* --- PHÁT LẦN LƯỢT (KHI HẾT BÀI TỰ SANG BÀI MỚI) --- */
    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    });

    loadSong(currentSongIndex);

    /* --- 4. CHẾ ĐỘ KHÁCH / CHỦ VÀ XÁC THỰC MẬT KHẨU --- */
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
            if (secretMenuLi) secretMenuLi.style.display = 'block';
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
