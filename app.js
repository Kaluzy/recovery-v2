const KEY='recovery-v2-state-v7';
const seed={version:7,weight:201,goal:163,calorieGoal:1750,proteinGoal:120,fasting:false,selectedDay:4,floor:{walk:false,strength:false,water:false,sleep:false},notes:'',training:[],weights:[{date:'2026-09-17',value:201}],meals:[
{id:101,day:1,name:'Protein bread + turkey',detail:'2 slices ALDI protein bread, about 5 slices turkey, lots of lettuce/salad.',kcal:330,protein:34,confidence:'estimate'},
{id:102,day:1,name:'Injera + tibs dinner',detail:'Injera, beef/tibs, shredded lettuce salad with cucumber and onion, 2 tbsp cottage cheese, small doro wot, awaze, water.',kcal:760,protein:43,confidence:'estimate'},
{id:201,day:2,name:'Zucchini + leftovers',detail:'1 whole zucchini, leftover tibs/beef, 1 drumstick and couscous.',kcal:560,protein:40,confidence:'estimate'},
{id:202,day:2,name:'Homemade dabo',detail:'Small piece of homemade Ethiopian-style bread made with almond flour and dark Ethiopian bread flour.',kcal:180,protein:6,confidence:'estimate'},
{id:203,day:2,name:'Chili plate',detail:'Chili, 1 egg, yellow split peas, 1 drumstick, cottage cheese, salad/green beans.',kcal:690,protein:47,confidence:'estimate'},
{id:301,day:3,name:'Tofu + carrots + dabo',detail:'Tofu, carrots and homemade dabo.',kcal:430,protein:24,confidence:'estimate'},
{id:302,day:3,name:'Chickpea pasta + lentils',detail:'Chickpea rotini, lentils, mixed vegetables, diced tomatoes with green chilies, small BBQ sauce and sriracha. 1 tbsp psyllium with water.',kcal:610,protein:31,confidence:'estimate'},
{id:303,day:3,name:'Apple + peanut butter',detail:'Chopped apple with cinnamon and measured peanut butter.',kcal:220,protein:4,confidence:'estimate'},
{id:401,day:4,name:'Legume bowl + sardines',detail:'Leftover chickpea pasta/lentil/vegetable mix, cooked grain, and lightly smoked sardines in oil.',kcal:650,protein:45,confidence:'estimate'},
{id:402,day:4,name:'Homemade tuna sub',detail:'Toasted multigrain bread, tuna, light mayo, cottage cheese, chopped salad, tomato, seasoning and a little butter.',kcal:575,protein:40,confidence:'estimate'}]};
function clone(x){return JSON.parse(JSON.stringify(x))}
function load(){let x=JSON.parse(localStorage.getItem(KEY)||'null');if(!x){x=clone(seed);localStorage.setItem(KEY,JSON.stringify(x))}return x}
let state=load();const $=s=>document.querySelector(s);const save=()=>localStorage.setItem(KEY,JSON.stringify(state));const today=()=>new Date().toISOString().slice(0,10);
function dayMeals(d=state.selectedDay){return state.meals.filter(m=>m.day===d)}
function totals(ms){return (ms||dayMeals()).reduce((a,m)=>({kcal:a.kcal+(+m.kcal||0),protein:a.protein+(+m.protein||0)}),{kcal:0,protein:0})}
function esc(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mealHTML(m,remove=true){return '<div class="meal"><div class="meal-icon">🍽️</div><div class="grow"><strong>'+esc(m.name)+'</strong><span class="sub">'+esc(m.detail)+'</span><span class="tag">~'+m.kcal+' kcal · ~'+m.protein+'g protein · '+esc(m.confidence)+'</span></div>'+(remove?'<button class="ghost" onclick="removeMeal('+m.id+')">×</button>':'')+'</div>'}
function render(){
 const dm=dayMeals(),t=totals(dm),all=totals(state.meals);$('#todayDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});$('#weight').textContent=state.weight+' lb';$('#calories').textContent='~'+t.kcal;$('#protein').textContent='~'+t.protein+'g';$('#calBar').style.width=Math.min(100,t.kcal/state.calorieGoal*100)+'%';$('#proBar').style.width=Math.min(100,t.protein/state.proteinGoal*100)+'%';$('#fastBadge').textContent=state.fasting?'☦ Fasting day':'Regular day';
 $('#todayMeals').innerHTML=dm.map(m=>mealHTML(m,false)).join('')||'<p class="sub">No meals logged.</p>';
 $('#daytabs').innerHTML=[1,2,3,4].map(d=>'<button class="daytab '+(d===state.selectedDay?'active':'')+'" onclick="selectDay('+d+')">Day '+d+'</button>').join('');$('#daytotal').textContent='Day '+state.selectedDay+' · ~'+t.kcal+' kcal · ~'+t.protein+'g protein';$('#meals').innerHTML=dm.map(m=>mealHTML(m,true)).join('');
 const first=state.weights[0]?.value||state.weight,last=state.weights[state.weights.length-1]?.value||state.weight;$('#weightStats').innerHTML='<div class="mini"><b>'+last+'</b><span class="sub">Current lb</span></div><div class="mini"><b>'+state.goal+'</b><span class="sub">Goal lb</span></div><div class="mini"><b>'+((last-first)>0?'+':'')+(last-first).toFixed(1)+'</b><span class="sub">Change lb</span></div>';$('#weightHistory').innerHTML=state.weights.slice().reverse().map(w=>'<div class="meal"><div class="grow"><strong>'+w.value+' lb</strong><span class="sub">'+w.date+'</span></div></div>').join('');
 $('#trainingLog').innerHTML=state.training.slice().reverse().map(x=>'<div class="meal"><div class="grow"><strong>'+esc(x.type)+' · '+x.mins+' min</strong><span class="sub">'+x.date+'</span></div></div>').join('')||'<p class="sub">No training logged yet.</p>';
 const mins=state.training.reduce((n,x)=>n+(+x.mins||0),0),days=Math.max(1,new Set(state.meals.map(m=>m.day)).size),avgK=Math.round(all.kcal/days),avgP=Math.round(all.protein/days);
 $('#trendStats').innerHTML='<div class="mini"><b>~'+avgK+'</b><span class="sub">kcal/day</span></div><div class="mini"><b>~'+avgP+'g</b><span class="sub">protein/day</span></div><div class="mini"><b>'+mins+'</b><span class="sub">training min</span></div>';
 $('#macroStats').innerHTML='<div class="mini"><b>'+Math.round(avgP/state.proteinGoal*100)+'%</b><span class="sub">protein target</span></div><div class="mini"><b>'+state.meals.length+'</b><span class="sub">meals logged</span></div><div class="mini"><b>'+days+'</b><span class="sub">days logged</span></div>';
 $('#trendText').textContent=state.weights.length<3?'Add a few more weigh-ins to show a useful weight trend. Daily weight can move from water and food, so the trend matters more than one reading.':'Weight trend is based on your logged weigh-ins.';
 const now=Date.now(),week=state.training.filter(x=>now-new Date(x.date+'T00:00:00').getTime()<7*86400000);$('#weekWorkouts').textContent=week.length;$('#weekMinutes').textContent=week.reduce((n,x)=>n+(+x.mins||0),0);$('#notes').value=state.notes||'';document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('done',!!state.floor[b.dataset.floor]));
}
window.showView=(v,el)=>{document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));$('#'+v+'View').classList.add('active');document.querySelectorAll('.navin span').forEach(x=>x.classList.remove('active'));el.classList.add('active');render()}
window.selectDay=d=>{state.selectedDay=d;save();render()}
window.toggleFloor=k=>{state.floor[k]=!state.floor[k];save();render()}
window.toggleFast=()=>{state.fasting=!state.fasting;save();render()}
window.saveNotes=v=>{state.notes=v;save()}
window.removeMeal=id=>{state.meals=state.meals.filter(m=>m.id!==id);save();render()}
window.addMeal=()=>{const name=prompt('Meal');if(!name)return;const detail=prompt('What was in it?')||'';const kcal=Number(prompt('Estimated calories')||0);const protein=Number(prompt('Estimated protein (g)')||0);state.meals.push({id:Date.now(),day:state.selectedDay,name,detail,kcal,protein,confidence:'estimate'});save();render()}
window.logWeight=()=>{const v=Number(prompt('Current weight (lb)',state.weight));if(!v)return;state.weight=v;state.weights.push({date:today(),value:v});save();render()}
window.logTraining=type=>{const mins=Number(prompt(type+' minutes',10)||0);if(!mins)return;state.training.push({id:Date.now(),date:today(),type,mins});save();render()}
window.exportData=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='recovery-data.json';a.click()}
window.importData=()=>{const i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=()=>{const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.meals||!x.weights)throw 0;state=x;state.version=7;save();render();alert('Data imported')}catch(e){alert('That backup could not be read')}};r.readAsText(i.files[0])};i.click()}
render();