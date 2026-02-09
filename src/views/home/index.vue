<template>
    <div class="home">
        <!-- 背景层 -->
        <div class="bg">
            <div class="bg__grid"></div>
            <div class="bg__glow bg__glow--1"></div>
            <div class="bg__glow bg__glow--2"></div>

            <!-- 漂浮粒子：纯 CSS -->
            <div class="particles" aria-hidden="true">
                <span v-for="n in 18" :key="n" class="particle" :style="particleStyle(n)"></span>
            </div>

            <!-- 波浪底部 -->
            <svg class="wave" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
                <path
                    d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,149.3C840,171,960,181,1080,170.7C1200,160,1320,128,1380,112L1440,96L1440,220L1380,220C1320,220,1200,220,1080,220C960,220,840,220,720,220C600,220,480,220,360,220C240,220,120,220,60,220L0,220Z" />
            </svg>
        </div>

        <!-- 内容层 -->
        <div class="container">
            <main class="hero">
                <section class="hero__left">
                    <div class="badge">
                        <span class="badge__icon">⚡</span>
                        <span>极简 · 蓝白 · 轻特效</span>
                    </div>

                    <h1 class="title">
                        欢迎来到
                        <span class="title__accent">小宋博客</span>
                    </h1>

                    <!-- 打字机效果 -->
                    <p class="subtitle">
                        <span class="typewriter">{{ typedText }}</span><span class="caret" aria-hidden="true"></span>
                    </p>

                    <div class="actions">
                        <button class="btn btn--primary" @click="go('/article')">
                            开始阅读
                            <span class="btn__shine" aria-hidden="true"></span>
                        </button>

                        <button class="btn btn--ghost" @click="scrollTo('features')">了解特色</button>
                    </div>

                    <div class="meta">
                        <div class="meta__item">
                            <div class="meta__num">Vue3</div>
                            <div class="meta__label">前端</div>
                        </div>
                        <div class="meta__sep"></div>
                        <div class="meta__item">
                            <div class="meta__num">FastAPI</div>
                            <div class="meta__label">后端</div>
                        </div>
                        <div class="meta__sep"></div>
                        <div class="meta__item">
                            <div class="meta__num">PostgreSQL</div>
                            <div class="meta__label">数据库</div>
                        </div>
                    </div>

                    <div class="hint" @click="scrollTo('features')" role="button" tabindex="0">
                        <span class="hint__mouse" aria-hidden="true"></span>
                        <span class="hint__text">往下看看</span>
                    </div>
                </section>

                <section class="hero__right">
                    <!-- 右侧“玻璃卡片”展示区 -->
                    <div class="card">
                        <div class="card__top">
                            <div class="dot dot--red"></div>
                            <div class="dot dot--yellow"></div>
                            <div class="dot dot--green"></div>
                            <div class="card__title">Today</div>
                        </div>

                        <div class="card__body">
                            <div class="stat">
                                <div class="stat__label">最新文章</div>
                                <div class="stat__value">持续更新中</div>
                            </div>

                            <div class="list">
                                <div class="list__item" v-for="(it, idx) in previewItems" :key="idx">
                                    <div class="list__icon">📝</div>
                                    <div class="list__content">
                                        <div class="list__title">{{ it.title }}</div>
                                        <div class="list__desc">{{ it.desc }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="card__footer">
                                <span class="pill">#工程化</span>
                                <span class="pill">#前后端</span>
                                <span class="pill">#学习笔记</span>
                            </div>
                        </div>
                    </div>

                    <div class="orb orb--1" aria-hidden="true"></div>
                    <div class="orb orb--2" aria-hidden="true"></div>
                </section>
            </main>

            <!-- 特色区 -->
            <section class="features" id="features">
                <div class="features__head">
                    <h2>为什么是小宋博客</h2>
                    <p>简洁不单调：蓝白风格 + 细节动效，让内容更“舒服”。</p>
                </div>

                <div class="features__grid">
                    <article class="fcard">
                        <div class="fcard__icon">🎯</div>
                        <h3>专注内容</h3>
                        <p>阅读体验优先，信息密度高但不拥挤。</p>
                    </article>

                    <article class="fcard">
                        <div class="fcard__icon">🧩</div>
                        <h3>工程化结构</h3>
                        <p>组件拆分清晰，样式可维护，便于你后续扩展。</p>
                    </article>

                    <article class="fcard">
                        <div class="fcard__icon">✨</div>
                        <h3>轻量特效</h3>
                        <p>纯 CSS 动效，不卡顿；暗示交互但不过度抢戏。</p>
                    </article>
                </div>
            </section>

            <footer class="footer">
                <span>© {{ new Date().getFullYear() }} 小宋博客</span>
                <span class="footer__dot">·</span>
                <a class="footer__link" @click.prevent="go('/about')">About</a>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const previewItems = ref([
    { title: "Vue3 + TS 工程化实践", desc: "路由、布局、组件拆分与规范" },
    { title: "FastAPI 文件上传设计", desc: "临时区、提交、并发与校验" },
    { title: "PostgreSQL 表设计", desc: "评论 / 点赞 / 收藏建模思路" },
]);

function go(path: string) {
    router.push(path);
}
function goHome() {
    router.push("/");
}

function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** 打字机效果：轻量实现 */
const lines = [
    "记录学习 · 分享实践 · 追求工程化",
    "Vue3 + TypeScript + SCSS 的真实项目笔记",
    "写给未来的自己，也写给正在努力的你",
];
const typedText = ref("");
let lineIdx = 0;
let charIdx = 0;
let deleting = false;
let timer: number | null = null;

function tick() {
    const current = lines[lineIdx];
    if (!deleting && current) {
        typedText.value = current.slice(0, charIdx + 1);
        charIdx += 1;
        if (charIdx >= current.length) {
            deleting = true;
            // 停留一下再删
            timer = window.setTimeout(tick, 1200);
            return;
        }
    } else {

        if (!current) return;
        typedText.value = current.slice(0, Math.max(0, charIdx - 1));
        charIdx -= 1;
        if (charIdx <= 0) {
            deleting = false;
            lineIdx = (lineIdx + 1) % lines.length;
        }
    }
    timer = window.setTimeout(tick, deleting ? 28 : 48);
}

onMounted(() => {
    tick();
});

onBeforeUnmount(() => {
    if (timer) window.clearTimeout(timer);
});

/** 粒子样式：用 index 做随机分布（可预测、可复现） */
function particleStyle(n: number) {
    // 伪随机（确定性）
    const seed = (n * 9301 + 49297) % 233280;
    const rnd = (seed / 233280) * 1.0;

    const left = Math.round((rnd * 100) % 100);
    const top = Math.round(((rnd * 73) % 60) + 5);
    const size = 3 + (n % 6); // 3~8px
    const delay = (n % 10) * 0.35;
    const dur = 6 + (n % 8);

    return {
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${dur}s`,
    };
}
</script>

<style scoped lang="scss">
/* ====== 可调主题变量（你后续可以抽到 _theme.scss）====== */
$blue-1: #eaf3ff;
$blue-2: #b8dcff;
$blue-3: #4aa3ff;
$blue-4: #1f7ae0;
$blue-5: #0b2f57;

.home {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, $blue-1 0%, #ffffff 60%, #ffffff 100%);
    color: $blue-5;
}

.bg {
    position: absolute;
    inset: 0;
    pointer-events: none;

    &__grid {
        position: absolute;
        inset: 0;
        opacity: 0.55;
        background-image:
            linear-gradient(to right, rgba(31, 122, 224, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(31, 122, 224, 0.08) 1px, transparent 1px);
        background-size: 46px 46px;
        mask-image: radial-gradient(circle at 50% 30%, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    }

    &__glow {
        position: absolute;
        border-radius: 999px;
        filter: blur(42px);
        opacity: 0.85;

        &--1 {
            width: 520px;
            height: 520px;
            left: -140px;
            top: -120px;
            background: radial-gradient(circle, rgba(74, 163, 255, 0.55), rgba(74, 163, 255, 0));
            animation: floatSoft 10s ease-in-out infinite;
        }

        &--2 {
            width: 560px;
            height: 560px;
            right: -180px;
            top: 120px;
            background: radial-gradient(circle, rgba(31, 122, 224, 0.35), rgba(31, 122, 224, 0));
            animation: floatSoft 12s ease-in-out infinite reverse;
        }
    }
}

.particles {
    position: absolute;
    inset: 0;

    .particle {
        position: absolute;
        border-radius: 999px;
        background: rgba(31, 122, 224, 0.22);
        box-shadow: 0 0 16px rgba(31, 122, 224, 0.18);
        animation-name: drift;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }
}

.wave {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 220px;
    fill: rgba(31, 122, 224, 0.08);
}

.container {
    position: relative;
    max-width: 1120px;
    margin: 0 auto;
    padding: 22px 20px 56px;
}

/* 顶部导航 */
.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 8px 2px;
}

.brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    user-select: none;
    cursor: pointer;

    &__dot {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: linear-gradient(135deg, $blue-3, $blue-4);
        box-shadow: 0 8px 24px rgba(31, 122, 224, 0.22);
    }

    &__name {
        font-weight: 700;
        letter-spacing: 0.2px;
    }
}

.nav {
    display: flex;
    align-items: center;
    gap: 10px;

    &__link {
        padding: 8px 10px;
        border-radius: 10px;
        color: rgba(11, 47, 87, 0.78);
        text-decoration: none;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;

        &:hover {
            background: rgba(31, 122, 224, 0.08);
            transform: translateY(-1px);
        }
    }

    &__cta {
        padding: 9px 12px;
        border-radius: 12px;
        background: rgba(31, 122, 224, 0.12);
        color: $blue-5;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.2s ease, background 0.2s ease;

        &:hover {
            background: rgba(31, 122, 224, 0.18);
            transform: translateY(-1px);
        }
    }
}

/* Hero */
.hero {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 26px;
    padding: 54px 0 34px;
    align-items: center;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
        padding-top: 34px;
    }
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(31, 122, 224, 0.14);
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(11, 47, 87, 0.06);

    &__icon {
        font-size: 14px;
    }
}

.title {
    margin: 14px 0 10px;
    font-size: 44px;
    line-height: 1.1;
    letter-spacing: -0.4px;

    @media (max-width: 520px) {
        font-size: 36px;
    }

    &__accent {
        background: linear-gradient(135deg, $blue-4, $blue-3);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
}

.subtitle {
    margin: 0 0 22px;
    color: rgba(11, 47, 87, 0.75);
    font-size: 16px;
    line-height: 1.7;
    min-height: 28px;

    .typewriter {
        font-weight: 600;
    }

    .caret {
        display: inline-block;
        width: 10px;
        height: 18px;
        margin-left: 6px;
        transform: translateY(3px);
        border-radius: 3px;
        background: rgba(31, 122, 224, 0.6);
        animation: blink 1s steps(2, end) infinite;
    }
}

.actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    position: relative;
    border: none;
    cursor: pointer;
    border-radius: 14px;
    padding: 12px 16px;
    font-weight: 700;
    letter-spacing: 0.2px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

    &:active {
        transform: translateY(0px) scale(0.99);
    }

    &--primary {
        color: #fff;
        background: linear-gradient(135deg, $blue-4, $blue-3);
        box-shadow: 0 16px 36px rgba(31, 122, 224, 0.25);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 18px 44px rgba(31, 122, 224, 0.32);
        }

        .btn__shine {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(120deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.32) 38%,
                    rgba(255, 255, 255, 0) 70%);
            transform: translateX(-120%);
            transition: transform 0.8s ease;
            pointer-events: none;
        }

        &:hover .btn__shine {
            transform: translateX(120%);
        }
    }

    &--ghost {
        background: rgba(255, 255, 255, 0.72);
        color: $blue-5;
        border: 1px solid rgba(31, 122, 224, 0.18);
        backdrop-filter: blur(10px);

        &:hover {
            transform: translateY(-1px);
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 14px 34px rgba(11, 47, 87, 0.08);
        }
    }
}

.meta {
    margin-top: 22px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;

    &__item {
        display: grid;
        gap: 2px;
    }

    &__num {
        font-weight: 800;
        letter-spacing: 0.2px;
    }

    &__label {
        font-size: 12px;
        color: rgba(11, 47, 87, 0.62);
    }

    &__sep {
        width: 1px;
        height: 26px;
        background: rgba(31, 122, 224, 0.16);
    }
}

.hint {
    margin-top: 26px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: rgba(11, 47, 87, 0.7);
    cursor: pointer;
    user-select: none;

    &__mouse {
        width: 18px;
        height: 28px;
        border-radius: 999px;
        border: 2px solid rgba(31, 122, 224, 0.28);
        position: relative;

        &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 6px;
            width: 4px;
            height: 4px;
            border-radius: 999px;
            background: rgba(31, 122, 224, 0.65);
            transform: translateX(-50%);
            animation: wheel 1.5s ease-in-out infinite;
        }
    }

    &__text {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.2px;
    }
}

/* 右侧卡片 */
.hero__right {
    position: relative;
    display: flex;
    justify-content: center;

    @media (max-width: 980px) {
        justify-content: flex-start;
    }
}

.card {
    width: min(460px, 100%);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid rgba(31, 122, 224, 0.14);
    backdrop-filter: blur(14px);
    box-shadow: 0 20px 60px rgba(11, 47, 87, 0.12);
    overflow: hidden;
    transform: translateY(0);
    animation: floatCard 7s ease-in-out infinite;

    &__top {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(31, 122, 224, 0.12);
    }

    &__title {
        margin-left: 8px;
        font-weight: 800;
        color: rgba(11, 47, 87, 0.74);
        font-size: 13px;
    }

    &__body {
        padding: 14px;
    }

    &__footer {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
    }
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;

    &--red {
        background: #ff6b6b;
    }

    &--yellow {
        background: #ffd166;
    }

    &--green {
        background: #06d6a0;
    }
}

.stat {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(31, 122, 224, 0.08);
    border: 1px solid rgba(31, 122, 224, 0.12);

    &__label {
        font-size: 13px;
        color: rgba(11, 47, 87, 0.65);
        font-weight: 700;
    }

    &__value {
        font-weight: 900;
        color: rgba(11, 47, 87, 0.88);
    }
}

.list {
    margin-top: 12px;
    display: grid;
    gap: 10px;

    &__item {
        display: flex;
        gap: 10px;
        padding: 10px 10px;
        border-radius: 14px;
        border: 1px solid rgba(31, 122, 224, 0.12);
        background: rgba(255, 255, 255, 0.6);
        transition: transform 0.18s ease, box-shadow 0.18s ease;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 14px 34px rgba(11, 47, 87, 0.08);
        }
    }

    &__icon {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: rgba(31, 122, 224, 0.1);
    }

    &__title {
        font-weight: 900;
        font-size: 14px;
    }

    &__desc {
        margin-top: 2px;
        font-size: 12px;
        color: rgba(11, 47, 87, 0.62);
    }
}

.pill {
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(31, 122, 224, 0.08);
    border: 1px solid rgba(31, 122, 224, 0.12);
    font-size: 12px;
    font-weight: 800;
    color: rgba(11, 47, 87, 0.72);
}

.orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(28px);
    opacity: 0.8;

    &--1 {
        width: 120px;
        height: 120px;
        left: -26px;
        bottom: 30px;
        background: radial-gradient(circle, rgba(74, 163, 255, 0.55), rgba(74, 163, 255, 0));
        animation: floatSoft 9s ease-in-out infinite;
    }

    &--2 {
        width: 140px;
        height: 140px;
        right: -36px;
        top: 40px;
        background: radial-gradient(circle, rgba(31, 122, 224, 0.35), rgba(31, 122, 224, 0));
        animation: floatSoft 11s ease-in-out infinite reverse;
    }
}

/* 特色区 */
.features {
    padding: 34px 0 26px;

    &__head {
        max-width: 680px;

        h2 {
            margin: 0;
            font-size: 22px;
            letter-spacing: -0.2px;
        }

        p {
            margin: 8px 0 0;
            color: rgba(11, 47, 87, 0.7);
            line-height: 1.7;
        }
    }

    &__grid {
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;

        @media (max-width: 980px) {
            grid-template-columns: 1fr;
        }
    }
}

.fcard {
    padding: 14px 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(31, 122, 224, 0.14);
    box-shadow: 0 14px 40px rgba(11, 47, 87, 0.06);
    transition: transform 0.18s ease, box-shadow 0.18s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 52px rgba(11, 47, 87, 0.1);
    }

    &__icon {
        width: 44px;
        height: 44px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        background: rgba(31, 122, 224, 0.1);
        font-size: 18px;
    }

    h3 {
        margin: 10px 0 6px;
        font-size: 16px;
    }

    p {
        margin: 0;
        color: rgba(11, 47, 87, 0.68);
        line-height: 1.7;
        font-size: 13px;
    }
}

.footer {
    margin-top: 26px;
    padding: 18px 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: rgba(11, 47, 87, 0.6);

    &__dot {
        opacity: 0.6;
    }

    &__link {
        cursor: pointer;
        text-decoration: none;
        color: rgba(11, 47, 87, 0.72);
        font-weight: 800;

        &:hover {
            text-decoration: underline;
        }
    }
}

/* 动画 */
@keyframes drift {
    0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0.55;
    }

    50% {
        transform: translateY(-18px) translateX(10px) scale(1.12);
        opacity: 0.85;
    }

    100% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0.55;
    }
}

@keyframes floatSoft {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(14px);
    }
}

@keyframes floatCard {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes blink {

    0%,
    49% {
        opacity: 1;
    }

    50%,
    100% {
        opacity: 0;
    }
}

@keyframes wheel {
    0% {
        transform: translate(-50%, 0);
        opacity: 0.85;
    }

    60% {
        transform: translate(-50%, 10px);
        opacity: 0.45;
    }

    100% {
        transform: translate(-50%, 0);
        opacity: 0.85;
    }
}

.main-content {
    padding-top: 0
}
</style>
