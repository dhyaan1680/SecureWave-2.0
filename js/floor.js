
// Restored reliable floor.js - pointer-based dragging and EventSource mock connection
let pins = [];
const floor = document.getElementById('floor');
const pinLayer = document.getElementById('pinLayer');
const fileInput = document.getElementById('file');
const addPin = document.getElementById('addPin');
const exportBtn = document.getElementById('export');
const importBtn = document.getElementById('importBtn');
const statusSpan = document.getElementById('status');
const sensorList = document.getElementById('sensorList');
let addMode = false;
let es = null;

function renderPins(){
  pinLayer.innerHTML='';
  pins.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'pin '+(p.alarm? 'alarm':'ok');
    el.style.left = p.x+'%'; el.style.top = p.y+'%';
    el.textContent = p.label;
    el.setAttribute('data-id', p.id);
    el.style.cursor='grab';
    el.draggable = false;
    // pointer drag
    el.addEventListener('pointerdown', (ev)=>{
      ev.preventDefault();
      el.setPointerCapture(ev.pointerId);
      const rect = pinLayer.getBoundingClientRect();
      function move(me){
        const nx = ((me.clientX - rect.left)/rect.width)*100;
        const ny = ((me.clientY - rect.top)/rect.height)*100;
        p.x = Math.max(0,Math.min(100,nx));
        p.y = Math.max(0,Math.min(100,ny));
        el.style.left = p.x+'%'; el.style.top = p.y+'%';
        updateList();
      }
      function up(me){
        try{ el.releasePointerCapture(ev.pointerId); } catch(e){}
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
    el.addEventListener('click', ()=>{ p.alarm = !p.alarm; updateList(); });
    pinLayer.appendChild(el);
  });
}

function updateList(){
  sensorList.innerHTML='';
  pins.forEach(p=>{
    const div = document.createElement('div'); div.className='card lift';
    div.innerHTML = `<strong>${p.label}</strong><div class="muted">Battery: ${p.batt}% ${p.tamper? '• Tamper':''}</div>`;
    if(p.alarm) div.style.borderLeft = '4px solid #ef4444';
    sensorList.appendChild(div);
  });
}

function addSensor(x,y){
  const id = pins.length+1;
  pins.push({id:id,label:'S'+id,x:x,y:y,batt:80+Math.floor(Math.random()*18),tamper:false,alarm:false});
  renderPins(); updateList();
}

floor.addEventListener('click', (e)=>{
  if(addMode){
    const rect = floor.getBoundingClientRect();
    const x = ((e.clientX - rect.left)/rect.width)*100;
    const y = ((e.clientY - rect.top)/rect.height)*100;
    addSensor(x,y);
    addMode = false; addPin.textContent='Add Pin';
  }
});

addPin.addEventListener('click', ()=>{ addMode = !addMode; addPin.textContent = addMode? 'Click floor to add...':'Add Pin'; });

fileInput.addEventListener('change', (ev)=>{
  const f = ev.target.files[0]; if(!f) return;
  const url = URL.createObjectURL(f);
  floor.innerHTML = '';
  const img = document.createElement('img'); img.src = url; img.style.maxWidth='100%'; img.style.maxHeight='100%'; img.onload = ()=>{
    floor.appendChild(img);
    renderPins();
  };
});

exportBtn.addEventListener('click', ()=>{
  const data = JSON.stringify(pins, null, 2);
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data],{type:'application/json'})); a.download='layout.json'; a.click();
});

importBtn.addEventListener('click', ()=>{
  const t = document.createElement('input'); t.type='file'; t.accept='application/json';
  t.onchange = (e)=>{
    const f = e.target.files[0]; const reader = new FileReader();
    reader.onload = ()=>{ try{ pins = JSON.parse(reader.result); renderPins(); updateList(); }catch(err){ alert('Invalid JSON'); } };
    reader.readAsText(f);
  };
  t.click();
});

document.getElementById('connectMock').addEventListener('click', ()=>{
  if(es){ es.close(); es=null; statusSpan.textContent='Not connected'; return; }
  try{
    es = new EventSource('http://localhost:5000/events');
    statusSpan.textContent='Connected (mock)';
    es.onmessage = function(e){
      try{
        const data = JSON.parse(e.data);
        let s = pins.find(p=>p.id===data.id);
        if(!s){ addSensor(30 + (pins.length*8)%40, 30 + (pins.length*6)%40); s = pins[pins.length-1]; s.id = data.id; s.label = 'S'+data.id; }
        s.alarm = data.alarm; s.tamper = data.tamper;
        renderPins(); updateList();
      }catch(err){ console.error(err); }
    };
    es.onerror = function(){ statusSpan.textContent='Error connecting'; es.close(); es=null; };
  }catch(err){ alert('Unable to connect: ' + err.message); }
});

// init with sample pins
addSensor(22,42); addSensor(66,28); addSensor(44,72);
renderPins(); updateList();
