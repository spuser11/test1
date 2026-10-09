/* Wishora V15 — Classic-Confetti-style flow per occasion (config + engine + builder fields) */
(function(){
  const F={};
  function O(pal,fx,hero,popT,popI,popD,lightT,lightI,lightN,lightD,pickT,pickI,pickD,giftT,giftI,giftD,wishT,wishD,endT,endD){
    return{pal,fx,hero,pop:{t:popT,i:popI,d:popD},light:{t:lightT,i:lightI,n:lightN,d:lightD},pick:{t:pickT,i:pickI,d:pickD},gift:{t:giftT,i:giftI,d:giftD},wish:{t:wishT,d:wishD},end:{t:endT,d:endD}};
  }
  F.birthday=O(['#ffe3ef','#fff1d6','#e91e63','#a3124f'],['🎈','🎉','🎂','✨','💖'],'🎂','Pop the balloons','🎈',['Joy','Laughter','Cake'],'Light the candles','🕯️',3,'May this year be your brightest one yet.','Pick a flower','🌷',['You make every day brighter','You are loved more than you know','Here is to you'],'Your gift is here','🎁','A little something made just for you.','Birthday wishes',['Laugh loudly','Dream bigger','Celebrate often'],'Happy Birthday!','Thank you for being you.');
  F.wedding=O(['#fdeee6','#f8e1e7','#c9776b','#8f4a4a'],['🌸','🤍','💍','✨','🕊️'],'💍','Scatter the petals','🌸',['Forever','Together','Always'],'Light the unity candle','🕯️',2,'Two flames, one light, one life together.','Choose a blessing','💐',['May your home be full of laughter','May love grow with every year','May you always choose each other'],'Open the ring box','💍','Every promise starts here.','Promises & blessings',['I will always listen','I will always laugh with you','I will always choose us'],'Here begins forever','With all our love and happiness.');
  F.anniversary=O(['#ffe1e6','#ffd0dd','#e0457b','#a61e4d'],['❤️','💕','🌹','✨','💫'],'❤️','Collect the hearts','❤️',['Love','Laughter','Us'],'Light the candles of our years','🕯️',3,'Every year with you is my favourite.','Open a memory','💌',['The day we met','Our favourite little moment','The best is still ahead'],'Open our love box','🎁','Something small, for something big.','Promises for the years ahead',['More adventures','More laughter','More us'],'Here is to us','Thank you for every year.');
  F.graduation=O(['#e3ecff','#fff3d1','#2f55c8','#1c3a8a'],['🎓','⭐','✨','📜','🎉'],'🎓','Collect your stars','⭐',['Hard work','Courage','Dreams'],'Light the lamps of knowledge','🪔',3,'You earned every bit of this moment.','Choose a chapter','📘',['The late nights paid off','You never gave up','The future is yours'],'Unroll your diploma','📜','Officially unstoppable.','Wishes for your next chapter',['Stay curious','Be brave','Keep shining'],'Congratulations, graduate!','So proud of you.');
  F.congratulations=O(['#fff0cf','#ffe0ec','#f59e0b','#b45309'],['🏆','🎉','✨','⭐','👏'],'🏆','Pop the confetti','🎊',['Proud','Brilliant','Unstoppable'],'Fire the sparklers','🎇',3,'Look how far you have come.','Pick a trophy','🏆',['Hard work wins','You deserve this','Keep going'],'Open your reward','🎁','You earned this one.','Cheers for you',['Celebrate loudly','Rest well','Dream bigger'],'You did it!','Congratulations!');
  F['festival-wishes']=O(['#fff0d0','#ffd3a8','#e8590c','#9c3a06'],['🪔','✨','🎆','🌼','🧡'],'🪔','Tap the lanterns','🏮',['Light','Joy','Prosperity'],'Light the diyas','🪔',4,'May your home glow with happiness.','Choose a blessing','🌼',['Peace in every corner','Sweetness in every day','Light in every heart'],'Open the festive box','🎁','Sweet blessings, just for you.','Festive wishes',['Good health','Good fortune','Good company'],'Happy festival!','Wishing you light and joy.');
  F['baby-shower']=O(['#e0f4ff','#f3e5ff','#4aa3d6','#2b6b94'],['🍼','☁️','⭐','🧸','💙'],'🍼','Pop the clouds','☁️',['Tiny','Precious','Loved'],'Wish upon the stars','⭐',3,'May this little one be wrapped in love.','Pick a little gift','🧸',['Sweet dreams','Tiny toes, big love','So many cuddles ahead'],'Open the baby box','🎁','A tiny surprise.','Wishes for baby',['Healthy and happy','Surrounded by love','Full of giggles'],'Welcome, little one','The family is growing.');
  F.farewell=O(['#dff7f3','#e4ecff','#1fa896','#0e6b75'],['✈️','🌅','💌','✨','🧳'],'✈️','Stamp the tickets','🎫',['Memories','Friends','Adventure'],'Send up the lanterns','🏮',3,'Wherever you go, we are with you.','Open a keepsake','💌',['You will be missed','Thank you for everything','Stay in touch'],'Open your travel kit','🧳','Something for the road.','Parting wishes',['Safe travels','New adventures','Come back soon'],'Until we meet again','Go shine.');
  F.housewarming=O(['#fdeed8','#e6f3de','#d9822b','#8a4b12'],['🏡','🔑','🌿','✨','🧡'],'🏡','Unlock the doors','🔑',['Home','Warmth','Love'],'Light up the rooms','💡',3,'May this house be full of happy memories.','Pick a housewarming gift','🪴',['Fresh plants, fresh start','A cozy corner for you','Open doors, open hearts'],'Open the front door','🚪','Welcome to your new home.','Wishes for the new home',['Peaceful mornings','Joyful evenings','Plenty of guests'],'Welcome home','Cheers to new beginnings.');
  F.custom=O(['#ece6ff','#ffe6f3','#7c5cff','#4b2fb8'],['✨','💫','🎈','💖','⭐'],'✨','Pop the stars','⭐',['Special','Bright','Yours'],'Light the sparkles','✨',3,'This moment is just for you.','Pick a card','💌',['You matter','Thank you','This is for you'],'Open your surprise','🎁','Made with love.','A few wishes',['Be happy','Be kind','Be you'],'Made for you','Thank you for being here.');

  const POP4={birthday:'Wishes',wedding:'Blessings',anniversary:'Forever',graduation:'Success',congratulations:'Victory','festival-wishes':'Blessings','baby-shower':'Giggles',farewell:'Hugs',housewarming:'Cheers',custom:'Wonder'};
  Object.keys(F).forEach(k=>F[k].pop.d.push(POP4[k]||'Magic'));

  const JR=p=>window.WISHORA_JOURNEYS&&p&&window.WISHORA_JOURNEYS[p.slug];
  const has=p=>!!(p&&(JR(p)||(F[p.occasionId]&&p.slug!=='wishora-birthday-classic')));
  const g=(d,k,def)=>(d&&d[k]&&String(d[k]).trim())||def;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const absu=u=>{if(!u)return'';try{return new URL(u,document.baseURI).href}catch(e){return u}};

  const DEF_ORDER=['pop','light','pick','photos','letter','gift','wish','surprise','end'];
  const SK=p=>(window.WISHORA_SKINS||{})[p.slug]||{};
  function cfg(p){const b=F[p.occasionId],k=SK(p);return Object.assign({},b,{fx:k.fx||b.fx,hero:k.hero||b.hero,pop:Object.assign({},b.pop,k.pi?{i:k.pi}:{}),gift:Object.assign({},b.gift,k.gi?{i:k.gi}:{}),k})}
  const DEF={cine:['A story of two people','Years of laughter, one love','Now showing: your anniversary'],tl:['The beginning','The best part','What comes next'],st:['New horizons','Old friends','Next adventure'],rooms:['Living Room','Kitchen','Garden'],roomc:['Where we gather','Where the magic is cooked','Where the sun lives'],quizo:['Boy','Girl','A surprise!'],vow:['I promise to laugh with you every day.','I promise to choose you, always.']};

  /* ---------- builder fields: generated from THIS template's page order ---------- */
  function groups(p){
    if(JR(p))return JR(p).groups(p);
    const c=cfg(p),k=c.k,order=k.order||DEF_ORDER;
    const tri=(id,L,arr,n)=>arr.slice(0,n).map((v,i)=>({id:`f_${id}${i+1}`,label:`${L} ${i+1}`,placeholder:v,max:140})),ta=(id,label,ph,max)=>({id,label,placeholder:ph,max:max||300,type:'textarea',full:true});
    const tl=k.tl||DEF.tl,st=k.st||DEF.st,rm=k.rooms||DEF.rooms,rc=k.roomc||DEF.roomc,cn=k.cine||DEF.cine;
    const PG={
      trailer:['Opening trailer','Three title cards that play before the story.',()=>tri('cine','Title card',cn,3)],
      pop:[c.pop.t,'Four words, one revealed by each tap.',()=>tri('pop','Word',c.pop.d,4)],
      light:[c.light.t,'Message shown once everything is lit.',()=>[ta('f_light','Message',c.light.d,200)]],
      pick:[c.pick.t,'Three messages, one behind each card.',()=>tri('pick','Message',c.pick.d,3)],
      timeline:[k.tlT||'Timeline','Three milestones shown one by one.',()=>tri('tl','Milestone',tl,3)],
      stamp:[k.stT||'Stamp your passport','Three destinations to stamp.',()=>tri('stamp','Stamp',st,3)],
      rooms:['Room tour','Three rooms, each with a caption.',()=>[...tri('room','Room name',rm,3),...tri('roomc','Caption',rc,3)]],
      quiz:['Guess the baby','The question, three guesses and the reveal.',()=>[{id:'f_quizq',label:'Question',placeholder:'Boy or girl? Make your guess!',max:140},...tri('quizo','Option',DEF.quizo,3),ta('f_quizr','Reveal message','Thank you for playing! Everyone wins a hug.',200)]],
      vows:['Vows','Two vows that appear one at a time.',()=>tri('vow','Vow',DEF.vow,2)],
      photos:['Photos','Add photos in the Media tab. They play in this template\'s own photo style.',()=>[]],
      letter:['Letter','Opens from a tap-to-open envelope.',()=>[ta('letter','Your letter','Write something only they would understand…',3000)]],
      gift:[c.gift.t,'Revealed after two taps on the gift.',()=>[ta('f_gift','Gift message',c.gift.d)]],
      wish:[c.wish.t,'Three wishes that appear one by one.',()=>tri('wish','Wish',c.wish.d,3)],
      surprise:['One more surprise','A last personal note before the ending.',()=>[ta('f_surprise','Surprise message','This whole page was made with love, just for you.')]],
      end:['Finale','The last screen, with confetti.',()=>[ta('f_end','Closing message',c.end.d)]]
    };
    const out=[];
    order.forEach((id,i)=>{const g=PG[id];if(g)out.push({title:`${id==='end'?'Finale':'Page '+(i+1)} · ${g[0]}`,copy:g[1],defs:g[2]()})});
    return out;
  }

  /* ---------- engine ---------- */
  function confetti(x,y,fx){
    if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    for(let i=0;i<24;i++){const s=document.createElement('span');s.className='fl-conf';s.textContent=fx[i%fx.length];s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
      const a=Math.random()*6.28,r=60+Math.random()*150;
      s.animate([{transform:'translate(0,0) scale(.6)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r+100}px) rotate(${Math.random()*600}deg) scale(1.15)`,opacity:0}],{duration:950+Math.random()*500,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove();}
  }
  const ASK={birthday:'Are you excited for your surprise?',wedding:'Ready to step into our story?',anniversary:'Shall we look back together?',graduation:'Ready for your big moment?',congratulations:'Ready to celebrate you?','festival-wishes':'Shall we light up the page?','baby-shower':'Ready to meet the little surprise?',housewarming:'Ready for the grand tour?',farewell:'Ready for a little goodbye party?',custom:'Ready for something special?'};
  const NOMSG=['Hmm… are you sure? 🥺','The surprise is waiting… 🎁','Pretty please? 💖','Okay okay, just press Yes ✨'];
  function render(d,p,app,o){
    if(JR(p))return JR(p).render(d,p,app,o);
    const c=cfg(p),k=c.k,fx=c.fx,pal=c.pal,rec=g(d,'recipient',''),snd=g(d,'sender',''),recD=rec||'you',nm=rec?', '+rec:'';
    const prof=(window.WISHORA_TEMPLATE_PROFILES||{})[p.slug]||{},art=absu(prof.heroArt||prof.coverArt||'');
    const heroHtml=art?`<img class="fl-art" src="${esc(art)}" alt="">`:`<div class="fl-hero">${c.hero}</div>`;
    const order=(k.order||DEF_ORDER).slice();if(o&&o.intro)order.unshift('intro');let idx=0;
    const V=window.WISHORA_VIBES,vb=V?V.get(p.slug):null;
    const T=Object.assign({i:`A surprise for ${rec}`,ph:'Some Sweet Moments',lt:'Message From My Heart',md:'Our Little Soundtrack 🎵',su:'One More Little Surprise 💝'},k.T);
    const vars=`--c1:${pal[0]};--c2:${pal[1]};--ac:${k.ac||pal[2]};--dp:${k.dp||pal[3]};--txt:${k.txt||'#3a2230'};--sf:${k.sf||'#fff'};--onsf:${k.onsf||k.txt||'#3a2230'};--barc:${k.barc||k.dp||pal[3]};--fd:${k.f||"Fraunces,Georgia,serif"};--fm:${k.fm||k.f||"Outfit,system-ui,sans-serif"};${k.bg?`background:${k.bg};`:''}`;
    app.innerHTML=`<div class="fl" data-card="${k.card||'none'}" data-pop="${k.pop||'balloon'}" data-pick="${k.pick||'flip'}" data-photo="${k.photo||'polaroid'}" data-align="${k.align||'center'}" data-btn="${k.btn||'pill'}" data-tr="${k.tr||'rise'}" style="${vars}"><div class="fl-fx"></div><div class="fl-bar"><button class="fl-back">← Back</button><span class="fl-count"></span></div><div class="fl-stage"></div><div class="fl-dots"></div><div class="v-trans"></div></div>`;
    const root=app.querySelector('.fl'),stage=root.querySelector('.fl-stage'),fxl=root.querySelector('.fl-fx');
    if(window.WISHORA_BGM)window.WISHORA_BGM.attach(root,d);
    for(let i=0;i<14;i++){const s=document.createElement('span');s.textContent=fx[i%fx.length];s.style.cssText=`left:${Math.random()*96}%;font-size:${16+Math.random()*20}px;animation-duration:${9+Math.random()*9}s;animation-delay:${-Math.random()*14}s`;fxl.appendChild(s)}
    if(vb&&vb.amb)V.ambient(fxl,vb.amb);
    root.querySelector('.fl-back').onclick=()=>{if(idx===0){location.reload();return}idx--;show()};
    const boom=e=>{const r=(e&&e.currentTarget||stage).getBoundingClientRect();confetti(e&&e.clientX?e.clientX:r.left+r.width/2,e&&e.clientY?e.clientY:r.top+r.height/2,fx)};
    const next=()=>{idx++;show()};
    const auto=ms=>{const at=idx;setTimeout(()=>{if(idx===at)next()},ms)};
    const cont=label=>`<button class="fl-next fl-hide">${label||'Continue →'}</button>`;
    const reveal=()=>{const b=stage.querySelector('.fl-next');if(b){b.classList.remove('fl-hide');b.onclick=e=>{boom(e);next()}}};
    const head=(t,h)=>`<h2 class="fl-title">${esc(t)}</h2><p class="fl-kick">${esc(h)}</p>`;
    const wire=()=>{const b=stage.querySelector('.fl-next');b.onclick=e=>{boom(e);next()}};
    const arr=(key,n,def)=>Array.from({length:n},(_,i)=>g(d,`f_${key}${i+1}`,def[i]));
    const S={
      intro(){let n=0,sc=1;
        stage.innerHTML=`<p class="fl-kick fl-up">${esc(p.name)}</p><p class="fl-meta">${esc(((vb&&vb.meta)||'').replace('{rec}',recD))}</p><h2 class="fl-title fl-big">${esc(T.i)}</h2>${heroHtml}<p class="fl-ask">${esc(ASK[p.occasionId]||'Ready for something special?')}</p><div class="fl-row2"><button class="fl-ghost fl-no">No</button><button class="fl-next fl-yes">Yes ✦</button></div><p class="fl-msg fl-small fl-nomsg"> </p>`;
        const yes=stage.querySelector('.fl-yes'),no=stage.querySelector('.fl-no'),m=stage.querySelector('.fl-nomsg');
        yes.onclick=e=>{boom(e);next()};
        no.onclick=()=>{m.textContent=NOMSG[Math.min(n,3)];n++;sc=Math.min(1.45,sc+.12);yes.style.transform=`scale(${sc})`;no.classList.remove('fl-shake');void no.offsetWidth;no.classList.add('fl-shake');if(n>=4)no.style.display='none'}},
      trailer(){const L=arr('cine',3,k.cine||DEF.cine);let i=0;
        stage.innerHTML=`<div class="fl-bars"></div><p class="fl-kick fl-gold">NOW SHOWING</p><h2 class="fl-title fl-big fl-trail"></h2><p class="fl-msg fl-small">${esc(rec)}${d.date?' · '+esc(d.date):''}</p>`;
        const t=stage.querySelector('.fl-trail'),at=idx;const play=()=>{if(idx!==at)return;if(i>=L.length){next();return}t.classList.remove('fl-in');void t.offsetWidth;t.classList.add('fl-in');t.textContent=L[i++];setTimeout(play,2000)};play()},
      pop(){const w=arr('pop',4,c.pop.d),got=[];
        stage.innerHTML=`${head(`${c.pop.t}${nm}`,`Pop all 4 · tap each one`)}<div class="fl-field">${w.map((x,i)=>`<button class="fl-item fl-bal fl-float" style="--i:${i}"><span>${c.pop.i}</span></button>`).join('')}</div><p class="fl-words"></p>`;
        stage.querySelectorAll('.fl-item').forEach((b,i)=>b.onclick=e=>{if(b.classList.contains('done'))return;b.classList.add('done');b.innerHTML=esc(w[i]);boom(e);got.push(w[i]);stage.querySelector('.fl-words').textContent=`${got.length} / 4`;if(got.length===4){stage.querySelector('.fl-words').textContent=got.join(' · ');auto(1500)}})},
      light(){const n=c.light.n;let kk=0;
        stage.innerHTML=`${head(c.light.t,'Tap each one to light it')}<div class="fl-plinth">${art?`<img class="fl-art fl-sm" src="${esc(art)}" alt="">`:`<div class="fl-hero fl-sm">${c.hero}</div>`}</div><div class="fl-row">${Array.from({length:n},()=>`<button class="fl-item fl-candle"><span class="fl-flame">🔥</span><span>${c.light.i}</span></button>`).join('')}</div><p class="fl-msg fl-hide">${esc(g(d,'f_light',c.light.d))}</p>`;
        stage.querySelectorAll('.fl-item').forEach(b=>b.onclick=e=>{if(b.classList.contains('done'))return;b.classList.add('done');boom(e);if(++kk===n){stage.querySelector('.fl-msg').classList.remove('fl-hide');auto(2800)}})},
      pick(){const m=arr('pick',3,c.pick.d);let kk=0;
        stage.innerHTML=`${head(`Your ${c.pick.t.replace(/^(Pick|Choose|Open) (a |an |the )?/i,'')} ${c.pick.i}`,'A little gift of words, just for you')}<div class="fl-row">${m.map(x=>`<button class="fl-item fl-card"><span class="fl-front">${c.pick.i}</span><span class="fl-back">${esc(x)}</span></button>`).join('')}</div>${cont()}`;
        stage.querySelectorAll('.fl-item').forEach(b=>b.onclick=e=>{if(b.classList.contains('done'))return;b.classList.add('done');boom(e);if(++kk===3)reveal()})},
      timeline(){const L=arr('tl',3,k.tl||DEF.tl);
        stage.innerHTML=`${head(k.tlT||'Timeline','Scroll through the moments')}<ol class="fl-tlist">${L.map((x,i)=>`<li style="animation-delay:${i*.5}s"><i>${i+1}</i><span>${esc(x)}</span></li>`).join('')}</ol><button class="fl-next">Keep going →</button>`;wire()},
      stamp(){const L=arr('stamp',3,k.st||DEF.st);let n=0;
        stage.innerHTML=`${head(k.stT||'Stamp your passport','Tap each stamp')}<div class="fl-row">${L.map((x,i)=>`<button class="fl-item fl-stamp" style="--r:${(i-1)*8}deg"><b>?</b><small>${esc(x)}</small></button>`).join('')}</div>`;
        stage.querySelectorAll('.fl-item').forEach(b=>b.onclick=e=>{if(b.classList.contains('done'))return;b.classList.add('done');b.querySelector('b').textContent='✔';boom(e);if(++n===3)auto(1500)})},
      rooms(){const R=arr('room',3,k.rooms||DEF.rooms),C=arr('roomc',3,k.roomc||DEF.roomc),ph=(Array.isArray(d.photos)?d.photos:[]).map(x=>typeof x==='string'?x:(x&&(x.src||x.data))||'');let i=0;
        stage.innerHTML=`${head('Take the tour','Tap a room')}<div class="fl-tabs">${R.map((x,j)=>`<button class="fl-tab" data-i="${j}">${esc(x)}</button>`).join('')}</div><div class="fl-room"></div><button class="fl-next">Keep going →</button>`;
        const paint=()=>{stage.querySelectorAll('.fl-tab').forEach((t,j)=>t.classList.toggle('on',j===i));stage.querySelector('.fl-room').innerHTML=`${ph[i]?`<img src="${esc(ph[i])}" alt="">`:`<div class="fl-ph">${fx[i]}</div>`}<p>${esc(C[i])}</p>`};
        stage.querySelectorAll('.fl-tab').forEach(t=>t.onclick=()=>{i=+t.dataset.i;paint()});paint();wire()},
      quiz(){const O=arr('quizo',3,DEF.quizo);
        stage.innerHTML=`${head(g(d,'f_quizq','Boy or girl? Make your guess!'),'Tap your guess')}<div class="fl-row">${O.map(x=>`<button class="fl-item fl-opt">${esc(x)}</button>`).join('')}</div><p class="fl-msg fl-hide">${esc(g(d,'f_quizr','Thank you for playing! Everyone wins a hug.'))}</p>${cont('Keep going →')}`;
        stage.querySelectorAll('.fl-item').forEach(b=>b.onclick=e=>{stage.querySelectorAll('.fl-opt').forEach(o=>o.classList.remove('pick'));b.classList.add('pick');boom(e);stage.querySelector('.fl-msg').classList.remove('fl-hide');reveal()})},
      vows(){const V=arr('vow',2,DEF.vow);let n=0;
        stage.innerHTML=`${head(rec?`Vows for ${rec}`:'Our vows','Tap to hear them')}<div class="fl-vows">${V.map(x=>`<blockquote class="fl-vow fl-hide">“${esc(x)}”</blockquote>`).join('')}</div><button class="fl-next">First vow →</button>`;
        const b=stage.querySelector('.fl-next'),q=stage.querySelectorAll('.fl-vow');b.onclick=e=>{boom(e);if(n<2){q[n].classList.remove('fl-hide');q[n].classList.add('fl-pop');n++;b.textContent=n<2?'Next vow →':'Keep going →'}else next()}},
      photos(){const ph=(Array.isArray(d.photos)?d.photos:[]).map(x=>typeof x==='string'?x:(x&&(x.src||x.data))||'').filter(Boolean).slice(0,8);
        const slides=ph.length?ph.map(s=>`<figure class="fl-pol"><img src="${esc(s)}" alt=""><figcaption>${esc(rec)}</figcaption></figure>`):[0,1,2].map(i=>`<figure class="fl-pol"><div class="fl-ph">${fx[i]}</div><figcaption>Add a photo in the builder</figcaption></figure>`);
        let i=0;stage.innerHTML=`${head(T.ph,'Swipe or use the buttons')}<div class="fl-car">${slides.join('')}</div><div class="fl-cdots">${slides.map(()=>'<i></i>').join('')}</div><div class="fl-row2"><button class="fl-ghost fl-prev">← Prev</button><button class="fl-next fl-nx">Next →</button></div>`;
        const els=[...stage.querySelectorAll('.fl-pol')],dots=[...stage.querySelectorAll('.fl-cdots i')],nx=stage.querySelector('.fl-nx'),pv=stage.querySelector('.fl-prev');
        const paint=()=>{els.forEach((e,kk)=>e.classList.toggle('on',kk===i));dots.forEach((e,kk)=>e.classList.toggle('on',kk===i));nx.textContent=i===els.length-1?'Keep going →':'Next →';pv.style.visibility=i?'visible':'hidden'};
        nx.onclick=e=>{if(i===els.length-1){boom(e);next()}else{i++;paint()}};pv.onclick=()=>{if(i){i--;paint()}};
        let x0=null;const car=stage.querySelector('.fl-car');car.onpointerdown=e=>x0=e.clientX;car.onpointerup=e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(dx<-40&&i<els.length-1){i++;paint()}if(dx>40&&i){i--;paint()}};paint()},
      letter(){stage.innerHTML=`${head(T.lt,'Tap to open')}<button class="fl-env fl-float"><span>💌</span></button><article class="fl-paper fl-hide"><p>${rec?'Dear '+esc(rec)+',':'Hello,'}</p><p>${esc(g(d,'letter','Thank you for being you. This little page is just a small way to say how much you mean to me.'))}</p>${snd?`<p class="fl-sign">— ${esc(snd)}</p>`:''}</article>${cont('Keep going →')}`;
        const env=stage.querySelector('.fl-env');env.onclick=e=>{env.remove();boom(e);const pp=stage.querySelector('.fl-paper');pp.classList.remove('fl-hide');pp.classList.add('fl-pop');reveal()}},
      gift(){let t=0;stage.innerHTML=`${head(c.gift.t+'…','Tap the gift twice to open it')}<div class="fl-giftwrap"><button class="fl-gift fl-float">${c.gift.i}</button><span class="fl-badge">0</span></div><p class="fl-msg fl-hide">${esc(g(d,'f_gift',c.gift.d))}</p>${cont('Keep going →')}`;
        const b=stage.querySelector('.fl-gift'),bd=stage.querySelector('.fl-badge');b.onclick=e=>{if(t>=2)return;t++;bd.textContent=t;boom(e);b.classList.remove('fl-shake');void b.offsetWidth;b.classList.add('fl-shake');if(t===2){b.classList.add('fl-open');stage.querySelector('.fl-msg').classList.remove('fl-hide');reveal()}}},
      wish(){const w=arr('wish',3,c.wish.d);stage.innerHTML=`${head(`${c.wish.t} ✨`,'Because one message is never enough')}<div class="fl-wishes">${w.map((x,i)=>`<div class="fl-wish" style="animation-delay:${i*.35}s">${fx[i]} ${esc(x)}</div>`).join('')}</div><button class="fl-next">Keep going →</button>`;wire()},
      media(){const a=d.audioData?`<audio controls src="${esc(d.audioData)}"></audio>`:'<p class="fl-muted">🎵 Your audio will appear here</p>',v=d.videoData?`<video controls playsinline src="${esc(d.videoData)}"></video>`:'<p class="fl-muted">🎬 Your video will appear here</p>';
        stage.innerHTML=`${head(T.md,'Press play and stay a while')}<div class="fl-media"><b>${esc(g(d,'songTitle','Your song'))}</b><small>${esc(g(d,'songArtist','Artist'))}</small>${a}${v}</div><button class="fl-next">One more page →</button>`;wire()},
      surprise(){const first=(Array.isArray(d.photos)&&d.photos[0])?(typeof d.photos[0]==='string'?d.photos[0]:d.photos[0].src||''):'';
        stage.innerHTML=`${head(T.su,'Made just for you')}<div class="fl-sur">${first?`<img class="fl-sphoto" src="${esc(first)}" alt="">`:heroHtml}<p>${esc(g(d,'f_surprise','This whole page was made with love, just for you.'))}</p></div><button class="fl-next">Show me the ending →</button>`;wire()},
      end(){stage.innerHTML=`${heroHtml}<h2 class="fl-title fl-big">${esc(g(d,'title',c.end.t))} ✨</h2><p class="fl-msg">${esc(g(d,'f_end',c.end.d))}</p><p class="fl-msg fl-small">Once again, this one is for <b>${esc(recD)}</b> 💖</p>${snd?`<p class="fl-sign">— ${esc(snd)}</p>`:''}<div class="fl-row2"><button class="fl-ghost fl-copy">🔗 Copy link</button><button class="fl-next fl-replay">↺ Replay</button></div>`;
        stage.querySelector('.fl-replay').onclick=()=>{idx=0;show()};const cp=stage.querySelector('.fl-copy');cp.onclick=()=>{try{navigator.clipboard.writeText(location.href.split('?')[0])}catch(e){}cp.textContent='Copied ✓'};
        const r=stage.getBoundingClientRect();[.2,.35,.5,.65,.8,.5].forEach((x,i)=>setTimeout(()=>confetti(r.left+r.width*x,r.top+r.height*.3,fx),i*400))}
    };
    function show(){const id=order[idx];root.dataset.page=id;root.querySelector('.fl-count').textContent=`${idx+1} / ${order.length}`;root.querySelector('.fl-back').style.visibility=id==='intro'?'hidden':'visible';
      root.querySelector('.fl-dots').innerHTML=order.map((_,i)=>`<i class="${i<=idx?'on':''}"></i>`).join('');stage.scrollTop=0;stage.classList.remove('fl-in');void stage.offsetWidth;stage.classList.add('fl-in');S[id]();if(vb){V.kinetic(stage.querySelector('.fl-title'),vb.kin);V.trans(root,stage,vb.cur)}}
    show();
  }
  window.WISHORA_FLOW={has,groups,render,config:F,pageCount:p=>JR(p)?(JR(p).pages||14):((SK(p).order||DEF_ORDER).length+1)};
})();
