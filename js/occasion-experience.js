/* Wishora V14 — Classic-Confetti-style interactions for all occasion templates */
(function(){
  const app=document.getElementById('gift-app');if(!app)return;
  const CFG={
    birthday:{fx:['🎈','🎉','🎂','✨','💖'],ask:'Are you excited for your surprise?'},
    wedding:{fx:['🌸','🤍','💍','✨','🕊️'],ask:'Ready to step into our story?'},
    anniversary:{fx:['❤️','💕','🌹','✨','💫'],ask:'Shall we look back together?'},
    graduation:{fx:['🎓','⭐','✨','📜','🎉'],ask:'Ready for your big moment?'},
    congratulations:{fx:['🏆','🎉','✨','⭐','👏'],ask:'Ready to celebrate you?'},
    'festival-wishes':{fx:['🪔','✨','🎆','🌼','🧡'],ask:'Shall we light up the page?'},
    'baby-shower':{fx:['🍼','☁️','⭐','🧸','💙'],ask:'Ready to meet the little surprise?'},
    housewarming:{fx:['🏡','🔑','🌿','✨','🧡'],ask:'Ready for the grand tour?'},
    farewell:{fx:['✈️','🌅','💌','✨','🧳'],ask:'Ready for a little goodbye party?'},
    custom:{fx:['✨','💫','🎈','💖','⭐'],ask:'Ready for something special?'}
  };
  const NO=['Hmm… are you sure? 🥺','The surprise is waiting… 🎁','Pretty please? 💖','Okay okay, just press Yes ✨'];
  function occ(root){const m=(root.className||'').match(/occasion-([a-z-]+)/);return CFG[m&&m[1]]||CFG.custom}
  function burst(x,y,fx){
    if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    for(let i=0;i<22;i++){const s=document.createElement('span');s.className='v14-conf';s.textContent=fx[i%fx.length];s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
      const a=Math.random()*Math.PI*2,r=60+Math.random()*130;
      s.animate([{transform:'translate(0,0) scale(.6)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r+90}px) rotate(${Math.random()*540}deg) scale(1.1)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove();}
  }
  function enhance(){
    const root=app.querySelector('.gift-page');if(!root||root.classList.contains('birthday-host'))return;
    const c=occ(root);
    if(!root.querySelector('.v14-float')){const f=document.createElement('div');f.className='v14-float';
      for(let i=0;i<14;i++){const s=document.createElement('span');s.textContent=c.fx[i%c.fx.length];s.style.left=(Math.random()*96)+'%';s.style.fontSize=(16+Math.random()*20)+'px';s.style.animationDuration=(9+Math.random()*9)+'s';s.style.animationDelay=(-Math.random()*14)+'s';f.appendChild(s)}
      root.prepend(f);}
    const yes=root.querySelector('#intro-continue');
    if(yes&&!yes.dataset.v14){yes.dataset.v14=1;
      const holder=yes.parentElement,ask=document.createElement('p');ask.className='v14-ask';ask.textContent=c.ask;
      const msg=document.createElement('p');msg.className='v14-msg';
      const no=document.createElement('button');no.type='button';no.className='v14-no';no.textContent='No';
      let n=0,scale=1;
      no.onclick=()=>{msg.textContent=NO[Math.min(n,NO.length-1)];n++;scale=Math.min(1.5,scale+.14);yes.style.transform=`scale(${scale})`;no.classList.remove('v14-shake');void no.offsetWidth;no.classList.add('v14-shake');if(n>=NO.length)no.style.display='none'};
      yes.textContent='Yes ✦';holder.before(ask);holder.classList.add('scene-actions');yes.after(no);holder.after(msg);
    }
    const paper=root.querySelector('.letter-paper:not([data-v14])');
    if(paper){paper.dataset.v14=1;paper.classList.add('v14-sealed');
      const env=document.createElement('button');env.type='button';env.className='v14-envelope';env.innerHTML='<span class="v14-env-art">💌</span><span>Tap to open your letter</span><small>a note just for you</small>';
      env.onclick=e=>{env.remove();paper.classList.remove('v14-sealed');paper.classList.add('v14-open');burst(e.clientX,e.clientY,c.fx)};
      paper.before(env);}
  }
  let t=0;new MutationObserver(()=>{cancelAnimationFrame(t);t=requestAnimationFrame(enhance)}).observe(app,{childList:true,subtree:true});enhance();
  document.addEventListener('click',e=>{
    const b=e.target.closest&&e.target.closest('#intro-continue,.primary-action,.nav-next,.yes-btn,#giftbox-btn,#surprise-btn,.v14-no');if(!b)return;
    const root=app.querySelector('.gift-page');if(root)burst(e.clientX,e.clientY,occ(root).fx);
  },true);
})();
