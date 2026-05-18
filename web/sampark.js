function switchTab(id){
  document.querySelectorAll('.scr').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
  document.getElementById('s-'+id).classList.add('active');
  document.getElementById('ni-'+id).classList.add('on');
  // close any open sub-panels when switching tabs
  document.querySelectorAll('.sub-panel').forEach(p=>p.classList.remove('open'));
}
function openPanel(id){document.getElementById('panel-'+id).classList.add('open');}
function closePanel(id){document.getElementById('panel-'+id).classList.remove('open');}
let currentRole='parent';
function setRole(r){
  currentRole=r;
  document.querySelectorAll('.rp').forEach(p=>p.classList.remove('ap','at','as'));
  const map={parent:'ap',teacher:'at',student:'as'};
  document.getElementById('rp-'+r).classList.add(map[r]);
  const isT=r==='teacher',isS=r==='student';

  // Parent/Student content IDs to hide when teacher
  const parentEls=['tc','tbc','ta','tsl','tprof'];
  parentEls.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});

  // Parent-only elements in feed (stories, event banner, posts)
  document.querySelectorAll('.stbar,.evbanner,.post').forEach(el=>{
    el.style.display=isT?'none':'';
  });

  // Parent-only elements in progress (student hero, streak, chart, badges, leaderboard)
  document.querySelectorAll('.proghero,.strkcard,.chartcard,.badgegrid,.lbcard').forEach(el=>{
    // Only target ones inside s-prog
    if(el.closest('#s-prog'))el.style.display=isT?'none':'';
  });
  document.querySelectorAll('#s-prog > .sechdr').forEach(el=>el.style.display=isT?'none':'');

  // Parent-only elements in messages (meetcta, vnui, parent DMs, scheduler)
  document.querySelectorAll('.meetcta,.vnui').forEach(el=>{
    if(el.closest('#s-msgs'))el.style.display=isT?'none':'';
  });
  // Parent DM rows (not inside teacher section)
  document.querySelectorAll('#s-msgs > .dmrow').forEach(el=>el.style.display=isT?'none':'');
  document.querySelectorAll('#s-msgs > .slbl').forEach(el=>el.style.display=isT?'none':'');
  const sched=document.getElementById('sched');
  if(sched)sched.style.display=isT?'none':'block';

  // Parent-only profile elements
  document.querySelectorAll('#s-prof > .profhero, #s-prof > .profscore').forEach(el=>el.style.display=isT?'none':'');
  document.querySelectorAll('#s-prof > .slbl, #s-prof > .prefsec').forEach(el=>el.style.display=isT?'none':'');

  // Teacher sections
  document.querySelectorAll('.t-section').forEach(el=>el.style.display=isT?'block':'none');

  // Build teacher chart if switching to teacher
  if(isT) buildClassChart();

  const roleLabels={parent:'Parent View',teacher:'Teacher View',student:'Student View'};
  toast(isT?'👩‍🏫':isS?'🎒':'👨‍👩‍👦',roleLabels[r],isT?'Dashboard & analytics unlocked':isS?'Your XP and leaderboard':'Feed and messages active');
}
function buildClassChart(){
  const mc=document.getElementById('t-mchart');
  if(!mc)return;
  mc.innerHTML='';
  const scores=[68,72,70,76,79,80,82],days=['T1','T2','T3','T4','T5','T6','T7'];
  scores.forEach((s,i)=>{
    const wrap=document.createElement('div');wrap.className='barwrap';
    const bar=document.createElement('div');bar.className='barfill'+(s>=80?' hi':s<=70?' low':'');
    bar.style.height='0px';bar.style.maxHeight='52px';
    const lbl=document.createElement('div');lbl.className='barlbl';lbl.textContent=days[i];
    wrap.appendChild(bar);wrap.appendChild(lbl);mc.appendChild(wrap);
    setTimeout(()=>{bar.style.height=Math.round(s/100*52)+'px';},100+i*80);
  });
}
let activeToasts = 0;
function toast(icon,title,msg){
  const container = document.getElementById('toast-container');
  if(!container) return;
  
  // Combine repeated notifications logic (Optional Enhancement)
  // If similar toast exists, just ignore or update. For now we will just stack.
  
  const t = document.createElement('div');
  t.className = 'toast show';
  t.innerHTML = `
    <div class="toasticon">${icon}</div>
    <div class="toasttx"><h5>${title}</h5><p>${msg}</p></div>
    <div class="toastclose" onclick="closeToast(this.parentElement)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </div>
  `;
  container.appendChild(t);
  activeToasts++;
  
  // Max 3 notifications on screen
  if(container.children.length > 3) {
    closeToast(container.firstElementChild);
  }
  
  // Auto-dismiss smoothly
  const isDesktop = window.innerWidth >= 768;
  const duration = isDesktop ? 2500 : 2800; // Faster on desktop
  
  setTimeout(() => {
    if(t.parentNode) closeToast(t);
  }, duration);
}

