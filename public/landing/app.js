'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const announcement = document.querySelector('#announcement');

// Original Figma decoration positions on the 1440 × 1053 story canvas.
const particles = [
  ['fb7e6',1055,417,14.154,14.154],['d3011',784,476,47,50],['d3011',1301,341,31,29,-90],
  ['8eb18',1159,324,32,32],['8eb18',868,521,14,14],['fb7e6',1104,587,23,23],
  ['6169a',1320,411,26,26],['6169a',818,312,26,26],['6169a',1123,196,36,37],
  ['ac2b1',1012,608,9,9],['ac2b1',949,473,13,13],['ac2b1',1020,479,27,27],
  ['f788f',1127,538,19.627,13],['f788f',854,415,17,18,-53.72],['93e57',1231,525,15.536,20],['93e57',1088,298,15.536,20]
];
const particleLayer = document.querySelector('.particles');
for (const [name,x,y,w,h,rotation=0] of particles) {
  const img = new Image(); img.src = `assets/illustrations/particles/${name}.png`; img.alt = '';
  Object.assign(img.style,{left:`${x/14.4}%`,top:`${y/10.53}%`,width:`${w/14.4}%`,height:`${h/10.53}%`,transform:`rotate(${rotation}deg)`});
  particleLayer.append(img);
}

// The scroll range is measured again on resize, including mobile browser chrome.
// Each state occupies an equal part of the pinned range. Scrolling back reverses it.
const stories = [...document.querySelectorAll('[data-story]')].map(element => ({
  element, count:Number(element.dataset.steps), active:-1,
  items:[...element.querySelectorAll('.waiting-step, .employer-step')],
  characters:[...element.querySelectorAll('.character')], start:0, range:1
}));
const lowerGradient = document.querySelector('.lower-gradient');
const employerStory = stories.find(story => story.element.dataset.story === 'employer');
function setStep(story, index) {
  if (story.active === index) return;
  story.active = index;
  story.element.dataset.activeStep = index;
  story.items.forEach((item,i) => {
    const active = i === index;
    item.classList.toggle('is-active',active);
    item.querySelector('button').setAttribute('aria-expanded',String(active));
    const detail = item.querySelector('.step-detail, .employer-detail');
    detail.inert = !active;
    detail.setAttribute('aria-hidden',String(!active));
  });
  story.characters.forEach((character,i) => character.classList.toggle('is-active',i===index));
}
function updateScroll() {
  for (const story of stories) {
    const progress = clamp((scrollY-story.start)/story.range,0,1);
    setStep(story,Math.min(story.count-1,Math.floor(progress*story.count)));
  }
  // Keep a single continuous backdrop stationary while the employer scene is pinned.
  const pinnedDistance = clamp(scrollY-employerStory.start,0,employerStory.range);
  lowerGradient.style.setProperty('--lower-gradient-offset', `${pinnedDistance}px`);
}
function measure() {
  document.querySelector('.footer-wordmark').style.setProperty('--footer-scale', innerWidth/1440);
  for (const story of stories) {
    story.start = story.element.getBoundingClientRect().top + scrollY;
    story.range = Math.max(1,story.element.offsetHeight-story.element.querySelector('.sticky-scene').offsetHeight);
  }
  lowerGradient.style.setProperty('--lower-gradient-height', `${lowerGradient.offsetHeight-employerStory.range}px`);
  const frame=document.querySelector('.dashboard-window');
  document.querySelector('.dashboard-scale').style.transform=`scale(${frame.clientWidth/927})`;
  updateScroll();
}
let scheduled = false;
addEventListener('scroll',() => {
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{updateScroll();scheduled=false;});
},{passive:true});
new ResizeObserver(measure).observe(document.documentElement);
addEventListener('resize',measure,{passive:true});
addEventListener('pageshow',measure);
document.fonts.ready.then(measure);
for(const story of stories) {
  for(const button of story.element.querySelectorAll('[data-step]')) {
    button.addEventListener('click',()=>{
      const index=Number(button.dataset.step);
      // Land in the middle of the selected state's range, avoiding rounding boundaries.
      scrollTo({top:story.start+story.range*(index+.5)/story.count,behavior:reducedMotion.matches?'instant':'smooth'});
    });
    button.addEventListener('keydown',event=>{
      if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
      event.preventDefault();
      const current=Number(button.dataset.step);
      const next=event.key==='Home'?0:event.key==='End'?story.count-1:clamp(current+(event.key==='ArrowDown'?1:-1),0,story.count-1);
      const target=story.items[next].querySelector('button');target.focus({preventScroll:true});target.click();
    });
  }
}

// Language control intentionally offers only the supplied Korean content.
const languageToggle=document.querySelector('#language-toggle');
const languageMenu=document.querySelector('#language-menu');
function closeLanguage(){languageMenu.hidden=true;languageToggle.setAttribute('aria-expanded','false');}
languageToggle.addEventListener('click',()=>{languageMenu.hidden=!languageMenu.hidden;languageToggle.setAttribute('aria-expanded',String(!languageMenu.hidden));});
document.addEventListener('click',event=>{if(!event.target.closest('.nav'))closeLanguage();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!languageMenu.hidden){closeLanguage();languageToggle.focus();}});

// Configurable handoff to the product. No fabricated destination or fake registration.
const dialog=document.querySelector('.start-dialog');
for(const button of document.querySelectorAll('[data-start]'))button.addEventListener('click',()=>{
  const role=button.dataset.start;
  const url=window.HIRELINK_CONFIG?.[`${role}Url`];
  if(url){window.top.location.assign(url);return;}
  document.querySelector('#dialog-description').textContent=`${role==='student'?'유학생':'사장님'} 서비스 연결을 준비하고 있어요. 조금만 기다려 주세요.`;
  dialog.showModal();
});
for(const button of dialog.querySelectorAll('button'))button.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});

