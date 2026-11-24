const icons={book:'M3 4q5-2 9 1 4-3 9-1v15q-5-2-9 1-4-3-9-1z M12 5v15',test:'M6 4h12v17H6z M9 4V2h6v2 M9 10l1 1 3-3 M9 16h6',chart:'M3 20h18 M6 16v-4 M12 16V7 M18 16V3',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 2',user:'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21q0-9 8-9t8 9',layers:'M2 8l10-5 10 5-10 5z M3 12l9 5 9-5 M3 16l9 5 9-5',list:'M8 6h13 M8 12h13 M8 18h13 M3 6h1 M3 12h1 M3 18h1'};
const icon=k=>'<svg aria-hidden="true" viewBox="0 0 24 24"><path d="'+icons[k]+'"/></svg>';
const pages={index:['Сабақтар','book'],test:['Жалпы тест','test'],progress:['Прогресс','chart']};
function currentPage(){const id=location.hash.slice(1);return Object.hasOwn(pages,id)?id:'index'}
let page=currentPage();
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem('ustaz.'+k))??d}catch{return d}}, save=(k,v)=>localStorage.setItem('ustaz.'+k,JSON.stringify(v));
let grade=Number(read('grade',7)), alt=read('alt',false), lesson, key;
if(!lessons.some(x=>x[0]===grade))grade=7;
const extra=[0,'Пунктуация','Қаратпа сөз','Сөйлеушінің біреуге назар аударта айтқан сөзі қаратпа сөз деп аталады. Ол сөйлемнің өзге бөлігінен үтір арқылы бөлінеді.','Балалар, кітаптарыңды ашыңдар.','Балалар','Қаратпа сөз','кітаптарыңды ашыңдар','Негізгі ой',[
['Қаратпа сөзі бар сөйлемді тап.','Асан, бері кел.','Асан келді.','Мен Асанды көрдім.','Сөйлеуші Асанға тікелей қарата айтып тұр.'],['Үтір дұрыс қойылған сөйлемді тап.','Сәлем, досым!','Сәлем досым!','Сә, лем досым!','Досым қаратпа сөзі сөйлемнің соңында үтірмен бөлінеді.']]];
function setLesson(){lesson=alt?extra:lessons.find(x=>x[0]===grade);key=grade+'-'+Number(alt)}
setLesson();
const head=(k,t)=>'<div class="head"><span class="ico">'+icon(k)+'</span><h3>'+t+'</h3></div>';
const link=(p,t)=>'<a class="primary" href="#'+p+'">'+t+'</a>';
const app=document.querySelector('#app');
function shell(){app.innerHTML='<aside><a class="brand" href="#index"><b>'+icon('book')+'</b><span>BolashaqUstaz<small>Қазақ тілі платформасы</small></span></a><div class="sideLabel">ОҚУ КЕҢІСТІГІ</div><nav>'+Object.entries(pages).map(([p,[n,i]])=>'<a class="'+(page===p?'on':'')+'" href="#'+p+'">'+icon(i)+n+'</a>').join('')+'</nav><div class="account"><span class="avatar">'+icon('user')+'</span><div>Оқушы<small>Жеке оқу кабинеті</small></div></div></aside><main><header class="bar"><span>'+icon('layers')+' Оқу кабинеті　/　'+pages[page][0]+'</span><span>Қазақ тілі <b class="avatar">'+icon('user')+'</b></span></header><div class="wrap"><div class="top"><div><div class="eyebrow">ҚАЗАҚ ТІЛІ</div><h1>'+({index:'BolashaqUstaz',test:'Жалпы тест',progress:'Менің прогресім'})[page]+'</h1><p class="muted">'+({index:'Тақырыпты меңгеріп, біліміңді бекіт.',test:'Қазақ тілі грамматикасы · 5 тақырып бойынша 50 сұрақ.',progress:'Оқыған сабақтарың мен тест нәтижелерің.'})[page]+'</p></div><select id="grade" aria-label="Сынып">'+lessons.map(x=>'<option '+(x[0]===grade?'selected':'')+' value="'+x[0]+'">'+x[0]+'-сынып</option>').join('')+'</select></div><div id="content"></div></div></main>';
document.querySelector('#grade').onchange=e=>{grade=+e.target.value;save('grade',grade);activeTest='';setLesson();if(location.hash.startsWith('#lesson-'))history.replaceState(null,'','#lesson-'+grade);render()}}
function topic(){return '<label class="topic"><small>Тақырыпты таңдау</small><br><select id="topic"><option value="0">'+lessons.find(x=>x[0]===grade)[2]+'</option><option value="1">'+extra[2]+'</option></select></label>'}
function setupTopic(){let t=document.querySelector('#topic');if(t){t.value=Number(alt);t.onchange=()=>{alt=!!Number(t.value);save('alt',alt);setLesson();render()}}}
function videoLesson(title) {
  const [id, name, duration, prompt] = grade === 7 && title === "Қаратпа сөз" ? gradeSevenAddressVideo : videos[title];
  const media=offlineLessons[title];
  return `<section class="video-lesson"><h4>Видеосабақ</h4>
    <p>Қысқа түсіндірме · 45 секунд · дыбыссыз</p>
    <video controls playsinline preload="metadata" poster="${media.poster}" aria-label="${title} — қысқа түсіндірме"><source src="${media.video}" type="video/mp4"></video>
    <p><b>Толық видеосабақ</b> · ${name} · ${duration}</p>
    ${prompt ? `<p class="lesson-detail">${prompt}</p>` : ""}
    <a class="primary video-open" href="https://www.youtube.com/watch?v=${id}">▶ YouTube-та көру</a>
    ${/^https?:$/.test(location.protocol) ? `<iframe loading="lazy" title="${name} — YouTube видеосабағы" src="https://www.youtube-nocookie.com/embed/${id}" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>` : ''}</section>`;
}
const practice = {
  'Зат есім': {
    claim:'«Қуаныш» сөзі сезімнің атын білдіретіндіктен, зат есімге жатады.', truth:true, why:'Зат есім дерексіз ұғымды да атай алады. «Қуаныш» сөзіне «не?» деген сұрақ қойылады.',
    find:'Адамды атайтын сөзді тап.', words:['жүгірді','дәрігер','биік','жел'], pick:'дәрігер', hint:'«Кім?» деген сұрақты қой.',
    goal:'Зат есімді мағынасы мен сұрағы арқылы анықтау.', criterion:'Зат есімді тауып, оған «кім?» немесе «не?» сұрағын дұрыс қояды.'
  },
  'Туынды сөз': {
    claim:'«Үйлер» сөзіндегі -лер жұрнағы жаңа сөз жасайды.', truth:false, why:'-лер — көптік жалғауы. «Үй» сөзінің мағынасы сақталып, саны ғана өзгереді.',
    find:'Жұрнақ арқылы жасалған кәсіп атауын тап.', words:['балық','қалада','егінші','жолдар'], pick:'егінші',hint:'Іс иесін білдіретін -шы немесе -ші жұрнағын ізде.',
    goal:'Туынды сөздің түбірі мен жұрнағын ажырату.',criterion:'Түбірді көрсетіп, жұрнақтың қандай мағына қосқанын түсіндіреді.'
  },
  'Сабақтас құрмалас сөйлем': {
    claim:'«Жаңбыр басылса, серуенге шығамыз» сөйлемінде бірінші бөлік серуенге шығудың шартын білдіреді.',truth:true,why:'Қандай жағдайда шығамыз? Жаңбыр басылса. -са тұлғасы шартты білдіреді.',
    find:'«Қоңырау соғылғанда, балалар сыныпқа кірді» сөйлемінен мезгілді білдіретін бағыныңқы бөліктің баяндауышын тап.',words:['қоңырау','соғылғанда','балалар','кірді'],pick:'соғылғанда',hint:'«Балалар қашан кірді?» деп сұра. Жауаптағы қимылды білдіретін сөзді таңда.',
    goal:'Бағыныңқы және басыңқы бөліктердің мағыналық байланысын түсіндіру.',criterion:'Екі бөлікті ажыратып, басыңқыдан бағыныңқыға орынды сұрақ қояды.'
  },
  'Сөйлем мүшелері': {
    claim:'«Құстар оралды» сөйлемінде «құстар» сөзі баяндауыш қызметін атқарады.',truth:false,why:'«Нелер оралды?» деген сұраққа «құстар» жауап береді. Ол — бастауыш. Баяндауыш — «оралды».',
    find:'«Таңертең бақта құстар сайрады» сөйлемінен баяндауышты тап.',words:['таңертең','бақта','құстар','сайрады'],pick:'сайрады',hint:'«Құстар не істеді?» деген сұраққа жауап беретін сөзді ізде.',
    goal:'Сөйлемнің грамматикалық негізін табу.',criterion:'Бастауыш пен баяндауышты атап, әрқайсысына тиісті сұрақ қояды.'
  },
  'Салалас құрмалас сөйлем': {
    claim:'Салалас құрмаластағы жай сөйлемдер тең дәрежеде байланысады.',truth:true,why:'Әр бөліктің баяндауышы тиянақты болады. Оларды жалғаулық немесе интонация байланыстырады.',
    find:'«Жол алыс, … біз уақытында жеттік» сөйлеміне қарсылық мәнін беретін сөзді таңда.',words:['өйткені','бірақ','немесе','сондықтан'],pick:'бірақ',hint:'Екінші оқиға бірінші бөліктен күтілетін нәтижеге қарама-қарсы.',
    goal:'Салалас құрмаластың бөліктері арасындағы мағыналық қатынасты анықтау.',criterion:'Тиянақты баяндауыштарды тауып, жалғаулықтың қызметін түсіндіреді.'
  },
  'Қаратпа сөз': {
    claim:'Қаратпа сөз сөйлемнің ортасында келсе, екі жағынан үтір қойылады.',truth:true,why:'«Бүгін, Айша, кезек сенде» сөйлемінде сөйлеуші Айшаға тіл қатып тұр. Екі үтір қаратпа сөздің шегін көрсетеді.',
    find:'«Аружан, ертең кітапханаға келші» сөйлемінен қаратпа сөзді тап.',words:['ертең','Аружан','кітапханаға','келші'],pick:'Аружан',hint:'Сөйлеуші кімге тіл қатып тұр?',
    goal:'Қаратпа сөзді танып, оған қатысты үтірді дұрыс қою.',criterion:'Сөздің кімге арналғанын анықтап, үтірдің орнын түсіндіреді.'
  }
};

