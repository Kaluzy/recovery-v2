const KEY='recovery-v2-state-v5';
const seed={version:4,weight:201,goal:163,calorieGoal:1750,proteinGoal:120,fasting:false,selectedDay:4,floor:{walk:false,strength:false,water:false,sleep:false},weights:[{date:'2026-09-17',value:201}],meals:[
{id:101,day:1,name:'Protein bread + turkey',detail:'2 slices ALDI protein bread, about 5 slices turkey, lots of lettuce/salad.',kcal:330,protein:34,confidence:'estimate'},
{id:102,day:1,name:'Injera + tibs dinner',detail:'Injera, beef/tibs, shredded lettuce salad with cucumber and onion, 2 tbsp cottage cheese, small doro wot, awaze, water.',kcal:760,protein:43,confidence:'estimate'},
{id:201,day:2,name:'Zucchini + leftovers',detail:'1 whole zucchini, leftover tibs/beef, 1 drumstick and couscous.',kcal:560,protein:40,confidence:'estimate'},
{id:202,day:2,name:'Homemade dabo',detail:'Small piece of homemade Ethiopian-style bread made with almond flour and dark Ethiopian bread flour.',kcal:180,protein:6,confidence:'estimate'},
{id:203,day:2,name:'Chili plate',detail:'Chili, 1 egg, yellow split peas, 1 drumstick, cottage cheese, salad/green beans.',kcal:690,protein:47,confidence:'estimate'},
{id:301,day:3,name:'Tofu + carrots + dabo',detail:'Tofu, carrots and homemade dabo.',kcal:430,protein:24,confidence:'estimate'},
{id:302,day:3,name:'Chickpea pasta + lentils',detail:'Chickpea rotini, lentils, mixed vegetables, diced tomatoes with green chilies, small BBQ sauce and sriracha. 1 tbsp psyllium with water.',kcal:610,protein:31,confidence:'estimate'},
{id:303,day:3,name:'Apple + peanut butter',detail:'Chopped apple with cinnamon and measured peanut butter.',kcal:220,protein:4,confidence:'estimate'},
{id:401,day:4,name:'Leftover legume bowl + sardines',detail:'Leftover chickpea pasta/lentil/vegetable mix, cooked grain, and Chicken of the Sea lightly smoked sardines in oil.',kcal:650,protein:45,confidence:'estimate'},
{id:402,day:4,name:'Homemade tuna sub',detail:'Toasted multigrain bread, tuna, light mayo, cottage cheese, chopped salad, tomato, seasoning and a little butter.',kcal:575,protein:40,confidence:'estimate'}
]};
function load(){const old=JSON.parse(localStorage.getItem(KEY)||'null');if(!old||!old.version||old.version<4){localStorage.setItem(KEY,JSON.stringify(seed));return structuredClone(seed)}return old}
let state=load(); const save=()=>localStorage.setItem(KEY,JSON.stringify(state)); const $=s=>document.querySelector(s);
function dayMeals(){return state.meals.filter(m=>m.day===state.selectedDay)}
function totals(ms=dayMeals()){return ms.reduce((a,m)=>({kcal:a.kcal+(+m.kcal||0),protein:a.protein+(+m.protein||0)}),{kcal:0,protein:0})}
function render(){
 const t=totals(); $('#weight').textContent=state.weight+' lb'; $('#calories').textContent='~'+t.kcal.toLocaleString(); $('#protein').textContent='~'+t.protein+'g';
 $('#calBar').style.width=Math.min(100,t.kcal/state.calorieGoal*100)+'%'; $('#proBar').style.width=Math.min(100,t.protein/state.proteinGoal*100)+'%';
 $('#fastBadge').textContent=state.fasting?'☦ Fasting day':'Regular day';
 $('#daytabs').innerHTML=[1,2,3,4].map(d=>`<button class="daytab ${d===state.selectedDay?'active':''}" onclick="selectDay(${d})">Day ${d}</button>`).join('');
 $('#daytotal').textContent=`Day ${state.selectedDay} · ~${t.kcal} kcal · ~${t.protein}g protein`;
 $('#meals').innerHTML=dayMeals().map(m=>`<div class="meal"><div class="meal-icon">🍽️</div><div class="grow"><strong>${m.name}</strong><span class="sub">${m.detail}</span><span class="tag">~${m.kcal} kcal · ~${m.protein}g protein · ${m.confidence}</span></div><button class="ghost" onclick="removeMeal(${m.id})">×</button></div>`).join('');
 const all=totals(state.meals), avgK=Math.round(all.kcal/4), avgP=Math.round(all.protein/4);
 $('#summary').innerHTML='<div class="big">~'+avgK+' kcal/day</div><div class="sub">~'+avgP+'g protein/day average · '+state.meals.length+' logged meals</div>';
 $('#weightHistory').innerHTML=state.weights.slice().reverse().map(w=>'<div class="meal"><div class="grow"><strong>'+w.value+' lb</strong><span class="sub">'+w.date+'</span></div></div>').join('')||'<span class="sub">No weight entries yet.</span>';
 document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('done',!!state.floor[b.dataset.floor]));
}
window.selectDay=d=>{state.selectedDay=d;save();render()}
window.removeMeal=id=>{state.meals=state.meals.filter(m=>m.id!==id);save();render()}
window.toggleFloor=k=>{state.floor[k]=!state.floor[k];save();render()}
window.addMeal=()=>{const name=prompt('Meal');if(!name)return;const detail=prompt('What was in it?')||'';const kcal=Number(prompt('Estimated calories')||0);const protein=Number(prompt('Estimated protein (g)')||0);state.meals.push({id:Date.now(),day:state.selectedDay,name,detail,kcal,protein,confidence:'estimate'});save();render()}
window.logWeight=()=>{const v=Number(prompt('Current weight (lb)',state.weight));if(!v)return;state.weight=v;state.weights.push({date:new Date().toISOString().slice(0,10),value:v});save();render()}
window.toggleFast=()=>{state.fasting=!state.fasting;save();render()}
window.exportData=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='recovery-data.json';a.click()}
render();