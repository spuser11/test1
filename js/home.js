(function(){
  const C=window.WISHORA_CATALOG, W=window.WISHORA;
  const params=new URLSearchParams(location.search);
  let active=params.get('occasion')||'all', query='';
  const grid=document.getElementById('occasion-grid'), templates=document.getElementById('template-grid');
  const title=document.getElementById('template-title'), count=document.getElementById('template-count');
  const search=document.getElementById('search'), filterBar=document.getElementById('occasion-filter-bar');
  const occasions=()=>C.occasions||[];
  const byId=id=>occasions().find(o=>o.id===id);
  function normalizeOccasion(value){
    const ids=new Set(occasions().map(o=>o.id));
    return value==='all'||ids.has(value)?value:'all';
  }
  function syncFilterUrl(){
    const url=new URL(location.href);
    if(active==='all') url.searchParams.delete('occasion'); else url.searchParams.set('occasion',active);
    history.replaceState(null,'',url.toString());
  }
  function filtered(){
    const q=query.toLowerCase();
    return C.products.filter(p=>{
      if(active!=='all' && p.occasionId!==active) return false;
      if(!q) return true;
      const hay=[p.name,p.blurb,p.occasion,(p.includes||[]).join(' ')].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  function renderFilterBar(){
    if(!filterBar)return;
    filterBar.innerHTML='';
    const all=document.createElement('button'); all.type='button'; all.className='occasion-filter-chip'+(active==='all'?' active':'');
    all.textContent='All occasions'; all.onclick=()=>setActive('all'); filterBar.appendChild(all);
    occasions().forEach(o=>{
      const b=document.createElement('button'); b.type='button'; b.className='occasion-filter-chip'+(active===o.id?' active':'');
      b.innerHTML=`<span>${o.emoji}</span>${W.safe(o.label)}`; b.onclick=()=>setActive(o.id); filterBar.appendChild(b);
    });
  }
  function setActive(id){
    active=normalizeOccasion(id); syncFilterUrl(); renderOccasions(); renderFilterBar(); renderTemplates();
    document.getElementById('templates')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function button(name,isActive){const b=document.createElement('button');b.type='button';b.className=isActive?'occasion active':'occasion';b.innerHTML=name;return b;}
  function renderOccasions(){
    if(!grid)return; grid.innerHTML='';
    occasions().forEach(o=>{const b=button(`<span class="emoji">${o.emoji}</span><span class="label">${W.safe(o.label)}</span><span class="desc">${W.safe(o.description)}</span>`,active===o.id);b.onclick=()=>setActive(o.id);grid.appendChild(b)});
  }
  function card(p){
    const el=document.createElement('article');el.className='template';
    const cover=p.cover||'images/covers/occasions/custom.jpg';
    const photoLimit=p.photoLimit||0;
    const tags=[`${(p.pages||[]).length} pages`, ...(p.includes||[]).slice(0,1), photoLimit?`up to ${photoLimit} photos`:null].filter(Boolean).join(' · ');
    el.innerHTML=`<div class="template-cover"><img src="${W.safe(cover)}" alt="${W.safe(p.name)}"><span class="template-engine">${W.safe(p.occasion)}</span></div><div class="template-info"><div class="chip">${W.safe(p.occasion)}</div><div class="template-name">${W.safe(p.name)}</div><div class="template-blurb">${W.safe(p.blurb)}</div><div class="template-bottom"><span class="template-tags">${W.safe(tags)}</span><button type="button">Customize</button></div></div>`;
    el.querySelector('button').onclick=()=>location.href='builder.html?template='+encodeURIComponent(p.slug); return el;
  }
  function renderTemplates(){
    active=normalizeOccasion(active); renderFilterBar(); syncFilterUrl();
    const list=filtered(); if(templates)templates.innerHTML='';
    title.textContent=active==='all'?'All starting points':(byId(active)?.label||'Templates');
    count.textContent=`${list.length} template${list.length===1?'':'s'} available${query?' matching your search':''}`;
    const status=document.getElementById('filter-status'); if(status)status.textContent=active==='all'?'Showing all occasions':`Showing ${byId(active)?.label||'selected occasion'} only`;
    list.forEach(p=>templates?.appendChild(card(p)));
    if(!list.length && templates)templates.innerHTML='<div class="empty-state"><strong>No template matched that search.</strong><span>Try another search or choose Custom Occasion.</span><a class="btn btn-primary btn-small" href="builder.html?template=wishora-custom-blank">Build from scratch</a></div>';
  }
  search?.addEventListener('input',e=>{query=e.target.value.trim();renderTemplates()});
  document.getElementById('show-all')?.addEventListener('click',()=>{query='';if(search)search.value='';setActive('all')});
  document.getElementById('start-btn')?.addEventListener('click',()=>document.getElementById('occasions')?.scrollIntoView({behavior:'smooth'}));
  active=normalizeOccasion(active); renderOccasions(); renderFilterBar(); renderTemplates();
})();
