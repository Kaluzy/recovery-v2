const KEY='recovery-v2-state';
const seed={weight:201,goal:163,calorieGoal:1750,proteinGoal:120,water:3,fasting:false,floor:{light:false,walk:false,protein:false,alcohol:true,wind:false},meals:[
{id:1,name:'Legume bowl + sardines',detail:'Chickpea pasta, lentils, vegetables, grain and sardines',kcal:620,protein:42,confidence:'estimate'},
{id:2,name:'Homemade tuna sub',detail:'Whole-grain toast, tuna, light mayo, cottage cheese, tomato + chopped salad',kcal:575,protein:40,confidence:'estimate'}],
weights:[{date:'2026-09-17',value:201}]};
let state=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const $=s=>document.querySelector(s);
function totals(){return state.meals.reduce((a,m)=>({kcal:a.kcal+(+m.kcal||0),protein:a.protein+(+m.protein||0)}),{kcal:0,protein:0})}
function render(){
 const t=totals(); $('#weight').textContent=state.weight+' lb'; $('#calories').textContent='~'+t.kcal.toLocaleString(); $('#protein').textContent='~'+t.protein+'g';
 $('#calBar').style.width=Math.min(100,t.kcal/state.calorieGoal*100)+'%'; $('#proBar').style.width=Math.min(100,t.protein/state.proteinGoal*100)+'%';
 $('#fastBadge').textContent=state.fasting?'☦ Fasting day':'Regular day';
 $('#meals').innerHTML=state.meals.map(m=>`<div class="meal"><div class="meal-icon">🍽️</div><div class="grow"><strong>${m.name}</strong><span class="sub">${m.detail}</span><br><span class="tag">~${m.kcal} kcal · ~${m.protein}g protein · ${m.confidence}</span></div><button class="ghost" onclick="removeMeal(${m.id})">×</button></div>`).join('');
 document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('done',!!state.floor[b.dataset.floor]));
}
window.removeMeal=id=>{state.meals=state.meals.filter(m=>m.id!==id);save();render()}
window.toggleFloor=k=>{state.floor[k]=!state.floor[k];save();render()}
window.addMeal=()=>{const name=prompt('Meal name');if(!name)return;const detail=prompt('What was in it?')||'';const kcal=Number(prompt('Estimated calories?')||0);const protein=Number(prompt('Estimated protein (g)?')||0);state.meals.push({id:Date.now(),name,detail,kcal,protein,confidence:'estimate'});save();render()}
window.logWeight=()=>{const v=Number(prompt('Current weight (lb)',state.weight));if(!v)return;state.weight=v;state.weights.push({date:new Date().toISOString().slice(0,10),value:v});save();render()}
window.toggleFast=()=>{state.fasting=!state.fasting;save();render()}
window.exportData=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='recovery-backup.json';a.click()}
render();