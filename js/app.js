
// small app utilities
console.log('SecureWave UI loaded');
document.addEventListener('DOMContentLoaded', function(){
  // friendly hint for audio autoplay lock
  window.__userInteracted = false;
  document.body.addEventListener('pointerdown', ()=> window.__userInteracted = true, {once:true});
});
