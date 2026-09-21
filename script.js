const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
let dpr = Math.min(devicePixelRatio || 1, 2);
let stars = [];

function resize(){
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth*dpr;
  canvas.height = innerHeight*dpr;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count = Math.min(310, Math.floor(innerWidth*innerHeight/4800));
  stars = Array.from({length:count},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    r:Math.random()*1.25+.15,a:Math.random()*.65+.15,
    p:Math.random()*Math.PI*2,s:Math.random()*.015+.003
  }));
}
function starsLoop(t=0){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const s of stars){
    const a=Math.max(.03,s.a+Math.sin(t*s.s+s.p)*.16);
    ctx.beginPath();
    ctx.fillStyle=`rgba(255,244,199,${a})`;
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(starsLoop);
}
addEventListener("resize",resize);
resize(); requestAnimationFrame(starsLoop);

/* Entrada cinematográfica */
const enter=document.getElementById("enter");
const intro=document.getElementById("intro");
enter.addEventListener("click",()=>{
  document.body.classList.remove("locked");
  document.body.classList.add("entered");
  intro.classList.add("hide");
  setTimeout(()=>document.getElementById("home").scrollIntoView({behavior:"smooth"}),900);
});

/* Navegación */
document.querySelectorAll("[data-scroll]").forEach(btn=>{
  btn.addEventListener("click",()=>document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:"smooth"}));
});

/* Aparición de secciones */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.14});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* Parallax de la galaxia en escritorio */
const galaxyWrap=document.getElementById("galaxyWrap");
const galaxy=document.getElementById("galaxy");
if(innerWidth>800){
  addEventListener("pointermove",e=>{
    const r=galaxyWrap.getBoundingClientRect();
    if(e.clientX<r.left-100 || e.clientX>r.right+100 || e.clientY<r.top-100 || e.clientY>r.bottom+100) return;
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    galaxy.style.transform=`rotateY(${x*5}deg) rotateX(${-y*4}deg)`;
  });
}

/* Mensaje secreto */
const openNote=document.getElementById("openNote");
const secret=document.getElementById("secret");
openNote.addEventListener("click",()=>{
  secret.classList.toggle("open");
  openNote.querySelector("span").textContent=secret.classList.contains("open")?"Cerrar mensaje":"Hay algo más";
});

/* Corazones finales */
const heart=document.getElementById("heart");
const particles=document.getElementById("particles");
heart.addEventListener("click",()=>{
  for(let i=0;i<18;i++){
    const p=document.createElement("span");
    p.className="particle-heart";
    p.textContent=i%4===0?"✦":"♥";
    p.style.left=`${50+(Math.random()*18-9)}%`;
    p.style.top=`${50+(Math.random()*8-4)}%`;
    p.style.setProperty("--x",`${Math.random()*190-95}px`);
    p.style.setProperty("--r",`${Math.random()*80-40}deg`);
    p.style.animationDelay=`${Math.random()*.2}s`;
    particles.appendChild(p);
    setTimeout(()=>p.remove(),2100);
  }
});

/* Si vuelve a cargar en mitad de la página, mantiene la experiencia bloqueada
   solo hasta que el usuario toque Entrar. */
