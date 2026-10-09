/* Wishora V17 — a unique atmosphere per template: living background, kinetic titles, page-change effect, intro tagline */
(function(){
  const R=(a,b)=>a+Math.random()*(b-a);
  const VM={
    'wishora-birthday-gift':{amb:'balloons',kin:'bounce',cur:'wipe',meta:'Made for the birthday star {rec}'},
    'wishora-anniversary-story':{amb:'hearts',kin:'blur',cur:'iris',meta:'A love letter for {rec}'},
    'wishora-anniversary-cinema':{amb:'grain',kin:'reveal',cur:'curtain',meta:'Starring {rec} · Rated L for Love'},
    'wishora-wedding-story':{amb:'petals',kin:'blur',cur:'iris',meta:'The wedding of {rec}'},
    'wishora-wedding-vows':{amb:'fireflies',kin:'mask',cur:'',meta:'Vows for {rec}'},
    'wishora-baby-shower-welcome':{amb:'clouds',kin:'float',cur:'',meta:'Welcoming {rec}'},
    'wishora-baby-shower-game':{amb:'bubbles',kin:'bounce',cur:'wipe',meta:'Round 1 · Player: {rec}'},
    'wishora-graduation-classic':{amb:'stars',kin:'mask',cur:'',meta:'Awarded to {rec}'},
    'wishora-graduation-future':{amb:'aurora',kin:'glitch',cur:'',meta:'System online · User: {rec}'},
    'wishora-congratulations-celebrate':{amb:'confetti',kin:'pop',cur:'wipe',meta:'Big news for {rec}!'},
    'wishora-congratulations-gallery':{amb:'light',kin:'underline',cur:'',meta:'On view · Featuring {rec}'},
    'wishora-farewell-voyage':{amb:'plane',kin:'type',cur:'',meta:'Passenger {rec} · Gate 14 · Seat 1A'},
    'wishora-farewell-memory':{amb:'leaves',kin:'hand',cur:'',meta:'For {rec}, with love'},
    'wishora-housewarming-welcome':{amb:'window',kin:'float',cur:'',meta:'Welcome, {rec}'},
    'wishora-housewarming-tour':{amb:'blueprint',kin:'type',cur:'',meta:'Guest: {rec} · Tour starts now'},
    'wishora-festival-wishes-diwali':{amb:'embers',kin:'glow',cur:'flash',meta:'For {rec}, with light'},
    'wishora-festival-wishes-family':{amb:'mandala',kin:'pop',cur:'iris',meta:'To {rec} and family'},
    'wishora-custom-blank':{amb:'calm',kin:'none',cur:'',meta:''},
    'wishora-custom-mixed':{amb:'blobs',kin:'wobble',cur:'wipe',meta:'A mixed bag for {rec}'}
  };
  const sp=(L,n,fn,tag)=>{for(let i=0;i<n;i++){const e=document.createElement(tag||'i');fn(e,i);L.appendChild(e)}};
  const rise=(e,cls,z,t)=>{e.className=cls;e.style.cssText=`left:${R(1,96)}%;--z:${z}px;--h:${(Math.random()*360)|0}deg;animation-duration:${t},${R(2.5,5)}s;animation-delay:${-R(0,20)}s,${-R(0,4)}s`};
  const fall=(e,cls,z,t)=>{e.className=cls;e.style.cssText=`left:${R(0,98)}%;--z:${z}px;--dx:${R(-90,90)}px;--hue:${(Math.random()*360)|0};animation-duration:${t},${R(3,7)}s;animation-delay:${-R(0,18)}s,0s`};
  const A={
    balloons:L=>sp(L,10,(e,i)=>rise(e,'v-bal',R(34,56),R(12,22)+'s')),
    hearts:L=>{sp(L,14,(e,i)=>{rise(e,'v-heart',R(14,34),R(14,26)+'s');e.textContent='❤'});sp(L,1,e=>e.className='v-warm')},
    grain:L=>{['v-grain','v-leak','v-spot','v-flick'].forEach(c=>sp(L,1,e=>e.className=c));sp(L,16,(e,i)=>{e.className='v-speck';e.style.cssText=`left:${R(0,98)}%;top:${R(0,98)}%;animation-duration:${R(6,14)}s;animation-delay:${-R(0,10)}s`})},
    petals:L=>sp(L,18,(e,i)=>fall(e,'v-petal',R(10,20),R(10,18)+'s')),
    fireflies:L=>sp(L,24,(e,i)=>{e.className='v-fly';e.style.cssText=`left:${R(2,96)}%;top:${R(5,95)}%;--dx:${R(-80,80)}px;--dy:${R(-80,80)}px;animation-duration:${R(4,9)}s,${R(1.6,3.2)}s;animation-delay:${-R(0,5)}s,${-R(0,3)}s`}),
    clouds:L=>sp(L,6,(e,i)=>{e.className='v-cloud';e.style.cssText=`top:${6+i*14+R(0,6)}%;--w:${R(110,200)}px;animation-duration:${R(40,80)}s;animation-delay:${-R(0,60)}s;opacity:${R(.5,.9)}`}),
    bubbles:L=>sp(L,18,(e,i)=>rise(e,'v-bub',R(18,52),R(9,18)+'s')),
    stars:L=>{sp(L,32,(e,i)=>{e.className='v-star';e.style.cssText=`left:${R(0,98)}%;top:${R(0,98)}%;--z:${R(6,16)}px;animation-duration:${R(2,5)}s;animation-delay:${-R(0,4)}s`});sp(L,2,(e,i)=>{e.className='v-shoot';e.style.cssText=`top:${R(5,35)}%;animation-delay:${i*3.5}s`})},
    aurora:L=>{['#00c2ff','#a855f7','#22d3ee'].forEach((c,i)=>sp(L,1,e=>{e.className='v-aur';e.style.cssText=`--c:${c};--dx:${(i-1)*180}px;--dy:${i%2?-120:100}px;left:${i*25-10}%;top:${i*18-10}%;animation-delay:${-i*5}s`}));sp(L,1,e=>e.className='v-grid')},
    confetti:L=>{sp(L,1,e=>e.className='v-sun');sp(L,38,(e,i)=>fall(e,'v-conf',R(8,14),R(5,10)+'s'))},
    light:L=>{sp(L,4,(e,i)=>{e.className='v-beam';e.style.cssText=`left:${8+i*24}%;animation-delay:${-i*2.2}s;width:${R(10,18)}vmax`});sp(L,18,(e,i)=>{e.className='v-dust';e.style.cssText=`left:${R(0,98)}%;top:${R(0,98)}%;animation-duration:${R(8,16)}s;animation-delay:${-R(0,12)}s`})},
    plane:L=>{sp(L,1,e=>e.className='v-route');sp(L,5,(e,i)=>{e.className='v-cloud';e.style.cssText=`top:${8+i*17+R(0,5)}%;--w:${R(100,170)}px;animation-duration:${R(40,70)}s;animation-delay:${-R(0,50)}s`});sp(L,1,e=>{e.className='v-plane';e.textContent='✈️'})},
    leaves:L=>{sp(L,14,(e,i)=>{fall(e,'v-leaf',R(18,34),R(11,20)+'s');e.textContent='🍂'});sp(L,12,(e,i)=>{e.className='v-dust';e.style.cssText=`left:${R(0,98)}%;top:${R(0,98)}%;animation-duration:${R(8,16)}s;animation-delay:${-R(0,12)}s`})},
    window:L=>{sp(L,1,e=>e.className='v-win');sp(L,18,(e,i)=>{e.className='v-dust';e.style.cssText=`left:${R(0,98)}%;top:${R(0,98)}%;animation-duration:${R(8,16)}s;animation-delay:${-R(0,12)}s`})},
    blueprint:L=>{L.insertAdjacentHTML('beforeend','<svg class="v-bp" viewBox="0 0 200 160"><path d="M20 80L100 20L180 80V150H20Z M80 150V100H120V150 M140 90H165V115H140Z M10 150H190"/></svg><i class="v-pulse"></i>')},
    embers:L=>{sp(L,1,e=>e.className='v-glow');sp(L,34,(e,i)=>rise(e,'v-ember',R(3,8),R(6,13)+'s'));sp(L,5,(e,i)=>{rise(e,'v-lant',R(28,44),R(26,40)+'s');e.textContent='🏮'})},
    mandala:L=>{sp(L,1,e=>e.className='v-mand');sp(L,16,(e,i)=>{fall(e,'v-petal o',R(10,18),R(11,19)+'s')})},
    blobs:L=>sp(L,6,(e,i)=>{e.className='v-blob';e.style.cssText=`left:${R(0,80)}%;top:${R(0,80)}%;--z:${R(90,200)}px;--c:${['#ff8fb1','#7be0d6','#ffd86b','#b9a7ff'][i%4]};--dx:${R(-90,90)}px;--dy:${R(-90,90)}px;animation-delay:${-R(0,8)}s,${-R(0,10)}s`}),
    calm:()=>{}
  };
  function ambient(L,type){L.innerHTML='';L.classList.add('v-layer');L.dataset.amb=type;(A[type]||A.calm)(L)}
  function kinetic(el,type){
    if(!el||!type||type==='none')return;const txt=el.textContent;el.classList.add('kin-'+type);
    if(type==='hand'||type==='underline'&&false)return;
    if(type==='glitch'){const ch='!<>-_/[]{}=+*^?#',tg=[...txt];let f=0;const iv=setInterval(()=>{f++;el.textContent=tg.map((c,i)=>c===' '?' ':(i<f/2?c:ch[(Math.random()*ch.length)|0])).join('');if(f>tg.length*2+4){clearInterval(iv);el.textContent=txt}},30);return}
    let k=0;const e2=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    el.innerHTML=txt.split(' ').map(w=>`<span class="kw">${[...w].map(c=>`<span class="kc" style="--k:${k++}">${e2(c)}</span>`).join('')}</span>`).join(' ');
  }
  function trans(root,stage,type){
    if(!type)return;
    if(type==='iris'){try{stage.animate([{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(150% at 50% 50%)'}],{duration:850,easing:'ease-out'})}catch(e){}return}
    const t=root.querySelector('.v-trans');if(!t)return;t.className='v-trans';void t.offsetWidth;t.className='v-trans '+type+' go';
  }
  window.WISHORA_VIBES={get:slug=>VM[slug]||null,ambient,kinetic,trans};
})();