function closeToast(el) {
  if(!el) return;
  el.classList.add('hide');
  setTimeout(() => {
    if(el.parentNode) el.remove();
    activeToasts--;
  }, 400); // Wait for fade out animation
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
function openStory(initials,name,time,emoji,heading,caption,img){
  const sv=document.getElementById('storyViewer');
  document.getElementById('stav').textContent=initials;
  document.getElementById('stauth').textContent=name;
  document.getElementById('sttm').textContent=time;
  const cont=document.getElementById('stcont');
  if(img){
    cont.textContent='';
    cont.style.backgroundImage='url('+img+')';
    cont.style.backgroundSize='cover';
    cont.style.backgroundPosition='center';
  }else{
    cont.textContent=emoji;
    cont.style.backgroundImage='none';
  }
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
let currentLang='English';
const i18n={
  English:{
    feed:'Feed',community:'Community',progress:'Progress',messages:'Messages',play:'Play',profile:'Profile',
    explore:'Explore 🎓',exploresub:'Your school, organized',
    events:'Events',clubs:'Clubs',syllabus:'Syllabus',schedule:'Schedule',notices:'Notices',compete:'Compete',
    channels:'Channels',polls:'Polls',gallery:'Gallery',fees:'Fees',report:'Report Card',bus:'Bus Track',
    library:'Library',holidays:'Holidays',attendance:'Attendance',diary:'Diary',complaints:'Complaints',
    yourStory:'Your story',preferences:'Preferences',language:'Language',account:'Account',
    whatsapp:'WhatsApp Alerts',push:'Push Notifications',darkMode:'Dark Mode',signout:'Sign Out',
    bookMeeting:'Book a Video Meeting',typeMsg:'Type a message...',
    parent:'Parent',teacher:'Teacher',student:'Student'
  },
  Hindi:{
    feed:'फ़ीड',community:'समुदाय',progress:'प्रगति',messages:'संदेश',play:'खेल',profile:'प्रोफ़ाइल',
    explore:'एक्सप्लोर 🎓',exploresub:'आपका स्कूल, व्यवस्थित',
    events:'कार्यक्रम',clubs:'क्लब',syllabus:'पाठ्यक्रम',schedule:'समय-सारणी',notices:'सूचनाएं',compete:'प्रतियोगिता',
    channels:'चैनल',polls:'मतदान',gallery:'गैलरी',fees:'शुल्क',report:'रिपोर्ट कार्ड',bus:'बस ट्रैक',
    library:'पुस्तकालय',holidays:'छुट्टियां',attendance:'उपस्थिति',diary:'डायरी',complaints:'शिकायतें',
    yourStory:'आपकी कहानी',preferences:'प्राथमिकताएं',language:'भाषा',account:'खाता',
    whatsapp:'व्हाट्सएप अलर्ट',push:'पुश नोटिफिकेशन',darkMode:'डार्क मोड',signout:'साइन आउट',
    bookMeeting:'वीडियो मीटिंग बुक करें',typeMsg:'संदेश लिखें...',
    parent:'अभिभावक',teacher:'शिक्षक',student:'छात्र'
  },
  Marathi:{
    feed:'फीड',community:'समुदाय',progress:'प्रगती',messages:'संदेश',play:'खेळ',profile:'प्रोफाइल',
    explore:'एक्सप्लोर 🎓',exploresub:'तुमची शाळा, व्यवस्थित',
    events:'कार्यक्रम',clubs:'क्लब',syllabus:'अभ्यासक्रम',schedule:'वेळापत्रक',notices:'सूचना',compete:'स्पर्धा',
    channels:'चॅनेल',polls:'मतदान',gallery:'गॅलरी',fees:'शुल्क',report:'गुणपत्रिका',bus:'बस ट्रॅक',
    library:'वाचनालय',holidays:'सुट्ट्या',attendance:'उपस्थिती',diary:'डायरी',complaints:'तक्रारी',
    yourStory:'तुमची गोष्ट',preferences:'प्राधान्ये',language:'भाषा',account:'खाते',
    whatsapp:'व्हाट्सएप अलर्ट',push:'पुश सूचना',darkMode:'डार्क मोड',signout:'साइन आउट',
    bookMeeting:'व्हिडिओ मीटिंग बुक करा',typeMsg:'संदेश लिहा...',
    parent:'पालक',teacher:'शिक्षक',student:'विद्यार्थी'
  }
};
function setLang(btn,lang){
  document.querySelectorAll('.lngbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentLang=lang;
  const dict=i18n[lang]||i18n.English;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    if(dict[key])el.textContent=dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key=el.getAttribute('data-i18n-placeholder');
    if(dict[key])el.placeholder=dict[key];
  });
  const langEmoji=lang==='Hindi'?'🇮🇳 हिंदी':lang==='Marathi'?'🇮🇳 मराठी':'🇬🇧 English';
  toast('🌐',langEmoji,lang==='Hindi'?'ऐप अब हिंदी में दिखेगा':lang==='Marathi'?'ऐप आता मराठीत दिसेल':'App now in English');
}
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

/* Old init moved to enhanced DOMContentLoaded at end of file */

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

/* GAME HUB LOGIC */
function openGame(id) {
  document.getElementById('gameHub').style.display = 'none';
  document.getElementById('game-memory').style.display = 'none';
  document.getElementById('game-tictactoe').style.display = 'none';
  document.getElementById('game-math').style.display = 'none';
  document.getElementById('game-g2048').style.display = 'none';
  document.getElementById('game-wordle').style.display = 'none';
  document.getElementById('game-'+id).style.display = 'block';
  if(id==='memory') initMemoryGame();
  if(id==='tictactoe') initTTT();
  if(id==='math') initMath();
  if(id==='wordle') initWordle();
  if(id==='g2048') init2048();
}

function closeGame() {
  document.getElementById('game-memory').style.display = 'none';
  document.getElementById('game-tictactoe').style.display = 'none';
  document.getElementById('game-math').style.display = 'none';
  document.getElementById('game-g2048').style.display = 'none';
  document.getElementById('game-wordle').style.display = 'none';
  document.getElementById('gameHub').style.display = 'flex';
}

/* Tic Tac Toe Logic */
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttActive = false;

function initTTT() {
  tttBoard = ['', '', '', '', '', '', '', '', ''];
  tttActive = true;
  document.getElementById('tttStatus').innerText = 'Your turn (X)';
  const grid = document.getElementById('tttGrid');
  grid.innerHTML = '';
  for(let i=0; i<9; i++) {
    const cell = document.createElement('div');
    cell.className = 'ttt-cell';
    cell.onclick = () => playTTT(i, cell);
    grid.appendChild(cell);
  }
}

function playTTT(idx, cell) {
  if(!tttActive || tttBoard[idx] !== '') return;
  tttBoard[idx] = 'X';
  cell.innerText = 'X';
  cell.classList.add('x');
  
  if(checkTTTWin('X')) {
    endTTT('You Won! 🎉', true);
    return;
  }
  if(!tttBoard.includes('')) {
    endTTT('Draw! 🤝', false);
    return;
  }
  
  document.getElementById('tttStatus').innerText = 'AI thinking...';
  tttActive = false;
  
  setTimeout(() => {
    let empty = tttBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    if(empty.length > 0) {
      let move = empty[Math.floor(Math.random() * empty.length)];
      tttBoard[move] = 'O';
      let aiCell = document.getElementById('tttGrid').children[move];
      aiCell.innerText = 'O';
      aiCell.classList.add('o');
      
      if(checkTTTWin('O')) {
        endTTT('AI Won! 🤖', false);
      } else if(!tttBoard.includes('')) {
        endTTT('Draw! 🤝', false);
      } else {
        tttActive = true;
        document.getElementById('tttStatus').innerText = 'Your turn (X)';
      }
    }
  }, 600);
}

function checkTTTWin(p) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let l of lines) {
    if(tttBoard[l[0]]===p && tttBoard[l[1]]===p && tttBoard[l[2]]===p) {
      document.getElementById('tttGrid').children[l[0]].classList.add('ttt-win');
      document.getElementById('tttGrid').children[l[1]].classList.add('ttt-win');
      document.getElementById('tttGrid').children[l[2]].classList.add('ttt-win');
      return true;
    }
  }
  return false;
}

