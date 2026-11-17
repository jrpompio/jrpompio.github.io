// Scroll decorates the page; only the All journey can drive demonstration stages.
export function createScrollEffects({onFlowStage, motionPreference}) {
  const wide=matchMedia('(min-width: 960px) and (min-height: 700px)');
  const section=document.querySelector('#journey');
  let enabled=false,following=false,observer=null;
  const canFollow=()=>wide.matches && !motionPreference.matches;
  const observe=()=>{
    observer?.disconnect();
    if(!enabled || !following || !canFollow() || !('IntersectionObserver' in window))return;
    observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting);
      if(visible.length)onFlowStage(Number(visible[visible.length-1].target.dataset.flowStep));
    },{rootMargin:'-35% 0px -45% 0px',threshold:0});
    section.querySelectorAll('[data-flow-step]').forEach(el=>observer.observe(el));
  };
  function sync(isAll) {
    enabled=isAll;section.hidden=!isAll;
    section.dataset.following=String(following && canFollow());
    document.querySelector('#flow-follow').hidden=!canFollow();
    document.querySelector('#flow-follow').setAttribute('aria-pressed',String(following && canFollow()));
    observe();
  }
  wide.addEventListener('change',()=>sync(enabled));
  motionPreference.addEventListener('change',()=>sync(enabled));
  const sentinel=document.querySelector('#header-sentinel');
  if('IntersectionObserver' in window) {
    new IntersectionObserver(([entry])=>{
      document.querySelector('.selector').classList.toggle('is-docked',!entry.isIntersecting);
    }).observe(sentinel);
  }
  return {
    sync,
    follow(value) {following=value;sync(enabled);},
    isFollowing:()=>following && canFollow(),
    mark(stage) {section.querySelectorAll('[data-flow-step]').forEach(el=>{
      el.classList.toggle('is-current',Number(el.dataset.flowStep)===stage);
      const button=el.querySelector('button');
      if(Number(el.dataset.flowStep)===stage)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    });},
    refresh(){observe();}
  };
}