function lessonExercises(l) {
  const name=l[2], x=practice[name], examples=explanations[name];
  return [
    {id:'truth',type:'truth',prompt:x.claim,answer:String(x.truth),note:x.why},
    {id:'word',type:'choice',prompt:x.find,options:x.words,answer:x.pick,note:x.hint},
    {id:'written',type:'open',prompt:examples[2],note:examples[3]},
    ...morePractice[name]
  ];
}
function practiceBlock(l) {
  const items=lessonExercises(l);
  return `<section class="card" id="practice">${head('book','Тәжірибелік тапсырмалар')}
    ${items.map((item,index)=>{
      const label={truth:'Дұрыс па, бұрыс па?',choice:'Дұрыс жауапты тап',open:'Ашық сұрақ'}[item.type];
      const options=item.type==='truth'?['Дұрыс','Бұрыс']:item.options;
      const control=item.type==='open'?
        `<textarea id="write-${item.id}" aria-labelledby="prompt-${item.id}" rows="2" placeholder="Жауабыңды өз сөзіңмен жаз"></textarea><button class="primary" data-compare>Үлгі жауаппен салыстыру</button>`:
        options.map((word,i)=>`<button class="chip" aria-pressed="false" data-value="${item.type==='truth'?String(i===0):word}">${word}</button>`).join(' ');
      return `<fieldset data-exercise="${item.id}"><legend>${index+1}. ${label}</legend><p id="prompt-${item.id}">${item.prompt}</p>${control}<p class="reply" role="status"></p></fieldset>`;
    }).join('')}</section>`;
}
function bindExercises(l, state, storeKey) {
  const items=lessonExercises(l);
  document.querySelectorAll('#practice fieldset').forEach((group,index)=>{
    const item=items[index], reply=group.querySelector('.reply');
    const persist=value=>{state[item.id]=value;save(storeKey,state)};
    if(item.type==='open'){
      const input=group.querySelector('textarea');
      input.value=state[item.id]||'';
      input.oninput=()=>{persist(input.value);reply.textContent=''};
      group.querySelector('[data-compare]').onclick=()=>{reply.textContent=input.value.trim()?'Үлгі жауап. '+item.note:'Алдымен өз жауабыңды жаз.'};
      return;
    }
    const buttons=group.querySelectorAll('[data-value]');
    function show(value){
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===value)));
      reply.textContent=(value===item.answer?'Дұрыс. ':'Қайта ойланып көр. ')+item.note;
    }
    buttons.forEach(b=>b.onclick=()=>{persist(b.dataset.value);show(b.dataset.value)});
    if(state[item.id]!==undefined)show(state[item.id]);
  });
}
function planBlock(l) {
  const x=practice[l[2]];
  return `<section class="card" id="plan"><details><summary>Қысқа мерзімді жоспар (ҚМЖ)</summary>
    <h4>${grade}-сынып · ${l[2]}</h4><p><b>Сабақ мақсаты.</b> ${x.goal}</p>
    <p><b>Бағалау критерийі.</b> ${x.criterion}</p>
    <p><b>Сабақтың басы · 5 минут.</b> Мұғалім «${l[4]}» мысалын көрсетеді. Оқушылар таныс сөздер мен құрылымдарды атайды.</p>
    <p><b>Түсіндіру · 15 минут.</b> Оқушылар видеосабақты қарап, мұғаліммен бірге мысалды талдайды. Тақтаға «${l[5]}» және «${l[7]}» бөліктерін жазып, әрқайсысының қызметін анықтайды.</p>
    <p><b>Бекіту · 15 минут.</b> Оқушы 10 тапсырманы орындайды. Жұбына сөзді неге таңдағанын түсіндіріп, жазбаша жауабын үлгімен салыстырады.</p>
    <p><b>Қорытынды · 5 минут.</b> Мұғалім жауаптарды бағалау критерийі бойынша талдайды. Оқушы сабақты бағалап, қай тұсына тағы мысал қажет екенін жазады.</p>
    <p><b>Саралау.</b> Қолдау қажет болса, мұғалім «${x.hint}» деген бағыт береді. Ерте аяқтаған оқушы ережеге өз мысалын келтіреді.</p>
    <p><b>Ресурстар.</b> Сабақ мәтіні, бейнесабақ, тапсырмалар және дәптер.</p></details></section>`;
}
function reviewBlock(){
  return `<form class="card" id="review">${head('list','Сабақ туралы пікір')}
    <fieldset><legend>Сабақ ұнады ма?</legend><p>1 — ұнамады, 5 — өте ұнады.</p>
    ${[1,2,3,4,5].map(i=>`<label class="rating"><input type="radio" name="rating" value="${i}" required> ${i}</label>`).join('')}</fieldset>
    <label for="comment">Сабақта не жетіспеді? Қандай ұсынысың бар?</label>
    <textarea id="comment" rows="2" placeholder="Пікіріңді осында жаз (міндетті емес)"></textarea>
    <button class="primary">Пікірді сақтау</button><p class="reply" id="reviewStatus" role="status"></p></form>
    <article id="savedReview" class="card saved-review" aria-label="Сақталған пікір" hidden>
      <header><strong>Менің пікірім</strong><span class="review-stars" role="img"></span></header>
      <p class="review-body"></p><time></time>
    </article>`;
}
function bindActivities(){
  const $=s=>document.querySelector(s);
  const storeKey='practice.'+key;
  const state=read(storeKey,{});
  bindExercises(lesson,state,storeKey);
  const reviewKey='review.'+key;
  const old=read(reviewKey,null);
  function showReview(review){
    const card=$('#savedReview');
    const rating=Number(review.rating);
    if(!Number.isInteger(rating)||rating<1||rating>5)return;
    const stars=card.querySelector('.review-stars');
    stars.textContent='★'.repeat(rating)+'☆'.repeat(5-rating);
    stars.setAttribute('aria-label','5 балдың '+rating+' балы');
    const body=card.querySelector('.review-body');
    body.textContent=review.comment||'';
    body.hidden=!body.textContent;
    const time=card.querySelector('time');
    time.hidden=!review.date;
    if(review.date){
      const date=new Date(review.date);
      time.dateTime=date.toISOString();
      time.textContent=date.toLocaleDateString('kk-KZ',{day:'numeric',month:'long',year:'numeric'});
    }
    card.hidden=false;
  }
  if(old){
    $('#review').elements.rating.value=old.rating;
    $('#comment').value=old.comment||'';
    showReview(old);
  }
  $('#review').onsubmit=e=>{
    e.preventDefault();
    const review={rating:e.target.elements.rating.value,comment:$('#comment').value.trim(),date:Date.now()};
    save(reviewKey,review);
    showReview(review);
    $('#reviewStatus').textContent='Пікірің осы браузерде сақталды.';
    $('#savedReview').scrollIntoView({block:'nearest'});
  };
}

