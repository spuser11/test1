(function(){
  const W=window.WISHORA||{};
  W.clone=x=>JSON.parse(JSON.stringify(x));
  W.slug=()=>new URLSearchParams(location.search).get('template')||'custom-occasion';
  W.product=slug=>window.WISHORA_CATALOG.products.find(p=>p.slug===slug)||window.WISHORA_CATALOG.products.find(p=>p.slug==='custom-occasion')||window.WISHORA_CATALOG.products[0];
  W.defaults=p=>W.clone(p?.defaults||{});
  W.storageKey='wishora-draft-v2';
  W.saveDraft=(slug,data)=>{try{const all=JSON.parse(localStorage.getItem(W.storageKey)||'{}');all[slug]=data;localStorage.setItem(W.storageKey,JSON.stringify(all));}catch(e){}};
  W.loadDraft=(slug,fallback)=>{try{const all=JSON.parse(localStorage.getItem(W.storageKey)||'{}');return {...W.clone(fallback),...(all[slug]||{})};}catch(e){return W.clone(fallback)}};
  W.uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-5);
  W.safe=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  W.base64UrlEncode=value=>{const bytes=new TextEncoder().encode(value);let bin='';for(let i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
  W.base64UrlDecode=value=>{const pad=value.length%4?'='.repeat(4-value.length%4):'';const bin=atob(value.replace(/-/g,'+').replace(/_/g,'/')+pad);const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)};
  W.hashPasscode=async pass=>{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(pass)));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('')};
  W.resizeImage=(file,max=640,quality=.58)=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',quality))};img.onerror=reject;img.src=r.result};r.onerror=reject;r.readAsDataURL(file)});
  W.readAsDataURL=file=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
  W.themeColors={
    blush:['#e55a98','#ffd6e8','#fff7fb'], lemon:['#c99513','#ffe7a4','#fffaf0'], cherry:['#bc384b','#ffd0d4','#fff6f6'], sky:['#3f7fb5','#d6e8f6','#f6fbff'], mint:['#3f9478','#cfeee0','#f4fcf8'], cocoa:['#9b6c49','#ead9cc','#fbf5f0'], ink:['#b18a38','#2b2b31','#111116'], pixel:['#2d8fb1','#a7dff0','#effbff'], news:['#7a2635','#e9d9b5','#fbf4e6'], lilac:['#8769b5','#e7dcf5','#faf7ff']
  };
  W.themeMeta={
    blush:{label:'Blush',className:'theme-blush'}, lemon:{label:'Lemon',className:'theme-lemon'}, cherry:{label:'Cherry',className:'theme-cherry'}, sky:{label:'Sky',className:'theme-sky'}, mint:{label:'Mint',className:'theme-mint'}, cocoa:{label:'Cocoa',className:'theme-cocoa'}, ink:{label:'Ink',className:'theme-ink'}, pixel:{label:'Pixel',className:'theme-pixel'}, news:{label:'Newsprint',className:'theme-news'}, lilac:{label:'Lilac',className:'theme-lilac'}
  };
  const engineDefaults={
    minisite:['cover','letter','photos','song','certificate'],
    birthday:['cover','cake','letter','memories','photos','song','fireworks'],
    giftbox:['cover','giftbox','letter','photos','song','certificate'],
    yesno:['cover','yesno','letter','photos','song'],
    museum:['cover','timeline','museum','photos','certificate'],
    cinema:['cover','video','timeline','photos','song'],
    newspaper:['cover','newspaper','letter','photos','promises'],
    letters:['cover','fourletters','letter','photos'],
    pixel:['cover','pixel','letter'],
    proposal:['cover','photos','letter','proposal']
  };
  W.normalizeSections=(product,data)=>{
    const source=Array.isArray(data?.sections)&&data.sections.length?data.sections:(Array.isArray(product?.sections)&&product.sections.length?product.sections:null);
    return source?source.slice():W.clone(engineDefaults[product?.engine]||engineDefaults.minisite);
  };
  W.templateCover=product=>product?.cover||'images/covers/occasions/custom.jpg';
  W.legacyTemplates=()=>window.WISHORA_CATALOG.products.filter(p=>p.legacy);
  window.WISHORA=W;
})();
