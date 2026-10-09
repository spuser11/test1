/* Wishora V18 — background music: starts on the first tap, loops softly, mute button in the top bar */
(function(){
  function attach(root,d){
    if(!d||!d.audioData)return null;
    const a=new Audio(d.audioData);a.loop=true;a.volume=.45;let on=true,started=false;
    const bar=root.querySelector('.fl-bar'),count=root.querySelector('.fl-count');
    const btn=document.createElement('button');btn.type='button';btn.className='fl-mute';btn.textContent='🔊';btn.title=d.songTitle?('♪ '+d.songTitle):'Music on/off';btn.setAttribute('aria-label','Toggle background music');
    if(bar)bar.insertBefore(btn,count||null);
    const start=()=>{if(started)return;started=true;a.play().catch(()=>{started=false})};
    root.addEventListener('pointerdown',start,{capture:true});root.addEventListener('click',start,{capture:true});
    btn.onclick=e=>{e.stopPropagation();on=!on;btn.textContent=on?'🔊':'🔇';if(on){started=true;a.play().catch(()=>{})}else a.pause()};
    return{start,audio:a};
  }
  window.WISHORA_BGM={attach};
})();
