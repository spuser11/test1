/* Wishora V18 — "Our Love Story": the 14-step Extended Love Journey */
(function(){
  const SLUG='wishora-anniversary-story';
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const g=(d,k,def)=>(d&&d[k]&&String(d[k]).trim())||def;
  const absu=u=>{try{return new URL(u,document.baseURI).href}catch(e){return u}};

  const DEF={
    ask:'Are you ready to relive our story?',
    lm:'Some stories are written… ours was meant to happen. ❤️',
    cap:['Where it all began','The day I knew','Our little adventure','Just us, being us'],
    dt:['Day one','The day I knew','Our adventure','Today'],
    hid:'And these are just a few of my favorite moments with you…',
    hug:'Okay… I need a hug now. 🤗',
    cmT:['Our Funniest Moment 😂','Our Sweetest Moment ❤️','Our Craziest Moment 😭','My Favorite Moment 🥹'],
    cm:['That time we laughed until we cried. I still smile every time I think about it.','The moment I knew you were the one. Quiet, simple and perfect.','Remember that crazy night? I would do it all again with you.','Every moment with you is my favourite. Truly.'],
    q:['Who said I love you first?','Who gets angry first? 😂','Who misses the other person more?'],
    qa:['Me','Me','Me'],qb:['You','You','You'],
    qr:['Aww… I knew it! 🥰','Haha, guilty as charged! 😂','Same here… always. ❤️'],
    env:'There’s something I never told you…',
    secret:'I never said it out loud, but you changed the way I see everything. Every ordinary day became something to look forward to the moment you were part of it. Thank you for being my safe place, my best friend and my favourite person. ❤️',
    fut:'But our story doesn’t end here…',
    futT:['🌅 Places we want to visit','🏡 Things we want to do together','❤️ Memories we haven’t created yet'],
    fu:['Passport ready. Wherever you are going, I want to be right there beside you.','A thousand little things, from lazy Sundays to big adventures.','Pages not yet written, memories not yet made. I can’t wait.'],
    pr:['I’ll always be there.','I’ll keep making you smile.','I’ll choose you, every time.','I’ll create more memories with you.','I’ll never stop annoying you. 😂❤️'],
    lq1:'After everything we’ve shared…',
    lq2:'Will you stay with me for all the chapters yet to come?',
    cel1:'Then this isn’t the end…',cel2:'It’s just the beginning. ❤️',
    col:'4 memories captured… and countless more waiting for us. ❤️',
    fl:'I don’t know how to say this properly…\nBut with you, every day feels like home.\nThank you for every laugh, every hug, every memory.\nI’d choose you in every lifetime.\nAnd I’ll keep choosing you, today and always.',
    sign:'Forever & Always'
  };

  /* ---------------- builder fields ---------------- */
  function groups(){
    const f=(id,label,ph,max,ta)=>({id,label,placeholder:ph,max:max||160,type:ta?'textarea':undefined,full:ta?true:undefined});
    const n4=(k,L,arr,m)=>arr.map((v,i)=>f(`f_${k}${i+1}`,`${L} ${i+1}`,v,m));
    const G=(title,copy,defs)=>({title,copy,defs});
    return[
      G('Page 1 · Yes → Arrow → Broken heart','The question on the first page. The arrow flies in and breaks the heart.',[f('f_ask','Question',DEF.ask,120)]),
      G('Page 2 · Love message','Revealed with a typing animation.',[f('f_lm','Message',DEF.lm,200,1)]),
      G('Page 3 · Memories (photos 1–4)','Uses photos 1–4 from the Media tab. Each gets a caption and a date. They are also used for the hidden-heart background and the final collage.',[...n4('cap','Caption',DEF.cap,60),...n4('dt','Date',DEF.dt,40)]),
      G('Page 4 · Hidden message','Appears when they tap the glowing heart.',[f('f_hid','Hidden message',DEF.hid,200,1)]),
      G('Page 5 · Hug','They tap the hug 3 times.',[f('f_hug','Hug text',DEF.hug,100)]),
      G('Page 6 · Choose a memory (photos 5–8)','One message behind each heart. Photos 5–8 from the Media tab show with Funniest, Sweetest, Craziest and Favorite. Without them, only the message shows.',n4('cm','Message',DEF.cm,220)),
      G('Page 7 · How well do you know us?','Three questions with two answers each, and a cute reaction.',[1,2,3].flatMap(i=>[f(`f_q${i}`,`Question ${i}`,DEF.q[i-1],100),f(`f_q${i}a`,`Question ${i} · answer A`,DEF.qa[i-1],30),f(`f_q${i}b`,`Question ${i} · answer B`,DEF.qb[i-1],30),f(`f_q${i}r`,`Question ${i} · reaction`,DEF.qr[i-1],80)])),
      G('Page 8 · Secret envelope','The teaser, then the longer letter that slides out.',[f('f_env','Teaser',DEF.env,100),f('f_secret','Secret letter',DEF.secret,1200,1)]),
      G('Page 9 · Our future','Three dreamy cards.',[f('f_fut','Intro line',DEF.fut,100),...n4('fu','Card message',DEF.fu,200).slice(0,3)]),
      G('Page 10 · Promise cards','Five cards that flip.',n4('pr','Promise',DEF.pr,100)),
      G('Page 11 · One last question','Two lines, then YES / ALWAYS.',[f('f_lq1','First line',DEF.lq1,100),f('f_lq2','The question',DEF.lq2,160)]),
      G('Page 12 · Celebration','Shown when they choose ALWAYS.',[f('f_cel1','First line',DEF.cel1,100),f('f_cel2','Second line',DEF.cel2,100)]),
      G('Page 13 · Memory collage','All 4 photos together.',[f('f_col','Collage message',DEF.col,160)]),
      G('Page 14 · Final love letter','One line per row. Each line is typed out softly.',[f('f_fl','Letter (one line per row)',DEF.fl,1500,1),f('f_sign','Sign-off',DEF.sign,60)])
    ];
  }

  /* ---------------- experience ---------------- */
  const HEART='M50 88C20 62 2 44 2 24 2 11 12 2 25 2c10 0 20 6 25 14C55 8 65 2 75 2c13 0 23 9 23 22 0 20-18 38-48 64z';
  const MODES={8:'dream',10:'night',11:'celebrate',12:'celebrate'};

  function render(d,p,app){
    const photos=(Array.isArray(d.photos)?d.photos:[]).map(x=>typeof x==='string'?x:(x&&(x.src||x.data))||'').filter(Boolean).slice(0,8);
    const A=(k,i,def)=>g(d,`f_${k}${i}`,def);
    const pic=(i,cls)=>photos[i]?`<img class="${cls||''}" src="${esc(photos[i])}" alt="">`:`<div class="lj-ph ${cls||''}">📸</div>`;
    app.innerHTML=`<div class="fl lj" data-card="none" data-btn="pill" data-tr="fade" data-align="center" data-photo="polaroid"><div class="fl-fx"></div><div class="fl-bar"><button class="fl-back">← Back</button><span class="fl-count"></span></div><div class="fl-stage"></div><div class="fl-dots"></div><div class="lj-flash"></div><div class="lj-bloom"></div></div>`;
    const root=app.querySelector('.lj'),stage=root.querySelector('.fl-stage'),fxl=root.querySelector('.fl-fx');
    const V=(window.LJVFX&&window.LJVFX.create(root))||new Proxy({},{get:()=>()=>{}});root.__vfx=V;
    if(window.WISHORA_BGM)window.WISHORA_BGM.attach(root,d);
    const FX=['❤️','💕','💖','✨','🌹'];
    let idx=0,timers=[],curMode='';
    const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t};
    const clear=()=>{timers.forEach(t=>{clearTimeout(t);clearInterval(t)});timers=[]};
    const burst=(x,y,em,n)=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;for(let i=0;i<(n||18);i++){const s=document.createElement('span');s.className='fl-conf';s.textContent=(em||FX)[i%(em||FX).length];s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);const a=Math.random()*6.28,r=50+Math.random()*130;s.animate([{transform:'translate(0,0) scale(.6)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r-40}px) scale(1.2)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove()}};
    const at=e=>{const r=(e&&e.currentTarget||stage).getBoundingClientRect();return[e&&e.clientX?e.clientX:r.left+r.width/2,e&&e.clientY?e.clientY:r.top+r.height/2]};
    const boom=(e,em,n)=>{const[x,y]=at(e);V.sparks(x,y,26,['#ffd6e0','#ff5b8a','#ffe08a']);V.hearts(x,y,8);V.ring(x,y,'rgba(255,120,160,.9)',14,3);burst(x,y,em,Math.round((n||18)*.45))};
    const next=()=>{idx++;show()};
    const glint=(el,i)=>{const t=el.firstChild;if(!t)return;try{const r=document.createRange();r.setStart(t,Math.min(t.length,i));r.collapse(true);const c=r.getClientRects()[0];if(c)V.glint(c.right,c.top+c.height/2)}catch(e){}};
    const typeInto=(el,text,speed,done)=>{el.textContent='';el.classList.add('lj-caret');let i=0;const iv=setInterval(()=>{el.textContent=text.slice(0,++i);if(i%2===0)glint(el,i);if(i>=text.length){clearInterval(iv);el.classList.remove('lj-caret');done&&done()}},speed||38);timers.push(iv)};
    const head=(t,k)=>`${k?`<p class="fl-kick">${esc(k)}</p>`:''}<h2 class="fl-title">${esc(t)}</h2>`;
    const cont=l=>`<button class="fl-next fl-hide">${l||'Continue →'}</button>`;
    const showCont=()=>{const b=stage.querySelector('.fl-next');if(b){b.classList.remove('fl-hide');b.classList.add('fl-in');b.onclick=e=>{boom(e);next()}}};
    const wireNext=()=>{const b=stage.querySelector('.fl-next');b.onclick=e=>{boom(e);next()}};

    const S=[
      /* 1 · Yes → Arrow → Broken heart */
      function yes(){
        stage.innerHTML=`<p class="fl-kick">Our Love Story</p><div class="lj-hw"><div class="lj-half l lj-beat"><svg viewBox="0 0 100 90"><path d="${HEART}"/><path class="sh" d="M22 14c-8 2-13 9-12 18"/></svg></div><div class="lj-half r lj-beat"><svg viewBox="0 0 100 90"><path d="${HEART}"/><path class="sh" d="M22 14c-8 2-13 9-12 18"/></svg></div><svg class="lj-arrow" viewBox="0 0 140 24"><line x1="6" y1="12" x2="118" y2="12" stroke="#c9a46a" stroke-width="4" stroke-linecap="round"/><path d="M116 2L138 12L116 22Z" fill="#aeb7bf"/><path d="M6 12L0 2M6 12L0 22M20 12L14 2M20 12L14 22" stroke="#ff5b8a" stroke-width="3" stroke-linecap="round"/></svg><span class="lj-mend">❤️‍🩹</span></div><h2 class="fl-title lj-ask">${esc(g(d,'f_ask',DEF.ask))}</h2><div class="fl-row2 lj-btns"><button class="fl-ghost lj-no">No</button><button class="fl-next lj-yes">Yes ❤️</button></div><p class="fl-msg fl-small lj-nm"> </p>`;
        const hw=stage.querySelector('.lj-hw'),arrow=stage.querySelector('.lj-arrow'),nm=stage.querySelector('.lj-nm'),yesB=stage.querySelector('.lj-yes'),noB=stage.querySelector('.lj-no');
        const NO=['Hmm… are you sure? 🥺','My heart is waiting… ❤️','Pretty please? 💖','Okay okay, just press Yes ✨'];let n=0;
        V.follow(hw);const hbt=setInterval(()=>{const r=hw.getBoundingClientRect();V.ring(r.left+r.width/2,r.top+r.height/2,'rgba(255,60,100,.8)',60,3)},1100);timers.push(hbt);
        noB.onclick=()=>{nm.textContent=NO[Math.min(n++,3)];yesB.style.transform=`scale(${Math.min(1.45,1+n*.12)})`;noB.classList.remove('fl-shake');void noB.offsetWidth;noB.classList.add('fl-shake');if(n>=4)noB.style.display='none'};
        yesB.onclick=()=>{
          stage.querySelector('.lj-ask').style.opacity=0;stage.querySelector('.lj-btns').style.opacity=0;nm.style.opacity=0;
          hw.querySelectorAll('.lj-half').forEach(h=>h.classList.remove('lj-beat'));
          clearInterval(hbt);arrow.classList.add('go');const trail=setInterval(()=>{const r=arrow.getBoundingClientRect();V.trail(r.right-8,r.top+8)},16);timers.push(trail);
          const an=arrow.animate([{transform:'translate(-254px,159px) rotate(-32deg)',opacity:0},{opacity:1,offset:.15},{transform:'translate(0,0) rotate(-32deg)',opacity:1}],{duration:900,easing:'cubic-bezier(.5,0,.85,.45)',fill:'forwards'});
          an.onfinish=()=>{clearInterval(trail);
            root.classList.add('lj-shake');later(()=>root.classList.remove('lj-shake'),500);
            root.querySelector('.lj-flash').classList.remove('go');void root.offsetWidth;root.querySelector('.lj-flash').classList.add('go');
            hw.classList.add('broken');const r=hw.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;V.slowmo(950,.28);V.shatter(cx,cy,1.05);V.ring(cx,cy,'rgba(255,255,255,.95)',20,6);V.ring(cx,cy,'rgba(255,60,100,.85)',10,12);V.flare(cx,cy);V.sparks(cx,cy,110,['#ffd6e0','#ff5b8a','#ffe08a','#ffffff']);V.smoke(cx,cy,10);V.shake(root,560,15);V.aberration(stage,450);burst(cx,cy,['💔'],6);
            later(()=>{arrow.style.transition='opacity .5s';arrow.style.opacity=0},900);
            later(next,2300);
          };
        };
      },
      /* 2 · Love message */
      function msg(){
        stage.innerHTML=`${head('','A message for you').replace('<h2 class="fl-title"></h2>','')}<p class="lj-type"></p>${cont()}`;
        typeInto(stage.querySelector('.lj-type'),g(d,'f_lm',DEF.lm),55,()=>later(showCont,500));
      },
      /* 3 · Memories */
      function mem(){
        const caps=[0,1,2,3].map(i=>A('cap',i+1,DEF.cap[i])),dts=[0,1,2,3].map(i=>A('dt',i+1,DEF.dt[i]));let i=0;
        stage.innerHTML=`${head('Our Memories','Swipe or tap Next')}<div class="fl-car">${caps.map((c,k)=>`<figure class="fl-pol">${pic(k)}<figcaption><b>${esc(c)}</b><small>${esc(dts[k])}</small></figcaption></figure>`).join('')}</div><div class="fl-cdots">${caps.map(()=>'<i></i>').join('')}</div><div class="fl-row2"><button class="fl-ghost fl-prev">← Prev</button><button class="fl-next fl-nx">Next →</button></div>`;
        const els=[...stage.querySelectorAll('.fl-pol')],dots=[...stage.querySelectorAll('.fl-cdots i')],nx=stage.querySelector('.fl-nx'),pv=stage.querySelector('.fl-prev');
        const paint=()=>{els.forEach((e,k)=>e.classList.toggle('on',k===i));dots.forEach((e,k)=>e.classList.toggle('on',k===i));nx.textContent=i===3?'Continue →':'Next →';pv.style.visibility=i?'visible':'hidden'};
        const dustAt=()=>{const r=stage.querySelector('.fl-car').getBoundingClientRect();V.sparks(r.left+r.width/2,r.top+r.height/2,26,['#fff1d6','#ffd6e0'],.5);V.glint(r.left+r.width*.7,r.top+r.height*.3)};
        nx.onclick=e=>{boom(e,['❤️','✨'],10);if(i===3)next();else{i++;paint();dustAt()}};pv.onclick=()=>{if(i){i--;paint();dustAt()}};
        let x0=null;const car=stage.querySelector('.fl-car');car.addEventListener('pointermove',ev=>{const r=car.getBoundingClientRect(),px=(ev.clientX-r.left)/r.width-.5,py=(ev.clientY-r.top)/r.height-.5,el=stage.querySelector('.fl-pol.on');if(el){el.style.setProperty('--ry',(px*18)+'deg');el.style.setProperty('--rx',(-py*14)+'deg');el.style.setProperty('--gx',(px*100+50)+'%');el.style.setProperty('--gy',(py*100+50)+'%')}});car.onpointerdown=e=>x0=e.clientX;car.onpointerup=e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(dx<-40&&i<3){i++;paint()}if(dx>40&&i){i--;paint()}};paint();
      },
      /* 4 · Memory → hidden message */
      function hidden(){
        stage.innerHTML=`<div class="lj-drift">${[0,1,2,3].map(k=>`<div class="lj-dp" style="--k:${k}">${pic(k)}</div>`).join('')}</div><p class="fl-kick lj-hint">Tap the glowing heart</p><button class="lj-glow">💗</button><p class="lj-type lj-big"></p>${cont()}`;
        const hb=stage.querySelector('.lj-glow'),t=stage.querySelector('.lj-type');V.follow(hb);
        hb.onclick=e=>{hb.onclick=null;boom(e,['💗','✨','❤️'],20);{const[x,y]=at(e);V.flare(x,y);V.ring(x,y,'rgba(255,120,170,.9)',40,5);V.fountain(x,y,'hearts',900)}hb.classList.add('gone');stage.querySelector('.lj-hint').style.display='none';typeInto(t,g(d,'f_hid',DEF.hid),48,()=>later(showCont,400))};
      },
      /* 5 · Hug ×3 */
      function hug(){
        let n=0;
        stage.innerHTML=`${head('','Tap the hug 3 times').replace('<h2 class="fl-title"></h2>','')}<p class="lj-bigtext">${esc(g(d,'f_hug',DEF.hug))}</p><div class="lj-hugwrap"><span class="lj-pulse">❤️</span><img class="lj-hug" src="${esc(absu('images/birthday-example/intro-bear-panda.gif'))}" alt="Hug"></div><div class="lj-hh"><i>♡</i><i>♡</i><i>♡</i></div><p class="fl-msg fl-small lj-done fl-hide">Hug complete 💞</p>${cont()}`;
        const img=stage.querySelector('.lj-hug'),pl=stage.querySelector('.lj-pulse'),hh=[...stage.querySelectorAll('.lj-hh i')];
        img.onclick=e=>{if(n>=3)return;n++;hh[n-1].textContent='❤';hh[n-1].classList.add('on');img.classList.remove('lj-wig');void img.offsetWidth;img.classList.add('lj-wig');pl.classList.remove('go');void pl.offsetWidth;pl.classList.add('go');boom(e,['❤️','💕','💖'],14);{const[x,y]=at(e);V.ring(x,y,'rgba(255,120,170,.9)',40,5);V.hearts(x,y,10);V.zoom(stage.querySelector('.lj-hugwrap'))}if(n===3){{const[x,y]=at(e);V.flare(x,y);V.fountain(x,y,'hearts',1800);V.confetti('l');V.confetti('r')}stage.querySelector('.lj-done').classList.remove('fl-hide');later(showCont,500)}};
      },
      /* 6 · Choose a memory */
      function choose(){
        const seen=new Set();
        stage.innerHTML=`${head('Choose a Memory','Tap each heart')}<div class="lj-hearts">${DEF.cmT.map((t,i)=>`<button class="lj-hc" data-i="${i}"><svg viewBox="0 0 100 90"><path d="${HEART}"/></svg><span>${esc(t)}</span></button>`).join('')}</div><div class="lj-reveal"></div>${cont()}`;
        const rv=stage.querySelector('.lj-reveal');
        stage.querySelectorAll('.lj-hc').forEach(b=>b.onclick=e=>{const i=+b.dataset.i;stage.querySelectorAll('.lj-hc').forEach(x=>x.classList.remove('sel'));b.classList.add('on','sel');seen.add(i);boom(e,['❤️','✨'],10);{const[x,y]=at(e);V.flare(x,y,'rgba(255,150,190,.9)');V.ring(x,y,'rgba(255,120,170,.8)',30,4)}rv.innerHTML=`<div class="lj-card lj-pop">${photos[4+i]?`<img src="${esc(photos[4+i])}" alt="">`:''}<p>${esc(A('cm',i+1,DEF.cm[i]))}</p></div>`;if(seen.size===4)showCont()});
      },
      /* 7 · Quiz */
      function quiz(){
        let n=0;
        const ask=()=>{
          const i=n+1;
          stage.innerHTML=`${head(A('q',i,DEF.q[n]).replace(/^f_q\d/,''),`How well do you know us? · ${i} / 3`)}<div class="fl-row">${['a','b'].map(k=>`<button class="fl-opt" data-k="${k}">${esc(g(d,`f_q${i}${k}`,(k==='a'?DEF.qa:DEF.qb)[n]))}</button>`).join('')}</div><p class="lj-react fl-hide">${esc(g(d,`f_q${i}r`,DEF.qr[n]))}</p><button class="fl-next fl-hide">${i===3?'Continue →':'Next question →'}</button>`;
          stage.querySelectorAll('.fl-opt').forEach(b=>b.onclick=e=>{stage.querySelectorAll('.fl-opt').forEach(o=>{o.disabled=true;o.classList.remove('pick')});b.classList.add('pick');boom(e,['🥰','❤️','😂','✨'],14);const r=stage.querySelector('.lj-react');r.classList.remove('fl-hide');r.classList.add('lj-pop');const nb=stage.querySelector('.fl-next');nb.classList.remove('fl-hide');nb.onclick=ev=>{boom(ev,['❤️'],8);if(i===3)next();else{n++;ask()}}});
        };ask();
      },
      /* 8 · Secret envelope */
      function envelope(){
        stage.innerHTML=`${head('','A secret').replace('<h2 class="fl-title"></h2>','')}<p class="lj-bigtext">${esc(g(d,'f_env',DEF.env))}</p><button class="lj-env"><span class="lj-pap">💌</span><span class="lj-flap"></span><span class="lj-fr"></span></button><p class="fl-kick lj-tap">Tap the envelope</p>${cont()}`;
        const eb=stage.querySelector('.lj-env');
        eb.onclick=e=>{eb.onclick=null;eb.classList.add('open');stage.querySelector('.lj-tap').style.display='none';boom(e,['💌','✨','❤️'],14);{const[x,y]=at(e);V.fountain(x,y,'sparks',1100);V.flare(x,y,'rgba(255,235,190,.95)');V.ring(x,y,'rgba(255,230,170,.9)',30,4)}later(()=>{eb.outerHTML=`<article class="lj-letter lj-pop"><p>${esc(g(d,'f_secret',DEF.secret))}</p></article>`;later(showCont,600)},1100)};
      },
      /* 9 · Our future */
      function future(){
        const seen=new Set();
        stage.innerHTML=`<p class="lj-bigtext lj-type"></p><div class="lj-fcards fl-hide">${DEF.futT.map((t,i)=>`<button class="lj-fc" data-i="${i}"><b>${esc(t)}</b><p>${esc(A('fu',i+1,DEF.fu[i]))}</p></button>`).join('')}</div>${cont()}`;
        typeInto(stage.querySelector('.lj-type'),g(d,'f_fut',DEF.fut),52,()=>{stage.querySelector('.lj-fcards').classList.remove('fl-hide');stage.querySelector('.lj-fcards').classList.add('fl-in')});
        stage.querySelectorAll('.lj-fc').forEach(b=>b.onclick=e=>{if(b.classList.contains('on'))return;b.classList.add('on');seen.add(b.dataset.i);const em=b.querySelector('b').textContent.trim().slice(0,2);boom(e,[em,'✨','💫'],16);if(seen.size===3)showCont()});
      },
      /* 10 · Promise cards */
      function promises(){
        const P=[1,2,3,4,5].map(i=>A('pr',i,DEF.pr[i-1]));let k=0;
        stage.innerHTML=`${head('Promise Cards','Tap each card')}<div class="fl-row lj-prow">${P.map(x=>`<button class="fl-item fl-card"><span class="fl-front">🤞</span><span class="fl-back">${esc(x)}</span></button>`).join('')}</div>${cont()}`;
        stage.querySelectorAll('.fl-item').forEach(b=>b.onclick=e=>{if(b.classList.contains('done'))return;b.classList.add('done');boom(e,['❤️','🤞','✨'],12);if(++k===5){showCont();V.confetti('l');V.confetti('r')}});
      },
      /* 11 · One last question */
      function last(){
        let nudged=false;
        stage.innerHTML=`<div class="lj-bigheart">❤️</div><p class="lj-bigtext lj-l1" style="opacity:0">${esc(g(d,'f_lq1',DEF.lq1))}</p><p class="lj-q lj-l2"></p><div class="fl-row2 lj-ch fl-hide"><button class="fl-ghost lj-yes2">YES ❤️</button><button class="lj-always">ALWAYS ❤️</button></div><p class="fl-msg fl-small lj-nudge"> </p>`;
        V.follow(stage.querySelector('.lj-bigheart'));
        const l1=stage.querySelector('.lj-l1');later(()=>{l1.style.transition='opacity 1.2s';l1.style.opacity=1},300);
        later(()=>typeInto(stage.querySelector('.lj-l2'),g(d,'f_lq2',DEF.lq2),50,()=>later(()=>{const c=stage.querySelector('.lj-ch');c.classList.remove('fl-hide');c.classList.add('fl-in')},400)),2200);
        stage.querySelector('.lj-always').onclick=e=>{boom(e,['❤️','💖','✨'],26);{const[x,y]=at(e);V.flare(x,y);V.ring(x,y,'rgba(255,60,120,.9)',30,6);setTimeout(()=>V.ring(x,y,'rgba(255,200,220,.8)',20,5),180);V.hearts(x,y,26,{big:34});V.slowmo(500,.4);V.shake(root,380,8)}later(next,950)};
        stage.querySelector('.lj-yes2').onclick=e=>{if(!nudged){nudged=true;stage.querySelector('.lj-nudge').textContent='A yes is lovely… but we both know the answer is ALWAYS ❤️';stage.querySelector('.lj-always').classList.add('big');return}boom(e,['❤️'],14);later(next,400)};
      },
      /* 12 · Final celebration */
      function celebrate(){
        stage.innerHTML=`<div class="lj-cel"><p class="lj-bigtext lj-c1" style="opacity:0">${esc(g(d,'f_cel1',DEF.cel1))}</p><h2 class="fl-title fl-big lj-c2" style="opacity:0">${esc(g(d,'f_cel2',DEF.cel2))}</h2></div>${cont()}`;
        V.fireworks(true);V.confetti('l');V.confetti('r');later(()=>{V.confetti('l');V.confetti('r')},1600);later(()=>{V.confetti('l');V.confetti('r')},3200);
        const r=stage.getBoundingClientRect();[.2,.4,.6,.8,.5].forEach((x,i)=>later(()=>burst(r.left+r.width*x,r.top+r.height*.35,['❤️','💖','🌹','✨','🎉'],26),i*350));
        const iv=setInterval(()=>{const h=document.createElement('span');h.className='lj-fall';h.textContent=['❤️','💖','💕','🌹','🎉'][(Math.random()*5)|0];h.style.cssText=`left:${Math.random()*96}%;font-size:${16+Math.random()*22}px;animation-duration:${4+Math.random()*4}s`;root.appendChild(h);setTimeout(()=>h.remove(),8500)},230);timers.push(iv);
        const c1=stage.querySelector('.lj-c1'),c2=stage.querySelector('.lj-c2');
        later(()=>{c1.style.transition='opacity 1s';c1.style.opacity=1},500);later(()=>{c2.style.transition='opacity 1.2s';c2.style.opacity=1},2200);later(showCont,3800);
      },
      /* 13 · Final memories collage */
      function collage(){
        stage.innerHTML=`${head('Our Memories','All together')}<div class="lj-col">${[0,1,2,3].map(k=>`<figure class="lj-cp" style="--k:${k}">${pic(k)}<figcaption>${esc(A('cap',k+1,DEF.cap[k]))}</figcaption></figure>`).join('')}</div><p class="lj-bigtext">${esc(g(d,'f_col',DEF.col))}</p>${cont()}`;
        later(()=>{const c=stage.querySelector('.lj-col').getBoundingClientRect();V.flare(c.left+c.width/2,c.top+c.height*.4,'rgba(255,225,190,.9)');V.sparks(c.left+c.width/2,c.top+c.height/2,50,undefined,.6)},700);
        later(showCont,900);
      },
      /* 14 · Final love letter */
      function letter(){
        stage.classList.add('lj-full');
        const lines=g(d,'f_fl',DEF.fl).split(/\n+/).filter(Boolean);
        stage.innerHTML=`<article class="lj-full-letter"><p class="fl-kick">A letter for you</p><div class="lj-lines">${lines.map(()=>'<p></p>').join('')}</div><p class="lj-forever fl-hide">❤️ ${esc(g(d,'f_sign',DEF.sign))} ❤️</p><button class="fl-next lj-replay fl-hide">Replay Our Story ↻</button></article>`;
        const ps=[...stage.querySelectorAll('.lj-lines p')];let li=0;
        const go=()=>{if(li>=ps.length){stage.querySelector('.lj-forever').classList.remove('fl-hide');stage.querySelector('.lj-forever').classList.add('fl-in');{const r=stage.querySelector('.lj-forever').getBoundingClientRect();V.hearts(r.left+r.width/2,r.top,14);V.sparks(r.left+r.width/2,r.top+10,40)}later(()=>{const b=stage.querySelector('.lj-replay');b.classList.remove('fl-hide');b.classList.add('fl-in');b.onclick=()=>{idx=0;show()}},700);return}const el=ps[li++];typeInto(el,lines[li-1],34,()=>later(go,380))};
        later(go,500);
        const r=stage.getBoundingClientRect();later(()=>burst(r.left+r.width/2,r.top+80,['❤️','✨'],12),400);
      }
    ];

    function show(){
      clear();V.fireworks(false);V.follow(null);root.querySelectorAll('.lj-fall').forEach(e=>e.remove());stage.classList.remove('lj-full');
      root.dataset.mode=MODES[idx]||'wine';if(root.dataset.mode!==curMode){curMode=root.dataset.mode;V.mode(curMode)}root.dataset.page=['yes','msg','mem','hidden','hug','choose','quiz','envelope','future','promises','last','celebrate','collage','letter'][idx];
      root.querySelector('.fl-count').textContent=`${idx+1} / ${S.length}`;
      root.querySelector('.fl-back').style.visibility=idx===0?'hidden':'visible';
      root.querySelector('.fl-dots').innerHTML=S.map((_,i)=>`<i class="${i<=idx?'on':''}"></i>`).join('');
      stage.scrollTop=0;stage.classList.remove('fl-in','lj-focus');void stage.offsetWidth;stage.classList.add('fl-in','lj-focus');
      if(idx>0){const bl=root.querySelector('.lj-bloom');bl.classList.remove('go');void bl.offsetWidth;bl.classList.add('go')}
      S[idx]();
    }
    root.querySelector('.fl-back').onclick=()=>{if(idx>0){idx--;show()}};
    show();
  }

  window.WISHORA_JOURNEYS=Object.assign(window.WISHORA_JOURNEYS||{},{[SLUG]:{render,groups,pages:14}});
})();