function endTTT(msg, win) {
  tttActive = false;
  document.getElementById('tttStatus').innerText = msg;
  if(win) {
    toast('🎉', 'Victory!', 'You beat the AI! +20 XP');
    badge('⭕', 'Tic-Tac-Toe Champ', 'Won a game of Tic-Tac-Toe', '+20 XP');
  }
}

/* Quick Math Logic */
let mathScore = 0;
let mathCorrectAns = 0;

function initMath() {
  mathScore = 0;
  document.getElementById('mathScore').innerText = '0';
  nextMathQ();
}

function nextMathQ() {
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a, b;
  if(op === '*') {
    a = Math.floor(Math.random()*9)+2;
    b = Math.floor(Math.random()*9)+2;
    mathCorrectAns = a * b;
  } else if(op === '+') {
    a = Math.floor(Math.random()*50)+10;
    b = Math.floor(Math.random()*50)+10;
    mathCorrectAns = a + b;
  } else {
    a = Math.floor(Math.random()*50)+20;
    b = Math.floor(Math.random()*a);
    mathCorrectAns = a - b;
  }
  
  document.getElementById('mathQ').innerText = `${a} ${op} ${b} = ?`;
  
  let opts = [mathCorrectAns];
  while(opts.length < 4) {
    let wrong = mathCorrectAns + (Math.floor(Math.random()*21)-10);
    if(wrong !== mathCorrectAns && !opts.includes(wrong) && wrong >= 0) opts.push(wrong);
  }
  opts.sort(() => Math.random() - 0.5);
  
  const optsDiv = document.getElementById('mathOpts');
  optsDiv.innerHTML = '';
  opts.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'math-opt';
    btn.innerText = val;
    btn.onclick = () => answerMath(btn, val === mathCorrectAns);
    optsDiv.appendChild(btn);
  });
}

