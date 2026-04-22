function switchTab(id){
  document.querySelectorAll('.scr').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
  document.getElementById('s-'+id).classList.add('active');
  document.getElementById('ni-'+id).classList.add('on');
}
let currentRole='parent';
function setRole(r){
  currentRole=r;
  document.querySelectorAll('.rp').forEach(p=>p.classList.remove('ap','at','as'));
  const map={parent:'ap',teacher:'at',student:'as'};
  document.getElementById('rp-'+r).classList.add(map[r]);
  const isT=r==='teacher',isS=r==='student';
  document.getElementById('tc').style.display=isT?'block':'none';
  document.getElementById('tbc').style.display=isT?'block':'none';
  document.getElementById('ta').style.display=isT?'block':'none';
  document.getElementById('tsl').style.display=isT?'block':'none';
  document.getElementById('tprof').style.display=isT?'block':'none';
  document.getElementById('sched').style.display=isT?'none':'block';
  const roleLabels={parent:'Parent View',teacher:'Teacher View',student:'Student View'};
  toast(isT?'👩‍🏫':isS?'🎒':'👨‍👩‍👦',roleLabels[r],isT?'Dashboard & analytics unlocked':isS?'Your XP and leaderboard':'Feed and messages active');
}
let toastTimer;
function toast(icon,title,msg){
  clearTimeout(toastTimer);
  const t=document.getElementById('toast');
  document.getElementById('ti').textContent=icon;
  document.getElementById('tt').textContent=title;
  document.getElementById('tm').textContent=msg;
  t.classList.add('show');
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}
function badge(emoji,title,desc,xp){
  document.getElementById('achemoji').textContent=emoji;
  document.getElementById('achtitle').textContent=title;
  document.getElementById('achdesc').textContent=desc;
  document.getElementById('achxp').textContent=xp;
  document.getElementById('achModal').classList.add('show');
  confetti();
}
function closeAch(){document.getElementById('achModal').classList.remove('show');}
function confetti(){
  const c=document.getElementById('celebrate');
  c.innerHTML='';
  const colors=['#F4692A','#FF8C52','#E8A020','#00C896','#8B7FF0','#F04A5E','#3B9EFF','#FFD700'];
  for(let i=0;i<48;i++){
    const d=document.createElement('div');
    d.className='confetti';
    d.style.cssText=`left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-duration:${1.2+Math.random()*1.6}s;animation-delay:${Math.random()*.6}s;border-radius:${Math.random()>.5?'50%':'2px'};width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;`;
    c.appendChild(d);
  }
  setTimeout(()=>c.innerHTML='',3000);
}
let storyTimer;
function openStory(initials,name,time,emoji,heading,caption){
  const sv=document.getElementById('storyViewer');
  document.getElementById('stav').textContent=initials;
  document.getElementById('stauth').textContent=name;
  document.getElementById('sttm').textContent=time;
  document.getElementById('stcont').textContent=emoji;
  document.getElementById('stcaph').textContent=heading;
  document.getElementById('stcapp').textContent=caption;
  const pb=document.getElementById('stprogbar');
  pb.innerHTML='<div class="stseg"><div class="stsegfill" id="sf0"></div></div>';
  sv.classList.add('open');
  setTimeout(()=>{const sf=document.getElementById('sf0');sf.classList.add('run');sf.style.width='100%';},50);
  storyTimer=setTimeout(closeStory,4200);
}
function closeStory(){
  clearTimeout(storyTimer);
  document.getElementById('storyViewer').classList.remove('open');
  const sf=document.getElementById('sf0');
  if(sf){sf.style.transition='none';sf.style.width='0';}
}
function openChat(){document.getElementById('chatScr').classList.add('open');}
function closeChat(){document.getElementById('chatScr').classList.remove('open');}
function sendMsg(){
  const inp=document.getElementById('ci');
  const txt=inp.value.trim();
  if(!txt)return;
  const msgs=document.getElementById('chatmsgs');
  const d=document.createElement('div');
  d.className='mbbl mout';
  d.innerHTML=txt+'<div class="mtm">Just now ✓</div>';
  msgs.appendChild(d);
  inp.value='';
  msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    const r=document.createElement('div');
    r.className='mbbl min';
    r.innerHTML='Thank you for reaching out! I\'ll get back to you shortly. 🙏<div class="mtmin">Just now</div>';
    msgs.appendChild(r);
    msgs.scrollTop=msgs.scrollHeight;
  },1200);
}
function buildWave(id){
  const el=document.getElementById(id);
  if(!el)return;
  el.innerHTML='';
  const count=id==='vwv'?24:18;
  for(let i=0;i<count;i++){
    const b=document.createElement('div');
    b.className=id==='vnw'?'wvb':'vwvb';
    b.style.cssText=`height:${4+Math.random()*18}px;animation-delay:${i*0.07}s`;
    el.appendChild(b);
  }
}
function playVoice(btn){
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  setTimeout(()=>{btn.innerHTML='<svg viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>';},2000);
}
function like(id,base){
  const el=document.getElementById(id);
  if(el.classList.contains('liked')){el.classList.remove('liked');el.querySelector('span').textContent=base;}
  else{el.classList.add('liked');el.querySelector('span').textContent=base+1;}
}
function clap(id,base){
  const el=document.getElementById(id);
  if(el.classList.contains('clapped')){el.classList.remove('clapped');el.querySelector('span').textContent=base;}
  else{el.classList.add('clapped');el.querySelector('span').textContent=base+1;toast('👏','Clapped!','Your appreciation has been sent');}
}
function votePoll(opt,pct,grad){
  document.querySelectorAll('.pollopt').forEach(o=>o.style.opacity='.5');
  opt.style.opacity='1';
  const fill=opt.querySelector('.pollbf');
  fill.style.background=grad;
  fill.style.boxShadow='0 0 8px rgba(244,105,42,.4)';
  toast('📊','Vote Recorded!','Thank you for your response · '+pct+' agree');
}
function selDay(el){document.querySelectorAll('.calday').forEach(d=>d.classList.remove('sel'));el.classList.add('sel');}
function selSlot(el,time){document.querySelectorAll('.tslot.avail').forEach(s=>s.classList.remove('sel'));el.classList.add('sel');toast('✅','Slot Selected',time+' — click Confirm to book');}
function setLang(btn,lang){document.querySelectorAll('.lngbtn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');toast('🌐','Language Changed','App will now display in '+lang);}
function openNotif(){document.getElementById('notifPanel').classList.add('open');}
function closeNotif(){document.getElementById('notifPanel').classList.remove('open');}
function buildChart(){
  const mc=document.getElementById('mchart');
  if(!mc)return;
  mc.innerHTML='';
  const scores=[65,72,68,80,78,88,95],days=['M','T','W','T','F','S','T'];
  scores.forEach((s,i)=>{
    const wrap=document.createElement('div');wrap.className='barwrap';
    const bar=document.createElement('div');bar.className='barfill'+(s>=88?' hi':s<=68?' low':'');
    bar.style.height='0px';bar.style.maxHeight='52px';
    const lbl=document.createElement('div');lbl.className='barlbl';lbl.textContent=days[i];
    wrap.appendChild(bar);wrap.appendChild(lbl);mc.appendChild(wrap);
    setTimeout(()=>{bar.style.height=Math.round(s/100*52)+'px';},100+i*80);
  });
}
function animateXP(){setTimeout(()=>{const xf=document.getElementById('xpfill');if(xf)xf.style.width='83%';},400);}

