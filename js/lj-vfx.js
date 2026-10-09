/* Wishora V19 — canvas VFX engine for "Our Love Story": physics particles, glass shards, shockwaves, flares, smoke, fireworks, bokeh, god rays, slow-mo */
(function(){
  const TAU=Math.PI*2,R=(a,b)=>a+Math.random()*(b-a),P=a=>a[(Math.random()*a.length)|0];
  const HEART='M50 88C20 62 2 44 2 24 2 11 12 2 25 2c10 0 20 6 25 14C55 8 65 2 75 2c13 0 23 9 23 22 0 20-18 38-48 64z';
  const HP=new Path2D(HEART);
  const PINKS=['#ff5b8a','#ff8fb1','#ff2d6d','#ffb3c7'],GOLDS=['#ffe08a','#ffd36e','#fff1c2','#ffb347'];
  const CONF=['#ff5b8a','#ffd36e','#ffffff','#ff9bb8','#c084fc','#7dd3fc'];

  function create(root,opts){
    const mk=c=>{const e=document.createElement('canvas');e.className='lj-cv '+c;return e};
    const back=mk('back'),front=mk('front');
    if(opts&&opts.backFirst)root.insertBefore(back,root.firstChild);else root.insertBefore(back,root.querySelector('.fl-bar'));root.appendChild(front);
    const bx=back.getContext('2d'),fx=front.getContext('2d'),pcx=document.createElement('canvas').getContext('2d');
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    let W=0,H=0,q=matchMedia('(max-width:700px)').matches?.6:1;if(reduce)q=.25;const qMax=q;
    const B=[],F=[];let ts=1,modeName='wine',anchorFn=()=>({x:W*.5,y:H*.4}),running=true,time=0,tms=[],slowT=0;

    let vigG=null,slow=0,fast=0,backOn=true,jsMs=0;const BS=.5;function size(){const r=root.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;[[back,BS],[front,1]].forEach(([c,k])=>{c.width=Math.max(1,Math.round(W*dpr*k));c.height=Math.max(1,Math.round(H*dpr*k));c.style.width=W+'px';c.style.height=H+'px'});bx.setTransform(dpr*BS,0,0,dpr*BS,0,0);vigG=null;fx.setTransform(dpr,0,0,dpr,0,0)}
    size();try{new ResizeObserver(size).observe(root)}catch(e){addEventListener('resize',size)}
    const loc=(x,y)=>{const r=root.getBoundingClientRect();return[x-r.left,y-r.top]};
    const cap=(list,n)=>list.length<n*Math.max(.4,q);
    const N=n=>Math.max(1,Math.round(n*q));

    const SP={};function sprite(key,stops){if(SP[key])return SP[key];const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);stops.forEach(t=>g.addColorStop(t[0],t[1]));x.fillStyle=g;x.fillRect(0,0,64,64);return SP[key]=c}
    /* ---------- drawing ---------- */
    function draw(c,p,a){
      c.save();c.globalAlpha=Math.max(0,Math.min(1,a*(p.al==null?1:p.al)));
      switch(p.t){
        case'glow':{c.globalCompositeOperation='lighter';c.drawImage(sprite('g'+p.c,[[0,p.c],[1,'rgba(0,0,0,0)']]),p.x-p.s,p.y-p.s,p.s*2,p.s*2);break}
        case'spark':{c.globalCompositeOperation='lighter';c.strokeStyle=p.c;c.lineWidth=p.s;c.lineCap='round';c.beginPath();c.moveTo(p.x-p.vx*p.k,p.y-p.vy*p.k);c.lineTo(p.x,p.y);c.stroke();break}
        case'heart':{c.translate(p.x,p.y);c.rotate(p.r);const s=p.s/50;c.scale(s,s);c.translate(-50,-45);if(p.gl){c.shadowColor=p.c;c.shadowBlur=p.gl/s}c.fillStyle=p.c;c.fill(HP);break}
        case'ring':{c.globalCompositeOperation='lighter';c.strokeStyle=p.c;c.lineWidth=Math.max(.5,p.lw*a);c.beginPath();c.arc(p.x,p.y,p.s,0,TAU);c.stroke();break}
        case'smoke':{c.drawImage(sprite('s'+p.c,[[0,p.c+'.38)'],[1,p.c+'0)']]),p.x-p.s,p.y-p.s,p.s*2,p.s*2);break}
        case'conf':{c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.cos(p.fl));c.fillStyle=p.c;c.fillRect(-(p.w||p.s),-(p.h||p.s/2),(p.w||p.s)*2,(p.h||p.s));break}
        case'glit':{c.globalCompositeOperation='lighter';c.globalAlpha*=.35+.65*Math.abs(Math.sin(p.tw));c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.fillRect(-p.s/2,-p.s,p.s,p.s*2);break}
        case'petal':{c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.beginPath();c.ellipse(0,0,p.s,p.s*.55,0,0,TAU);c.fill();break}
        case'shard':{c.translate(p.x,p.y);c.rotate(p.r);const g=c.createLinearGradient(-26,-26,26,26);g.addColorStop(0,p.c1);g.addColorStop(1,p.c2);c.fillStyle=g;c.beginPath();p.pts.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1.2;c.stroke();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,255,255,.14)';c.fill();break}
        case'bokeh':{c.globalCompositeOperation='lighter';c.drawImage(sprite('b'+p.c,[[0,`rgba(${p.c},.03)`],[.82,`rgba(${p.c},.2)`],[1,`rgba(${p.c},0)`]]),p.x-p.s,p.y-p.s,p.s*2,p.s*2);break}
        case'star':{c.globalCompositeOperation='lighter';const tw=.55+.45*Math.sin(p.tw),s=p.s*tw;c.fillStyle=p.c;c.beginPath();c.arc(p.x,p.y,s*.55,0,TAU);c.fill();if(p.s>1.6){c.strokeStyle=p.c;c.lineWidth=.8;c.beginPath();c.moveTo(p.x-s*3,p.y);c.lineTo(p.x+s*3,p.y);c.moveTo(p.x,p.y-s*3);c.lineTo(p.x,p.y+s*3);c.stroke()}break}
        case'neb':{c.drawImage(sprite('n'+p.c,[[0,`rgba(${p.c},.22)`],[1,`rgba(${p.c},0)`]]),p.x-p.s,p.y-p.s,p.s*2,p.s*2);break}
        case'flare':{c.globalCompositeOperation='lighter';const L=p.s*(1.1-a*.4),g=c.createLinearGradient(p.x-L,p.y,p.x+L,p.y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,p.c);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(p.x-L,p.y-2,L*2,4);const r=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*.35);r.addColorStop(0,'rgba(255,255,255,.95)');r.addColorStop(1,'rgba(255,200,220,0)');c.fillStyle=r;c.beginPath();c.arc(p.x,p.y,p.s*.35,0,TAU);c.fill();[.35,.7,1.2].forEach((k,i)=>{const gx=p.x+(W*.5-p.x)*k,gy=p.y+(H*.5-p.y)*k,rr=p.s*(.12+i*.05),gg=c.createRadialGradient(gx,gy,0,gx,gy,rr);gg.addColorStop(0,i%2?'rgba(120,180,255,.5)':'rgba(255,140,180,.5)');gg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gg;c.beginPath();c.arc(gx,gy,rr,0,TAU);c.fill()});break}
      }
      c.restore();
    }
    const RC={};
    function rays(c,cx,cy,t,al,col,n){
      const key=col+'|'+n;let sp=RC[key];
      if(!sp){const S=512,cv=document.createElement('canvas');cv.width=cv.height=S;const x=cv.getContext('2d');x.translate(S/2,S/2);
        for(let i=0;i<n;i++){x.save();x.rotate(i*TAU/n);const g=x.createRadialGradient(0,0,0,0,0,S/2);g.addColorStop(0,`rgba(${col},1)`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.beginPath();x.moveTo(0,0);const L=S/2,w=.085;x.lineTo(L,-L*Math.tan(w));x.lineTo(L,L*Math.tan(w));x.closePath();x.fill();x.restore()}
        sp=RC[key]=cv}
      const D=Math.hypot(W,H)*1.7;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,al*1.7*(.8+.2*Math.sin(t*1.3)));c.translate(cx,cy);c.rotate(t*.06);c.drawImage(sp,-D/2,-D/2,D,D);c.restore();
    }

    /* ---------- simulation ---------- */
    function run(list,c,dt){
      for(let i=list.length-1;i>=0;i--){
        const p=list[i];
        if(!p.amb){p.life-=dt;if(p.life<=0){list.splice(i,1);continue}}
        const f=Math.pow(p.drag||1,dt*60);p.vx=(p.vx||0)*f;p.vy=(p.vy||0)*f+(p.g||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
        if(p.vr)p.r=(p.r||0)+p.vr*dt;if(p.grow)p.s+=p.grow*dt;if(p.vf)p.fl+=p.vf*dt;if(p.tw!=null)p.tw+=dt*(p.ts||2);
        if(p.t==='shard'&&p.y>H-6&&p.vy>0){p.y=H-6;p.vy*=-.38;p.vx*=.72;p.vr*=.6}
        if(p.t==='petal'){p.x+=Math.sin(time*1.4+p.ph)*20*dt}
        if(p.t==='rocket'){
          F.push({t:'spark',x:p.x,y:p.y,vx:R(-25,25),vy:R(20,70),g:220,drag:.95,k:.02,s:2.2,c:'#ffe3b0',life:.55,max:.55});
          if(p.vy>-70||p.y<p.ty){explode(p.x,p.y,p.kind,p.cols);list.splice(i,1)}
          continue;
        }
        if(p.amb){const m=p.s+20;if(p.x<-m)p.x=W+m;else if(p.x>W+m)p.x=-m;if(p.y<-m)p.y=H+m;else if(p.y>H+m)p.y=-m}
        draw(c,p,p.amb?(p.t==='ember'?.5+.5*Math.abs(Math.sin(p.tw||0)):(p.t==='glow'&&p.tw!=null?.3+.7*Math.abs(Math.sin(p.tw)):1)):p.life/p.max);
      }
    }
    let last=performance.now(),acc=0,nf=0,bAcc=0,fN=0;
    function frame(now){
      if(!root.isConnected){running=false;return}
      const t0=performance.now();const raw=Math.min(.05,(now-last)/1000);last=now;acc+=raw;nf++;
      if(nf>=45){const av=acc/nf;if(av>.028&&q>.35)q=Math.max(.35,q-.12);else if(av<.02&&q<qMax)q=Math.min(qMax,q+.06);
        if(av>.034&&q<=.36){slow++;if(slow>=3&&backOn){backOn=false;back.style.display='none'}}else if(av<.022){slow=0;if(!backOn&&++fast>=6){backOn=true;fast=0;back.style.display=''}}
        acc=0;nf=0}
      time+=raw;const dt=raw*ts,an=anchorFn();
      fx.clearRect(0,0,W,H);bAcc+=dt;fN++;
      if(backOn&&!(fN&1)){bx.clearRect(0,0,W,H);
      if(opts&&opts.vignette){if(!vigG){vigG=bx.createRadialGradient(W*.5,H*.45,Math.min(W,H)*.35,W*.5,H*.45,Math.hypot(W,H)*.6);vigG.addColorStop(0,'rgba(0,0,0,0)');vigG.addColorStop(1,opts.vignette)}bx.fillStyle=vigG;bx.fillRect(0,0,W,H)}
      if(modeName==='wine')rays(bx,W*.5,-H*.1,time,.075,'255,170,190',5);
      else if(modeName==='night')rays(bx,an.x,an.y,time,.17,'255,60,100',9);
      else if(modeName==='celebrate')rays(bx,W*.18,-H*.05,time,.13,'255,225,160',6);
      else if(modeName==='party')rays(bx,W*.5,-H*.1,time,.1,'255,190,210',5);
      else if(modeName==='cake')rays(bx,an.x,an.y,time,.12,'255,200,120',8);
      run(B,bx,bAcc);bAcc=0;}
      run(F,fx,dt);
      jsMs=jsMs*.9+(performance.now()-t0)*.1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* ---------- ambient scenes ---------- */
    function seed(m){
      B.length=0;const add=p=>{p.amb=true;B.push(p)};
      const bokeh=(n,cols,sMin,sMax)=>{for(let i=0;i<N(n);i++)add({t:'bokeh',x:R(0,W),y:R(0,H),vx:R(-8,8),vy:R(-14,-3),s:R(sMin,sMax),c:P(cols)})};
      const dust=n=>{for(let i=0;i<N(n);i++)add({t:'glow',x:R(0,W),y:R(0,H),vx:R(-5,5),vy:R(-10,-2),s:R(1.5,3.2),c:'rgba(255,235,220,.9)',tw:R(0,6),ts:R(.8,2.4)})};
      if(m==='wine'){bokeh(16,['255,110,150','255,160,190','255,90,120'],18,70);dust(30)}
      else if(m==='night'){for(let i=0;i<N(46);i++)add({t:'ember',x:R(0,W),y:R(0,H),vx:R(-10,10),vy:R(-60,-18),s:R(1.6,4),tw:R(0,6),ts:R(3,7)});bokeh(8,['255,60,100'],30,90)}
      else if(m==='dream'){for(let i=0;i<3;i++)add({t:'neb',x:R(0,W),y:R(0,H),vx:R(-6,6),vy:R(-4,4),s:R(200,340),c:P(['190,120,255','255,140,190','120,170,255'])});
        for(let i=0;i<N(110);i++)add({t:'star',x:R(0,W),y:R(0,H),vx:R(-3,3)*(1+i%3),vy:R(-2,2),s:R(.8,2.6),tw:R(0,6),ts:R(1,4),c:P(['#ffffff','#ffd9f0','#cfe0ff'])});dust(14)}
      else if(m==='party'||m==='cake'){bokeh(16,m==='cake'?['255,170,90','255,140,110','255,200,140']:['255,150,190','255,214,120','255,255,255'],18,72);dust(34);for(let i=0;i<N(26);i++)add({t:'glit',x:R(0,W),y:R(0,H),vx:R(-6,6),vy:R(-12,-2),s:R(2,4.5),r:R(0,6),vr:R(-2,2),tw:R(0,6),ts:R(2,5),c:P(['#ffd36e','#ff9bb8','#ffffff','#9be7ff'])})}
      else if(m==='celebrate'){bokeh(16,['255,214,120','255,170,190','255,255,255'],20,80);for(let i=0;i<N(22);i++)add({t:'petal',x:R(0,W),y:R(-H,H),vx:R(-10,10),vy:R(30,70),g:0,r:R(0,6),vr:R(-2,2),s:R(6,12),ph:R(0,6),c:P(['#ff9bb8','#ffb3c7','#ff7aa5'])})}
    }
    seed('wine');
    let shootT=0;
    tms.push(setInterval(()=>{if(modeName!=='dream'||!running)return;const y=R(0,H*.45),x=R(0,W*.7),sp=R(900,1300);F.push({t:'spark',x,y,vx:sp,vy:sp*.4,g:0,drag:1,k:.09,s:2.4,c:'#ffffff',life:.7,max:.7});F.push({t:'spark',x,y,vx:sp,vy:sp*.4,g:0,drag:1,k:.22,s:1.2,c:'rgba(255,170,230,.9)',life:.7,max:.7})},2600));

    /* ---------- effects ---------- */
    function explode(x,y,kind,cols){
      cols=cols||[...PINKS,...GOLDS];const n=N(kind==='heart'?72:kind==='ring'?64:110);
      F.push({t:'flare',x,y,s:170,c:'rgba(255,235,210,.95)',life:.55,max:.55});
      F.push({t:'glow',x,y,s:150,c:'rgba(255,210,180,.9)',life:.6,max:.6});
      for(let i=0;i<n;i++){let vx,vy;const c=P(cols);
        if(kind==='heart'){const t=i/n*TAU;vx=16*Math.pow(Math.sin(t),3)*14;vy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*14}
        else if(kind==='ring'){const a=i/n*TAU;vx=Math.cos(a)*270;vy=Math.sin(a)*270}
        else{const a=R(0,TAU),s=R(90,390);vx=Math.cos(a)*s;vy=Math.sin(a)*s}
        F.push({t:'spark',x,y,vx,vy,g:kind==='willow'?60:110,drag:kind==='willow'?.985:.965,k:.045,s:R(2.2,4),c,life:R(1.3,2.2),max:2.2});
      }
    }
    const V={
      mode(m){modeName=m;seed(m)},
      follow(el){anchorFn=el?()=>{const r=el.getBoundingClientRect(),o=root.getBoundingClientRect();return{x:r.left-o.left+r.width/2,y:r.top-o.top+r.height/2}}:()=>({x:W*.5,y:H*.4})},
      ring(x,y,c,s,lw){[x,y]=loc(x,y);F.push({t:'ring',x,y,s:s||10,grow:(s||10)*6+200,lw:lw||4,c:c||'rgba(255,120,160,.9)',life:.9,max:.9})},
      sparks(x,y,n,cols,sp){[x,y]=loc(x,y);cols=cols||GOLDS;for(let i=0;i<N(n)&&cap(F,900);i++){const a=R(0,TAU),s=R(120,420)*(sp||1);F.push({t:'spark',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-50,g:620,drag:.965,k:.03,s:R(1.2,3.2),c:P(cols),life:R(.5,1.2),max:1.2})}},
      hearts(x,y,n,o){[x,y]=loc(x,y);for(let i=0;i<N(n)&&cap(F,900);i++)F.push({t:'heart',x,y,vx:R(-230,230),vy:-R(220,560),g:520,drag:.985,r:R(-.6,.6),vr:R(-3,3),s:R(9,(o&&o.big)||26),c:P(PINKS),gl:14,life:R(1.8,3.1),max:3.1})},
      glint(x,y){[x,y]=loc(x,y);F.push({t:'star',x,y,vx:R(-14,14),vy:R(-30,-8),g:20,s:R(1.6,3),tw:1.2,ts:0,c:'#fff4d6',life:.8,max:.8});F.push({t:'glow',x,y,vx:R(-10,10),vy:R(-25,-6),s:R(7,13),c:'rgba(255,200,220,.8)',life:.7,max:.7})},
      trail(x,y){[x,y]=loc(x,y);F.push({t:'glow',x,y,s:R(10,18),c:'rgba(255,120,160,.9)',life:.35,max:.35});F.push({t:'spark',x,y,vx:R(-120,-40),vy:R(40,130),g:0,drag:.95,k:.05,s:R(1.4,2.6),c:'#ffd9a0',life:.45,max:.45})},
      flare(x,y,c){[x,y]=loc(x,y);F.push({t:'flare',x,y,s:Math.min(W,H)*.45,c:c||'rgba(255,220,230,.95)',life:.65,max:.65})},
      smoke(x,y,n,col){[x,y]=loc(x,y);for(let i=0;i<N(n);i++)F.push({t:'smoke',x:x+R(-20,20),y:y+R(-20,20),vx:R(-40,40),vy:R(-70,-15),s:R(24,40),grow:R(50,100),c:col||'rgba(110,25,50,',life:R(1,1.8),max:1.8})},
      shatter(cx,cy,sc){
        [cx,cy]=loc(cx,cy);const s=(sc||1)*2.1,m=new DOMMatrix().translate(cx-50*s,cy-45*s).scale(s),p2=new Path2D();p2.addPath(HP,m);
        const pts=[];let tries=0;while(pts.length<N(26)&&tries<5000){tries++;const x=R(cx-50*s,cx+50*s),y=R(cy-45*s,cy+45*s);if(pcx.isPointInPath(p2,x,y))pts.push([x,y])}
        pts.forEach((a,i)=>{const near=pts.map((b,j)=>[Math.hypot(a[0]-b[0],a[1]-b[1]),j]).filter(o=>o[1]!==i).sort((u,v)=>u[0]-v[0]).slice(0,2).map(o=>pts[o[1]]);if(near.length<2)return;
          const tri=[a,...near],gx=(tri[0][0]+tri[1][0]+tri[2][0])/3,gy=(tri[0][1]+tri[1][1]+tri[2][1])/3,ang=Math.atan2(gy-cy,gx-cx),sp=R(180,560);
          F.push({t:'shard',x:gx,y:gy,pts:tri.map(v=>[v[0]-gx,v[1]-gy]),vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-R(140,420),g:950,drag:.985,r:0,vr:R(-9,9),life:R(2.4,3.6),max:3.6,c1:'#ff2d55',c2:'#7a0020'})});
      },
      confetti(side,o){const L=side==='l',n=N(o&&o.streamer?26:70),st=o&&o.streamer;for(let i=0;i<n&&cap(F,900);i++)F.push({t:'conf',x:L?W*.02:W*.98,y:H*.96,vx:(L?1:-1)*R(220,640),vy:-R(520,980),g:st?560:720,drag:st?.99:.985,r:R(0,6),vr:R(-8,8),fl:R(0,6),vf:R(8,18),s:R(3.5,6.5),w:st?R(9,16):undefined,h:st?2.4:undefined,c:P(CONF),life:R(3,5),max:5})},
      fragments(x,y,c1,c2,n){[x,y]=loc(x,y);for(let i=0;i<N(n||16)&&cap(F,900);i++){const a=R(0,TAU),sp=R(120,430),sz=R(5,13);F.push({t:'shard',x,y,pts:[[-sz,-sz*.6],[sz,-sz*.4],[0,sz]],vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-90,g:700,drag:.975,r:R(0,6),vr:R(-12,12),life:R(1.2,2),max:2,c1,c2})}},
      petalRain(ms,cols){const iv=setInterval(()=>{if(running)F.push({t:'petal',x:R(0,W),y:-20,vx:R(-20,20),vy:R(50,110),g:0,r:R(0,6),vr:R(-3,3),s:R(6,12),ph:R(0,6),c:P(cols||['#ff9bb8','#ffb3c7','#ff7aa5','#ffd0dc']),life:R(6,9),max:9})},120);tms.push(iv);setTimeout(()=>clearInterval(iv),ms)},
      flameOn(fn){clearInterval(V._fl);V._fl=setInterval(()=>{if(!running)return;const p=fn();if(!p)return;const[x,y]=loc(p.x,p.y);F.push({t:'glow',x,y,s:R(60,92),c:'rgba(255,190,110,.35)',life:.22,max:.22});for(let i=0;i<2;i++)F.push({t:'glow',x:x+R(-6,6),y:y+R(-4,4),vx:R(-14,14),vy:-R(40,110),s:R(2,4.2),c:'rgba(255,200,120,.95)',life:R(.6,1.3),max:1.3})},70);tms.push(V._fl)},
      flameOff(){clearInterval(V._fl)},
      rocket(){const ty=R(H*.12,H*.45),x=R(W*.15,W*.85),g=420,v=Math.sqrt(2*g*(H-ty));F.push({t:'rocket',x,y:H,vx:R(-30,30),vy:-v,g,drag:1,ty,kind:P(['burst','heart','ring','willow','burst']),cols:P([PINKS,GOLDS,[...PINKS,...GOLDS],['#ffffff','#ffd9f0','#ff9bb8']]),life:5,max:5})},
      fireworks(on){clearInterval(V._fw);if(on&&!reduce){V.rocket();V._fw=setInterval(()=>{if(!running)return;V.rocket();if(Math.random()<.4)setTimeout(V.rocket,220)},760);tms.push(V._fw)}},
      fountain(x,y,kind,ms){const iv=setInterval(()=>{if(kind==='sparks')V.sparks(x,y,6,GOLDS,.8);else V.hearts(x,y,2,{big:20})},45);tms.push(iv);setTimeout(()=>clearInterval(iv),ms)},
      slowmo(ms,s){ts=s;clearTimeout(slowT);slowT=setTimeout(()=>{const iv=setInterval(()=>{ts=Math.min(1,ts+.08);if(ts>=1)clearInterval(iv)},40);tms.push(iv)},ms)},
      shake(el,ms,amp){if(reduce)return;const f=[];for(let i=0;i<10;i++)f.push({transform:`translate(${R(-amp,amp)}px,${R(-amp,amp)}px) rotate(${R(-amp/8,amp/8)}deg)`});f.push({transform:'none'});el.animate(f,{duration:ms,easing:'ease-out'})},
      aberration(el,ms){el.style.filter='drop-shadow(5px 0 0 rgba(255,0,60,.7)) drop-shadow(-5px 0 0 rgba(0,220,255,.6))';setTimeout(()=>el.style.filter='',ms)},
      zoom(el){try{el.animate([{transform:'scale(1)'},{transform:'scale(1.07)'},{transform:'scale(1)'}],{duration:380,easing:'ease-out'})}catch(e){}},
      stats:()=>({back:B.length,front:F.length,q,mode:modeName,jsMs:Math.round(jsMs*100)/100,backOn})
    };
    return V;
  }
  window.LJVFX={create};
})();