function answerMath(btn, isCorrect) {
  document.querySelectorAll('.math-opt').forEach(b => b.onclick = null);
  if(isCorrect) {
    btn.classList.add('correct');
    mathScore += 10;
    document.getElementById('mathScore').innerText = mathScore;
    setTimeout(nextMathQ, 600);
    if(mathScore === 50) {
      toast('🏆', 'Math Whiz!', 'Scored 50 points! +50 XP');
      badge('🧮', 'Quick Calculator', 'Scored 50 points in Quick Math', '+50 XP');
    }
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.math-opt').forEach(b => {
      if(parseInt(b.innerText) === mathCorrectAns) b.classList.add('correct');
    });
    setTimeout(() => {
      toast('💡', 'Game Over', `Final Score: ${mathScore}`);
      initMath();
    }, 1500);
  }
}

/* Word Guess Logic */
const wordleWords = ['BRAIN', 'SMART', 'LEARN', 'STUDY', 'MATHS', 'BOOKS', 'PEACE', 'FOCUS', 'LOGIC', 'SKILL'];
let targetWord = '';
let wdlRow = 0;
let wdlCol = 0;
let wdlGrid = [];
let wdlKeys = {};
let wdlActive = false;

function initWordle() {
  targetWord = wordleWords[Math.floor(Math.random() * wordleWords.length)];
  wdlRow = 0;
  wdlCol = 0;
  wdlGrid = Array(6).fill().map(() => Array(5).fill(''));
  wdlActive = true;
  document.getElementById('wordleStatus').innerText = 'Guess the word!';
  
  const gridDiv = document.getElementById('wordleGrid');
  gridDiv.innerHTML = '';
  for(let r=0; r<6; r++){
    const rowDiv = document.createElement('div');
    rowDiv.className = 'wdl-row';
    for(let c=0; c<5; c++){
      const cell = document.createElement('div');
      cell.className = 'wdl-cell';
      cell.id = `wdl-${r}-${c}`;
      rowDiv.appendChild(cell);
    }
    gridDiv.appendChild(rowDiv);
  }

  const keys = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
  ];
  const kbDiv = document.getElementById('wordleKeyboard');
  kbDiv.innerHTML = '';
  wdlKeys = {};
  keys.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'wdl-keyrow';
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'wdl-key';
      btn.innerText = key;
      if(key === 'ENTER' || key === '⌫') btn.style.flex = '1.5';
      btn.onclick = () => handleWdlKey(key);
      rowDiv.appendChild(btn);
      wdlKeys[key] = btn;
    });
    kbDiv.appendChild(rowDiv);
  });
}

