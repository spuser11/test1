(function(){
  const W=window.WISHORA, app=document.getElementById('gift-app');
  const PROFILES=window.WISHORA_TEMPLATE_PROFILES||{};
  let packet=null;
  function readPacket(){
    if(window.WISHORA_PREVIEW_PACKET)return window.WISHORA_PREVIEW_PACKET;
    try{
      const match=(location.hash||'').match(/^#gift=([^&]+)/);
      if(!match)return null;
      const obj=JSON.parse(W.base64UrlDecode(match[1]));
      if(!obj||!obj.template||!obj.data||typeof obj.data!=='object')return null;
      return obj;
    }catch(e){return null}
  }
  packet=readPacket();
  if(!packet){showFallback();return}
  const product=W.product(packet.template);
  const data={...W.defaults(product),...(packet.data||{})};
  data.theme=data.theme||product.palette||'blush';
  data.photos=Array.isArray(data.photos)?data.photos:[];
  data.sections=W.normalizeSections(product,data);
  const preview=window.WISHORA_PREVIEW===true||new URLSearchParams(location.search).has('preview')||location.hash.includes('&preview=1');
  renderGift(data,product,{preview});

  function profile(p){
    return PROFILES[p.slug]||{style:'default',icon:p.occasionId==='custom'?'✦':'✦',introEyebrow:'A little website for a big feeling',introTitle:'Something special is waiting for you.',introCopy:'A personalized Wishora celebration made just for this moment.',coverKicker:'Wishora celebration',coverCopy:'Open the pages and discover the little things waiting inside.'};
  }
  function showFallback(){
    app.innerHTML='<div class="gift-lock"><div class="lock-card"><div class="lock-art"><img src="images/illustrations/gift.svg" alt="Wishora gift"></div><p class="eyebrow">Wishora</p><h1>This celebration link is missing.</h1><p class="lock-copy">The shared page could not be opened. Create a new Wishora celebration to generate a fresh link.</p><a class="btn btn-primary" href="index.html">Create a new Wishora</a></div></div>';
  }
  function renderGift(d,p,opts){
    if(p.slug==='wishora-birthday-classic'&&window.WISHORA_BIRTHDAY){window.WISHORA_BIRTHDAY.render(d,p,app,{preview:opts.preview});return}
    document.title=`${d.title||p.name} — Wishora`;
    const prof=profile(p);
    const protectedGate=d.passcodeProtected!==false&&!opts.preview;
    if(window.WISHORA_FLOW&&window.WISHORA_FLOW.has(p)&&!protectedGate){window.WISHORA_FLOW.render(d,p,app,{intro:true});return}
    let unlocked=!protectedGate;
    let mode='intro';
    let page=0;
    const allSections=(d.sections||[]).filter(Boolean);
    const root=document.createElement('div');
    root.className=`gift-page theme-${W.safe(d.theme||p.palette||'blush')} template-${W.safe(p.slug)} style-${W.safe(prof.style)} occasion-${W.safe(p.occasionId||'custom')}${opts.preview?' preview-mode':''}`;
    /* url() inside a CSS variable resolves against the stylesheet (css/), so use absolute URLs. */
    const absUrl=u=>{if(!u)return '';try{return new URL(u,document.baseURI).href}catch(e){return u}};
    root.style.setProperty('--wishora-bg-art', prof.backgroundArt?`url("${absUrl(prof.backgroundArt)}")`:'none');
    root.style.setProperty('--wishora-motif-art', prof.motifArt?`url("${absUrl(prof.motifArt)}")`:'none');
    root.innerHTML=`<div class="gift-chrome"><a href="index.html" class="gift-brand">✦ Wishora</a><span id="gift-progress">INTRO</span><button type="button" class="gift-share" id="gift-copy">Copy link</button></div><div class="gift-stage"><div id="gift-scene"></div></div><div class="gift-nav" id="gift-nav"><button type="button" id="prev-page" class="nav-btn">←</button><div id="nav-dots" class="nav-dots"></div><button type="button" id="next-page" class="nav-btn nav-next">→</button></div><footer class="gift-footer">Made with <strong>Wishora</strong> · a little website just for you.</footer>`;
    app.innerHTML='';app.appendChild(root);
    const scene=root.querySelector('#gift-scene'),dots=root.querySelector('#nav-dots'),progress=root.querySelector('#gift-progress'),nav=root.querySelector('#gift-nav');
    allSections.forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.title=`Go to page ${i+1}`;b.className='dot';b.onclick=()=>{if(unlocked)showContent(i)};dots.appendChild(b)});
    function renderIntro(){
      mode='intro';
      progress.textContent='INTRO';nav.style.display='none';dots.style.display='none';
      scene.innerHTML=`<section class="scene scene-intro"><div class="template-intro-art template-intro-art-image"><img src="${W.safe(prof.coverArt||p.cover)}" alt="${W.safe(p.name)}"></div><p class="eyebrow">${W.safe(prof.introEyebrow)}</p><h1 class="template-intro-title">${W.safe(prof.introTitle)}</h1><p class="template-intro-copy">${W.safe(prof.introCopy)}</p><p class="scene-caption">For <strong>${W.safe(d.recipient||'someone special')}</strong> · made by <strong>${W.safe(d.sender||'someone who cares')}</strong></p><div class="scene-actions"><button class="primary-action" id="intro-continue">${protectedGate&&!unlocked?'Continue to the private page →':'Open the celebration →'}</button></div></section>`;
      scene.querySelector('#intro-continue').onclick=()=>{if(protectedGate&&!unlocked)renderGate();else showContent(0)};
    }
    function renderGate(){
      mode='gate';progress.textContent='LOCK';nav.style.display='none';dots.style.display='none';
      scene.innerHTML=`<section class="scene scene-passcode"><div class="template-gate-card"><div class="template-gate-icon">🔐</div><p class="eyebrow">Private surprise</p><h2>Enter the passcode.</h2><p class="template-gate-copy">${W.safe(d.sender||'Someone special')} left this celebration behind a little lock. Enter the code they gave you.</p><input id="gate-code" inputmode="text" autocomplete="one-time-code" maxlength="12" placeholder="Passcode" aria-label="Passcode"><div class="template-gate-error" id="gate-error" aria-live="polite"></div><button class="primary-action" id="gate-unlock">Unlock the celebration ✦</button><button class="text-button gate-back" id="gate-back" type="button">← Back to intro</button></div></section>`;
      const input=scene.querySelector('#gate-code'),btn=scene.querySelector('#gate-unlock'),err=scene.querySelector('#gate-error');
      async function unlock(){
        const value=input.value.trim();
        if(!value){err.textContent='Enter the passcode to continue.';return}
        btn.disabled=true;btn.textContent='Checking…';err.textContent='';
        try{
          const hash=await W.hashPasscode(value);
          const expected=d.passcodeHash||await W.hashPasscode(d.passcode||'');
          if(hash===expected){unlocked=true;showContent(0)}else err.textContent='That code did not work. Try again.';
        }catch(e){err.textContent='The passcode could not be checked right now.'}
        finally{btn.disabled=false;btn.textContent='Unlock the celebration ✦'}
      }
      btn.onclick=unlock;input.addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});scene.querySelector('#gate-back').onclick=renderIntro;input.focus();
    }
    function showContent(i){
      if(!unlocked)return renderGate();
      if(window.WISHORA_FLOW&&window.WISHORA_FLOW.has(p)){window.WISHORA_FLOW.render(d,p,app);return}
      mode='content';page=Math.max(0,Math.min(i,allSections.length-1));
      progress.textContent=`${String(page+1).padStart(2,'0')} / ${String(allSections.length).padStart(2,'0')}`;
      nav.style.display='flex';dots.style.display='flex';
      scene.innerHTML=sectionMarkup(allSections[page],d,p,prof);
      bindSection(allSections[page],d,p);
      dots.querySelectorAll('.dot').forEach((b,idx)=>b.classList.toggle('active',idx===page));
      root.classList.toggle('last-page',page===allSections.length-1);
      window.scrollTo({top:0,behavior:'smooth'});
    }
    function next(){
      if(mode==='intro'){if(protectedGate&&!unlocked)return renderGate();return showContent(0)}
      if(mode==='gate')return;
      if(page<allSections.length-1)showContent(page+1);
    }
    function back(){
      if(mode==='intro')return;
      if(mode==='gate')return renderIntro();
      if(page>0)showContent(page-1);else renderIntro();
    }
    root.querySelector('#prev-page').onclick=back;root.querySelector('#next-page').onclick=next;
    root.querySelector('#gift-copy').onclick=async e=>{try{await navigator.clipboard.writeText(location.href);e.currentTarget.textContent='Copied ✓';setTimeout(()=>e.currentTarget.textContent='Copy link',1400)}catch{prompt('Copy this Wishora link:',location.href)}};
    root.addEventListener('click',e=>{if(e.target.closest('#gift-copy'))return});
    root._wishoraNext=next;
    root._wishoraBack=back;
    root._wishoraShowContent=showContent;
    root.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')back()});
    renderIntro();
  }
  function img(src,alt,className='scene-image'){return `<img class="${className}" src="${W.safe(src)}" alt="${W.safe(alt||'Wishora memory')}">`}
  function templateVoice(d,p,prof){
    const fallback=`A little ${p.occasion||'celebration'} page made especially for ${d.recipient||'you'}.`;
    return {kicker:prof.coverKicker||p.occasion||'Wishora',copy:prof.coverCopy||fallback};
  }
  function sectionMarkup(id,d,p,prof){
    const cover=p.cover||'images/covers/occasions/custom.jpg'; const coverArt=prof.coverArt||cover;
    const photos=Array.isArray(d.photos)?d.photos.filter(Boolean):[];
    const memories=(d.memories||[]).slice(0,6);
    const promises=(d.promises||[]).slice(0,6);
    const voice=templateVoice(d,p,prof);
    const base=`<div class="scene scene-${W.safe(id)}"><img class="scene-template-motif" src="${W.safe(prof.motifArt||'')}" alt="" aria-hidden="true"><div class="scene-orbit-mark">${W.safe(prof.icon||'✦')}</div>`;
    const end='</div>';
    if(id==='cover')return `${base}<div class="template-cover-mark template-art-frame"><img src="${W.safe(coverArt)}" alt="${W.safe(p.name)}"></div><p class="template-cover-kicker">${W.safe(voice.kicker)}</p><h2 class="template-cover-title">${W.safe(d.title||p.name)}</h2><p class="scene-sub">For <strong>${W.safe(d.recipient||'you')}</strong> · from <strong>${W.safe(d.sender||'me')}</strong>${d.date?` · ${W.safe(d.date)}`:''}</p><div class="occasion-cover-line">${W.safe(voice.copy)}</div><div class="scene-actions"><button class="primary-action" data-next>Begin page one →</button></div>${end}`;
    if(id==='dedication')return `${base}<p class="eyebrow">a page made just for you</p><div class="dedication-card"><div class="dedication-mark">${W.safe(prof.icon||'✦')}</div><p class="dedication-kicker">${W.safe(voice.kicker)}</p><h2>Made for ${W.safe(d.recipient||'you')}.</h2><p>${W.safe(voice.copy)}</p><div class="dedication-sign">— ${W.safe(d.sender||'someone who cares')}</div></div>${end}`;
    if(id==='letter')return `${base}<p class="eyebrow">a note for you</p><h2>${W.safe(d.title||'A little letter')}</h2><article class="letter-paper"><div class="letter-top">Dear ${W.safe(d.recipient||'you')},</div><p>${W.safe(d.letter||'Write something only they would understand.')}</p><div class="letter-sign">— ${W.safe(d.sender||'me')}</div></article>${end}`;
    if(id==='photos'){const photoHtml=photos.length?photos.map((s,i)=>img(s,`Memory ${i+1}`,'memory-photo')).join(''):`<div class="photo-placeholder-grid"><div>📸<strong>Your photos</strong><small>This template supports up to ${p.photoLimit||6} photos.</small></div><div>🖼️<strong>Your moments</strong><small>Your uploaded photos will appear here.</small></div><div>💫<strong>Your story</strong><small>Make this page personal.</small></div></div>`;return `${base}<p class="eyebrow">${p.occasionId==='housewarming'?'rooms & memories':'photo desk'}</p><h2>${p.occasionId==='wedding'?'The people behind the day':p.occasionId==='baby-shower'?'Little moments before the arrival':p.occasionId==='graduation'?'The years that got you here':p.occasionId==='farewell'?'The faces you take with you':p.occasionId==='festival-wishes'?'Family & tradition':'Photos worth keeping'}</h2><div class="photo-grid-large ${p.variant==='cinema'?'photo-filmstrip':''}">${photoHtml}</div><p class="scene-caption">${p.occasionId==='festival-wishes'?'Tradition looks different in every family. These are yours.':'Every ordinary frame can become part of the story.'}</p>${end}`;}
    if(id==='memories'||id==='timeline'){
      const heading=p.occasionId==='anniversary'?'Chapters of us':p.occasionId==='graduation'?'The road that led here':p.occasionId==='farewell'?'The moments we will keep':p.occasionId==='housewarming'?'How this place became home':'Little moments, kept close.';
      return `${base}<p class="eyebrow">the timeline</p><h2>${heading}</h2><div class="timeline">${(memories.length?memories:[{date:'Now',title:'Your memory',note:'Add more moments in the builder.'}]).map((m,i)=>`<article class="timeline-item"><span>${W.safe(m.date||`0${i+1}`)}</span><div><h3>${W.safe(m.title||'A moment')}</h3><p>${W.safe(m.note||'')}</p></div></article>`).join('')}</div>${end}`;
    }
    if(id==='song')return `${base}<p class="eyebrow">the soundtrack</p><h2>${W.safe(d.songTitle||'Add your soundtrack')}</h2><p class="scene-sub">${W.safe(d.songArtist||'Your artist or note')}</p><div class="media-card"><div class="media-disc">♪</div>${d.audioData?`<audio controls preload="metadata"><source src="${W.safe(d.audioData)}"></audio>`:`<div class="media-placeholder">🎵 Add your audio in the builder.</div>`}<p class="media-hint">Your own song or voice note can live here.</p></div>${end}`;
    if(id==='video')return `${base}<p class="eyebrow">now showing</p><h2>${W.safe(d.movieTitle||d.title||'Your celebration film')}</h2><p class="scene-sub">${W.safe(d.movieTagline||'Add your video when you customize the page.')}</p><div class="film-frame">${d.videoData?`<video class="scene-video" controls playsinline poster="${W.safe(cover)}"><source src="${W.safe(d.videoData)}"></video>`:`<div class="media-placeholder">🎬 Your video will appear here.</div>`}</div>${end}`;
    if(id==='cake')return `${base}<p class="eyebrow">make a wish</p><h2>${p.variant==='classic'?'Close your eyes. Make the wish.':'A birthday gift should have a little drama.'}</h2><div class="cake-wrap"><div class="cake-art"><span class="candle c1">●</span><span class="candle c2">●</span><span class="candle c3">●</span><div class="cake-top"></div><div class="cake-body"></div></div><button id="cake-btn" class="primary-action">Blow out the candles</button><div id="cake-result" class="reveal hidden">Wish made. Now make the day wonderful. ✨</div></div>${end}`;
    if(id==='giftbox')return `${base}<p class="eyebrow">there is something inside</p><h2>${p.occasionId==='baby-shower'?'A tiny surprise.':'Open your gift.'}</h2><div class="giftbox-wrap"><div id="giftbox-art" class="giftbox-art"><div class="gift-lid"></div><div class="gift-body"></div><span>${W.safe(prof.icon||'✦')}</span></div><button id="giftbox-btn" class="primary-action">Open the box</button><div id="giftbox-result" class="reveal hidden"><strong>${W.safe(d.songTitle||'A little surprise')}</strong><p>${W.safe(d.surpriseMessage||d.letter||'You found it. ✨')}</p></div></div>${end}`;
    if(id==='yesno')return `${base}<p class="eyebrow">one little question</p><h2>${p.occasionId==='baby-shower'?'Who do you think the baby will look like?':W.safe(d.quizQuestion||'Do you want one more surprise?')}</h2><p class="scene-sub">Tap the answer your instincts are already whispering.</p><div class="yesno-large"><button id="yes-btn" class="yes-btn">${p.occasionId==='baby-shower'?'Option A':'Yes ♥'}</button><button id="no-btn" class="no-btn">${p.occasionId==='baby-shower'?'Option B':'Not yet'}</button></div><div id="yes-result" class="reveal hidden">Nice choice. Keep going. ✨</div>${end}`;
    if(id==='promises'||id==='wishes')return `${base}<p class="eyebrow">a few things to carry forward</p><h2>${p.occasionId==='farewell'?'Good wishes for the road':p.occasionId==='housewarming'?'Wishes for the new home':p.occasionId==='wedding'?'Promises & blessings':'A few little wishes'}</h2><div class="promise-list">${(promises.length?promises:['Add a promise or wish in the builder.']).map((x,i)=>`<div><span>0${i+1}</span><p>${W.safe(x)}</p></div>`).join('')}</div>${end}`;
    if(id==='certificate')return `${base}<p class="eyebrow">official document</p><div class="certificate"><small>THE WISHORA OFFICE OF SPECIAL MOMENTS</small><h2>${p.occasionId==='graduation'?'Diploma of Achievement':'Certificate of Being Exceptionally Special'}</h2><p>This is proudly presented to</p><strong>${W.safe(d.recipient||'you')}</strong><p>${W.safe(voice.copy)}</p><span class="seal">${W.safe(prof.icon||'✦')}</span><footer>${W.safe(d.date||'Today')} · ${W.safe(d.sender||'me')}</footer></div>${end}`;
    if(id==='countdown')return `${base}<p class="eyebrow">counting toward something</p><h2>${W.safe(d.title||'The next chapter begins soon')}</h2><div id="countdown" class="countdown" data-date="${W.safe(d.date||'')}"><div><strong>—</strong><span>days</span></div><div><strong>—</strong><span>hours</span></div><div><strong>—</strong><span>minutes</span></div><div><strong>—</strong><span>seconds</span></div></div><p class="scene-caption">${W.safe(d.date||'Add a real date to activate the countdown.')}</p>${end}`;
    if(id==='fireworks')return `${base}<div class="celebration-visual"><div class="center-heart">${p.occasionId==='graduation'?'🎓':p.occasionId==='housewarming'?'🏡':p.occasionId==='festival-wishes'?'✨':'♥'}</div><div class="burst b1">✹</div><div class="burst b2">✦</div><div class="burst b3">✷</div></div><h2>${p.occasionId==='farewell'?'Safe travels. Keep the memories.':p.occasionId==='wedding'?'Here begins the next chapter.':p.occasionId==='housewarming'?'May this home hold a thousand good days.':'One more reason to celebrate.'}</h2><button id="firework-btn" class="primary-action">Make it official</button><div id="firework-result" class="reveal hidden">🎉 This moment is officially celebrated.</div>${end}`;
    if(id==='quiz')return `${base}<p class="eyebrow">a tiny quiz</p><h2>${W.safe(d.quizQuestion|| (p.occasionId==='graduation'?'Which chapter are you most excited for?':'How well do you know this story?'))}</h2><div class="quiz-options"><button data-quiz="1">Absolutely</button><button data-quiz="2">I think so</button><button data-quiz="3">Tell me the answer</button></div><div id="quiz-result" class="reveal hidden">Correct answer: this page was made with love. ♥</div>${end}`;
    if(id==='fourletters')return `${base}<p class="eyebrow">open in order</p><h2>${p.occasionId==='anniversary'?'Four chapters of us':'Four little letters'}</h2><div class="letter-grid">${['L','O','V','E'].map((x,i)=>`<button class="letter-card" data-letter="${i}"><span>${x}</span><small>${['open','read','keep','close'][i]}</small></button>`).join('')}</div><div id="letter-reveal" class="letter-reveal hidden"></div>${end}`;
    if(id==='newspaper')return `${base}<article class="newspaper"><div class="paper-kicker">SPECIAL EDITION · WISHORA</div><h2>${W.safe(d.movieTitle||d.title||'The Wishora Times')}</h2><div class="paper-grid"><p class="paper-lead">${W.safe(d.letter||'Breaking news: someone is worth celebrating today.')}</p>${memories.slice(0,3).map(m=>`<div class="paper-note"><b>${W.safe(m.title)}</b><span>${W.safe(m.note)}</span></div>`).join('')}</div></article>${end}`;
    if(id==='museum')return `${base}<p class="eyebrow">the museum</p><h2>${p.occasionId==='farewell'?'The people & places we keep':'A small collection of big moments.'}</h2><div class="museum-grid">${(memories.length?memories:[{title:'Add your first memory',note:'Use the builder to turn a real moment into an exhibit.'}]).map((m,i)=>`<article class="museum-card"><span>ROOM ${String(i+1).padStart(2,'0')}</span><h3>${W.safe(m.title)}</h3><p>${W.safe(m.note)}</p></article>`).join('')}</div>${end}`;
    if(id==='proposal')return `${base}<p class="eyebrow">one big question</p><h2>${W.safe(d.title||'So…')}</h2><div class="proposal-stage"><p>${W.safe(d.recipient||'You')}, will you?</p><div class="proposal-buttons"><button id="proposal-yes" class="yes-btn">Yes ♥</button><button id="proposal-later" class="no-btn">Give me a minute</button></div><div id="proposal-result" class="reveal hidden"></div></div>${end}`;
    if(id==='guestbook')return `${base}<p class="eyebrow">leave a little note</p><h2>${p.occasionId==='wedding'?'Guest wishes':p.occasionId==='farewell'?'Leave a goodbye note':p.occasionId==='baby-shower'?'Notes for the family':'Guestbook'}</h2><label class="guestbook-label">Your note<textarea id="guestbook-input" maxlength="300" rows="4" placeholder="Write something worth keeping…"></textarea></label><button id="guestbook-btn" class="primary-action">Leave the note</button><div id="guestbook-result" class="reveal hidden"></div>${end}`;
    if(id==='surprise')return `${base}<p class="eyebrow">one last thing</p><h2>${p.occasionId==='graduation'?'Open your final applause.':p.occasionId==='festival-wishes'?'There is still a little sparkle left.':'A surprise is hiding here.'}</h2><button id="surprise-btn" class="primary-action">Reveal it</button><div id="surprise-result" class="surprise-reveal hidden">${W.safe(d.surpriseMessage||d.letter||'Surprise! ♥')}</div>${end}`;
    if(id==='wedding-vows')return `${base}<p class="eyebrow">the ceremony</p><h2>Words worth keeping.</h2><div class="occasion-card ceremony-card"><div class="ceremony-mark">∞</div><p>${W.safe(d.letter||'Write the vows, blessing or ceremony words you want to remember.')}</p><div class="ceremony-sign">${W.safe(d.sender||'From all of us')}</div></div>${end}`;
    if(id==='baby-wishes')return `${base}<p class="eyebrow">tiny wishes</p><h2>For the little one.</h2><div class="baby-wishes">${(promises.length?promises:['May your days be full of wonder.','May you always know how loved you are.','May this new chapter be gentle and joyful.']).map((x,i)=>`<article><span>${['☁','★','♡'][i%3]}</span><p>${W.safe(x)}</p></article>`).join('')}</div>${end}`;
    if(id==='graduation-diploma')return `${base}<p class="eyebrow">class of ${W.safe(d.date||'2026')}</p><div class="diploma"><div class="diploma-seal">GRAD</div><small>WISHORA ACADEMY OF BIG MOMENTS</small><h2>Diploma of Achievement</h2><p>This certifies that</p><strong>${W.safe(d.recipient||'You')}</strong><p>has earned this moment by showing up, working hard and making it to the next chapter.</p><footer>${W.safe(d.sender||'Proud of you')} · ${W.safe(d.date||'Today')}</footer></div>${end}`;
    if(id==='congrats-confetti')return `${base}<p class="eyebrow">achievement unlocked</p><div class="achievement-card"><div class="achievement-icon">🏆</div><h2>${W.safe(d.title||'You did it!')}</h2><p>${W.safe(d.letter||'Here is to the work, the courage and the moment it all paid off.')}</p><button id="firework-btn" class="primary-action">Celebrate the win</button><div id="firework-result" class="reveal hidden">🎊 Big moment. Big cheer. Bigger things ahead.</div></div>${end}`;
    if(id==='farewell-toast')return `${base}<p class="eyebrow">one last toast</p><div class="toast-card"><div class="toast-glass">🥂</div><h2>To the next chapter.</h2><p>${W.safe(d.letter||'Thank you for all the memories. Wherever you go next, take the good stories with you.')}</p><strong>— ${W.safe(d.sender||'Your people')}</strong></div>${end}`;
    if(id==='home-welcome')return `${base}<p class="eyebrow">new keys · new memories</p><div class="home-welcome"><div class="home-icon">⌂</div><h2>${W.safe(d.title||'Welcome home')}</h2><p>${W.safe(d.letter||'May every room become a memory and every corner feel like yours.')}</p><div class="house-tags"><span>new beginnings</span><span>good company</span><span>many memories</span></div></div>${end}`;
    if(id==='festival-greeting')return `${base}<p class="eyebrow">${W.safe(d.festivalName||'Festival Wishes')}</p><div class="festival-card"><div class="festival-symbol">${p.variant==='diwali'?'🪔':'✨'}</div><h2>${W.safe(d.title||'Festival Wishes')}</h2><p>${W.safe(d.letter||'Wishing you warmth, joy and beautiful moments.')}</p><div class="festival-chips"><span>family</span><span>joy</span><span>good wishes</span></div></div>${end}`;
    if(id==='custom-collage')return `${base}<p class="eyebrow">freeform</p><h2>Make it unmistakably yours.</h2><div class="custom-collage">${photos.slice(0,4).map((s,i)=>`<div class="collage-tile tile-${i+1}">${img(s,`Custom memory ${i+1}`,'collage-image')}</div>`).join('')}<div class="collage-note">${W.safe(d.surpriseMessage||d.letter||'Add any story, surprise or inside joke here.')}</div></div>${end}`;
    return `${base}<p class="eyebrow">Wishora</p><h2>${W.safe(d.title||p.name)}</h2><p class="scene-sub">${W.safe(d.letter||'A personalized celebration.')}</p>${end}`;
  }
  function bindSection(id,d,p){
    const next=document.querySelector('#gift-app .primary-action[data-next]');if(next)next.onclick=()=>document.querySelector('#gift-app .gift-page')?._wishoraNext?.();
    const cake=document.getElementById('cake-btn');if(cake)cake.onclick=()=>{cake.textContent='Wish made ✓';document.getElementById('cake-result').classList.remove('hidden');celebrate()};
    const gift=document.getElementById('giftbox-btn');if(gift)gift.onclick=()=>{document.getElementById('giftbox-art').classList.add('opened');document.getElementById('giftbox-result').classList.remove('hidden');celebrate()};
    const yes=document.getElementById('yes-btn');if(yes)yes.onclick=()=>{document.getElementById('yes-result').classList.remove('hidden');celebrate()};
    const no=document.getElementById('no-btn');if(no)no.onclick=()=>{no.textContent=p.occasionId==='baby-shower'?'Let us keep guessing…':'Maybe later…';no.style.transform=`translate(${Math.random()*80-40}px,${Math.random()*30-15}px)`};
    const fw=document.getElementById('firework-btn');if(fw)fw.onclick=()=>{document.getElementById('firework-result').classList.remove('hidden');celebrate()};
    document.querySelectorAll('#gift-app [data-quiz]').forEach(b=>b.onclick=()=>document.getElementById('quiz-result').classList.remove('hidden'));
    document.querySelectorAll('#gift-app [data-letter]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.letter);const txt=(d.promises||[])[i]||d.letter||'Love.';const out=document.getElementById('letter-reveal');out.textContent=txt;out.classList.remove('hidden')});
    const pYes=document.getElementById('proposal-yes');if(pYes)pYes.onclick=()=>{const r=document.getElementById('proposal-result');r.textContent='Then it’s us. ✦';r.classList.remove('hidden');celebrate()};
    const pLater=document.getElementById('proposal-later');if(pLater)pLater.onclick=()=>{const r=document.getElementById('proposal-result');r.textContent='Take your time. I’ll be here.';r.classList.remove('hidden')};
    const s=document.getElementById('surprise-btn');if(s)s.onclick=()=>{document.getElementById('surprise-result').classList.remove('hidden');celebrate()};
    const g=document.getElementById('guestbook-btn');if(g)g.onclick=()=>{const value=document.getElementById('guestbook-input').value.trim();const r=document.getElementById('guestbook-result');r.textContent=value?`“${value}” — a note worth keeping. ♥`:'Write a note first.';r.classList.remove('hidden')};
    const timer=document.getElementById('countdown');if(timer){const target=Date.parse(timer.dataset.date);if(Number.isFinite(target)){const tick=()=>{let diff=Math.max(0,target-Date.now());const d0=Math.floor(diff/86400000);diff-=d0*86400000;const h=Math.floor(diff/3600000);diff-=h*3600000;const m=Math.floor(diff/60000);const sec=Math.floor((diff%60000)/1000);const vals=timer.querySelectorAll('strong');vals[0].textContent=d0;vals[1].textContent=String(h).padStart(2,'0');vals[2].textContent=String(m).padStart(2,'0');vals[3].textContent=String(sec).padStart(2,'0')};tick();timer._interval=setInterval(tick,1000)}}
  }
  function celebrate(){
    for(let i=0;i<36;i++){const e=document.createElement('span');e.className='confetti-bit';e.textContent=['✦','♥','•','✹','✧'][Math.floor(Math.random()*5)];e.style.left=(50+Math.random()*28-14)+'%';e.style.top='46%';e.style.setProperty('--dx',(Math.random()*520-260)+'px');e.style.setProperty('--dy',(Math.random()*460-220)+'px');document.body.appendChild(e);setTimeout(()=>e.remove(),1100)}
  }
})();
