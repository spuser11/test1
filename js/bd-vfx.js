/* Wishora V20 — heavy VFX for Classic Confetti Birthday. Runs inside the template iframe and listens to the template's own events. */
(function(){
  const app=document.getElementById('app');if(!app||!window.LJVFX)return;
  const V=window.LJVFX.create(app,{backFirst:true,vignette:'rgba(150,20,80,.22)'});app.__vfx=V;
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const mid=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
  const bloom=document.createElement('div');bloom.className='bd-bloom';app.appendChild(bloom);
  const flash=()=>{bloom.classList.remove('go');void bloom.offsetWidth;bloom.classList.add('go')};
  const HUES=[['#8be0ff','#0288d1'],['#ffb3cf','#e91e63'],['#a5e8a8','#388e3c'],['#e3b1ee','#8e24aa']];
  const CAN=()=>{V.confetti('l');V.confetti('r');V.confetti('l',{streamer:1});V.confetti('r',{streamer:1})};
  let page='',curMode='',done={},lastFlame=null,poppedN=0;

  function mode(m){if(m!==curMode){curMode=m;V.mode(m)}}
  function enter(name){
    if(!name||name===page)return;const prev=page;page=name;
    V.flameOff();V.fireworks(false);V.follow(null);
    if(name==='intro'){done={};poppedN=0;lastFlame=null}
    if(name==='cake'){mode('cake');const f=$('#flame');if(f)V.follow(f);V.flameOn(()=>{const el=$('#flame');if(!el||done.blown)return null;const r=el.getBoundingClientRect();if(r.width<1)return null;lastFlame={x:r.left+r.width/2,y:r.top+r.height*.3};return lastFlame})}
    else if(name==='final'){mode('celebrate');V.fireworks(true);CAN();setTimeout(CAN,1800);V.petalRain(9000)}
    else if(name==='bouquet'){mode('party');V.petalRain(6500)}
    else mode('party');
    if(prev)flash();
  }

  /* active page → effects */
  const watchPages=()=>{const a=$('.screen.active');if(a)enter(a.dataset.page)};
  new MutationObserver(watchPages).observe(app,{subtree:true,attributes:true,attributeFilter:['class']});
  watchPages();

  /* template events: popped / blown / opened classes */
  new MutationObserver(ms=>{for(const m of ms){const el=m.target,old=m.oldValue||'',now=el.className&&el.className.baseVal===undefined?el.className:'';
    if(typeof now!=='string')continue;const added=c=>now.split(/\s+/).includes(c)&&!old.split(/\s+/).includes(c);
    if(el.classList.contains('balloon')&&added('popped'))balloon(el);
    else if(added('blown'))blow();
    else if(added('opened')&&(el.id==='envelope'||el.id==='letter'||el.closest&&el.closest('#letter')))letter(el);
    else if((added('opened')&&el.id==='giftArea')||(el.id==='giftResult'&&added('show')))gift();
  }}).observe(app,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class']});

  function balloon(el){
    const[x,y]=mid(el),i=Math.max(0,$$('.balloon').indexOf(el)),h=HUES[i%4];poppedN++;
    V.fragments(x,y,h[0],h[1],18);V.ring(x,y,'rgba(255,255,255,.9)',26,4);V.sparks(x,y,30,['#ffffff','#ffd36e',h[0]],.8);V.glint(x,y);V.glint(x+14,y-10);V.shake(app,220,5);
    if(poppedN>=4){V.slowmo(700,.35);V.flare(x,y,'rgba(255,230,200,.95)');CAN();V.hearts(x,y,14)}
  }
  function blow(){
    if(done.blown)return;done.blown=true;V.flameOff();
    const p=lastFlame||(()=>{const c=$('#candleArea');const[x,y]=c?mid(c):[innerWidth/2,innerHeight/2];return{x,y}})();
    V.smoke(p.x,p.y,10,'rgba(235,235,245,');V.sparks(p.x,p.y,44,['#ffd36e','#ffb347','#ffffff'],.6);for(let i=0;i<6;i++)V.glint(p.x+(i-3)*12,p.y-i*6);
    V.flare(p.x,p.y,'rgba(255,210,150,.9)');V.ring(p.x,p.y,'rgba(255,200,130,.8)',20,5);flash();
    setTimeout(()=>{CAN();V.rocket();setTimeout(V.rocket,300);V.hearts(p.x,p.y,16)},700);
  }
  function letter(el){
    if(done.letter)return;done.letter=true;const[x,y]=mid($('#envelope')||el);
    V.fountain(x,y,'sparks',1100);V.flare(x,y,'rgba(255,235,190,.95)');V.ring(x,y,'rgba(255,230,170,.9)',30,4);V.hearts(x,y,10);
  }
  function gift(){
    if(done.gift)return;done.gift=true;const g=$('#giftArea'),[x,y]=g?mid(g):[innerWidth/2,innerHeight/2];
    V.flare(x,y);V.ring(x,y,'rgba(255,170,120,.95)',30,7);setTimeout(()=>V.ring(x,y,'rgba(255,230,200,.8)',20,5),180);
    V.sparks(x,y,90,['#ffd36e','#ff9bb8','#ffffff','#9be7ff']);CAN();V.hearts(x,y,16);V.fountain(x,y,'sparks',1400);V.slowmo(400,.5);V.shake(app,300,7);
  }

  /* clicks */
  app.addEventListener('click',e=>{
    const t=e.target.closest&&e.target.closest('button,.btn');if(!t)return;const[x,y]=[e.clientX||mid(t)[0],e.clientY||mid(t)[1]];
    if(t.id==='yesBtn'){CAN();V.flare(x,y);V.ring(x,y,'rgba(255,100,160,.9)',30,6);V.hearts(x,y,12)}
    else if(t.id==='noBtn'){V.sparks(x,y,16,['#ffffff','#ff9bb8']);V.shake(t,300,6)}
    else if(t.id==='nextPhoto'||t.id==='prevPhoto'){const s=$('#photoStack');if(s){const[sx,sy]=mid(s);V.sparks(sx,sy,26,['#fff1d6','#ffd6e0'],.5);V.glint(sx+40,sy-60)}}
    else {V.ring(x,y,'rgba(255,120,170,.85)',18,3);V.sparks(x,y,14,['#ffd36e','#ffffff','#ff9bb8'],.7)}
  },true);
  app.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('#giftArea');if(!g||done.gift)return;const[x,y]=[e.clientX||mid(g)[0],e.clientY||mid(g)[1]];V.sparks(x,y,26,['#ffd36e','#ff9bb8','#ffffff']);V.ring(x,y,'rgba(255,170,120,.9)',30,5);V.shake(g,350,6)},true);

  /* 3D photo tilt + gloss */
  document.addEventListener('pointermove',e=>{const st=$('#photoStack');if(!st)return;const r=st.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
    const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5,c=$('.photo-card.active');if(!c)return;
    c.style.setProperty('--ry',(px*16)+'deg');c.style.setProperty('--rx',(-py*12)+'deg');c.style.setProperty('--gx',(px*100+50)+'%');c.style.setProperty('--gy',(py*100+50)+'%')});
})();
