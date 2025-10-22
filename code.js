/* 视频控件 */
const videoEl = document.getElementById("video");
if (videoEl) videoEl.controls = true;

/* 打字机 */
(function initTypewriter() {
  function start() {
    const container = document.getElementById("typeout");
    if (!container) return;

    // 收集文案
    let texts = [];
    const ps = container.querySelectorAll("p");
    ps.forEach(p => {
      const t = (p.textContent || "").trim();
      if (t) texts.push(t);
    });
    if (texts.length === 0) {
      texts = [
        "There is no elevator to success",
        "you have to take the stairs.",
        "-- Zig Ziglar"
      ];
    }

    // 创建显示节点
    const tw = document.createElement("p");
    tw.id = "typewriter";
    tw.style.display = "inline-block";
    container.innerHTML = "";
    container.appendChild(tw);


    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      let i = 0;
      tw.textContent = texts[i];
      setInterval(() => {
        i = (i + 1) % texts.length;
        tw.textContent = texts[i];
      }, 2000);
      return;
    }

    // 动画参数
    const speedType = 40;   // 打字速度
    const speedBack = 25;   // 删除速度
    const holdTime   = 1500;// 打完停顿
    let line = 0, idx = 0, deleting = false;

    const tick = () => {
      const full = texts[line];

      if (!deleting) {
        tw.textContent = full.slice(0, idx + 1);
        idx++;
        if (idx === full.length) {
          deleting = true;
          setTimeout(tick, holdTime);
          return;
        }
        setTimeout(tick, speedType);
      } else {
        tw.textContent = full.slice(0, idx - 1);
        idx--;
        if (idx === 0) {
          deleting = false;
          line = (line + 1) % texts.length;
          setTimeout(tick, speedType);
          return;
        }
        setTimeout(tick, speedBack);
      }
    };
    tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

/* 回到顶部（自适配） */
const totop = document.getElementById("totop");
if (totop) {
  window.addEventListener("scroll", () => {
    const y = document.documentElement.scrollTop || document.body.scrollTop;
    totop.style.display = y > 900 ? "block" : "none";
  });
  totop.addEventListener("click", () => {
    const timer = setInterval(() => {
      const y = document.documentElement.scrollTop || document.body.scrollTop;
      window.scrollBy(0, -Math.max(40, Math.round(y / 25)));
      if (y <= 0) clearInterval(timer);
    }, 16);
  });
}

/* 浮动图片交互 */
// function resetFloat() {
//   for (let i = 1; i <= 5; i++) {
//     const el = document.getElementById(`flexpng${i}`);
//     if (!el) continue;
//     el.style.scale = '70%';
//     el.style.zIndex = (i % 2 === 0) ? '2' : '1';
//     el.style.transform = ''; // 清除滚动位移
//   }
// }
// window.flow = function(id){
//   resetFloat();
//   const el = document.getElementById(id);
//   if (el){ el.style.zIndex='3'; el.style.scale='80%'; }
// };

// // 轻微上下浮动
// (function gentleFloat(){
//   const m = window.matchMedia("(max-width: 900px)");
//   let raf = null, t = 0;

//   function step() {
//     if (m.matches) return; // 小屏不做浮动
//     t += 0.01;
//     for (let i=1;i<=5;i++){
//       const el = document.getElementById(`flexpng${i}`);
//       if (el) el.style.transform = `translateY(${8*Math.sin(t + i)}px)`;
//     }
//     raf = requestAnimationFrame(step);
//   }

//   function start(){ if (!m.matches && raf === null) raf = requestAnimationFrame(step); }
//   function stop(){ if (raf !== null) cancelAnimationFrame(raf), raf = null; }

//   m.addEventListener ? m.addEventListener("change", ()=>{ stop(); start(); })
//                      : m.addListener(()=>{ stop(); start(); });

//   start();
// })();

/* ========= 图片墙：用 CSS 变量驱动，互不抢 transform ========= */

/* 点击放大：只切换 .active 类，不直接改 scale/transform */
(function initClick(){
  let activeEl = null;

  window.flow = function(id){
    const el = document.getElementById(id);
    if (!el) return;

    // 再次点击同一张：取消激活（如需“锁定”，把这一段改成 return）
    if (activeEl === el){
      el.classList.remove('active');
      activeEl = null;
      return;
    }

    if (activeEl) activeEl.classList.remove('active');
    el.classList.add('active');
    activeEl = el;
  };

  // 点击画布空白处也可取消激活（可选）
  document.addEventListener('click', (e)=>{
    const g = document.querySelector('.float-gallery');
    if (!g) return;
    if (g.contains(e.target)) return; // 点击在图库内部不处理
    if (activeEl) activeEl.classList.remove('active'), activeEl = null;
  });
})();

/* 漂移动画：只更新 --ty，不直接改 transform；小屏或减少动画时关闭 */
(function gentleFloat(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia && window.matchMedia('(max-width: 900px)');
  let raf = null, t = 0;

  function step() {
    if (reduce || (mobile && mobile.matches)) return;  // 小屏/减少动画：停
    t += 0.015;
    for (let i = 1; i <= 5; i++){
      const el = document.getElementById(`flexpng${i}`);
      if (!el) continue;
      const amp = 6 + i * 0.8;                         // 振幅 6~10px
      el.style.setProperty('--ty', (amp * Math.sin(t + i)).toFixed(1) + 'px');
    }
    raf = requestAnimationFrame(step);
  }

  function start(){ if (!raf) raf = requestAnimationFrame(step); }
  function stop(){ if (raf) cancelAnimationFrame(raf), raf = null; }

  if (mobile && mobile.addEventListener){
    mobile.addEventListener('change', ()=>{ stop(); start(); });
  }
  start();

  // 窗口尺寸变化时，重启一次动画，避免“相位残留”
  window.addEventListener('resize', ()=>{ stop(); start(); });
})();