/* Memory Game Logic */
const memEmojis = ['🍎','📚','🎨','🔬','⚽','🌟','🧩','🎸'];
let memFlipped = [];
let memMoves = 0;
let memPairs = 0;
let memLock = false;

function initMemoryGame() {
  const grid = document.getElementById('memGrid');
  if(!grid) return;
  grid.innerHTML = '';
  memMoves = 0;
  memPairs = 0;
  memFlipped = [];
  memLock = false;
  document.getElementById('memMoves').innerText = '0';
  document.getElementById('memPairs').innerText = '0/8';
  
  let deck = [...memEmojis, ...memEmojis];
  deck.sort(() => Math.random() - 0.5);
  
  deck.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'mcard';
    card.dataset.emoji = emoji;
    card.innerHTML = `<span style="opacity:0; transition:opacity .2s">${emoji}</span>`;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (memLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  
  card.classList.add('flipped');
  card.querySelector('span').style.opacity = '1';
  memFlipped.push(card);
  
  if (memFlipped.length === 2) {
    memMoves++;
    document.getElementById('memMoves').innerText = memMoves;
    memLock = true;
    
    if (memFlipped[0].dataset.emoji === memFlipped[1].dataset.emoji) {
      setTimeout(() => {
        memFlipped[0].classList.add('matched');
        memFlipped[1].classList.add('matched');
        memPairs++;
        document.getElementById('memPairs').innerText = memPairs + '/8';
        memFlipped = [];
        memLock = false;
        if (memPairs === 8) {
          toast('🎉', 'You Won!', `Completed in ${memMoves} moves! +50 XP`);
          badge('🧠', 'Brain Gym', `Beat memory game in ${memMoves} moves`, '+50 XP');
        }
      }, 400);
    } else {
      setTimeout(() => {
        memFlipped[0].classList.remove('flipped');
        memFlipped[0].querySelector('span').style.opacity = '0';
        memFlipped[1].classList.remove('flipped');
        memFlipped[1].querySelector('span').style.opacity = '0';
        memFlipped = [];
        memLock = false;
      }, 800);
    }
  }
}

window.addEventListener('DOMContentLoaded',()=>{buildWave('vnw');buildWave('vwv');buildChart();animateXP();initMemoryGame();});

function rsvpEvent(card, name){
  const btn = card.querySelector('.ev-rsvp');
  if(!btn) return;
  if(btn.classList.contains('done')){
    btn.classList.remove('done');
    btn.textContent='RSVP';
    toast('📅', name, 'RSVP cancelled');
  } else {
    btn.classList.add('done');
    btn.textContent='✓ Going';
    toast('🎉', 'RSVP Confirmed!', name + ' added to your calendar');
  }
}

function joinClub(card, name){
  card.classList.toggle('joined');
  const joined = card.classList.contains('joined');
  toast(joined?'🤝':'👋', joined?'Club Joined!':'Left Club', name + (joined?' — see you at the next meeting!':' — you can rejoin anytime'));
}

function filterComm(pill, cat){
  document.querySelectorAll('.cpill').forEach(p=>p.classList.remove('active'));
  pill.classList.add('active');
  toast('🔍','Filtered', cat==='all'?'Showing all school activities':'Showing '+cat+' activities');
}
