(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    //pop-up
    document.body.classList.add("blocked");

function closePopup() {
  const popup = document.getElementById("welcomePopup");
  popup.classList.add("fade-out");

  // Tunggu animasi selesai
  setTimeout(() => {
    popup.style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    document.body.classList.remove("blocked"); // Aktifkan kembali interaksi setelah popup ditutup
  }, 3000);
}

    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:4
            },
            768:{
                items:6
            },
            992:{
                items:8
            }
        }
    });
    
})(jQuery);

(function () {
    "use strict";

    const callBtn = document.getElementById('callCenterBtn');
    const closeBtn = document.getElementById('closeCallCenterBtn');
    const locateBtn = document.getElementById('locatePuskesmasBtn');
    const panel = document.getElementById('callCenterPanel');
    const statusEl = document.getElementById('callCenterStatus');
    const listEl = document.getElementById('puskesmasCallList');

    if (!callBtn || !closeBtn || !locateBtn || !panel || !statusEl || !listEl) {
        return;
    }

    const puskesmasData = [
        {
            name: "Puskesmas Gianyar I",
            lat: -8.5400,
            lng: 115.3200,
            whatsapp: "628123768347"
        },
        {
            name: "Puskesmas Blahbatuh I",
            lat: -8.5791,
            lng: 115.3040
        },
        {
            name: "Puskesmas Blahbatuh II",
            lat: -8.5926,
            lng: 115.2798
        },
        {
            name: "Puskesmas Sukawati I",
            lat: -8.6005,
            lng: 115.2822
        },
        {
            name: "Puskesmas Sukawati II",
            lat: -8.5707,
            lng: 115.2617
        },
        {
            name: "Puskesmas Tampaksiring I",
            lat: -8.4247,
            lng: 115.3138
        },
        {
            name: "Puskesmas Tampaksiring II",
            lat: -8.4678,
            lng: 115.3044
        },
        {
            name: "Puskesmas Tegallalang I",
            lat: -8.4365,
            lng: 115.2786
        },
        {
            name: "Puskesmas Payangan",
            lat: -8.3922,
            lng: 115.2421
        },
        {
            name: "Puskesmas Ubud I",
            lat: -8.5098,
            lng: 115.2625
        }
    ];

    function togglePanel(force) {
        const shouldOpen = typeof force === 'boolean'
            ? force
            : !panel.classList.contains('is-open');

        panel.classList.toggle('is-open', shouldOpen);
        callBtn.setAttribute('aria-expanded', String(shouldOpen));
    }

    function toRad(value) {
        return value * Math.PI / 180;
    }

    function calculateDistance(userLat, userLng, targetLat, targetLng) {
        const earthRadiusKm = 6371;
        const dLat = toRad(targetLat - userLat);
        const dLng = toRad(targetLng - userLng);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(userLat)) * Math.cos(toRad(targetLat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }

    function getSortedPuskesmas(userLat, userLng) {
        return puskesmasData
            .map(puskesmas => ({
                ...puskesmas,
                distance: calculateDistance(userLat, userLng, puskesmas.lat, puskesmas.lng)
            }))
            .sort((a, b) => a.distance - b.distance);
    }

    function createMapsUrl(puskesmas) {
        return `https://www.google.com/maps/dir/?api=1&destination=${puskesmas.lat},${puskesmas.lng}`;
    }

    function renderList(items, withDistance) {
        listEl.innerHTML = items.slice(0, 6).map(puskesmas => {
            const distanceText = withDistance
                ? `${puskesmas.distance.toFixed(2)} km dari lokasi Anda`
                : "Aktifkan lokasi untuk melihat jarak";
            const callButton = puskesmas.whatsapp
                ? `<a href="https://wa.me/${puskesmas.whatsapp}" class="call-btn" target="_blank" rel="noopener noreferrer" title="WhatsApp ${puskesmas.name}" aria-label="WhatsApp ${puskesmas.name}"><i class="fab fa-whatsapp"></i></a>`
                : `<span class="call-btn is-disabled" title="Nomor WhatsApp belum tersedia" aria-label="Nomor WhatsApp belum tersedia"><i class="fas fa-phone-slash"></i></span>`;

            return `
                <li>
                    <span>
                        <span class="puskesmas-name">${puskesmas.name}</span>
                        <span class="puskesmas-distance">${distanceText}</span>
                    </span>
                    <span class="puskesmas-actions">
                        ${callButton}
                        <a href="${createMapsUrl(puskesmas)}" class="route-btn" target="_blank" rel="noopener noreferrer" title="Rute ke ${puskesmas.name}" aria-label="Rute ke ${puskesmas.name}"><i class="fas fa-route"></i></a>
                    </span>
                </li>
            `;
        }).join('');
    }

    function locateNearestPuskesmas() {
        if (!navigator.geolocation) {
            statusEl.textContent = "Browser tidak mendukung pelacakan lokasi. Daftar ditampilkan tanpa urutan jarak pengguna.";
            renderList(puskesmasData, false);
            return;
        }

        locateBtn.disabled = true;
        statusEl.textContent = "Sedang meminta izin lokasi dan menghitung jarak puskesmas terdekat...";
        listEl.innerHTML = '<li>Memuat lokasi Anda...</li>';

        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const accuracy = Math.round(position.coords.accuracy || 0);
                const sorted = getSortedPuskesmas(userLat, userLng);

                statusEl.textContent = `Lokasi ditemukan. Akurasi sekitar ${accuracy} meter, daftar diurutkan dari yang paling dekat.`;
                renderList(sorted, true);
                locateBtn.disabled = false;
            },
            error => {
                statusEl.textContent = `Gagal mendapatkan lokasi: ${error.message}. Daftar ditampilkan tanpa jarak pengguna.`;
                renderList(puskesmasData, false);
                locateBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 12000
            }
        );
    }

    renderList(puskesmasData, false);

    callBtn.addEventListener('click', () => togglePanel());
    closeBtn.addEventListener('click', () => togglePanel(false));
    locateBtn.addEventListener('click', locateNearestPuskesmas);

    document.addEventListener('mousedown', event => {
        if (panel.classList.contains('is-open') && !panel.contains(event.target) && !callBtn.contains(event.target)) {
            togglePanel(false);
        }
    });
})();