// Demo priority ordering: mouse drag, keyboard, and touch pointer movement.
const priorityList=document.querySelector('.priority-list');
let dragged=null;
function renumber(){[...priorityList.children].forEach((li,i)=>li.querySelector('.priority-number').textContent=i+1);}
function announceOrder(){announcement.textContent=`우선순위: ${[...priorityList.querySelectorAll('.priority-name')].map(el=>el.textContent).join(', ')}`;}
priorityList.addEventListener('dragstart',event=>{dragged=event.target.closest('li');if(!dragged)return;dragged.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',dragged.querySelector('.priority-name').textContent);});
priorityList.addEventListener('dragover',event=>{event.preventDefault();const target=event.target.closest('li');if(!dragged||!target||target===dragged)return;const box=target.getBoundingClientRect();priorityList.insertBefore(dragged,event.clientY>box.top+box.height/2?target.nextSibling:target);renumber();});
priorityList.addEventListener('drop',event=>{event.preventDefault();announceOrder();});
priorityList.addEventListener('dragend',()=>{dragged?.classList.remove('dragging');dragged=null;});
priorityList.addEventListener('keydown',event=>{
  if(!event.altKey||!['ArrowUp','ArrowDown'].includes(event.key))return;
  const item=event.target.closest('li');if(!item)return;event.preventDefault();
  if(event.key==='ArrowUp'&&item.previousElementSibling)priorityList.insertBefore(item,item.previousElementSibling);
  if(event.key==='ArrowDown'&&item.nextElementSibling)priorityList.insertBefore(item.nextElementSibling,item);
  item.focus();renumber();announceOrder();
});
// Touch users can tap the handle to move a preference up one position.
priorityList.addEventListener('click',event=>{
  if(!event.target.matches('li>img'))return;
  const item=event.target.closest('li');
  if(item.previousElementSibling)priorityList.insertBefore(item,item.previousElementSibling);
  else priorityList.append(item);
  renumber();announceOrder();
});
measure();

// Native touch/trackpad scrolling plus controls for narrow desktop windows.
const studentTrack=document.querySelector('.student-cards');
const studentCards=[...studentTrack.querySelectorAll('article')];
const carouselControls=document.querySelector('.student-carousel-controls');
const previousCard=document.querySelector('[data-carousel="previous"]');
const nextCard=document.querySelector('[data-carousel="next"]');
const cardCount=document.querySelector('.student-carousel-count');
let carouselIndex=0;
let cardDrag=null;
function cardPositions(){
  const trackLeft=studentTrack.getBoundingClientRect().left;
  const inset=parseFloat(getComputedStyle(studentTrack).paddingLeft)||0;
  const maximum=Math.max(0,studentTrack.scrollWidth-studentTrack.clientWidth);
  return studentCards.map(card=>clamp(card.getBoundingClientRect().left-trackLeft+studentTrack.scrollLeft-inset,0,maximum));
}
function updateCarousel(){
  const overflow=studentTrack.scrollWidth>studentTrack.clientWidth+2;
  carouselControls.hidden=!overflow;
  studentTrack.classList.toggle('is-scrollable',overflow);
  studentTrack.toggleAttribute('aria-describedby',overflow);
  if(overflow)studentTrack.setAttribute('aria-describedby','student-scroll-hint');
  const positions=cardPositions();
  carouselIndex=positions.reduce((best,value,index)=>Math.abs(value-studentTrack.scrollLeft)<Math.abs(positions[best]-studentTrack.scrollLeft)?index:best,0);
  previousCard.disabled=studentTrack.scrollLeft<=2;
  nextCard.disabled=studentTrack.scrollLeft>=studentTrack.scrollWidth-studentTrack.clientWidth-2;
  cardCount.textContent=`${carouselIndex+1} / ${studentCards.length}`;
}
function moveCard(index){
  studentTrack.scrollTo({left:cardPositions()[clamp(index,0,studentCards.length-1)],behavior:reducedMotion.matches?'instant':'smooth'});
}
previousCard.addEventListener('click',()=>moveCard(carouselIndex-1));
nextCard.addEventListener('click',()=>moveCard(carouselIndex+1));
studentTrack.addEventListener('scroll',updateCarousel,{passive:true});
studentTrack.addEventListener('keydown',event=>{
  if(!studentTrack.classList.contains('is-scrollable')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();moveCard(event.key==='Home'?0:event.key==='End'?studentCards.length-1:carouselIndex+(event.key==='ArrowRight'?1:-1));
});
studentTrack.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0||!studentTrack.classList.contains('is-scrollable'))return;
  cardDrag={x:event.clientX,left:studentTrack.scrollLeft,id:event.pointerId};
  studentTrack.setPointerCapture(event.pointerId);
  studentTrack.focus({preventScroll:true});
  event.preventDefault();
});
studentTrack.addEventListener('pointermove',event=>{
  if(!cardDrag||event.pointerId!==cardDrag.id)return;
  const distance=event.clientX-cardDrag.x;
  if(Math.abs(distance)>5)studentTrack.classList.add('is-dragging');
  if(studentTrack.classList.contains('is-dragging'))studentTrack.scrollLeft=cardDrag.left-distance;
});
function endCardDrag(){cardDrag=null;studentTrack.classList.remove('is-dragging');updateCarousel();}
studentTrack.addEventListener('pointerup',endCardDrag);
studentTrack.addEventListener('pointercancel',endCardDrag);
studentTrack.addEventListener('lostpointercapture',endCardDrag);
new ResizeObserver(updateCarousel).observe(studentTrack);
document.fonts.ready.then(updateCarousel);
updateCarousel();
