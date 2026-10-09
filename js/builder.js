(function(){
  const W=window.WISHORA;
  const C=window.WISHORA_CATALOG;
  const product=W.product(W.slug());
  const data=W.loadDraft(product.slug,W.defaults(product));
  data.passcodeProtected=data.passcodeProtected!==false;
  data.theme=data.theme||product.palette||'blush';
  data.photos=Array.isArray(data.photos)?data.photos:[];
  const IS_LJ=product.slug==='wishora-anniversary-story';
  const IS_CLASSIC=product.slug==='wishora-birthday-classic';
  const MEM_N=IS_CLASSIC?4:3;
  const LJ_TAGS=['Memory 1','Memory 2','Memory 3','Memory 4','😂 Funniest','❤️ Sweetest','😭 Craziest','🥹 Favorite'];
  const PHOTO_LIMIT=IS_LJ?8:Number(product.photoLimit||6);
  const IS_FLOW=!!(window.WISHORA_FLOW&&window.WISHORA_FLOW.has(product));
  if(data.photos.length>PHOTO_LIMIT)data.photos=data.photos.slice(0,PHOTO_LIMIT);
  data.sections=W.normalizeSections(product,data);
  data.memories=Array.isArray(data.memories)?data.memories:[];
  data.promises=Array.isArray(data.promises)?data.promises:[];
  const profile=(window.WISHORA_TEMPLATE_PROFILES||{})[product.slug]||{};

  const commonFieldDefs=[
    {id:'recipient',label:'Recipient name',placeholder:'Alex',max:80},
    {id:'sender',label:'Your name',placeholder:'Sam',max:80},
    {id:'title',label:'Page title',placeholder:'A special celebration',max:120}
  ];

  function has(...ids){return ids.some(id=>(data.sections||[]).includes(id));}
  function sectionMeta(id){return (window.WISHORA_SECTIONS||[]).find(x=>x.id===id)||{id,name:id,description:''};}
  function clone(v){return JSON.parse(JSON.stringify(v));}
  function sync(){W.saveDraft(product.slug,data); updateChip(); renderPreview();}
  function updateChip(){document.getElementById('builder-chip').textContent=`${product.occasion} · ${product.name} · ${IS_FLOW&&window.WISHORA_FLOW.pageCount?window.WISHORA_FLOW.pageCount(product):(data.sections||[]).length} pages`}
  function field(def, value, onInput){
    const wrap=document.createElement('label');
    wrap.className=def.full?'full':'';
    wrap.innerHTML=`${W.safe(def.label)}<${def.type==='textarea'?'textarea':'input'} id="${def.id}" maxlength="${def.max||1000}" placeholder="${W.safe(def.placeholder||'')}">${def.type==='textarea'?W.safe(value||''):''}</${def.type==='textarea'?'textarea':'input'}>`;
    const el=wrap.querySelector('input,textarea');
    if(def.type!=='textarea')el.value=value||'';
    el.addEventListener('input',()=>{onInput(el.value);});
    return wrap;
  }
  function makeIntro(title,copy){const d=document.createElement('div');d.className='builder-intro';d.innerHTML=`<strong>${W.safe(title)}</strong><span>${W.safe(copy)}</span>`;return d;}
  function appendGrid(root,defs){const grid=document.createElement('div');grid.className='form-grid';defs.forEach(def=>grid.appendChild(field(def,data[def.id],v=>{data[def.id]=v;sync();})));root.appendChild(grid);}

  function renderContent(){
    const root=document.getElementById('content-panel-root');root.innerHTML='';
    if(window.WISHORA_FLOW&&window.WISHORA_FLOW.has(product)){window.WISHORA_FLOW.groups(product).forEach((g,i)=>{if(i)root.appendChild(document.createElement('hr'));root.appendChild(makeIntro(g.title,g.copy));if(g.defs.length)appendGrid(root,g.defs);});return;}
    root.appendChild(makeIntro(`${product.name} content`,`These are the personal details this exact template uses.`));
    const defs=[...commonFieldDefs];
    if(has('cover','dedication','timeline','countdown','graduation-diploma','certificate')) defs.push({id:'date',label:product.occasionId==='graduation'?'Graduation / class date':'Special date',placeholder:'12 October 2026',max:60});
    if(has('letter')||has('wedding-vows')||has('farewell-toast')||has('home-welcome')||has('festival-greeting')||has('congrats-confetti')) defs.push({id:'letter',label:has('wedding-vows')?'Vows / ceremony words':'Personal message',placeholder:'Write something only they would understand…',max:3000,type:'textarea',full:true});
    if(has('song')){
      defs.push({id:'songTitle',label:'Song title',placeholder:'Our song',max:100});
      defs.push({id:'songArtist',label:'Artist / note',placeholder:'Us',max:100});
    }
    if(false&&has('video')){
      defs.push({id:'movieTitle',label:'Video title',placeholder:'Our celebration film',max:100});
      defs.push({id:'movieTagline',label:'Video caption',placeholder:'A story made of moments.',max:180,full:true});
    }
    if(has('quiz')&&!IS_CLASSIC) defs.push({id:'quizQuestion',label:'Quiz question',placeholder:'Which memory would you relive?',max:180,full:true});
    if(has('surprise')) defs.push({id:'surpriseMessage',label:'Surprise reveal message',placeholder:'The secret message they should see here…',max:600,type:'textarea',full:true});
    if(has('festival-greeting')) defs.push({id:'festivalName',label:'Festival name',placeholder:'Diwali',max:80});

    if(has('memories','timeline','museum','newspaper')){
      root.appendChild(document.createElement('hr'));
      root.appendChild(makeIntro('Memories used by this template','This template has a memory-based page, so add up to '+(MEM_N===4?'four':'three')+' real moments.'));
      const memoryGrid=document.createElement('div');memoryGrid.className='form-grid';
      for(let i=0;i<MEM_N;i++){
        const m=data.memories[i]||{date:'',title:'',note:''};
        const i1=i+1;
        memoryGrid.appendChild(field({id:`memoryTitle${i1}`,label:`Memory ${i1} title`,placeholder:i===0?'The beginning':'A moment worth keeping',max:90},m.title,v=>updateMemory(i,'title',v)));
        memoryGrid.appendChild(field({id:`memoryDate${i1}`,label:`Memory ${i1} date`,placeholder:i===0?'Day one':'Then',max:60},m.date,v=>updateMemory(i,'date',v)));
        memoryGrid.appendChild(field({id:`memoryNote${i1}`,label:`Memory ${i1} note`,placeholder:'Why was this moment special?',max:260,type:'textarea',full:true},m.note,v=>updateMemory(i,'note',v)));
      }
      root.appendChild(memoryGrid);
    }
    if(has('promises','wishes','baby-wishes','wedding-vows')){
      root.appendChild(document.createElement('hr'));
      root.appendChild(makeIntro(product.occasionId==='baby-shower'?'Baby wishes':product.occasionId==='wedding'?'Promises & blessings':'Wishes / promises','Only shown because this template uses a wishes-style page.'));
      const wishGrid=document.createElement('div');wishGrid.className='form-grid';
      for(let i=0;i<3;i++) wishGrid.appendChild(field({id:`promise${i+1}`,label:`Wish ${i+1}`,placeholder:i===0?'May your days be full of joy.':'A wish to carry forward',max:160},data.promises[i]||'',v=>{data.promises[i]=v;data.promises=data.promises.slice(0,3);sync();}));
      root.appendChild(wishGrid);
    }
    appendGrid(root,defs);

    if(product.slug==='wishora-birthday-classic') renderBirthdayClassicContent(root);
    const note=document.createElement('div');note.className='template-usage-note';note.innerHTML=`<strong>Template:</strong> ${W.safe(product.name)} uses ${W.safe((data.sections||[]).map(id=>sectionMeta(id).name).join(' · '))}.`;
    root.appendChild(note);
  }

  function updateMemory(i,key,value){while(data.memories.length<MEM_N)data.memories.push({date:'',title:'',note:''});data.memories[i][key]=value;sync();}
  function renderBirthdayClassicContent(root){
    root.appendChild(document.createElement('hr'));
    root.appendChild(makeIntro('Birthday interactions','These controls exist only because this specific Birthday template uses them.'));
    const grid=document.createElement('div');grid.className='form-grid';
    const words=Array.isArray(data.birthdayRevealWords)?data.birthdayRevealWords:['You','are','so','special'];
    for(let i=0;i<4;i++) grid.appendChild(field({id:`birthdayWord${i+1}`,label:`Balloon word ${i+1}`,placeholder:['You','are','so','special'][i],max:24},words[i]||'',v=>{data.birthdayRevealWords=[1,2,3,4].map(n=>document.getElementById(`birthdayWord${n}`).value||'').filter(Boolean);sync();}));
    grid.appendChild(field({id:'birthdayNoMessage',label:'No-button response',placeholder:'The surprise is waiting…',max:180},data.birthdayNoMessage||'',v=>{data.birthdayNoMessage=v;sync();}));
    grid.appendChild(field({id:'birthdayWishPrompt',label:'Make-a-wish prompt',placeholder:'Close your eyes & make a wish ✨',max:180},data.birthdayWishPrompt||'',v=>{data.birthdayWishPrompt=v;sync();}));
    grid.appendChild(field({id:'birthdayGiftPrompt',label:'Gift prompt',placeholder:'One last little surprise…',max:100},data.birthdayGiftPrompt||'',v=>{data.birthdayGiftPrompt=v;sync();}));
    grid.appendChild(field({id:'birthdayGiftMessage',label:'Gift reveal message',placeholder:'The surprise waiting inside…',max:500,type:'textarea',full:true},data.birthdayGiftMessage||'',v=>{data.birthdayGiftMessage=v;sync();}));
    grid.appendChild(field({id:'birthdayFinalMessage',label:'Final birthday message',placeholder:'Lots of love for you ❤️',max:300,type:'textarea',full:true},data.birthdayFinalMessage||'',v=>{data.birthdayFinalMessage=v;sync();}));
    const BQ=['A little love for you','A little joy for today','A memory worth keeping','Wishing you a beautiful year ahead'];
    const bq=Array.isArray(data.birthdayBouquetMessages)?data.birthdayBouquetMessages:[];
    for(let i=0;i<4;i++) grid.appendChild(field({id:`birthdayBouquet${i+1}`,label:`Bouquet message ${i+1}`,placeholder:BQ[i],max:80},bq[i]||'',v=>{data.birthdayBouquetMessages=[1,2,3,4].map(n=>document.getElementById(`birthdayBouquet${n}`).value||'').filter(Boolean);sync();}));
    const pr=Array.isArray(data.promises)?data.promises:[];
    for(let i=0;i<4;i++) grid.appendChild(field({id:`promise${i+1}`,label:`Wish ${i+1}`,placeholder:BQ[i],max:80},pr[i]||'',v=>{data.promises=[1,2,3,4].map(n=>document.getElementById(`promise${n}`).value||'').filter(Boolean);sync();}));
    root.appendChild(grid);
  }

  function renderExperience(){
    const root=document.getElementById('experience-panel-root');root.innerHTML='';
    root.appendChild(makeIntro('Template experience','The page order is defined by this template. You can reorder optional pages without introducing unrelated interactions.'));
    const layout=document.createElement('div');layout.className='section-builder';
    const current=document.createElement('div');current.innerHTML='<h3>Template pages</h3>';const list=document.createElement('div');list.className='section-list';
    data.sections.forEach((id,i)=>{
      const meta=sectionMeta(id);const row=document.createElement('div');row.className='section-row';
      const locked=i<2 || ['cover','dedication'].includes(id);
      row.innerHTML=`<span class="drag-handle">${locked?'🔒':'⋮⋮'}</span><div class="section-row-copy"><strong>${W.safe(meta.icon)} ${W.safe(meta.name)}</strong><small>${W.safe(meta.description)}</small></div><div class="section-row-actions"><button type="button" title="Move up" ${i===0||locked?'disabled':''}>↑</button><button type="button" title="Move down" ${i===data.sections.length-1?'disabled':''}>↓</button><button type="button" title="Remove optional page" ${locked?'disabled':''}>×</button></div>`;
      const bs=row.querySelectorAll('button');
      bs[0].onclick=()=>{[data.sections[i-1],data.sections[i]]=[data.sections[i],data.sections[i-1]];renderExperience();sync();};
      bs[1].onclick=()=>{[data.sections[i+1],data.sections[i]]=[data.sections[i],data.sections[i+1]];renderExperience();sync();};
      bs[2].onclick=()=>{if(locked)return;data.sections.splice(i,1);renderExperience();sync();};
      list.appendChild(row);
    });
    current.appendChild(list);
    const optional=document.createElement('div');optional.innerHTML='<h3>Compatible add-ons</h3>';const palette=document.createElement('div');palette.className='section-palette';
    const already=new Set(data.sections);
    const allowed=['photos','letter','memories','timeline','song','video','giftbox','yesno','promises','certificate','wishes','countdown','quiz','fourletters','newspaper','museum','proposal','guestbook','surprise','fireworks','cake','wedding-vows','baby-wishes','graduation-diploma','congrats-confetti','farewell-toast','home-welcome','festival-greeting','custom-collage'].filter(id=>{const m=sectionMeta(id);return !m.occasions||m.occasions.includes(product.occasionId);});
    allowed.filter(id=>!already.has(id)).forEach(id=>{const meta=sectionMeta(id);const b=document.createElement('button');b.type='button';b.className='section-add';b.innerHTML=`<span>${W.safe(meta.icon)}</span><div><strong>${W.safe(meta.name)}</strong><small>${W.safe(meta.description)}</small></div><b>+</b>`;b.onclick=()=>{data.sections.push(id);renderExperience();sync();};palette.appendChild(b);});
    if(!palette.children.length){const empty=document.createElement('div');empty.className='template-usage-note';empty.textContent='This template already uses all compatible page types.';palette.appendChild(empty);}
    optional.appendChild(palette);layout.append(current,optional);root.appendChild(layout);
  }

  function renderStyles(){
    const root=document.getElementById('style-panel-root');root.innerHTML='';
    root.appendChild(makeIntro('Set the visual mood','Only themes compatible with this occasion are shown here.'));
    const sets={birthday:['blush','lemon','cherry'],anniversary:['blush','cherry','cocoa','lilac'],wedding:['cocoa','blush','cherry'], 'baby-shower':['sky','mint','blush'],graduation:['ink','sky','mint'],congratulations:['lemon','cherry','blush'],farewell:['sky','cocoa','mint'],housewarming:['mint','cocoa','lemon'],'festival-wishes':['lemon','cherry','cocoa'],custom:['lilac','blush','mint','pixel']};
    const allowed=sets[product.occasionId]||Object.keys(W.themeColors);if(!allowed.includes(data.theme))data.theme=allowed[0];
    const grid=document.createElement('div');grid.className='style-grid';
    allowed.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='theme-option'+(data.theme===t?' active':'');const s=W.themeColors[t];b.innerHTML=`<div class="swatches"><span class="swatch" style="background:${s[0]}"></span><span class="swatch" style="background:${s[1]}"></span><span class="swatch" style="background:${s[2]}"></span></div><strong>${W.safe(W.themeMeta[t].label)}</strong>`;b.onclick=()=>{data.theme=t;renderStyles();sync();};grid.appendChild(b);});root.appendChild(grid);
  }

  function renderMedia(){
    const root=document.getElementById('media-panel-root');root.innerHTML='';
    root.appendChild(makeIntro('Add media','Only media types that this exact template uses are shown.'));
    const grid=document.createElement('div');grid.className='media-grid';
    if(has('photos')||IS_FLOW) grid.appendChild(mediaBox('▧','Your photos',IS_LJ?'Upload 8 photos in this order: photos 1–4 are your Memories (with captions), photos 5–8 appear behind the four “Choose a Memory” hearts: Funniest, Sweetest, Craziest, Favorite.':`Choose up to ${PHOTO_LIMIT} photos for this template.`,'photo-input','photo/*','multiple','photo-note','photos'));
    if(has('song')||IS_FLOW) grid.appendChild(mediaBox('♪','Background music',IS_FLOW?'Plays softly in the background through the whole experience. Visitors can mute it.':'Add the song or voice note used by the soundtrack page.','audio-input','audio/*','','audio-note','audio'));
    root.appendChild(grid);
    const photos=document.createElement('div');photos.id='photo-grid';photos.className='photo-grid';root.appendChild(photos);
    if(has('photos')||IS_FLOW){const limit=document.createElement('div');limit.className='photo-limit-note';limit.id='photo-limit-note';root.appendChild(limit);renderPhotos();}
    const warning=document.createElement('div');warning.className='media-warning';warning.textContent='In this static build, uploaded media is embedded in the share package. Production hosting should store media separately so links stay short.';root.appendChild(warning);
  }
  function mediaBox(icon,title,copy,inputId,accept,multiple,noteId,type){
    const d=document.createElement('div');d.className='upload-box';
    d.innerHTML=`<div class="upload-icon">${icon}</div><h3>${W.safe(title)}</h3><p>${W.safe(copy)}</p><label class="btn btn-primary file-button">Choose ${type}<input id="${inputId}" type="file" accept="${accept}" ${multiple?'multiple':''} hidden></label><div class="media-note" id="${noteId}"></div>${type==='audio'?'<button class="text-button" id="clear-audio" type="button">Remove custom audio</button>':''}${type==='video'?'<button class="text-button" id="clear-video" type="button">Remove custom video</button>':''}`;
    setTimeout(()=>{
      const input=d.querySelector('#'+inputId);input.addEventListener('change',async e=>{
        if(type==='photos'){
          const remaining=Math.max(0,PHOTO_LIMIT-data.photos.length);const files=Array.from(e.target.files||[]).slice(0,remaining);
          if(!files.length){document.getElementById('photo-note').textContent=`Photo limit reached (${PHOTO_LIMIT}). Remove a photo to add another.`;e.target.value='';return;}
          try{const imgs=await Promise.all(files.map(f=>W.resizeImage(f)));data.photos=[...data.photos,...imgs];renderPhotos();sync();}catch{document.getElementById('photo-note').textContent='Could not prepare one or more images.'}e.target.value='';
        }else addMedia(input,type==='audio'?'audioData':'videoData',noteId,type==='audio'?'Audio':'Video');
      });
      if(type==='audio')d.querySelector('#clear-audio').onclick=()=>{delete data.audioData;delete data.audioDataName;document.getElementById('audio-note').textContent='No custom audio added.';sync()};
      if(type==='video')d.querySelector('#clear-video').onclick=()=>{delete data.videoData;delete data.videoDataName;document.getElementById('video-note').textContent='No custom video added.';sync()};
      if(type==='audio'&&data.audioData)document.getElementById('audio-note').textContent=data.audioDataName||'Custom audio added.';
      if(type==='video'&&data.videoData)document.getElementById('video-note').textContent=data.videoDataName||'Custom video added.';
    },0);
    return d;
  }
  function renderPhotos(){const box=document.getElementById('photo-grid');if(!box)return;box.innerHTML='';data.photos.forEach((src,i)=>{const d=document.createElement('div');d.className='photo-item';d.innerHTML=`<img src="${W.safe(src)}" alt="Memory ${i+1}">${IS_LJ?`<span class="photo-tag">${LJ_TAGS[i]||'Extra'}</span>`:''}<button type="button" title="Remove">×</button>`;d.querySelector('button').onclick=()=>{data.photos.splice(i,1);renderPhotos();sync();};box.appendChild(d);});const note=document.getElementById('photo-note');if(note)note.textContent=data.photos.length?`${data.photos.length} / ${PHOTO_LIMIT} photos added.`:`No photos yet (0 / ${PHOTO_LIMIT}).`;const lim=document.getElementById('photo-limit-note');if(lim)lim.textContent=`This template allows up to ${PHOTO_LIMIT} photos.`;}
  async function addMedia(input,key,noteId,label){const f=input.files&&input.files[0];if(!f)return;const max=key==='audioData'?1.5*1024*1024:3*1024*1024;if(f.size>max){document.getElementById(noteId).textContent=`${label} is too large. Use a file under ${key==='audioData'?'1.5':'3'} MB in the static version.`;input.value='';return;}document.getElementById(noteId).textContent='Preparing…';try{data[key]=await W.readAsDataURL(f);data[key+'Name']=f.name;document.getElementById(noteId).textContent=f.name;sync();}catch{document.getElementById(noteId).textContent='Could not read that file.'}input.value='';}

  function renderPrivacy(){const root=document.getElementById('privacy-panel-root');root.innerHTML='';root.appendChild(makeIntro('Protect this celebration','Passcode controls are kept separate from the content and media tabs.'));
    const card=document.createElement('div');card.className='privacy-card';card.innerHTML=`<div class="switch-row"><div><strong>Protect with passcode</strong><p>Recipients enter this code after the intro and before private pages are revealed.</p></div><label class="switch"><input id="passcodeProtected" type="checkbox" ${data.passcodeProtected?'checked':''}><span></span></label></div><label id="passcode-wrap">Passcode<input id="passcode" inputmode="text" maxlength="12" placeholder="1430" value="${W.safe(data.passcode||'')}"></label><div class="privacy-tip">The passcode is not presented as normal text in the recipient UI. The static version verifies it in the browser; production hosting should verify it server-side.</div>`;root.appendChild(card);
    const protectedEl=card.querySelector('#passcodeProtected');protectedEl.onchange=()=>{data.passcodeProtected=protectedEl.checked;renderPrivacy();sync();};
    const wrap=card.querySelector('#passcode-wrap');wrap.classList.toggle('hidden',!data.passcodeProtected);
    card.querySelector('#passcode').oninput=e=>{data.passcode=e.target.value.replace(/[^0-9a-zA-Z-]/g,'').slice(0,12);e.target.value=data.passcode;sync();};
  }

  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.toggle('active',x.dataset.panel===b.dataset.tab));});
  document.getElementById('preview-btn').onclick=()=>document.querySelector('.preview-panel').scrollIntoView({behavior:'smooth',block:'start'});
  document.getElementById('reset-template').onclick=()=>{if(confirm('Reset this template to its clean starting point? Your saved draft for this template will be cleared.')){localStorage.removeItem(W.storageKey);location.reload();}};

  async function packet(){const clean=clone(data);delete clean.passcode;clean.passcodeHash=await W.hashPasscode(data.passcode||'');return {v:3,template:product.slug,data:clean};}
  async function makeShareUrl(){const p=await packet();const encoded=W.base64UrlEncode(JSON.stringify(p));const url=new URL('gift.html',location.href);url.hash='gift='+encoded;return url.toString();}
  function validatePublish(){const issues=[];if(data.passcodeProtected&&!data.passcode)issues.push('Add a passcode or turn passcode protection off.');if(!IS_FLOW){if(!data.recipient)issues.push('Add a recipient name.');if(!data.title)issues.push('Add a page title.');}if(data.photos.length>PHOTO_LIMIT)issues.push(`Remove extra photos. This template allows ${PHOTO_LIMIT}.`);const size=JSON.stringify(data).length;if(size>5_000_000)issues.push('The page is too large for a reliable static share link. Reduce media.');return issues;}
  document.getElementById('publish-btn').onclick=async()=>{const issues=validatePublish();document.getElementById('share-result').hidden=false;if(issues.length){document.getElementById('share-url').textContent=issues.join(' ');return;}const btn=document.getElementById('publish-btn');btn.disabled=true;btn.innerHTML='Generating…';try{const url=await makeShareUrl();document.getElementById('share-url').textContent=url;window._wishoraShare=url;document.getElementById('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText(url);document.getElementById('copy-link').textContent='Copied ✓';}catch{prompt('Copy this link:',url)}};}finally{btn.disabled=false;btn.innerHTML='Generate share link <span>↗</span>'}};

  const previewModes={desktop:{label:'Desktop · 1280×800',width:1280,height:800},tablet:{label:'Tablet · 768×1024',width:768,height:1024},mobile:{label:'Mobile · 390×844',width:390,height:844}};
  let previewMode=localStorage.getItem('wishora-preview-device')||'desktop';
  function applyPreviewMode(){const stage=document.querySelector('.preview-stage'),viewport=document.querySelector('.preview-viewport'),frame=document.getElementById('preview-frame'),label=document.getElementById('preview-size-label');if(!stage||!viewport||!frame)return;const spec=previewModes[previewMode]||previewModes.desktop;stage.dataset.previewDeviceStage=previewMode;document.querySelectorAll('[data-preview-device]').forEach(b=>b.classList.toggle('active',b.dataset.previewDevice===previewMode));if(label)label.textContent=spec.label+' · Fit';const availableWidth=Math.max(240,viewport.clientWidth-8),availableHeight=Math.max(360,window.innerHeight-230),scale=Math.min(1,availableWidth/spec.width,availableHeight/spec.height);viewport.style.setProperty('--preview-scale',String(scale));frame.style.width=spec.width+'px';frame.style.height=spec.height+'px';viewport.style.height=Math.ceil(spec.height*scale)+8+'px';}
  document.querySelectorAll('[data-preview-device]').forEach(b=>b.onclick=()=>{previewMode=b.dataset.previewDevice;localStorage.setItem('wishora-preview-device',previewMode);applyPreviewMode();});
  function scriptSafeJson(obj){return JSON.stringify(obj).replace(/</g,'\\u003c');}
  let previewTimer=null,previewSeq=0;
  function renderPreview(immediate){
    clearTimeout(previewTimer);
    previewTimer=setTimeout(loadPreview,immediate===true?0:300);
  }
  function loadPreview(){
    const frame=document.getElementById('preview-frame');
    if(!frame)return;
    const payload=clone(data);
    payload.passcodeProtected=false;
    delete payload.passcode;
    payload.passcodeHash='preview';
    const pkt={v:3,template:product.slug,data:payload};
    const encoded=W.base64UrlEncode(JSON.stringify(pkt));
    const previewUrl=new URL('gift.html',document.baseURI);
    previewUrl.searchParams.set('preview','1');
    /* A changed query string forces a real reload. Changing only the #hash is a
       same-document navigation, so the old preview was never re-rendered. */
    previewUrl.searchParams.set('_',(++previewSeq)+'-'+Date.now().toString(36));
    previewUrl.hash='gift='+encoded;
    frame.src=previewUrl.toString();
    applyPreviewMode();
  }
  function init(){document.getElementById('builder-name').textContent=product.name;document.getElementById('builder-blurb').textContent=product.blurb;updateChip();renderContent();renderExperience();renderStyles();renderMedia();renderPrivacy();renderPreview(true);applyPreviewMode();window.addEventListener('resize',applyPreviewMode);}
  init();
})();
