'use strict';
// Video IDs are public YouTube tutorials found for each named movement.
// Change an ID here if a creator removes a video or disables embedding.
const plan={
push:{title:'Push day',muscles:'CHEST / SHOULDERS / TRICEPS',exercises:[
['Machine chest press','8–12','120','V7paXInJW3c','Set the seat so the handles are near mid-chest. Keep your back supported and lower slowly.'],
['Incline dumbbell press','8–12','120','hMdrGLN-3x4','Use a gentle bench incline. Keep wrists stacked over elbows and lower with control.'],
['Machine shoulder press','8–12','120','crZ57F_PZZY','Adjust the seat for a comfortable starting position. Keep your back against the pad.'],
['Dumbbell side raises','12–15','90','8VfsgPu1HTY','Use light weights. Raise with control to around shoulder height without swinging.'],
['Rope triceps pushdown','10–15','90','vLf0Qu9mSGo','Keep elbows close to your sides. Move through your elbows without rocking your torso.']]},
pull:{title:'Pull day',muscles:'BACK / REAR SHOULDERS / BICEPS',exercises:[
['Lat pulldown','8–12','120','VH7nYMxIBCk','Pull toward your upper chest, never behind your neck. Avoid leaning back and swinging.'],
['Seated cable row','10–12','120','H2pTRrUcT6w','Keep your torso steady. Pull toward your lower ribs and return slowly.'],
['Rear delt fly machine','12–15','90','NoPexlHw6lI','Face the pad with your chest supported. Keep a slight elbow bend and avoid shrugging.'],
['Dumbbell biceps curl','10–12','90','gzpqksVEPH0','Keep elbows near your sides. Curl without swinging, then lower slowly.'],
['Hammer curl','10–12','90','BRVDS6HVR9Q','Keep palms facing inward. Hold your upper arms steady as you curl.']]},
legs:{title:'Legs + abs',muscles:'QUADS / GLUTES / HAMSTRINGS / CORE',exercises:[
['Leg press','10–12','120','eqMdP1LFxgA','Keep your back and hips supported. Lower only as far as you can without your pelvis lifting.'],
['Glute bridge','10–15','120','EHfFx_mvvxM','Start on the floor with knees bent. Lift by squeezing your glutes without arching your lower back.'],
['Seated leg curl','10–12','120','Ni2oZ5wDsZI','Adjust the machine so your knees align with its pivot. Keep your hips down and control the return.'],
['Leg extension','10–15','90','VjwclnjGq1E','Align knees with the machine pivot and place the pad above your ankles. Lift smoothly without kicking.'],
['Calf raises','12–15','90','haHcBAd637E','Use support for balance. Rise onto your toes and lower slowly without bouncing.'],
['Bench incline plank','15–30 sec','60','QuLekEa1lIs','Place hands on a stable bench. Keep your body in a straight line and breathe throughout the hold.']]}}
const $=s=>document.querySelector(s);
const date=new Date();const today=[date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
let state={weights:{},checks:{},firstWeek:true,day:'push'};
let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem('first-rep-v1')||'null');if(saved){state={...state,...saved};if(saved.date!==today)state.checks={};if(!plan[state.day])state.day='push';if(!state.weights||typeof state.weights!=='object')state.weights={};if(!state.checks||typeof state.checks!=='object')state.checks={};}}catch{storageOK=false}
function save(){try{localStorage.setItem('first-rep-v1',JSON.stringify({...state,date:today}))}catch{storageOK=false}if(!storageOK)$('#storage').textContent='Storage unavailable: changes last only while this page stays open.'}
function countSets(){return state.firstWeek?1:2}
function updateProgress(){const total=plan[state.day].exercises.length*countSets();let done=0;plan[state.day].exercises.forEach((_,i)=>{for(let s=0;s<countSets();s++)if(state.checks[`${state.day}-${i}-${s}`])done++});$('#progressText').textContent=`${done} / ${total} sets complete${done===total?' · Session done!':''}`;$('#progress').style.width=`${done/total*100}%`}
function render(){const workout=plan[state.day];$('#muscles').textContent=workout.muscles;$('#dayTitle').textContent=workout.title;$('#firstWeek').checked=state.firstWeek;document.querySelectorAll('[data-day]').forEach(b=>{b.classList.toggle('active',b.dataset.day===state.day);b.setAttribute('aria-pressed',String(b.dataset.day===state.day))});$('#exercises').replaceChildren();workout.exercises.forEach((e,i)=>{const key=`${state.day}-${i}`;const card=document.createElement('article');card.className='exercise';card.innerHTML=`<div class="exercise-top"><span class="number">${String(i+1).padStart(2,'0')}</span><div><h3>${e[0]}</h3><p class="meta">${countSets()} sets × ${e[1]}${e[1].includes('sec')?'':' reps'} · ${e[2]}s rest</p></div><button class="demo-button" aria-label="Watch ${e[0]} demonstration">▶ Demo</button></div><div class="exercise-bottom"><div class="sets"></div><label class="weight">Weight <input type="number" min="0" max="999" step="0.5" inputmode="decimal" placeholder="—" aria-label="${e[0]} weight in kilograms"> kg</label></div>`;card.querySelector('.demo-button').onclick=()=>openDemo(e);const input=card.querySelector('input');input.value=state.weights[key]??'';input.oninput=()=>{state.weights[key]=input.value;save()};for(let s=0;s<countSets();s++){const label=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.checked=!!state.checks[`${key}-${s}`];check.onchange=()=>{state.checks[`${key}-${s}`]=check.checked;save();updateProgress()};label.append(check,`Set ${s+1}`);card.querySelector('.sets').append(label)}$('#exercises').append(card)});updateProgress();save()}
document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{state.day=b.dataset.day;render()});$('#firstWeek').onchange=e=>{state.firstWeek=e.target.checked;render()};$('#reset').onclick=()=>{if(confirm('Clear the checked sets for this workout today? Your weight notes will stay.')){Object.keys(state.checks).forEach(k=>{if(k.startsWith(state.day+'-'))delete state.checks[k]});render()}};
function openDemo(e){$('#demoTitle').textContent=e[0];$('#demoCue').textContent=e[4];$('#youtubeLink').href=`https://www.youtube.com/watch?v=${e[3]}`;const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${e[3]}?playsinline=1&rel=0`;frame.title=e[0]+' YouTube tutorial';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';$('#video').replaceChildren(frame);$('#demo').showModal()}
$('#closeDemo').onclick=()=>$('#demo').close();$('#demo').addEventListener('close',()=>$('#video').replaceChildren());$('#demo').onclick=e=>{if(e.target===$('#demo')){const r=$('#demo').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#demo').close()}};
let duration=120,remaining=120,deadline=0,ticker=null;
function paintClock(){$('#clock').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`}
function pause(){clearInterval(ticker);ticker=null;$('#timerStart').textContent=remaining===0?'Start again ↗':'Resume rest ↗'}
function tick(){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));paintClock();if(!remaining){pause();$('#timerStatus').textContent='Rest complete. Start your next set when you feel ready.';if(navigator.vibrate)navigator.vibrate([150,80,150])}}
$('#timerStart').onclick=()=>{if(ticker){tick();pause();return}if(!remaining)remaining=duration;deadline=Date.now()+remaining*1000;ticker=setInterval(tick,250);$('#timerStart').textContent='Pause rest';$('#timerStatus').textContent='Recover, breathe, then go again.';tick()};
function resetTimer(){pause();remaining=duration;paintClock();$('#timerStart').textContent='Start rest ↗';$('#timerStatus').textContent='Rest 2 minutes after big lifts; 60–90 seconds after smaller exercises.'}
$('#timerReset').onclick=resetTimer;document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{duration=Number(b.dataset.time);document.querySelectorAll('[data-time]').forEach(x=>x.classList.toggle('selected',x===b));resetTimer()});document.addEventListener('visibilitychange',()=>{if(ticker)tick()});render();
