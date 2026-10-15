(function(){
  const D=window.BIRTHDAY_DATA||{}, seq=window.BIRTHDAY_SEQ||['intro','balloons','cake','bouquet','photos','letter','gift','wishes','media','final'];
  const gateIndex=seq.indexOf('passcode');
  const firstContentIndex=gateIndex>=0?gateIndex+1:1;
  let unlocked=gateIndex<0 || D.passcodeProtected===false;
  const screens=[...document.querySelectorAll('.screen')]; let current=0;
  const toast=document.getElementById('toast');
  const safe=(s)=>String(s??'');
  function showToast(msg,duration=2200){if(!toast)return;toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),duration)}
  function spawnClickVFX(x,y,n=16){
    const canvas=document.getElementById('vfxCanvas');if(!canvas)return;
    const ctx=canvas.getContext('2d');let w=canvas.width=innerWidth,h=canvas.height=innerHeight;
    const sparks=[];for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*3.8;sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:1})}
    const start=performance.now();(function draw(t){ctx.clearRect(0,0,w,h);for(const p of sparks){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.life-=.035;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.5,4*p.life),0,Math.PI*2);ctx.fillStyle=`hsla(${320+Math.random()*50},100%,78%,${Math.max(0,p.life)})`;ctx.fill()}if(t-start<700)requestAnimationFrame(draw);else ctx.clearRect(0,0,w,h)})(start)}
  function spawnAmbient(){
    const hearts=document.getElementById('heartsBg');
    if(hearts){ hearts.innerHTML=''; for(let i=0;i<16;i++){const h=document.createElement('div');h.className='heart';h.textContent='♥';h.style.left=(Math.random()*100)+'%';h.style.top=(Math.random()*100)+'%';h.style.fontSize=(14+Math.random()*18)+'px';h.style.animationDelay=(-Math.random()*8)+'s';h.style.animationDuration=(6+Math.random()*5)+'s';hearts.appendChild(h)} }
    ['fxLayer','cgiLayer'].forEach((id,kind)=>{const layer=document.getElementById(id);if(!layer)return;layer.innerHTML='';const isCgi=kind==='cgiLayer';for(let i=0;i<(isCgi?28:24);i++){const e=document.createElement('div');e.className=isCgi?'cgi-star':'fx-particle';e.style.left=(Math.random()*100)+'%';e.style.top=(Math.random()*100)+'%';e.style.animationDelay=(-Math.random()*7)+'s';e.style.animationDuration=(4+Math.random()*8)+'s';if(!isCgi){e.style.width=e.style.height=(3+Math.random()*7)+'px';e.style.background='rgba(255,255,255,.78)';e.style.boxShadow='0 0 10px 2px rgba(255,180,220,.28)';}layer.appendChild(e)}})
  }
  spawnAmbient();
  document.addEventListener('click',e=>{spawnClickVFX(e.clientX,e.clientY,14)});
  function pageEnter(){const p=seq[current];if(p==='bouquet'){document.querySelectorAll('#bubbles .bubble').forEach((b,i)=>{b.classList.remove('show');setTimeout(()=>b.classList.add('show'),250+i*220)});spawnPetals()}if(p==='wishes'){document.querySelectorAll('.birthday-wish').forEach((b,i)=>{b.classList.remove('show');setTimeout(()=>b.classList.add('show'),180+i*180)})}if(p==='gift')addEnergyRings();if(p==='final')spawnConfetti()}
  function go(next){if(next<0||next>=seq.length)return;if(!unlocked&&gateIndex>=0&&next>gateIndex)return;if(screens[current])screens[current].classList.remove('active');current=next;screens[current].classList.add('active');window.scrollTo(0,0);pageEnter()}
  function next(){if(current===0&&gateIndex>=0&&!unlocked){go(gateIndex);return}if(current===gateIndex&&!unlocked)return;if(current<seq.length-1)go(current+1)}
  function back(){if(current===gateIndex)return go(0);if(current===firstContentIndex&&gateIndex>=0)return go(0);if(current>0)go(current-1)}
  document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',next));
  document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',back));
  const yes=document.getElementById('yesBtn'),no=document.getElementById('noBtn');
  if(yes)yes.addEventListener('click',()=>{if(gateIndex>=0&&!unlocked){go(gateIndex);return}const b=seq.indexOf('balloons');go(b<0?firstContentIndex:b)});
  if(no)no.addEventListener('click',()=>showToast(D.birthdayNoMessage||"Aww come on… I know you're excited! 💕 Click Yes!"));
  let popped=0;const words=[];
  document.querySelectorAll('.balloon').forEach(el=>el.addEventListener('click',function(){if(this.classList.contains('popped'))return;this.classList.add('popped');const rect=this.getBoundingClientRect();spawnClickVFX(rect.left+rect.width/2,rect.top+rect.height/2,22);const wave=document.createElement('div');wave.className='shockwave';wave.style.left=(rect.left+rect.width/2)+'px';wave.style.top=(rect.top+rect.height/2)+'px';document.body.appendChild(wave);setTimeout(()=>wave.remove(),600);for(let i=0;i<14;i++){const b=document.createElement('div');b.className='pop-burst';b.style.left=(rect.left+rect.width/2)+'px';b.style.top=(rect.top+rect.height/2)+'px';b.style.background=['#81d4fa','#f8bbd0','#a5d6a7','#e1bee7','#ffe082','#ff8a80','#fff'][Math.floor(Math.random()*7)];b.style.setProperty('--bx',(Math.random()*100-50)+'px');b.style.setProperty('--by',(Math.random()*100-50)+'px');document.body.appendChild(b);setTimeout(()=>b.remove(),650)}popped++;words.push(this.dataset.word||'');document.getElementById('prog1').textContent=`${popped} / ${document.querySelectorAll('.balloon').length}`;document.getElementById('revealText').innerHTML=words.map((w,i)=>`<span style="animation-delay:${i*.1}s">${w}</span>`).join(' ');if(popped===document.querySelectorAll('.balloon').length)setTimeout(next,1200)}));
  let blown=false;const blow=document.getElementById('blowBtn');if(blow)blow.addEventListener('click',()=>{if(blown)return;blown=true;const area=document.getElementById('candleArea'),screen=document.querySelector('[data-page="cake"]');area.classList.add('blown');screen.classList.add('blown-bg');blow.style.display='none';const flash=document.getElementById('blowFlash');if(flash){flash.classList.add('active');setTimeout(()=>flash.classList.remove('active'),650)}const smoke=document.getElementById('smokeLayer');if(smoke){for(let i=0;i<6;i++){const p=document.createElement('div');p.className='smoke';p.style.setProperty('--dx',(Math.random()*40-20)+'px');p.style.left=(42+Math.random()*16)+'%';p.style.animationDelay=(i*.1)+'s';smoke.appendChild(p)}}setTimeout(next,2500)});
  const passInput=document.getElementById('birthdayPasscode'),passBtn=document.getElementById('birthdayUnlock'),passErr=document.getElementById('birthdayPassError'),backIntro=document.getElementById('birthdayBackIntro');
  async function unlockBirthday(){
    const v=(passInput&&passInput.value||'').trim();
    if(!v){if(passErr)passErr.textContent='Enter the passcode first.';return}
    if(passBtn){passBtn.disabled=true;passBtn.textContent='Checking…'}
    try{
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));
      const actual=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
      const expected=D.passcodeHash||'';
      if(expected&&actual===expected){unlocked=true;if(passErr)passErr.textContent='';go(firstContentIndex)}else{if(passErr)passErr.textContent='That passcode did not work. Try again.'}
    }catch(e){if(passErr)passErr.textContent='Could not check the passcode.'}
    finally{if(passBtn){passBtn.disabled=false;passBtn.textContent='Unlock my birthday surprise ✦'}}
  }
  if(passBtn)passBtn.addEventListener('click',unlockBirthday);
  if(passInput)passInput.addEventListener('keydown',e=>{if(e.key==='Enter')unlockBirthday()});
  if(backIntro)backIntro.addEventListener('click',()=>go(0));
  (function initSparks(){const layer=document.getElementById('sparkLayer');if(!layer)return;for(let i=0;i<16;i++){const s=document.createElement('div');s.className='spark';s.style.left=(40+Math.random()*20)+'%';s.style.top=(2+Math.random()*18)+'%';s.style.animationDelay=(Math.random()*1.5)+'s';layer.appendChild(s)}})();
  function spawnPetals(){const layer=document.getElementById('petalLayer');if(!layer)return;layer.innerHTML='';const emojis=['🌹','🌸','🌺','💕','✨','🍃'];for(let i=0;i<18;i++){const p=document.createElement('div');p.className='petal-float';p.textContent=emojis[i%emojis.length];p.style.left=Math.random()*100+'%';p.style.top=(-10-Math.random()*15)+'%';p.style.fontSize=(16+Math.random()*14)+'px';p.style.animationDuration=(6+Math.random()*7)+'s';p.style.animationDelay=(Math.random()*5)+'s';layer.appendChild(p)}}
  let photoIdx=0;const cards=[...document.querySelectorAll('.photo-card')],dots=[...document.querySelectorAll('#dots .dot')];
  function showPhoto(i){if(!cards.length)return;photoIdx=(i+cards.length)%cards.length;cards.forEach((c,j)=>c.classList.toggle('active',j===photoIdx));dots.forEach((d,j)=>d.classList.toggle('active',j===photoIdx))}
  const prev=document.getElementById('prevPhoto'),nxt=document.getElementById('nextPhoto');if(prev)prev.onclick=()=>showPhoto(photoIdx-1);if(nxt)nxt.onclick=()=>{if(photoIdx<cards.length-1)showPhoto(photoIdx+1);else next()};
  const stack=document.getElementById('photoStack');let sx=0;if(stack){stack.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});stack.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)(dx<0?(photoIdx<cards.length-1?showPhoto(photoIdx+1):next()):showPhoto(photoIdx-1))},{passive:true})}
  const env=document.getElementById('envelope');if(env){env.addEventListener('click',function(){if(this.classList.contains('opened'))return;this.classList.add('opened');this.style.display='none';const letter=document.getElementById('letter'),content=document.getElementById('letterContent');letter.classList.add('show');let i=0;const txt=`Dear ${safe(D.recipient||'you')},\n\n${safe(D.letter||'Happy Birthday to someone truly special! 🎂')}\n\nWith love and best wishes,\n${safe(D.sender||'Your Special Someone')} 💕`;function type(){if(i<txt.length){content.textContent=txt.substring(0,++i);if(i%8===0){const sp=document.createElement('div');sp.className='ink-spark';sp.style.left=(20+Math.random()*60)+'%';sp.style.top=(30+Math.random()*40)+'%';letter.appendChild(sp);setTimeout(()=>sp.remove(),600)}setTimeout(type,24)}else{setTimeout(()=>{const b=document.createElement('button');b.className='btn';b.textContent='One last surprise →';b.style.width='100%';b.style.marginTop='16px';b.addEventListener('click',next);letter.appendChild(b)},450)}}type()})}
  let taps=0;const gift=document.getElementById('giftArea');if(gift)gift.addEventListener('click',()=>{taps++;const count=document.getElementById('giftCount');if(count)count.textContent=Math.min(taps+1,3);const img=gift.querySelector('img');if(img){img.style.transition='transform .2s';img.style.transform='scale(1.08)';setTimeout(()=>img.style.transform='scale(1)',200)}if(taps>=2){const r=document.getElementById('giftResult');if(r){r.classList.remove('birthday-hidden');r.style.fontSize='1.1rem';r.style.marginTop='18px'}setTimeout(next,700)}});
  function addEnergyRings(){const el=document.getElementById('energyLayer');if(!el)return;el.innerHTML='';for(let i=0;i<3;i++){const r=document.createElement('div');r.className='energy-ring';r.style.animationDelay=(i*.4)+'s';el.appendChild(r)}}
  function spawnConfetti(){const c=document.getElementById('confetti');if(!c)return;c.innerHTML='';const e=['🎊','🎉','💖','✨','🌸','💕','🥳','⭐','💗','🎈','🌟'];for(let i=0;i<65;i++){const s=document.createElement('span');s.textContent=e[Math.floor(Math.random()*e.length)];s.style.left=Math.random()*100+'%';s.style.fontSize=(12+Math.random()*14)+'px';s.style.animationDelay=Math.random()*2.5+'s';s.style.animationDuration=(2.2+Math.random()*2.5)+'s';c.appendChild(s)}}
  const replay=document.getElementById('replayBtn');if(replay)replay.addEventListener('click',()=>location.reload());
  window.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')back()});
  pageEnter();
})();
