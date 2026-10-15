/* Wishora V22 — "Open Your Birthday Gift": the 13-page Birthday Universe Adventure */
(function(){
  const SLUG='wishora-birthday-gift';
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const g=(d,k,def)=>(d&&d[k]&&String(d[k]).trim())||def;
  const R=(a,b)=>a+Math.random()*(b-a);
  const FAST=()=>!!window.WISHORA_BD_FAST;

  const DEF={
    name:'Birthday Star',
    greet:'Hey, Birthday Star… ⭐',
    sub:'Your birthday surprise is ready. But first, you must enter your own little universe.',
    m1:'Your birthday adventure begins now! 🎉',
    m2:'Collect 5 magical stars to unlock your ultimate birthday surprise.',
    b:['Funny fact: you are officially one year more awesome than last year! 😂','You have the kind of smile that makes everyone’s day better. 🥰','Why did the birthday cake go to the doctor? It was feeling a little “layered” down! 🤣','You found a hidden star! The universe says: you are one too. ⭐','Mystery message: someone is very, very lucky to have you. 🎁'],
    bl:['Funny birthday fact 😂','Cute compliment 🥰','Birthday joke 🤣','Hidden star ⭐','Mystery message 🎁'],
    gm:['A big warm hug, delivered instantly! 🤗','A coupon for one free “you pick the movie” night! 🎬','A tiny bag of pure happiness. Open daily! 💛','A super-secret promise: more adventures are coming! 🚀'],
    ge:['🤗','🎬','💛','🚀'],
    cave:'Knock knock! Who’s there? Cake. Cake who? Cake a deep breath, it’s party time! 😂',
    island:'Remember this one? It is one of my favourite memories with you. 📸',
    castle:'You deserve a whole kingdom of happiness today and every day. 👑',
    chest:'You’ve completed the challenges. Your biggest surprise is finally here…',
    galFinal:'One birthday. Countless reasons to smile. And so many more adventures waiting ahead. ❤️',
    letter:'On your birthday I just want you to know how much you matter.\nYou make ordinary days feel like adventures.\nThank you for being exactly who you are.\nHere’s to another year of laughter, love and magic.',
    close1:'Happy Birthday, Superstar! 🎂✨',
    close2:'May your next chapter be even more amazing than the last.'
  };

  /* ---------------- builder fields ---------------- */
  function groups(){
    const f=(id,label,ph,max,ta)=>({id,label,placeholder:ph,max:max||160,type:ta?'textarea':undefined,full:ta?true:undefined});
    const G=(title,copy,defs)=>({title,copy,defs});
    return[
      G('Your birthday star','Who is this adventure for? Their name appears on the celebration and on the envelope.',[f('recipient','Birthday person’s name',DEF.name,60),f('sender','Your name (for the saved card)','Someone who loves you',60)]),
      G('Page 1 · Birthday portal','The mysterious glowing entry.',[f('f_greet','Greeting',DEF.greet,80),f('f_sub','Subtitle',DEF.sub,200,1)]),
      G('Page 2 · Mission unlocked','The assistant types these lines.',[f('f_m1','Mission line',DEF.m1,100),f('f_m2','Challenge line',DEF.m2,160,1)]),
      G('Page 3 · Balloon pop challenge','Five balloons, five surprises.',DEF.b.map((v,i)=>f(`f_b${i+1}`,DEF.bl[i].replace(/ ?\S+$/,''),v,200,1))),
      G('Page 4 · Mystery gift boxes','Four boxes. The guest opens one. Each holds a message and a virtual gift.',[...DEF.gm.map((v,i)=>f(`f_gm${i+1}`,`Gift box ${i+1} message`,v,160,1)),...DEF.ge.map((v,i)=>f(`f_ge${i+1}`,`Gift box ${i+1} emoji`,v,4))]),
      G('Page 5 · Design your cake','The guest designs their own cake: flavour, frosting, decorations and candles. Nothing to fill in.',[]),
      G('Page 6 · The secret wish','A night sky and a wish that travels to the stars. Nothing to fill in.',[]),
      G('Page 7 · Birthday mini-game','Catch the Cupcakes, Dodge the Presents or Emoji Rush. Nothing to fill in.',[]),
      G('Page 8 · Hidden treasure map','Three locations. The Memory Island shows your first photo.',[f('f_cave','The Laughing Cave 😂 (funny message)',DEF.cave,200,1),f('f_island','The Memory Island 📸 (memory message)',DEF.island,200,1),f('f_castle','The Treasure Castle 👑 (special message)',DEF.castle,200,1)]),
      G('Page 9 · Treasure chest','Tap the magic symbols in the right order.',[f('f_chest','Chest text',DEF.chest,160,1)]),
      G('Page 10 · Light the candles','Uses the candles from the cake they designed. Nothing to fill in.',[]),
      G('Page 11 · Ultimate celebration','Fireworks, confetti, final score and the 5 stars. Background music starts here if you add a song in the Media tab. Nothing to fill in.',[]),
      G('Page 12 · Highlights gallery','Add 4–8 photos in the Media tab. Each gets a caption and a date.',[...[...Array(8)].flatMap((_,i)=>[f(`f_gc${i+1}`,`Photo ${i+1} caption`,'A moment worth smiling about',70),f(`f_gd${i+1}`,`Photo ${i+1} date`,'12 October',40)]),f('f_gfinal','Closing text',DEF.galFinal,200,1)]),
      G('Page 13 · Final birthday letter','One line per row. Each line is typed out softly.',[f('f_letter','Letter',DEF.letter,1500,1),f('f_close1','Closing line 1',DEF.close1,80),f('f_close2','Closing line 2',DEF.close2,120)])
    ];
  }

  /* ---------------- cake data ---------------- */
  const FLAV=[{n:'Chocolate',c:'#6b3e26',e:'🍫'},{n:'Vanilla',c:'#f3dfb6',e:'🍦'},{n:'Strawberry',c:'#f4a6b8',e:'🍓'},{n:'Red velvet',c:'#b0233a',e:'❤️'}];
  const FROST=[{n:'Pink',c:'#ff9bc2'},{n:'Snow',c:'#ffffff'},{n:'Mint',c:'#9be8c8'},{n:'Sky',c:'#8fd0ff'},{n:'Gold',c:'#ffd36e'},{n:'Lilac',c:'#c9a7ff'}];
  const DECO=[{k:'sprinkles',n:'Sprinkles',e:'🍬'},{k:'cherries',n:'Cherries',e:'🍒'},{k:'stars',n:'Stars',e:'⭐'},{k:'flowers',n:'Flowers',e:'🌸'}];
  const CAND=[1,3,5,7];
  function cakeSVG(cfg,o){
    o=o||{};const fl=FLAV[cfg.flavor].c,fr=FROST[cfg.frost].c,sd=i=>((i*9301+49297)%233280)/233280;let deco='';
    if(cfg.decor.includes('sprinkles'))for(let i=0;i<34;i++){const x=40+sd(i+1)*160,y=104+sd(i+50)*96,r=sd(i+7)*180;deco+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="7" height="2.6" rx="1.3" fill="${['#ff5b8a','#ffd36e','#6ec6f5','#7be0a0','#fff'][i%5]}" transform="rotate(${r.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`}
    if(cfg.decor.includes('cherries'))[78,120,162].forEach(x=>{deco+=`<g><path d="M${x} 94q4-12 10-14" stroke="#3b7a3b" stroke-width="2" fill="none"/><circle cx="${x}" cy="97" r="7" fill="#d81b3c"/><circle cx="${x-2}" cy="95" r="2" fill="#fff" opacity=".7"/></g>`});
    if(cfg.decor.includes('stars'))[[50,170],[190,168],[120,152],[70,128],[170,130]].forEach(([x,y])=>{deco+=`<path d="M${x} ${y-7}l2 5 5 .5-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3 5-.5z" fill="#ffd36e" stroke="#e6a900" stroke-width=".6"/>`});
    if(cfg.decor.includes('flowers'))[[52,196],[100,201],[148,201],[196,196],[92,128],[150,128]].forEach(([x,y],k)=>{const c=['#ff7ab8','#fff','#ffc36e'][k%3];deco+=`<g>${[0,72,144,216,288].map(a=>`<circle cx="${(x+Math.cos(a*Math.PI/180)*5).toFixed(1)}" cy="${(y+Math.sin(a*Math.PI/180)*5).toFixed(1)}" r="3.6" fill="${c}"/>`).join('')}<circle cx="${x}" cy="${y}" r="2.6" fill="#ffd36e"/></g>`});
    const n=cfg.candles,xs=[...Array(n)].map((_,i)=>n===1?120:80+i*(80/(n-1)));
    const drips=(y0,xsd)=>xsd.map((x,i)=>`<rect x="${x-6}" y="${y0}" width="12" height="${14+sd(i+3)*12}" rx="6" fill="${fr}"/>`).join('');
    const cand=xs.map((x,i)=>`<g class="candle${o.lit&&o.lit[i]?' lit':''}" data-i="${i}"><rect x="${x-3.5}" y="62" width="7" height="30" rx="2" fill="${['#ff5b8a','#6ec6f5','#ffd36e','#7be0a0'][i%4]}"/><rect x="${x-3.5}" y="70" width="7" height="3" fill="rgba(255,255,255,.7)"/><rect x="${x-3.5}" y="80" width="7" height="3" fill="rgba(255,255,255,.7)"/><g class="fl"><ellipse cx="${x}" cy="52" rx="5" ry="9" fill="#ffb347"/><ellipse cx="${x}" cy="54" rx="2.6" ry="5.5" fill="#fff3b0"/></g><rect class="hit" x="${x-13}" y="34" width="26" height="62" fill="transparent"/></g>`).join('');
    return `<svg class="bj-cake" viewBox="0 0 240 230"><defs><linearGradient id="bjplate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d9c9e6"/></linearGradient></defs><ellipse cx="120" cy="214" rx="104" ry="12" fill="url(#bjplate)"/><rect x="30" y="146" width="180" height="66" rx="12" fill="${fl}"/><rect x="60" y="100" width="120" height="50" rx="10" fill="${fl}"/><rect x="26" y="138" width="188" height="20" rx="10" fill="${fr}"/>${drips(150,[44,76,108,140,172,198])}<rect x="56" y="92" width="128" height="18" rx="9" fill="${fr}"/>${drips(104,[72,100,128,156])}${deco}${cand}</svg>`;
  }

  const MASCOT=`<svg class="bj-mascot" viewBox="0 0 140 150"><defs><radialGradient id="bjm" cx="40%" cy="35%"><stop offset="0" stop-color="#ffc0e0"/><stop offset="1" stop-color="#ff5fa8"/></radialGradient></defs><ellipse cx="70" cy="142" rx="32" ry="6" fill="rgba(0,0,0,.25)"/><g class="mc-arm l"><rect x="10" y="80" width="32" height="12" rx="6" fill="#ff7ab8"/></g><g class="mc-arm r"><rect x="98" y="80" width="32" height="12" rx="6" fill="#ff7ab8"/></g><circle cx="70" cy="90" r="44" fill="url(#bjm)"/><g class="mc-eyes"><ellipse cx="55" cy="86" rx="6" ry="8" fill="#2b1055"/><ellipse cx="85" cy="86" rx="6" ry="8" fill="#2b1055"/><circle cx="57" cy="83" r="2" fill="#fff"/><circle cx="87" cy="83" r="2" fill="#fff"/></g><path d="M56 102q14 14 28 0" stroke="#2b1055" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="44" cy="100" r="6" fill="#ff8fb1" opacity=".7"/><circle cx="96" cy="100" r="6" fill="#ff8fb1" opacity=".7"/><path d="M46 52L70 8l24 44z" fill="#7b5cff"/><path d="M53 42h34M59 30h22" stroke="#ffd36e" stroke-width="5"/><circle cx="70" cy="8" r="8" fill="#ffd36e"/></svg>`;

  function render(d,p,app){
    const name=g(d,'recipient',DEF.name),sender=g(d,'sender','');
    const photos=(Array.isArray(d.photos)?d.photos:[]).map(x=>typeof x==='string'?x:(x&&(x.src||x.data))||'').filter(Boolean).slice(0,8);
    app.innerHTML=`<div class="fl bj" data-card="none" data-btn="pill" data-tr="fade" data-align="center"><div class="fl-fx"></div><div class="fl-bar"><button class="fl-back">← Back</button><div class="bj-hud"></div><button class="bj-sfx" title="Sound effects on/off" aria-label="Toggle sound effects">🔔</button><span class="fl-count"></span></div><div class="fl-stage"></div><div class="fl-dots"></div><div class="lj-flash"></div><div class="lj-bloom"></div></div>`;
    const root=app.querySelector('.bj'),stage=root.querySelector('.fl-stage');
    const V=(window.LJVFX&&window.LJVFX.create(root))||new Proxy({},{get:()=>()=>{}});root.__vfx=V;
    const bgm=window.WISHORA_BGM?window.WISHORA_BGM.attach(root,d,{manual:true}):null;
    const ST={stars:0,score:0,game:'',cake:{flavor:0,frost:0,decor:[],candles:5}};
    root.__bj=ST;
    let idx=0,timers=[],raf=0,curMode='',mic=null;const awarded=new Set();
    const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t};
    const clear=()=>{timers.forEach(t=>{clearTimeout(t);clearInterval(t)});timers=[];cancelAnimationFrame(raf);if(mic){try{mic.stream.getTracks().forEach(t=>t.stop());mic.ctx.close()}catch(e){}mic=null}};

    /* ---- sound effects (synthesised, can be switched off) ---- */
    let ac=null,sfxOn=true;
    const sfx=k=>{if(!sfxOn)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const t=ac.currentTime;
      const tone=(f,dur,type,v,dl,f2)=>{const o=ac.createOscillator(),gn=ac.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t+dl);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dl+dur);gn.gain.setValueAtTime(0,t+dl);gn.gain.linearRampToValueAtTime(v||.12,t+dl+.012);gn.gain.exponentialRampToValueAtTime(.0001,t+dl+dur);o.connect(gn);gn.connect(ac.destination);o.start(t+dl);o.stop(t+dl+dur+.03)};
      if(k==='pop'){const b=ac.createBuffer(1,Math.floor(ac.sampleRate*.12),ac.sampleRate),da=b.getChannelData(0);for(let i=0;i<da.length;i++)da[i]=(Math.random()*2-1)*Math.pow(1-i/da.length,2);const s=ac.createBufferSource(),gn=ac.createGain();s.buffer=b;gn.gain.value=.35;s.connect(gn);gn.connect(ac.destination);s.start(t);tone(520,.09,'triangle',.1,0,180)}
      else if(k==='chime'){[523,659,784].forEach((f,i)=>tone(f,.35,'sine',.1,i*.09))}
      else if(k==='star'){tone(880,.25,'sine',.1,0);tone(1320,.35,'sine',.09,.1);tone(1760,.4,'sine',.07,.2)}
      else if(k==='whoosh'){tone(160,.6,'sawtooth',.05,0,900)}
      else if(k==='err'){tone(170,.18,'square',.07,0,110)}
      else if(k==='win'){[523,659,784,1046].forEach((f,i)=>tone(f,.45,'triangle',.11,i*.12))}
      else if(k==='tick'){tone(700,.05,'square',.04,0)}
    }catch(e){}};
    root.querySelector('.bj-sfx').onclick=()=>{sfxOn=!sfxOn;root.querySelector('.bj-sfx').textContent=sfxOn?'🔔':'🔕';if(sfxOn)sfx('tick')};

    /* ---- helpers ---- */
    const mid=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
    const at=e=>{const el=e&&e.currentTarget;const[x,y]=el&&el.getBoundingClientRect?mid(el):[innerWidth/2,innerHeight/2];return[e&&e.clientX?e.clientX:x,e&&e.clientY?e.clientY:y]};
    const boom=(e,em,n)=>{const[x,y]=at(e);V.sparks(x,y,24,['#ffd36e','#ff9bc2','#ffffff','#9be7ff']);V.ring(x,y,'rgba(255,170,220,.9)',16,3);V.emojis(x,y,em||['⭐','✨','💖'],n||5)};
    const next=()=>{idx++;show()};
    const glint=(el,i)=>{const t=el.firstChild;if(!t)return;try{const r=document.createRange();r.setStart(t,Math.min(t.length,i));r.collapse(true);const c=r.getClientRects()[0];if(c)V.glint(c.right,c.top+c.height/2)}catch(e){}};
    const typeInto=(el,text,speed,done)=>{el.textContent='';el.classList.add('lj-caret');let i=0;const iv=setInterval(()=>{el.textContent=text.slice(0,++i);if(i%2===0)glint(el,i);if(i>=text.length){clearInterval(iv);el.classList.remove('lj-caret');done&&done()}},FAST()?8:(speed||38));timers.push(iv)};
    const head=(t,k)=>`${k?`<p class="fl-kick">${esc(k)}</p>`:''}${t?`<h2 class="fl-title">${esc(t)}</h2>`:''}`;
    const cont=l=>`<button class="fl-next bj-cont fl-hide">${l||'Continue →'}</button>`;
    const showCont=()=>{const b=stage.querySelector('.bj-cont');if(b){b.classList.remove('fl-hide');b.classList.add('fl-in');b.onclick=e=>{boom(e);sfx('chime');next()}}};
    const hud=()=>{root.querySelector('.bj-hud').innerHTML=[0,1,2,3,4].map(i=>`<span class="bj-hs${i<ST.stars?' on':''}">⭐</span>`).join('')+`<b>${ST.stars}/5</b>`};
    const award=(from,key)=>{if(key){if(awarded.has(key))return;awarded.add(key)}
      const hs=root.querySelectorAll('.bj-hs')[Math.min(ST.stars,4)],[x0,y0]=from?mid(from):[innerWidth/2,innerHeight/2];
      const el=document.createElement('div');el.className='bj-flystar';el.textContent='⭐';el.style.left=x0+'px';el.style.top=y0+'px';document.body.appendChild(el);
      V.flare(x0,y0,'rgba(255,230,150,.95)');V.sparks(x0,y0,40,['#ffd36e','#fff','#ffb347']);sfx('star');
      const[x1,y1]=hs?mid(hs):[innerWidth/2,30];
      const an=el.animate([{transform:'translate(-50%,-50%) scale(2.4)',opacity:1},{transform:`translate(${x1-x0-0}px,${y1-y0}px) translate(-50%,-50%) scale(.9)`,opacity:1}],{duration:900,easing:'cubic-bezier(.5,0,.2,1)'});
      an.onfinish=()=>{el.remove();ST.stars++;hud();V.ring(x1,y1,'rgba(255,220,120,.95)',14,4);V.sparks(x1,y1,26,['#ffd36e','#fff']);const h=root.querySelector('.bj-hud');h.classList.remove('pulse');void h.offsetWidth;h.classList.add('pulse')};
    };

    const S=[
      /* 1 · Birthday portal */
      function portal(){
        stage.innerHTML=`<div class="bj-portal"><i class="r1"></i><i class="r2"></i><i class="r3"></i><div class="core"></div></div><h2 class="fl-title bj-greet"></h2><p class="bj-sub fl-hide">${esc(g(d,'f_sub',DEF.sub))}</p><button class="fl-next bj-enter fl-hide">ENTER MY WORLD ✨</button>`;
        const por=stage.querySelector('.bj-portal');V.follow(por);
        const iv=setInterval(()=>{const[x,y]=mid(por);V.vortex(x,y,5)},300);timers.push(iv);
        typeInto(stage.querySelector('.bj-greet'),g(d,'f_greet',DEF.greet),55,()=>{stage.querySelector('.bj-sub').classList.remove('fl-hide');stage.querySelector('.bj-sub').classList.add('fl-in');later(()=>{const b=stage.querySelector('.bj-enter');b.classList.remove('fl-hide');b.classList.add('fl-in')},700)});
        stage.querySelector('.bj-enter').onclick=e=>{
          const b=e.currentTarget;b.onclick=null;por.classList.add('open');sfx('whoosh');const[x,y]=mid(por);
          V.slowmo(900,.35);V.flare(x,y,'rgba(200,170,255,.95)');V.ring(x,y,'rgba(190,140,255,.9)',40,8);setTimeout(()=>V.ring(x,y,'rgba(255,170,230,.9)',30,6),200);V.vortex(x,y,60);V.sparks(x,y,80,['#ffd36e','#c9a7ff','#ff9bc2','#fff']);
          V.fly(['🎈','⭐','🎈','✨'],26);setTimeout(()=>V.fly(['🎈','⭐'],18),500);V.shake(root,500,10);sfx('chime');
          later(()=>{const bl=root.querySelector('.lj-flash');bl.classList.remove('go');void bl.offsetWidth;bl.classList.add('go')},900);later(next,2100);
        };
      },
      /* 2 · Mission unlocked */
      function mission(){
        stage.innerHTML=`${MASCOT}<div class="bj-bubble"><p class="bj-m1 lj-bigtext"></p><p class="bj-m2 fl-msg fl-hide">${esc(g(d,'f_m2',DEF.m2))}</p></div><div class="bj-track fl-hide"><span>0/5</span> ${'<i>⭐</i>'.repeat(5)}</div>${cont("LET'S GO →")}`;
        const m=stage.querySelector('.bj-mascot');V.follow(m);
        typeInto(stage.querySelector('.bj-m1'),g(d,'f_m1',DEF.m1),50,()=>{sfx('chime');const m2=stage.querySelector('.bj-m2');m2.classList.remove('fl-hide');m2.classList.add('fl-in');later(()=>{const t=stage.querySelector('.bj-track');t.classList.remove('fl-hide');t.classList.add('fl-in');V.sparks(...mid(t),30,['#ffd36e','#fff']);later(showCont,500)},900)});
      },
      /* 3 · Balloon pop challenge */
      function balloons(){
        const COL=[['#ff8fb1','#d81b60'],['#8be0ff','#0288d1'],['#a5e8a8','#388e3c'],['#ffe08a','#f59e0b'],['#e3b1ee','#8e24aa']],EMO=['😂','🥰','🤣','⭐','🎁'];let n=0;
        stage.innerHTML=`${head('Balloon Pop Challenge','Pop all 5 balloons · every one hides a surprise')}<div class="bj-sky">${COL.map((c,i)=>`<button class="bj-bal" style="--c1:${c[0]};--c2:${c[1]};--x:${8+i*19}%;--y:${(i%2)*34+6}%;--d:${3.6+i*.5}s" data-i="${i}"><span>?</span></button>`).join('')}</div><p class="bj-count">0 / 5 popped</p><div class="bj-reveal"></div>${cont('Next challenge →')}`;
        stage.querySelectorAll('.bj-bal').forEach(b=>b.onclick=e=>{
          if(b.classList.contains('popped'))return;b.classList.add('popped');const i=+b.dataset.i,[x,y]=mid(b);n++;sfx('pop');
          V.fragments(x,y,COL[i][0],COL[i][1],22);V.ring(x,y,'rgba(255,255,255,.9)',26,4);V.sparks(x,y,34,['#fff','#ffd36e',COL[i][0]],.9);V.emojis(x,y,[EMO[i],'✨','🎉'],7);V.glint(x,y);V.shake(root,200,5);
          stage.querySelector('.bj-count').textContent=`${n} / 5 popped`;
          const rv=stage.querySelector('.bj-reveal');rv.innerHTML=`<div class="bj-card lj-pop"><b>${esc(DEF.bl[i])}</b><p>${esc(g(d,`f_b${i+1}`,DEF.b[i]))}</p></div>`;
          if(i===3){V.flare(x,y,'rgba(255,230,150,.95)');sfx('star')}
          if(n===5){later(()=>{V.confetti('l');V.confetti('r');award(rv,'b');rv.insertAdjacentHTML('beforeend','<p class="bj-got">All popped! ⭐ star unlocked!</p>');later(showCont,1000)},500)}
        });
      },
      /* 4 · Mystery gift boxes */
      function gifts(){
        const CL=[['#ff5b8a','#c2185b'],['#6ec6f5','#1976d2'],['#ffd36e','#f59e0b'],['#9be8c8','#2e9e75']];let opened=false;
        stage.innerHTML=`${head('Mystery Gift Boxes','Choose wisely')}<p class="bj-sub">Four gifts are waiting… but only one knows your next surprise.</p><div class="bj-gifts">${CL.map((c,i)=>`<button class="bj-gbox" style="--c1:${c[0]};--c2:${c[1]};--d:${i*.3}s" data-i="${i}"><span class="gl"></span><span class="lid"></span><span class="body"></span><span class="rv"></span><span class="rh"></span><span class="bow"></span></button>`).join('')}</div><div class="bj-reveal"></div>${cont('UNLOCK THE NEXT SURPRISE →')}`;
        stage.querySelectorAll('.bj-gbox').forEach(b=>b.onclick=e=>{
          if(opened)return;opened=true;const i=+b.dataset.i,[x,y]=mid(b);
          stage.querySelectorAll('.bj-gbox').forEach(o=>{if(o!==b)o.classList.add('dim')});b.classList.add('shake');sfx('tick');V.sparks(x,y,20,['#ffd36e','#fff']);
          later(()=>{b.classList.add('untie');sfx('whoosh');V.sparks(x,y-20,30,['#ffd36e','#ffb347'])},700);
          later(()=>{b.classList.add('open');sfx('chime');V.flare(x,y-30,'rgba(255,240,190,.95)');V.ring(x,y-20,'rgba(255,230,160,.9)',30,6);V.fountain(x,y-10,'sparks',900);const em=g(d,`f_ge${i+1}`,DEF.ge[i]);V.emojis(x,y-20,[em,'✨','🎉'],14,{maxS:44,up:260});
            const rv=stage.querySelector('.bj-reveal');rv.innerHTML=`<div class="bj-card lj-pop"><span class="bj-gem">${esc(em)}</span><p>${esc(g(d,`f_gm${i+1}`,DEF.gm[i]))}</p></div>`;V.confetti('l');V.confetti('r');award(rv,'g');later(showCont,1100)},1500);
        });
      },
      /* 5 · Design your birthday cake */
      function cake(){
        const C=ST.cake;let step=0;
        stage.innerHTML=`${head('Design Your Birthday Cake','Make it yours, one step at a time')}<div class="bj-cakewrap"><div class="bj-cakehost"></div></div><div class="bj-steps"></div><div class="bj-opts"></div><button class="fl-next bj-ready fl-hide">MY CAKE IS READY! 🎂</button>`;
        const host=stage.querySelector('.bj-cakehost'),opts=stage.querySelector('.bj-opts'),steps=stage.querySelector('.bj-steps'),ready=stage.querySelector('.bj-ready');
        const NAMES=['Flavour','Frosting','Decorations','Candles'];
        const paint=()=>{host.innerHTML=cakeSVG(C);host.classList.remove('pop');void host.offsetWidth;host.classList.add('pop')};
        const draw=()=>{
          steps.innerHTML=NAMES.map((n,i)=>`<button class="bj-st${i===step?' on':''}${i<step?' done':''}" data-i="${i}">${i+1}. ${n}</button>`).join('');
          const o=[FLAV.map((f,i)=>`<button class="bj-opt${C.flavor===i?' on':''}" data-v="${i}">${f.e}<small>${f.n}</small></button>`),FROST.map((f,i)=>`<button class="bj-opt sw${C.frost===i?' on':''}" data-v="${i}" style="--sw:${f.c}"><small>${f.n}</small></button>`),DECO.map(f=>`<button class="bj-opt${C.decor.includes(f.k)?' on':''}" data-v="${f.k}">${f.e}<small>${f.n}</small></button>`),CAND.map(n=>`<button class="bj-opt${C.candles===n?' on':''}" data-v="${n}">🕯️<small>${n} candle${n>1?'s':''}</small></button>`)][step];
          opts.innerHTML=o.join('')+(step<3?'<button class="fl-ghost bj-nx">Next step →</button>':'');
          opts.querySelectorAll('.bj-opt').forEach(b=>b.onclick=e=>{const v=b.dataset.v;if(step===0)C.flavor=+v;else if(step===1)C.frost=+v;else if(step===2){const k=C.decor.indexOf(v);if(k>=0)C.decor.splice(k,1);else C.decor.push(v)}else C.candles=+v;paint();draw();sfx('tick');const[x,y]=mid(host);V.sparks(x,y,18,['#ffd36e','#fff','#ff9bc2'],.7);V.glint(x+R(-50,50),y+R(-60,20));if(step===3)ready.classList.remove('fl-hide')});
          const nx=opts.querySelector('.bj-nx');if(nx)nx.onclick=()=>{step++;draw();sfx('chime')};
          steps.querySelectorAll('.bj-st').forEach(b=>b.onclick=()=>{step=+b.dataset.i;draw()});
          if(step===3)ready.classList.remove('fl-hide');
        };
        paint();draw();
        ready.onclick=e=>{ready.onclick=null;const[x,y]=mid(host);host.classList.add('spin');sfx('win');V.flare(x,y,'rgba(255,230,200,.95)');V.ring(x,y,'rgba(255,200,230,.9)',40,6);V.sparks(x,y,90,['#ffd36e','#ff9bc2','#fff','#9be7ff']);V.confetti('l');V.confetti('r');for(let k=0;k<6;k++)setTimeout(()=>V.glint(x+R(-80,80),y+R(-80,60)),k*160);award(host,'c');later(next,2300)};
      },
      /* 6 · The secret birthday wish */
      function wish(){
        stage.innerHTML=`<div class="bj-shoot"></div><h2 class="fl-title">Every birthday deserves one magical wish… ✨</h2><textarea class="bj-wish" maxlength="120" rows="2" placeholder="Type your wish… or keep it a secret ✨"></textarea><button class="fl-next bj-send">SEND MY WISH 💫</button><div class="bj-wishout"></div><p class="lj-bigtext bj-done fl-hide">Wish sent to the universe. Now let’s make some more magic!</p>${cont("Let's continue →")}`;
        later(()=>{V.sparks(innerWidth*.15,innerHeight*.18,10,['#fff'],.4)},300);
        stage.querySelector('.bj-send').onclick=e=>{
          const b=e.currentTarget;b.onclick=null;const ta=stage.querySelector('.bj-wish'),txt=ta.value.trim()||'✨ a secret wish ✨';ta.style.opacity=0;ta.style.pointerEvents='none';b.style.display='none';
          const out=stage.querySelector('.bj-wishout');out.innerHTML=`<div class="bj-wstar">⭐</div><p class="bj-wtext">${esc(txt)}</p>`;const star=out.querySelector('.bj-wstar'),tx=out.querySelector('.bj-wtext');
          const[x,y]=mid(star);V.flare(x,y,'rgba(255,240,170,.95)');V.ring(x,y,'rgba(255,230,150,.9)',30,5);sfx('star');
          later(()=>{tx.classList.add('melt');const[tx0,ty0]=mid(tx);V.sparks(tx0,ty0,60,['#ffd36e','#fff','#c9a7ff'],.7);for(let k=0;k<8;k++)setTimeout(()=>V.glint(tx0+R(-70,70),ty0+R(-12,12)),k*60);V.vortex(tx0,ty0,30,'rgba(255,230,160,.95)')},900);
          later(()=>{out.classList.add('fly');const orb=out.querySelector('.bj-wstar');sfx('whoosh');const iv=setInterval(()=>{const[ox,oy]=mid(orb);V.trail(ox,oy)},40);timers.push(iv);later(()=>{clearInterval(iv);const[ox,oy]=mid(orb);V.flare(ox,oy,'rgba(255,255,255,.95)');V.ring(ox,oy,'rgba(200,200,255,.9)',20,4);V.sparks(ox,oy,50,['#fff','#c9a7ff','#ffd36e']);orb.style.opacity=0},1900)},1700);
          later(()=>{const dn=stage.querySelector('.bj-done');dn.classList.remove('fl-hide');dn.classList.add('fl-in');sfx('chime');later(showCont,700)},3900);
        };
      },
      /* 7 · Birthday mini-game challenge */
      function arcade(){
        const DUR=FAST()?3500:20000;let kind='',finished=false;
        stage.innerHTML=`${head('Birthday Arcade 🕹️','Pick one mini-game · finish it to win a star')}<div class="bj-arcade"><div class="bj-menu">${[['catch','🧁','Catch the Cupcakes','Slide the basket and catch the sweet ones'],['dodge','🎁','Dodge the Presents','Slip away from the falling gifts'],['emoji','😂','Emoji Rush','Tap the right emoji before time runs out']].map(m=>`<button class="bj-gamebtn" data-k="${m[0]}"><b>${m[1]}</b><span>${m[2]}</span><small>${m[3]}</small></button>`).join('')}</div><div class="bj-play fl-hide"></div></div><div class="bj-result fl-hide"></div>${cont('CLAIM MY STAR ⭐')}`;
        const play=stage.querySelector('.bj-play'),menu=stage.querySelector('.bj-menu'),res=stage.querySelector('.bj-result');
        const finish=(score,label)=>{if(finished)return;finished=true;ST.score+=Math.round(score);ST.game=kind;sfx('win');play.classList.add('fl-hide');stage.querySelector('.bj-arcade').classList.add('fl-hide');res.classList.remove('fl-hide');res.innerHTML=`<div class="bj-card lj-pop"><b>${kind==='dodge'?'Survived':'Score'}: ${Math.round(score)}${kind==='dodge'?' s':''}</b><p>${esc(label)}</p></div>`;V.confetti('l');V.confetti('r');const[x,y]=mid(res);V.flare(x,y);award(res,'a');later(showCont,1300)};
        stage.querySelectorAll('.bj-gamebtn').forEach(b=>b.onclick=()=>{kind=b.dataset.k;menu.classList.add('fl-hide');play.classList.remove('fl-hide');sfx('chime');start()});
        function start(){
          play.innerHTML=`<div class="bj-gh"><b class="bj-gs">0</b><div class="bj-gt"><i></i></div><span class="bj-gl"></span></div>${kind==='emoji'?'<div class="bj-egrid"></div>':'<canvas class="bj-cvs"></canvas>'}`;
          const bar=play.querySelector('.bj-gt i'),sc=play.querySelector('.bj-gs'),lab=play.querySelector('.bj-gl'),t0=performance.now();
          if(kind==='emoji'){
            const EM=['😂','🥳','😍','🤩','🎂','🎁','🎈','🧁','⭐','🎉','🍕','🦄'],grid=play.querySelector('.bj-egrid');let target='',n=0,over=false,since=t0;
            const roll=()=>{const pool=[...EM].sort(()=>Math.random()-.5);target=pool[0];since=performance.now();const shuf=[...pool].sort(()=>Math.random()-.5);grid.innerHTML=shuf.map(e=>`<button class="bj-e" data-e="${e}">${e}</button>`).join('');lab.textContent='Tap '+target+' !';lab.dataset.t=target;grid.querySelectorAll('.bj-e').forEach(bn=>bn.onclick=ev=>{if(over)return;if(bn.dataset.e===target){n++;sc.textContent=n;sfx('pop');const[x,y]=mid(bn);V.sparks(x,y,16,['#ffd36e','#fff','#ff9bc2'],.7);V.emojis(x,y,[target],3);roll()}else{bn.classList.add('wrong');sfx('err')}})};
            roll();
            const iv=setInterval(()=>{const el=performance.now()-t0;bar.style.width=Math.max(0,100-el/DUR*100)+'%';if(performance.now()-since>2400)roll();if(el>=DUR&&!over){over=true;clearInterval(iv);finish(n*10,n>=10?'Emoji master! Lightning thumbs! ⚡':n>=5?'Quick fingers! You are basically a human emoji keyboard 😎':'Slow and steady… the emojis love you anyway! 😂')}},100);timers.push(iv);return;
          }
          const cv=play.querySelector('canvas'),r0=cv.getBoundingClientRect(),W=cv.width=Math.max(240,Math.round(r0.width||play.clientWidth||300)),H=cv.height=Math.round(Math.min(W*1.05,380)),c=cv.getContext('2d');
          let px=W/2,items=[],score=0,spawn=.3,last=t0,over=false,lives=3;
          cv.onpointermove=cv.onpointerdown=e=>{const r=cv.getBoundingClientRect();px=Math.max(24,Math.min(W-24,(e.clientX-r.left)*(W/r.width)))};
          const cl=(x,y)=>{const r=cv.getBoundingClientRect();return[r.left+x*(r.width/W),r.top+y*(r.height/H)]};
          const end=()=>{if(over)return;over=true;cancelAnimationFrame(raf);const el=Math.min(performance.now()-t0,DUR);
            if(kind==='catch')finish(score*10/ (FAST()?1:1),score>=15?'Cupcake champion! Sweet, sweet reflexes! 🧁🏆':score>=6?'Not bad, sprinkle-fingers! 😎':'The cupcakes escaped… they were scared of your awesomeness! 😂');
            else{const ratio=el/DUR;finish(el/1000,ratio>=.95?'Untouchable! Legendary present-dodging moves! 🕺':ratio>=.5?'Nice dodging! You are slippery like a greased cupcake 😄':'The presents got you… but they were just excited to meet you! 🎁😂')}};
          const loop=now=>{if(over)return;const dt=Math.min(.05,(now-last)/1000);last=now;const el=now-t0;c.clearRect(0,0,W,H);bar.style.width=Math.max(0,100-el/DUR*100)+'%';
            spawn-=dt;if(spawn<=0){spawn=kind==='catch'?R(.35,.65):Math.max(.22,.7-el/DUR*.45);const rare=Math.random()<.15;items.push(kind==='catch'?{x:R(22,W-22),y:-20,vy:R(150,250),ch:rare?'🍰':'🧁',v:rare?3:1,s:32}:{x:R(22,W-22),y:-30,vy:R(150,290)+el/DUR*120,ch:'🎁',s:R(28,42)})}
            c.textAlign='center';c.textBaseline='middle';c.font='40px serif';c.fillText(kind==='catch'?'🧺':'🤩',px,H-28);
            for(let i=items.length-1;i>=0;i--){const it=items[i];it.y+=it.vy*dt;c.font=it.s+'px serif';c.fillText(it.ch,it.x,it.y);
              if(Math.abs(it.x-px)<(kind==='catch'?38:26)&&Math.abs(it.y-(H-30))<(kind==='catch'?28:30)){const[x,y]=cl(it.x,it.y);items.splice(i,1);
                if(kind==='catch'){score+=it.v;sc.textContent=score;sfx('pop');V.sparks(x,y,14,['#ffd36e','#fff','#ff9bc2'],.7)}else{lives--;sfx('err');V.sparks(x,y,24,['#ff5b8a','#fff'],.9);V.shake(play,250,6);sc.textContent='❤'.repeat(Math.max(0,lives));if(lives<=0){end();return}}}
              else if(it.y>H+40)items.splice(i,1)}
            if(el>=DUR){end();return}raf=requestAnimationFrame(loop)};
          sc.textContent=kind==='dodge'?'❤❤❤':0;lab.textContent=kind==='catch'?'Move to catch! 🧁':'Move to dodge! 🎁';raf=requestAnimationFrame(loop);
        }
      },
      /* 8 · The hidden treasure map */
      function map(){
        const seen=new Set();
        stage.innerHTML=`${head('The Hidden Treasure Map','Tap each place to unlock it')}<div class="bj-map"><svg viewBox="0 0 320 330"><defs><radialGradient id="bjpar" cx="50%" cy="45%"><stop offset="0" stop-color="#fbe9b8"/><stop offset="1" stop-color="#e3bf7c"/></radialGradient></defs><rect width="320" height="330" rx="18" fill="url(#bjpar)"/><g opacity=".35" stroke="#7a4a1c" fill="none" stroke-width="1.4"><path d="M10 40q20-10 40 0t40 0 40 0 40 0 40 0 40 0 30 0"/><path d="M10 300q20-10 40 0t40 0 40 0 40 0 40 0 40 0 30 0"/><ellipse cx="86" cy="240" rx="56" ry="30"/><ellipse cx="190" cy="172" rx="52" ry="30"/><ellipse cx="238" cy="78" rx="52" ry="34"/></g><path class="bj-gpath" d="M86 244 C130 214 150 196 190 176 S 236 130 238 82" fill="none" stroke="#ffcf3a" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 9"/><text x="238" y="30" font-size="22" text-anchor="middle">✖️</text></svg><button class="bj-loc" data-k="cave" style="left:27%;top:72%"><i>🔒</i><small>The Laughing Cave 😂</small></button><button class="bj-loc" data-k="island" style="left:59%;top:52%"><i>🔒</i><small>The Memory Island 📸</small></button><button class="bj-loc" data-k="castle" style="left:74%;top:24%"><i>🔒</i><small>The Treasure Castle 👑</small></button></div><div class="bj-reveal"></div>${cont('FOLLOW THE GOLDEN PATH →')}`;
        const mp=stage.querySelector('.bj-map');
        stage.querySelectorAll('.bj-loc').forEach(b=>b.onclick=e=>{
          const k=b.dataset.k;if(seen.has(k))return;seen.add(k);const[x,y]=mid(b);b.classList.add('open');b.querySelector('i').textContent={cave:'😂',island:'📸',castle:'👑'}[k];sfx('chime');
          V.fragments(x,y,'#ffe08a','#b8860b',16);V.flare(x,y,'rgba(255,230,150,.95)');V.ring(x,y,'rgba(255,220,120,.9)',24,5);V.sparks(x,y,40,['#ffd36e','#fff']);
          const msg={cave:g(d,'f_cave',DEF.cave),island:g(d,'f_island',DEF.island),castle:g(d,'f_castle',DEF.castle)}[k];
          const pic=k==='island'?(photos[0]?`<img src="${esc(photos[0])}" alt="">`:`<div class="bj-ph">📸</div>`):'';
          const rv=stage.querySelector('.bj-reveal');rv.innerHTML=`<div class="bj-card lj-pop">${pic}<p>${esc(msg)}</p></div>`;
          if(k==='cave')V.emojis(x,y,['😂','🤣','😆'],14,{maxS:42});else if(k==='castle'){V.confetti('l');V.confetti('r');V.emojis(x,y,['👑','✨','💎'],10)}else V.emojis(x,y,['📸','💛','🌴'],8);
          if(seen.size===3){later(()=>{mp.classList.add('glow');sfx('win');const[mx,my]=mid(mp);V.flare(mx,my,'rgba(255,230,150,.95)');V.sparks(mx,my,80,['#ffd36e','#fff','#ffb347']);V.fountain(mx,my,'sparks',900);award(mp,'m');later(showCont,1400)},900)}
        });
      },
      /* 9 · The birthday treasure chest */
      function chest(){
        const SYM=['🌙','⭐','🔥','💎'];let seq=[0,1,2,3].sort(()=>Math.random()-.5).slice(0,3),pos=0,locked=true,done=false;stage.dataset.seq=seq.join(',');
        stage.innerHTML=`<p class="lj-bigtext bj-chesttxt">${esc(g(d,'f_chest',DEF.chest))}</p><div class="bj-chestwrap"><div class="bj-inside"><div class="bj-key">🗝️</div><div class="bj-fcake"></div></div><div class="bj-chest"><svg viewBox="0 0 260 190"><defs><linearGradient id="bjwood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8702b"/><stop offset="1" stop-color="#7a3f14"/></linearGradient><linearGradient id="bjgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#ffcf3a"/><stop offset="1" stop-color="#c98a10"/></linearGradient></defs><g class="lid"><path d="M28 86Q28 18 130 18Q232 18 232 86Z" fill="url(#bjwood)"/><path d="M28 86Q28 18 130 18Q232 18 232 86" fill="none" stroke="url(#bjgold)" stroke-width="7"/><rect x="104" y="18" width="52" height="68" fill="url(#bjgold)" opacity=".9"/></g><rect x="28" y="86" width="204" height="92" rx="8" fill="url(#bjwood)"/><rect x="28" y="86" width="204" height="12" fill="url(#bjgold)"/><rect x="28" y="166" width="204" height="12" fill="url(#bjgold)"/><rect x="104" y="86" width="52" height="92" fill="url(#bjgold)" opacity=".85"/><g class="lock"><rect x="112" y="104" width="36" height="34" rx="6" fill="#ffe27a" stroke="#a8730d" stroke-width="3"/><path d="M120 104v-9a10 10 0 0 1 20 0v9" fill="none" stroke="#a8730d" stroke-width="5"/><circle cx="130" cy="120" r="5" fill="#7a4a0a"/></g></svg></div></div><div class="bj-pips"><i></i><i></i><i></i></div><div class="bj-syms">${SYM.map((s,i)=>`<button class="bj-sym" data-i="${i}">${s}</button>`).join('')}</div><p class="fl-msg fl-small bj-cmsg">Watch the magic…</p>${cont('OPEN THE NEXT SURPRISE →')}`;
        const wrap=stage.querySelector('.bj-chestwrap'),msg=stage.querySelector('.bj-cmsg'),syms=[...stage.querySelectorAll('.bj-sym')],pips=[...stage.querySelectorAll('.bj-pips i')];V.follow(wrap);
        const lightSym=(i,on)=>{syms[i].classList.toggle('lit',on);if(on){const[x,y]=mid(syms[i]);V.sparks(x,y,14,['#ffd36e','#fff'],.6);V.ring(x,y,'rgba(255,220,120,.9)',14,3)}};
        const playSeq=()=>{locked=true;msg.textContent='Watch the magic…';syms.forEach((_,i)=>lightSym(i,false));seq.forEach((s,k)=>{later(()=>{lightSym(s,true);sfx('tick');sfx('chime')},700+k*750);later(()=>lightSym(s,false),1150+k*750)});later(()=>{locked=false;pos=0;pips.forEach(p=>p.classList.remove('on'));msg.textContent='Your turn! Repeat the sequence ✨'},700+seq.length*750)};
        const open=()=>{done=true;locked=true;const[x,y]=mid(wrap);msg.textContent='Click… click… CLICK! 🔓';stage.querySelector('.lock').classList.add('glow');sfx('win');
          later(()=>{wrap.classList.add('shake');V.shake(root,700,9);V.sparks(x,y,60,['#ffd36e','#fff'])},500);later(()=>{wrap.classList.add('open');V.flare(x,y-20,'rgba(255,240,170,.98)');V.ring(x,y-20,'rgba(255,230,140,.95)',50,10);setTimeout(()=>V.ring(x,y-20,'rgba(255,255,255,.8)',30,6),250);V.fountain(x,y-20,'sparks',1800);V.slowmo(600,.4);stage.querySelector('.bj-fcake').innerHTML=cakeSVG(ST.cake);V.rocket();setTimeout(V.rocket,400);V.confetti('l');V.confetti('r');msg.textContent='A giant golden key… and your birthday cake! 🗝️🎂'},1300);later(showCont,3200)};
        syms.forEach((b,i)=>b.onclick=()=>{if(locked||done)return;if(i===seq[pos]){lightSym(i,true);pips[pos].classList.add('on');pos++;sfx('chime');if(pos===3)open()}else{sfx('err');locked=true;wrap.classList.remove('wiggle');void wrap.offsetWidth;wrap.classList.add('wiggle');V.shake(wrap,400,8);msg.textContent='Hehe… not quite! The chest is giggling. Watch again 😏';later(playSeq,1100)}});
        playSeq();
      },
      /* 10 · Light the candles */
      function candles(){
        const n=ST.cake.candles,lit=Array(n).fill(false);let count=0,done=false;
        stage.innerHTML=`<h2 class="fl-title">Everything is ready…</h2><p class="bj-sub">…but the celebration can’t begin without you!</p><div class="bj-cakehost big"></div><p class="fl-kick bj-hint">Tap each candle to light it</p><div class="bj-blow fl-hide"><p class="lj-bigtext">Close your eyes, make a wish, and blow! 🌠</p><button class="fl-next bj-blowbtn">BLOW OUT THE CANDLES 💨</button><button class="fl-ghost bj-mic">🎤 or blow into your microphone</button><p class="fl-msg fl-small bj-micmsg"></p></div>`;
        const host=stage.querySelector('.bj-cakehost');host.innerHTML=cakeSVG(ST.cake,{lit});V.follow(host);
        const blowOut=()=>{if(done)return;done=true;if(mic){try{mic.stream.getTracks().forEach(t=>t.stop());mic.ctx.close()}catch(e){}mic=null}cancelAnimationFrame(raf);
          host.querySelectorAll('.candle').forEach((c,i)=>{const[x,y]=mid(c.querySelector('.fl'));V.smoke(x,y,3,'rgba(235,235,245,');V.sparks(x,y,14,['#ffd36e','#ffb347'],.5);c.classList.remove('lit')});
          sfx('whoosh');root.removeAttribute('data-dark');host.classList.remove('glow');const[cx,cy]=mid(host);V.flare(cx,cy-40,'rgba(255,210,150,.9)');V.ring(cx,cy-40,'rgba(255,200,130,.8)',30,6);V.slowmo(500,.4);later(next,1500)};
        host.addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('.candle');if(!c||done)return;const i=+c.dataset.i;if(lit[i])return;lit[i]=true;count++;c.classList.add('lit');const[x,y]=mid(c.querySelector('.fl'));sfx('chime');V.sparks(x,y,20,['#ffd36e','#ffb347','#fff'],.6);V.flare(x,y,'rgba(255,200,120,.8)');V.ring(x,y,'rgba(255,200,120,.9)',12,3);
          if(count===n){stage.querySelector('.bj-hint').style.display='none';later(()=>{root.dataset.dark='1';host.classList.add('glow');sfx('win');V.flameOn(()=>{const f=host.querySelector('.candle.lit .fl');if(!f||done)return null;const[fx,fy]=mid(f);return{x:fx,y:fy}});const b=stage.querySelector('.bj-blow');b.classList.remove('fl-hide');b.classList.add('fl-in')},500)}});
        stage.querySelector('.bj-blowbtn').onclick=blowOut;
        stage.querySelector('.bj-mic').onclick=()=>{const mm=stage.querySelector('.bj-micmsg');if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){mm.textContent='Microphone not available here. Use the button 💨';return}
          navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const ctx=new(window.AudioContext||window.webkitAudioContext)(),src=ctx.createMediaStreamSource(stream),an=ctx.createAnalyser();an.fftSize=512;src.connect(an);mic={stream,ctx};mm.textContent='Listening… blow towards your microphone! 🌬️';const buf=new Uint8Array(an.fftSize);let hot=0;const tick=()=>{if(done)return;an.getByteTimeDomainData(buf);let sum=0;for(let i=0;i<buf.length;i++){const v=(buf[i]-128)/128;sum+=v*v}hot=Math.sqrt(sum/buf.length)>.18?hot+1:0;if(hot>=4){blowOut();return}raf=requestAnimationFrame(tick)};tick()}).catch(()=>{mm.textContent='Microphone not available. Use the button 💨'})};
      },
      /* 11 · Ultimate birthday celebration */
      function celebrate(){
        const total=ST.stars*200+ST.score*10;
        stage.innerHTML=`<div class="bj-cel"><div class="bj-fcake2">${cakeSVG(ST.cake,{lit:Array(ST.cake.candles).fill(true)})}</div><h1 class="bj-name" style="opacity:0">${esc(name)}</h1><h2 class="fl-title fl-big bj-mc" style="opacity:0">MISSION COMPLETE! 🎉</h2><p class="lj-bigtext bj-uni" style="opacity:0">TODAY, THE WHOLE UNIVERSE CELEBRATES YOU! 🌎❤️</p><div class="bj-final" style="opacity:0"><div class="bj-fstars">${[0,1,2,3,4].map(i=>`<i class="${i<ST.stars?'on':''}" style="--k:${i}">⭐</i>`).join('')}</div><p class="bj-fscore">FINAL SCORE <b>0</b></p></div></div>${cont('OPEN MY FINAL SURPRISE →')}`;
        V.fireworks(true);sfx('win');if(bgm)bgm.start();
        const CAN=()=>{V.confetti('l');V.confetti('r');V.confetti('l',{streamer:1});V.confetti('r',{streamer:1})};CAN();later(CAN,1800);later(CAN,3600);later(CAN,5400);
        const iv=setInterval(()=>{V.fly(['🎈'],3,'up');const x=R(30,innerWidth-30),y=R(80,innerHeight*.6);V.emojis(x,y,['🧁','⭐','🎂','🎁','✨'],3,{g:60,up:40,maxSp:120})},1100);timers.push(iv);
        const show1=(sel,ms,fn)=>later(()=>{const e=stage.querySelector(sel);e.style.transition='opacity 1s';e.style.opacity=1;fn&&fn(e)},ms);
        show1('.bj-name',500,e=>{const[x,y]=mid(e);V.flare(x,y,'rgba(255,230,160,.95)');V.ring(x,y,'rgba(255,200,230,.9)',40,6);V.sparks(x,y,60,['#ffd36e','#ff9bc2','#fff'])});
        show1('.bj-mc',1700,()=>{sfx('star')});show1('.bj-uni',2900);
        show1('.bj-final',4000,e=>{const sc=e.querySelector('.bj-fscore b'),t0=performance.now(),dur=FAST()?300:1600;const tk=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/dur);sc.textContent=Math.round(total*k).toLocaleString();if(k>=1)clearInterval(tk)},40);timers.push(tk);e.querySelectorAll('.bj-fstars i.on').forEach((s,i)=>setTimeout(()=>{const[x,y]=mid(s);V.sparks(x,y,16,['#ffd36e','#fff']);V.glint(x,y)},i*180))});
        later(showCont,FAST()?5200:6200);
      },
      /* 12 · Birthday highlights gallery */
      function gallery(){
        const FX=['polaroid','flip','zoom','float'],slides=photos.length?photos:[0,1,2,3];let i=0;
        stage.innerHTML=`${head('Birthday Highlights','Swipe or tap Next')}<div class="bj-gal">${slides.map((s,k)=>`<figure class="bj-gp fx-${FX[k%4]}"><div class="fr">${photos.length?`<img src="${esc(s)}" alt="">`:`<div class="bj-ph">📸</div>`}</div><figcaption><b>${esc(photos.length?g(d,`f_gc${k+1}`,''):'Add photos in the Media tab')}</b><small>${esc(photos.length?g(d,`f_gd${k+1}`,''):'')}</small></figcaption></figure>`).join('')}</div><div class="fl-cdots">${slides.map(()=>'<i></i>').join('')}</div><div class="fl-row2"><button class="fl-ghost bj-pv">← Prev</button><button class="fl-ghost bj-nx2">Next →</button></div><p class="lj-bigtext bj-gfinal fl-hide">${esc(g(d,'f_gfinal',DEF.galFinal))}</p>${cont('ONE LAST SURPRISE 💌')}`;
        const els=[...stage.querySelectorAll('.bj-gp')],dots=[...stage.querySelectorAll('.fl-cdots i')],nx=stage.querySelector('.bj-nx2'),pv=stage.querySelector('.bj-pv');
        const paint=()=>{els.forEach((e,k)=>{e.classList.remove('on');if(k===i){void e.offsetWidth;e.classList.add('on')}});dots.forEach((e,k)=>e.classList.toggle('on',k===i));pv.style.visibility=i?'visible':'hidden';nx.style.visibility=i<els.length-1?'visible':'hidden';
          const e=els[i],[x,y]=mid(e);V.sparks(x,y,24,['#fff1d6','#ffd6e0','#ffd36e'],.6);V.glint(x+40,y-50);V.ring(x,y,'rgba(255,220,240,.7)',30,3);sfx('tick');
          if(i===els.length-1){const f=stage.querySelector('.bj-gfinal');f.classList.remove('fl-hide');f.classList.add('fl-in');V.confetti('l');V.confetti('r');later(showCont,700)}};
        nx.onclick=()=>{if(i<els.length-1){i++;paint()}};pv.onclick=()=>{if(i){i--;paint()}};
        let x0=null;const gal=stage.querySelector('.bj-gal');gal.onpointerdown=e=>x0=e.clientX;gal.onpointerup=e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(dx<-40&&i<els.length-1){i++;paint()}if(dx>40&&i){i--;paint()}};
        paint();
      },
      /* 13 · The final birthday letter */
      function letter(){
        stage.innerHTML=`<p class="lj-bigtext bj-lead">Before you leave your birthday universe… there’s one last message waiting for you.</p><button class="bj-env2"><span class="pap">💌</span><span class="flap"></span><span class="front"></span><span class="to">For ${esc(name)}</span></button><p class="fl-kick bj-tap">Tap the envelope</p>`;
        const eb=stage.querySelector('.bj-env2');
        eb.onclick=e=>{eb.onclick=null;eb.classList.add('open');stage.querySelector('.bj-tap').style.display='none';sfx('chime');const[x,y]=mid(eb);V.flare(x,y,'rgba(255,235,190,.95)');V.ring(x,y,'rgba(255,230,170,.9)',30,5);V.fountain(x,y,'sparks',1000);V.hearts(x,y,10);
          later(()=>{stage.classList.add('lj-full');const lines=g(d,'f_letter',DEF.letter).split(/\n+/).filter(Boolean);
            stage.innerHTML=`<article class="lj-full-letter lj-pop"><p class="fl-kick">A letter for ${esc(name)}</p><div class="lj-lines">${lines.map(()=>'<p></p>').join('')}</div><p class="bj-c1 fl-hide">${esc(g(d,'f_close1',DEF.close1))}</p><p class="bj-c2 fl-hide">${esc(g(d,'f_close2',DEF.close2))}</p><div class="fl-row2 bj-fin fl-hide"><button class="fl-next bj-replay">REPLAY MY ADVENTURE ↻</button><button class="fl-ghost bj-save">SAVE MY BIRTHDAY CARD 📥</button></div></article>`;
            const ps=[...stage.querySelectorAll('.lj-lines p')];let li=0;
            const fin=()=>{const c1=stage.querySelector('.bj-c1'),c2=stage.querySelector('.bj-c2'),fb=stage.querySelector('.bj-fin');c1.classList.remove('fl-hide');c1.classList.add('fl-in');const r=c1.getBoundingClientRect();V.hearts(r.left+r.width/2,r.top,14);V.sparks(r.left+r.width/2,r.top+10,40);sfx('win');later(()=>{c2.classList.remove('fl-hide');c2.classList.add('fl-in')},900);later(()=>{fb.classList.remove('fl-hide');fb.classList.add('fl-in')},1800)};
            const go=()=>{if(li>=ps.length){later(fin,400);return}const el=ps[li++];typeInto(el,lines[li-1],34,()=>later(go,350))};later(go,500);
            stage.querySelector('.bj-replay').onclick=()=>{ST.stars=0;ST.score=0;ST.game='';awarded.clear();ST.cake={flavor:0,frost:0,decor:[],candles:5};idx=0;show()};
            stage.querySelector('.bj-save').onclick=e=>saveCard(lines,e);
          },1500)};
      }
    ];

    /* save the finished card as an image */
    function saveCard(lines,e){
      const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;const c=cv.getContext('2d');
      const bgG=c.createLinearGradient(0,0,0,1350);bgG.addColorStop(0,'#1a0b3d');bgG.addColorStop(.55,'#7b2d8e');bgG.addColorStop(1,'#ff9a85');c.fillStyle=bgG;c.fillRect(0,0,1080,1350);
      for(let i=0;i<70;i++){c.fillStyle=`rgba(255,255,255,${.25+((i*37)%70)/100})`;c.beginPath();c.arc((i*191)%1080,(i*113)%1350,1+(i%3),0,7);c.fill()}
      c.textAlign='center';c.fillStyle='#fff';c.font='700 64px Georgia, serif';c.fillText('Happy Birthday',540,200);
      c.fillStyle='#ffd36e';c.font='700 130px Georgia, serif';let fs=130;while(c.measureText(name).width>940&&fs>50){fs-=6;c.font=`700 ${fs}px Georgia, serif`}c.fillText(name,540,350);
      c.font='90px serif';c.fillText('⭐'.repeat(Math.max(1,ST.stars)),540,500);c.fillStyle='#fff';c.font='700 46px Georgia, serif';c.fillText('MISSION COMPLETE! 🎉',540,590);
      c.font='italic 44px Georgia, serif';let y=720;const wrap=t=>{const w=t.split(' ');let l='';const out=[];w.forEach(x=>{const tt=l?l+' '+x:x;if(c.measureText(tt).width>880){out.push(l);l=x}else l=tt});if(l)out.push(l);return out};
      lines.slice(0,3).forEach(t=>wrap(t).forEach(l=>{c.fillText(l,540,y);y+=62}));y+=40;
      c.fillStyle='#ffd36e';c.font='700 54px Georgia, serif';wrap(g(d,'f_close1',DEF.close1)).forEach(l=>{c.fillText(l,540,y);y+=70});
      if(sender){c.fillStyle='#fff';c.font='italic 42px Georgia, serif';c.fillText('with love, '+sender,540,Math.min(y+40,1230))}
      c.fillStyle='rgba(255,255,255,.6)';c.font='32px sans-serif';c.fillText('Made with Wishora',540,1290);
      cv.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='birthday-card.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)},'image/png');
      boom(e,['💌','⭐','🎉'],8);sfx('chime');
    }

    /* ---- page controller ---- */
    const PAGES=['portal','mission','balloons','gifts','cake','wish','arcade','map','chest','candles','celebrate','gallery','letter'];
    const MODES=['cosmos','cosmos','party','party','party','night','cosmos','gold','gold','night','celebrate','party','cosmos'];
    const VMODE={cosmos:'cosmos',party:'party',night:'dream',gold:'cake',celebrate:'celebrate'};
    function show(){
      clear();V.fireworks(false);V.flameOff();V.follow(null);root.removeAttribute('data-dark');stage.classList.remove('lj-full');stage.removeAttribute('data-seq');
      const m=MODES[idx];root.dataset.mode=m;if(m!==curMode){curMode=m;V.mode(VMODE[m])}
      root.dataset.page=PAGES[idx];root.dataset.hud=idx>=2?'1':'0';hud();
      root.querySelector('.fl-count').textContent=`${idx+1} / ${S.length}`;root.querySelector('.fl-back').style.visibility=idx===0?'hidden':'visible';
      root.querySelector('.fl-dots').innerHTML=S.map((_,i)=>`<i class="${i<=idx?'on':''}"></i>`).join('');
      stage.scrollTop=0;stage.classList.remove('fl-in','lj-focus');void stage.offsetWidth;stage.classList.add('fl-in','lj-focus');
      if(idx>0){const bl=root.querySelector('.lj-bloom');bl.classList.remove('go');void bl.offsetWidth;bl.classList.add('go')}
      S[idx]();
    }
    root.querySelector('.fl-back').onclick=()=>{if(idx>0){idx--;show()}};
    root.__go=i=>{idx=i;show()};
    show();
  }

  window.WISHORA_JOURNEYS=Object.assign(window.WISHORA_JOURNEYS||{},{[SLUG]:{render,groups,pages:13}});
})();