function handleWdlKey(k) {
  if(!wdlActive) return;
  if(k === '⌫') {
    if(wdlCol > 0) { wdlCol--; wdlGrid[wdlRow][wdlCol] = ''; document.getElementById(`wdl-${wdlRow}-${wdlCol}`).innerText = ''; }
  } else if(k === 'ENTER') {
    if(wdlCol === 5) checkWdlRow();
    else toast('⚠️','Too short', 'Enter a 5-letter word');
  } else {
    if(wdlCol < 5) { wdlGrid[wdlRow][wdlCol] = k; document.getElementById(`wdl-${wdlRow}-${wdlCol}`).innerText = k; wdlCol++; }
  }
}

function checkWdlRow() {
  const guess = wdlGrid[wdlRow].join('');
  let tArr = targetWord.split('');
  
  for(let c=0; c<5; c++){
    const cell = document.getElementById(`wdl-${wdlRow}-${c}`);
    const ltr = wdlGrid[wdlRow][c];
    if(ltr === targetWord[c]) {
      cell.classList.add('correct');
      wdlKeys[ltr].className = 'wdl-key correct';
      tArr[c] = null;
    }
  }
  for(let c=0; c<5; c++){
    const cell = document.getElementById(`wdl-${wdlRow}-${c}`);
    const ltr = wdlGrid[wdlRow][c];
    if(!cell.classList.contains('correct')) {
      const idx = tArr.indexOf(ltr);
      if(idx > -1) {
        cell.classList.add('present');
        if(!wdlKeys[ltr].classList.contains('correct')) wdlKeys[ltr].className = 'wdl-key present';
        tArr[idx] = null;
      } else {
        cell.classList.add('absent');
        if(!wdlKeys[ltr].classList.contains('correct') && !wdlKeys[ltr].classList.contains('present')) wdlKeys[ltr].className = 'wdl-key absent';
      }
    }
  }

  if(guess === targetWord) {
    document.getElementById('wordleStatus').innerText = 'Genius!';
    toast('🏆', 'Word Master', 'You guessed the word! +40 XP');
    badge('📝', 'Vocab Champ', 'Won a game of Word Guess', '+40 XP');
    wdlActive = false;
  } else {
    wdlRow++;
    wdlCol = 0;
    if(wdlRow === 6) {
      document.getElementById('wordleStatus').innerText = targetWord;
      toast('💡', 'Game Over', `The word was ${targetWord}`);
      wdlActive = false;
    }
  }
}

/* 2048 Logic */
let g2048 = [];
let score2048 = 0;
let over2048 = false;

function init2048() {
  g2048 = Array(4).fill().map(() => Array(4).fill(0));
  score2048 = 0;
  over2048 = false;
  document.getElementById('score2048').innerText = '0';
  spawn2048();
  spawn2048();
  draw2048();
}

