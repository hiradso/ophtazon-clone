<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'fa' ? 'rtl' : 'ltr' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            $siteSettings = \App\Models\Setting::current();
            $currentLocale = app()->getLocale();
            $slogan = $currentLocale === 'fr'
                ? 'Le marché de confiance pour le matériel ophtalmique'
                : ($currentLocale === 'fa'
                    ? 'بازار قابل‌اعتماد تجهیزات چشم‌پزشکی'
                    : 'Trusted marketplace for ophthalmic equipment');

            // نگاشت اسم انتخابی ادمین (که در دیتابیس ذخیره شده) به اسم واقعی
            // family که پکیج‌های fontsource آن را ثبت می‌کنند
            $latinFontMap = [
                'Geist' => '"Geist Variable"',
                'Inter' => '"Inter Variable"',
                'Roboto' => '"Roboto"',
                'Poppins' => '"Poppins"',
                'Nunito Sans' => '"Nunito Sans Variable"',
                'Playfair Display' => '"Playfair Display Variable"',
            ];
            $persianFontMap = [
                'Vazirmatn' => '"Vazirmatn Variable"',
                'Noto Sans Arabic' => '"Noto Sans Arabic Variable"',
                'Rubik' => '"Rubik Variable"',
                'Noto Naskh Arabic' => '"Noto Naskh Arabic"',
            ];

            $latinFontFamily = $latinFontMap[$siteSettings->font_latin] ?? $latinFontMap['Geist'];
            $persianFontFamily = $persianFontMap[$siteSettings->font_persian] ?? $persianFontMap['Vazirmatn'];
        @endphp

        @if ($siteSettings->logo)
            <link rel="icon" href="{{ asset('storage/' . $siteSettings->logo) }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!--
            فونت‌های انتخابی ادمین — هر دو همیشه در یک font-family stack واحد
            اعمال می‌شوند (نه فقط وقتی زبان صفحه fa باشد)، چون مرورگر به‌صورت
            خودکار برای هر حرف، اولین فونتی که واقعاً آن گلیف را دارد انتخاب
            می‌کند: حروف لاتین → فونت لاتین، حروف فارسی/عربی → Vazirmatn.
            این یعنی متن فارسی همیشه Vazirmatn است، حتی وقتی زبان فعلی صفحه
            انگلیسی/فرانسه باشد (مثلاً گزینه‌ی «فارسی» داخل دراپ‌داون انتخاب زبان).
        -->
        <style>
            html,
            html body,
            html * {
                font-family: {!! $latinFontFamily !!}, {!! $persianFontFamily !!}, sans-serif !important;
            }
        </style>

        <!-- استایل اسپلش اسکرین اولیه — عمداً inline، تا قبل از لود باندل CSS اصلی هم نمایش داده شود -->
        <style>
            #initial-loader {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1.5rem;
                background: linear-gradient(135deg, rgba(13, 110, 100, 0.85), rgba(15, 60, 92, 0.85));
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                transition: opacity 0.4s ease, visibility 0.4s ease;
            }
            #initial-loader.fade-out {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            /* نماد برداری — همیشه فوری و بدون هیچ درخواست شبکه رندر می‌شود */
            #initial-loader .loader-mark {
                position: relative;
                width: 64px;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #initial-loader .loader-mark::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 9999px;
                background: rgba(255, 255, 255, 0.18);
                animation: loader-pulse 1.8s ease-in-out infinite;
            }
            #initial-loader .loader-mark svg {
                position: relative;
                width: 30px;
                height: 30px;
                color: #ffffff;
            }
            @keyframes loader-pulse {
                0%, 100% { transform: scale(0.85); opacity: 0.55; }
                50% { transform: scale(1.15); opacity: 1; }
            }

            #initial-loader .loader-text {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.4rem;
            }
            #initial-loader .loader-name {
                font-family: sans-serif;
                font-weight: 600;
                font-size: 1.25rem;
                color: #ffffff;
                opacity: 0;
                animation: loader-fade-in 0.5s ease forwards 0.15s;
            }
            #initial-loader .loader-slogan {
                font-family: sans-serif;
                font-size: 0.8125rem;
                color: rgba(255, 255, 255, 0.78);
                text-align: center;
                max-width: 20rem;
                padding: 0 1rem;
                opacity: 0;
                animation: loader-fade-in 0.5s ease forwards 0.3s;
            }
            @keyframes loader-fade-in {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* نوار پیشرفت نامشخص (Indeterminate) */
            #initial-loader .loader-bar-track {
                width: 140px;
                height: 3px;
                border-radius: 9999px;
                background: rgba(255, 255, 255, 0.2);
                overflow: hidden;
            }
            #initial-loader .loader-bar-fill {
                height: 100%;
                width: 40%;
                border-radius: 9999px;
                background: #ffffff;
                animation: loader-bar-slide 1.2s ease-in-out infinite;
            }
            @keyframes loader-bar-slide {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(350%); }
            }
        </style>

        {{-- Canonical و Hreflang — مستقیم توسط Blade/PHP ساخته می‌شوند، بدون وابستگی به Inertia Head --}}
        @php
            $rawPath = request()->path();
            $pathSegments = explode('/', $rawPath);
            $firstSegment = $pathSegments[0] ?? '';
            $isLocalizedRoute = in_array($firstSegment, ['en', 'fr', 'fa'], true);
            $restOfPath = $isLocalizedRoute ? implode('/', array_slice($pathSegments, 1)) : '';
        @endphp
        @if ($isLocalizedRoute)
            <link rel="canonical" href="{{ url('/' . $currentLocale . ($restOfPath ? '/' . $restOfPath : '')) }}" />
            @foreach (['en', 'fr', 'fa'] as $altLocale)
                <link rel="alternate" hreflang="{{ $altLocale }}" href="{{ url('/' . $altLocale . ($restOfPath ? '/' . $restOfPath : '')) }}" />
            @endforeach
            <link rel="alternate" hreflang="x-default" href="{{ url('/en' . ($restOfPath ? '/' . $restOfPath : '')) }}" />
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <div id="initial-loader">
            <div class="loader-mark">
                <!-- آیکون برداری لنز/چشم — بدون هیچ درخواست شبکه، رندر فوری -->
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C4.5 6.5 8 4 12 4C16 4 19.5 6.5 22 12C19.5 17.5 16 20 12 20C8 20 4.5 17.5 2 12Z" stroke="currentColor" stroke-width="1.8"/>
                    <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/>
                </svg>
            </div>

            <div class="loader-text">
                <div class="loader-name">{{ $siteSettings->site_name ?? 'Ophtazon' }}</div>
                <div class="loader-slogan">{{ $slogan }}</div>
            </div>

            <div class="loader-bar-track">
                <div class="loader-bar-fill"></div>
            </div>
        </div>

        @inertia

        <script>
            (function () {
                var loader = document.getElementById('initial-loader');
                if (!loader) return;

                var appRoot = document.getElementById('app');
                var domReady = false;
                var pageLoaded = false;

                function hideLoader() {
                    if (!domReady || !pageLoaded) return;

                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            loader.classList.add('fade-out');
                            setTimeout(function () {
                                if (loader.parentNode) {
                                    loader.parentNode.removeChild(loader);
                                }
                            }, 450);
                        });
                    });
                }

                if (appRoot && appRoot.children.length > 0) {
                    domReady = true;
                } else {
                    var observer = new MutationObserver(function () {
                        if (appRoot && appRoot.children.length > 0) {
                            domReady = true;
                            observer.disconnect();
                            hideLoader();
                        }
                    });
                    if (appRoot) {
                        observer.observe(appRoot, { childList: true });
                    }
                }

                if (document.readyState === 'complete') {
                    pageLoaded = true;
                } else {
                    window.addEventListener('load', function () {
                        pageLoaded = true;
                        hideLoader();
                    });
                }

                hideLoader();

                setTimeout(function () {
                    domReady = true;
                    pageLoaded = true;
                    hideLoader();
                }, 12000);
            })();
        </script>
    </body>
</html>