const tutorChats=new Map();
function tutorCard(l){
  return `<section class="card tutor" id="tutor"><header class="tutor-head"><div class="tutor-photo" role="img" aria-label="Айдана ұстаздың портреті"></div><div><small>Қазақ тілі мұғалімі</small><h2>Айдана ұстаз</h2><p>${l[2]}</p></div></header>
  <div class="tutor-panel"><h3>Ұстазбен сұхбат</h3><div class="tutor-log" role="log" aria-label="Сұхбат" aria-live="polite"></div>
  <div class="tutor-prompts">${['Ережені түсіндірші','Мысал келтірші','Жауабымды қалай тексеремін?'].map(q=>`<button class="chip" type="button">${q}</button>`).join(' ')}</div>
  <form><label for="tutor-query">Тақырып бойынша сұрағың</label><textarea id="tutor-query" rows="2" maxlength="600" required placeholder="Мысалы, 4-тапсырманы түсіндірші"></textarea><button class="primary">Жіберу</button></form></div></section>`;
}
function lessonReply(l,query){
  const title=l[2],text=query.toLocaleLowerCase('kk'),notes=explanations[title],tasks=lessonExercises(l);
  const num=text.match(/(?:тапсырма\s*[№#]?\s*(\d+)|(\d+)\s*[-–.)]?\s*(?:ші|шы|інші|ыншы)?\s*тапсырма)/);
  if(num){
    const task=tasks[Number(num[1]||num[2])-1];
    return task?task.prompt+'\n\n'+task.note:'Осы сабақта 1–10 аралығындағы тапсырманы таңда.';
  }
  if(/тексер|қалай таб|қалай ажырат/.test(text))return practice[title].criterion+' '+practice[title].hint+'\n\n'+notes[1];
  if(/мысал|пример/.test(text))return 'Мына сөйлемді қарастырайық: «'+l[4]+'»\n\n'+notes[1];
  const tokens=text.match(/[\p{L}]{3,}/gu)||[];
  const ignored=/^(деген|неге|қандай|болад|түсін|қалай|дұрыс|сұрақ|маған|тақырып|неден|үшін)/;
  const terms=tokens.filter(t=>!ignored.test(t)).map(t=>t.slice(0,Math.min(6,t.length)));
  const passages=[...tasks.map(t=>[t.prompt,t.note]),...(moreQuestions[title]||[]).map(q=>[q[0]+' '+q[1],q[4]]),[title,l[3]+' '+notes[0]]];
  let best=null,score=0;
  for(const [p,reply] of passages){
    const hit=terms.reduce((sum,t)=>sum+(p.toLowerCase().includes(t)?t.length:0),0);
    if(hit>score){score=hit;best=reply}
  }
  if(score>=4)return best;
  if(/ереже|не ол|деген|түсін|объясни/.test(text))return l[3]+'\n\n'+notes[0];
  return 'Қай сөз немесе сөйлем қиын болды? Оны сабақтан көшіріп жаз немесе тапсырманың нөмірін көрсет. Сол мысалды бірге талдайық.';
}
function bindTutor(l){
  const card=document.getElementById('tutor'),log=card.querySelector('.tutor-log'),input=card.querySelector('textarea');
  const messages=tutorChats.get(key)||[['Айдана ұстаз','Сәлем! Бүгін «'+l[2]+'» тақырыбын бірге талдаймыз. Қай тұсын түсіндіріп берейін?']];
  tutorChats.set(key,messages);
  function show([who,says]){
    const bubble=document.createElement('div');bubble.className='bubble'+(who==='Сен'?' mine':'');
    const by=document.createElement('strong'),body=document.createElement('p');by.textContent=who;body.textContent=says;
    bubble.append(by,body);log.append(bubble);log.scrollTop=log.scrollHeight;
  }
  messages.forEach(show);
  function send(value){
    const q=value.trim();if(!q)return;
    const pair=[['Сен',q],['Айдана ұстаз',lessonReply(l,q)]];
    messages.push(...pair);pair.forEach(show);input.value='';
  }
  card.querySelector('form').onsubmit=e=>{e.preventDefault();send(input.value)};
  card.querySelectorAll('.tutor-prompts button').forEach(b=>b.onclick=()=>send(b.textContent));
}

function study(){let l=lesson;const [rule, analysis]=explanations[l[2]];let done=read('read',[]).includes(key);
content.innerHTML='<section class="hero"><div class="heroText"><span class="pill">'+icon('book')+' Ағымдағы сабақ</span><h2>'+l[2]+'</h2><div class="meta">'+grade+'-сынып　·　'+l[1]+'　·　'+icon('clock')+' 5 мин</div></div><div class="boardarea" aria-hidden="true"><div class="board">'+(alt?'Қаратпа сөз':({5:'Зат есім',6:'Туынды сөз',7:'Сабақтас құрмалас',8:'Сөйлем мүшелері',9:'Салалас құрмалас'})[grade])+'<div class="branch">↙　　 ↘</div><div class="leaves"><i>'+l[6].replace(' сөйлем','')+'</i><i>'+l[8].replace(' сөйлем','')+'</i></div></div></div></section><div class="grid"><div><section class="card">'+head('book','Сабақ түсіндірмесі')+'<p>'+l[3]+'</p><p class="lesson-detail">'+rule+'</p><div class="example"><small>Мысал</small>'+l[4]+'</div><div class="tags"><div><small>'+l[6]+'</small><b>'+l[5]+'</b></div><div><small>'+l[8]+'</small><b>'+l[7]+'</b></div></div><h4>Мысалды талдайық</h4><p>'+analysis+'</p>'+videoLesson(l[2])+'</section>'+tutorCard(l)+practiceBlock(l)+'<section class="card"><button id="learned" class="primary" '+(done?'disabled':'')+'>'+(done?'✓ Сабақ оқылды':'Оқып болдым')+'</button></section>'+planBlock(l)+reviewBlock()+'</div><div><section class="card">'+head('list','Оқу жоспары')+[['Ережені оқы','Тақырыппен таныс'],['Мысалды талда','Бөліктердің байланысын анықта'],['Тапсырмаларды орында','Жауабыңды жазып, үлгімен салыстыр']].map(([a,b],i)=>'<div class="line"><b class="num">'+(i+1)+'</b><div><b>'+a+'</b><small>'+b+'</small></div></div>').join('')+'</section><section class="card">'+topic()+'</section></div></div>';
content.insertAdjacentHTML('afterbegin','<div class="lesson-jumps"><button class="chip" data-jump="tutor">Ұстаздан сұрау</button> <button class="chip" data-jump="practice">Тапсырмалар</button> <button class="chip" data-jump="plan">ҚМЖ</button> <button class="chip" data-jump="review">Сабақты бағалау</button></div>');
document.querySelectorAll('[data-jump]').forEach(button=>button.onclick=()=>{
  const section=document.getElementById(button.dataset.jump);
  if(button.dataset.jump==='plan')section.querySelector('details').open=true;
  section.scrollIntoView({block:'start'});
});
bindActivities();bindTutor(l);
if(globalThis.LanguageModel?.availability){
const learned=document.querySelector('#learned');const options={expectedOutputs:[{type:'text',languages:['kk']}]};
LanguageModel.availability(options).then(status=>{if(status!=='available'||!learned.isConnected)return;
const ask=document.createElement('button');ask.className='option';ask.textContent='ЖИ ұстаздан қосымша мысал алу';learned.after(ask);
ask.onclick=async()=>{ask.disabled=true;ask.textContent='Мысал дайындалып жатыр…';let session;
try{session=await LanguageModel.create(options);let answer=await session.prompt('Қазақ тілі мұғалімі ретінде '+grade+'-сыныпқа «'+l[2]+'» тақырыбынан бір жаңа мысал беріп, оны екі сөйлеммен қазақша түсіндір.');const box=document.createElement('p');box.className='example';box.textContent=answer;ask.replaceWith(box)}catch{ask.textContent='Қайта сұрау';ask.disabled=false}finally{session?.destroy()}}}).catch(()=>{})}
document.querySelector('#learned').onclick=()=>{save('read',[...new Set([...read('read',[]),key])]);study();setupTopic()}}
let qs,pos,points,locked,scoredCount,testTitle;
function start(topicName=''){
  const subjects=topicName?lessons.filter(l=>l[2]===topicName):lessons;
  testTitle=topicName || 'Жалпы тест · Қазақ тілі грамматикасы';
  qs=subjects.flatMap(l=>{
    const original=l[9].map((q,i)=>[...q,...distractors[l[2]][i]]);
    return [...original,...moreQuestions[l[2]]].map(item=>({item,lesson:l}));
  });
  scoredCount=qs.length;
  pos = 0;
  points = 0;
  locked = false;
  question();
}
function question(){locked=false;let q=qs[pos].item;content.innerHTML='<section class="card" style="margin-top:24px"><label>Тестті таңда <select id="testTopic"><option value="">Барлық тақырып · 50 сұрақ</option>'+lessons.map(l=>'<option>'+l[2]+'</option>').join('')+'</select></label><h3>'+qs[pos].lesson[2]+'</h3><hr style="border:0;border-top:1px solid #dde3da;margin:22px 0"><small>'+ (pos<scoredCount?'Сұрақ '+(pos+1)+' / '+scoredCount:'Қосымша жаттығу')+'</small><h2>'+q[0]+'</h2><div id="choices"></div><div id="feedback" aria-live="polite"></div></section>';
const picker=document.querySelector('#testTopic');
picker.value=scoredCount===10?testTitle:'';
picker.onchange=()=>start(picker.value);
let choices=[1,2,3].map(i=>({i,r:Math.random()})).sort((a,b)=>a.r-b.r);for(let c of choices){let b=document.createElement('button');b.className='option';b.textContent=q[c.i];document.querySelector('#choices').append(b);b.onclick=()=>answer(c.i)}}
function answer(i){if(locked)return;locked=true;const {item:q,lesson:subject}=qs[pos],ok=i===1;
if(ok && pos<scoredCount)points++;
document.querySelectorAll('#choices .option').forEach(button=>{
  button.disabled=true;
  if(button.textContent===q[1])button.classList.add('correct-choice');
  if(!ok && button.textContent===q[i])button.classList.add('incorrect-choice');
});
const explanation = ok ? q[4] : '<p><strong>Сенің жауабың</strong> · '+q[i]+'</p>'+(q[i+3]?'<p>'+q[i+3]+'</p>':'')+'<p><strong>Дұрыс жауап</strong> · '+q[1]+'</p><p>'+q[4]+'</p>';
document.querySelector('#feedback').innerHTML='<div class="'+(ok?'right':'wrong')+'"><b>'+(ok?'Дұрыс жауап!':'Қатені талдайық')+'</b><br>'+explanation+'</div><button class="primary" id="next">'+(pos+1<qs.length?'Келесі тапсырма':'Нәтижені көру')+'</button>';document.querySelector('#next').onclick=()=>{pos++;if(pos<qs.length)return question();let history=read('history',[]);history.push({key,grade,title:testTitle,points,total:scoredCount,date:Date.now()});save('history',history);content.innerHTML='<section class="card" style="margin-top:24px">'+head('chart','Тест аяқталды')+'<h2>'+points+' / '+scoredCount+' дұрыс жауап</h2><p>Нәтижең сақталды.</p>'+link('progress','Прогресті көру')+'</section>'}}
function progress(){let h=read('history',[]).filter(x=>x.grade===grade).reverse(),n=read('read',[]).filter(k=>k.startsWith(grade+'-')).length,p=h.length?Math.round(h.reduce((s,x)=>s+x.points/(x.total||3),0)/h.length*100):0;content.innerHTML='<div class="stats" style="margin-top:24px">'+[['Оқылған сабақ',n+' / 2'],['Тапсырылған тест',h.length],['Орташа нәтиже',h.length?p+'%':'—']].map(x=>'<div class="card"><small>'+x[0]+'</small><strong>'+x[1]+'</strong></div>').join('')+'</div><section class="card">'+head('book','Сабақтарды меңгеру')+'<div class="progress"><i style="width:'+n*50+'%"></i></div>'+link('index','Сабақтарға өту')+'</section><section class="card">'+head('chart','Тест нәтижелері')+(h.length?h.map(x=>'<div class="line"><div><b>'+x.title+'</b><small>'+new Date(x.date).toLocaleString('kk-KZ')+'</small></div><b style="margin-left:auto">'+x.points+' / '+(x.total||3)+'</b></div>').join(''):'<p>Бұл сынып бойынша алғашқы тестіңді тапсырған соң, нәтижең осында көрінеді.</p>'+link('test','Тест тапсыру'))+'</section>'}
function world(){
  app.innerHTML=`<div class="atlas"><header class="atlas-head"><a href="#index" class="atlas-logo">${icon('book')} BolashaqUstaz</a><nav aria-label="Басты мәзір"><a href="#index" aria-current="page">Аралдар</a><a href="#test">Жалпы тест</a><a href="#progress">Прогресс</a></nav></header>
  <main class="atlas-body"><section class="world-intro"><div class="eyebrow">ҚАЗАҚ ТІЛІ</div><h1>Тақырыптар аралы</h1><p>Аралды таңдап, сабаққа немесе тақырыптық тестке өт.</p></section>
  <div class="sky-map"><span class="compass" aria-hidden="true">✧</span><div class="constellation" aria-hidden="true"></div>
  <span class="sailboat" aria-hidden="true"><i></i></span>
  ${lessons.map((l,i)=>`<button class="island i${i}" data-island="${i}" aria-label="${l[2]}"><span class="beach" aria-hidden="true"></span><span class="island-label">${l[2]}</span></button>`).join('')}</div>
  <section class="dock" aria-live="polite"><div><small>Таңдалған арал</small><h2 id="dock-name"></h2></div><div class="dock-actions"><a id="isle-read" class="read-link">Сабақты ашу</a><a id="isle-test" class="test-link">Тест · 10 сұрақ</a></div></section></main></div>`;
  const buttons=[...app.querySelectorAll('[data-island]')];
  const map=app.querySelector('.sky-map');
  const boat=map.querySelector('.sailboat');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let destination=0, flight=0, position={x:.49,y:.55}, waitingLink='';
  function paint(x,y){
    position={x,y};
    boat.style.left=(x*100)+'%';
    boat.style.top=(y*100)+'%';
  }
  function sail(i,landing=false){
    cancelAnimationFrame(flight);
    const start=position, sea=map.getBoundingClientRect();
    const shore=buttons[i].querySelector('.beach').getBoundingClientRect();
    const end={
      x:Math.min(.96,(shore.left+shore.width*(landing?.88:1.00)-sea.left)/sea.width),
      y:(shore.top+shore.height*(landing?.88:.95)-sea.top)/sea.height
    };
    const dx=end.x-start.x,dy=end.y-start.y;
    const duration=reduced.matches?0:Math.min(1550,450+Math.hypot(dx,dy)*1500);
    boat.classList.toggle('west',dx<0);
    boat.classList.add('sailing');
    const began=performance.now();
    function tick(now){
      if(!map.isConnected)return;
      const t=duration?Math.min(1,(now-began)/duration):1;
      const f=t*t*(3-2*t),bow=Math.sin(Math.PI*f)*Math.min(.09,Math.hypot(dx,dy)*.23);
      paint(start.x+dx*f,start.y+dy*f+bow);
      if(t<1){flight=requestAnimationFrame(tick);return}
      boat.classList.remove('sailing');flight=0;
      if(waitingLink){const link=waitingLink;waitingLink='';location.hash=link}
    }
    flight=requestAnimationFrame(tick);
  }
  function select(i,travel=true){
    waitingLink='';destination=i;const l=lessons[i];
    buttons.forEach((b,n)=>b.setAttribute('aria-pressed',i===n));
    document.querySelector('#dock-name').textContent=l[2];
    document.querySelector('#isle-read').href='#lesson-'+l[0];
    document.querySelector('#isle-test').href='#quiz-'+l[0];
    if(travel)sail(i);
  }
  buttons.forEach((button,i)=>button.onclick=()=>select(i));
  app.querySelectorAll('.dock-actions a').forEach(link=>link.onclick=e=>{
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();waitingLink=link.hash;sail(destination,true);
  });
  paint(position.x,position.y);
  select(Math.max(0,lessons.findIndex(l=>l[0]===grade)),false);

}

function render(){
  if(page==='index' && !location.hash.startsWith('#lesson-')){world();return}
  shell();
  if(page==='index')study();
  else if(page==='test')start(activeTest);
  else progress();
  setupTopic();
}
let activeTest='';
function navigate(){
  activeTest='';
  const islandRoute=/^#(lesson|quiz)-([5-9])$/.exec(location.hash);
  if(islandRoute){
    grade=Number(islandRoute[2]);alt=false;save('grade',grade);save('alt',alt);setLesson();
    page=islandRoute[1]==='quiz'?'test':'index';
    if(page==='test')activeTest=lesson[2];
  }else{page=currentPage();}
  document.title=(page==='index'&&!islandRoute?'Тақырыптар аралы':pages[page][0])+' · BolashaqUstaz';
  render();window.scrollTo(0,0);
}
window.addEventListener('hashchange',navigate);
navigate();