function spawn2048() {
  let empty = [];
  for(let r=0; r<4; r++) for(let c=0; c<4; c++) if(g2048[r][c]===0) empty.push({r,c});
  if(empty.length > 0) {
    let {r,c} = empty[Math.floor(Math.random() * empty.length)];
    g2048[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function draw2048() {
  const grid = document.getElementById('grid2048');
  grid.innerHTML = '';
  for(let r=0; r<4; r++){
    for(let c=0; c<4; c++){
      const cell = document.createElement('div');
      let val = g2048[r][c];
      cell.className = 'cell-2048 ' + (val > 0 ? 't'+val : '');
      cell.innerText = val > 0 ? val : '';
      grid.appendChild(cell);
    }
  }
  document.getElementById('score2048').innerText = score2048;
}

function move2048(dir) {
  if(over2048) return;
  let moved = false;
  
  let slide = (row) => {
    let arr = row.filter(v => v);
    for(let i=0; i<arr.length-1; i++){
      if(arr[i] === arr[i+1]) { arr[i] *= 2; score2048 += arr[i]; arr[i+1] = 0; }
    }
    arr = arr.filter(v => v);
    while(arr.length < 4) arr.push(0);
    return arr;
  };

  let temp = JSON.stringify(g2048);

  if(dir === 'Left' || dir === 'Right') {
    for(let r=0; r<4; r++){
      let row = g2048[r];
      if(dir === 'Right') row.reverse();
      row = slide(row);
      if(dir === 'Right') row.reverse();
      g2048[r] = row;
    }
  } else {
    for(let c=0; c<4; c++){
      let col = [g2048[0][c], g2048[1][c], g2048[2][c], g2048[3][c]];
      if(dir === 'Down') col.reverse();
      col = slide(col);
      if(dir === 'Down') col.reverse();
      for(let r=0; r<4; r++) g2048[r][c] = col[r];
    }
  }

  if(temp !== JSON.stringify(g2048)) {
    spawn2048();
    draw2048();
    check2048Over();
  }
}

function check2048Over() {
  for(let r=0; r<4; r++) for(let c=0; c<4; c++) {
    if(g2048[r][c] === 2048 && !over2048) {
      toast('🏆', '2048 Unlocked!', 'You reached the 2048 tile! +100 XP');
      badge('🔢', 'Logic Master', 'Beat the 2048 game', '+100 XP');
    }
    if(g2048[r][c] === 0) return;
    if(c<3 && g2048[r][c] === g2048[r][c+1]) return;
    if(r<3 && g2048[r][c] === g2048[r+1][c]) return;
  }
  over2048 = true;
  toast('💀', 'Game Over', `Final Score: ${score2048}`);
}

/* ═══════════════════════════════════════════════════════ */
/* SCROLL REVEAL SYSTEM                                   */
/* ═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing to save performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  // Auto-apply reveal classes to content elements
  const selectors = [
    '.post', '.evbanner', '.strkcard', '.chartcard', '.dashcard',
    '.lbcard', '.profscore', '.meetcta', '.vnui', '.pollcard',
    '.comp-banner', '.sechdr', '.slbl', '.notice-item',
    '.dmrow', '.chanrow', '.syl-item', '.t-task', '.t-meet',
    '.t-hw', '.t-class', '.t-sched-row', '.t-actrow',
    '.t-atrisk', '.t-greeting', '.proghero', '.profhero',
    '.comm-hero', '.wasync'
  ];
  
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(idx * 0.04, 0.4)}s`;
      }
      observer.observe(el);
    });
  });

  // Apply stagger to grids
  document.querySelectorAll('.explore-grid, .badgegrid, .club-grid, .t-actions, .game-card').forEach(grid => {
    if (!grid.classList.contains('reveal-stagger')) {
      grid.classList.add('reveal-stagger');
    }
    observer.observe(grid);
  });

  // Apply scale reveal to special cards
  document.querySelectorAll('.evcard, .clubcard, .badgecard, .game-card, .exp-btn').forEach(card => {
    if (!card.classList.contains('reveal-scale') && !card.parentElement.classList.contains('reveal-stagger')) {
      card.classList.add('reveal-scale');
      observer.observe(card);
    }
  });
}

/* Re-initialize scroll reveals when switching tabs */
const origSwitchTab = switchTab;
switchTab = function(id) {
  origSwitchTab(id);
  // Small delay to let new screen render, then re-apply reveals
  setTimeout(() => {
    initScrollReveal();
    // Re-animate charts/XP when switching to progress
    if (id === 'prog') { buildChart(); animateXP(); }
  }, 100);
};

/* ═══════════════════════════════════════════════════════ */
/* LOGIN SYSTEM                                           */
/* ═══════════════════════════════════════════════════════ */
let selectedLoginRole = 'parent';

function selectLoginRole(role, el) {
  selectedLoginRole = role;
  document.querySelectorAll('.l-role').forEach(r => r.classList.remove('active'));
  el.classList.add('active');
}

function doLogin() {
  const loginPage = document.getElementById('login-page');
  if (!loginPage) return;
  
  loginPage.classList.add('hide');
  
  setTimeout(() => {
    loginPage.style.display = 'none';
    // Set the role after login
    setRole(selectedLoginRole);
    // Initialize scroll reveals for the main app
    initScrollReveal();
  }, 600);
}

/* ═══════════════════════════════════════════════════════ */
/* ENHANCED DOMContentLoaded                              */
/* ═══════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  buildWave('vnw');
  buildWave('vwv');
  buildChart();
  animateXP();
  initMemoryGame();
  
  // Initialize scroll reveal after a small delay
  setTimeout(initScrollReveal, 300);
  
  // Register keyboard handler for 2048
  document.addEventListener('keydown', (e) => {
    const map = { ArrowLeft: 'Left', ArrowRight: 'Right', ArrowUp: 'Up', ArrowDown: 'Down' };
    if (map[e.key]) { e.preventDefault(); move2048(map[e.key]); }
  });
  
  // Smooth scroll-to-top when clicking active nav items
  document.querySelectorAll('.ni').forEach(ni => {
    ni.addEventListener('click', () => {
      const activeScr = document.querySelector('.scr.active');
      if (activeScr) activeScr.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ═══════════════════════════════════════════════════════ */
  /* 🎬 JS-POWERED ANIMATIONS                              */
  /* ═══════════════════════════════════════════════════════ */

  // ── CLICK RIPPLE EFFECT ──
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn, .hbtn, .abtn, .ni, .exp-btn, .rp, .clubcard, .evcard, .notice-item, .t-act, .chanrow, .dmrow');
    if (!target) return;
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    target.style.position = target.style.position || 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // ── CURSOR GLOW TRACKER ──
  if (window.innerWidth >= 768) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let glowTimeout;
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('active');
      clearTimeout(glowTimeout);
      glowTimeout = setTimeout(() => glow.classList.remove('active'), 2000);
    });
  }

  // ── SCROLL PROGRESS BAR ──
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.width = '0%';
  document.body.appendChild(progressBar);
  
  const updateProgress = () => {
    const activeScr = document.querySelector('.scr.active');
    if (!activeScr) return;
    const scrollTop = activeScr.scrollTop;
    const scrollHeight = activeScr.scrollHeight - activeScr.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  };
  
  // Attach to all screen containers
  document.querySelectorAll('.scr').forEach(scr => {
    scr.addEventListener('scroll', updateProgress, { passive: true });
  });

  // ── SMOOTH NUMBER COUNTER ──
  function animateCounters() {
    document.querySelectorAll('.statv, .t-qsv').forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)/);
      if (!match || el.dataset.counted) return;
      el.dataset.counted = 'true';
      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const duration = 800;
      const start = performance.now();
      
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * ease);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  setTimeout(animateCounters, 500);

  // ── PARALLAX DEPTH on SCROLL ──
  if (window.innerWidth >= 768) {
    const feedScr = document.getElementById('s-feed');
    if (feedScr) {
      feedScr.addEventListener('scroll', () => {
        const scrollY = feedScr.scrollTop;
        const stbar = feedScr.querySelector('.stbar');
        const evbanner = feedScr.querySelector('.evbanner');
        if (stbar) stbar.style.transform = `translateY(${scrollY * 0.02}px)`;
        if (evbanner) evbanner.style.transform = `translateY(${scrollY * 0.015}px)`;
      }, { passive: true });
    }
  }

  // ── TILT EFFECT ON CARDS ──
  document.querySelectorAll('.evcard, .clubcard, .game-card, .exp-btn').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
