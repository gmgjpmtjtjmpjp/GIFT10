// FakeTikTokCoins — script.js (Demo-only)
(function(){
  const packs = [
    {coins:70, price:'$0.99'},
    {coins:350, price:'$4.99'},
    {coins:700, price:'$9.99'},
    {coins:1400, price:'$18.99'},
    {coins:3500, price:'$45.00'},
    {coins:7000, price:'$89.99'},
    {coins:'Custom', price:'Custom'}
  ];

  const balanceKey = 'faketiktok_balance_v1';

  // helpers
  const $ = sel => document.querySelector(sel);
  const create = (tag, attrs={}, children=[])=>{
    const el = document.createElement(tag);
    for(const k in attrs) el.setAttribute(k, attrs[k]);
    children.forEach(ch => typeof ch === 'string' ? el.appendChild(document.createTextNode(ch)) : el.appendChild(ch));
    return el;
  };

  // load balance
  let balance = Number(localStorage.getItem(balanceKey) || 0);
  function saveBalance(){
    localStorage.setItem(balanceKey, String(balance));
    renderBalance();
  }
  function renderBalance(){
    $('#balance').textContent = (balance||0).toLocaleString() + ' R$';
  }

  // build packs UI
  const packsContainer = $('#packs');
  packs.forEach(p => {
    const box = document.createElement('div');
    box.className = 'pack';
    const title = document.createElement('strong');
    title.textContent = (p.coins === 'Custom') ? 'Custom' : p.coins.toLocaleString() + ' R$';
    const sub = document.createElement('div');
    sub.className = 'muted';
    sub.textContent = p.price;
    const btn = document.createElement('button');
    btn.className = 'btn primary';
    btn.textContent = (p.coins === 'Custom') ? 'Custom' : 'Buy';
    btn.addEventListener('click', ()=> {
      if(p.coins === 'Custom'){
        // open custom prompt
        const c = prompt('Custom coins amount (number)', '250');
        if(!c) return;
        const n = Math.max(1, Number(c));
        simulatePurchase(n);
      } else {
        simulatePurchase(p.coins);
      }
    });
    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(btn);
    packsContainer.appendChild(box);
  });

  // custom buy button
  $('#buyCustom').addEventListener('click', ()=>{
    const v = Number($('#customCoins').value||0);
    if(!v || v<=0){ alert('有効な枚数を入力してください'); return; }
    simulatePurchase(v);
    $('#customCoins').value = '';
  });

  // send gift (just a demo stub)
  $('#sendGift').addEventListener('click', ()=> {
    alert('Send Gift はデモのため無効です（表示のみ）。');
  });

  $('#goBack').addEventListener('click', ()=> {
    // just a UI affordance: scroll to top
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // modal controls
  function openModal(coins){
    $('#modalCoins').textContent = (coins||0).toLocaleString();
    $('#modalDesc').querySelector('strong').textContent = (coins||0).toLocaleString();
    $('#modal').classList.add('open');
    $('#modal').setAttribute('aria-hidden','false');
  }
  function closeModal(){ $('#modal').classList.remove('open'); $('#modal').setAttribute('aria-hidden','true'); }

  $('#modalClose').addEventListener('click', closeModal);
  $('#modalContinue').addEventListener('click', closeModal);

  // simulate purchase flow: show modal then add to balance
  function simulatePurchase(coins){
    // visual: show payment completed
    $('#modalTitle').textContent = 'Payment completed';
    $('#modalDesc').innerHTML = `You purchased <strong id="modalCoins">${(coins||0).toLocaleString()}</strong> coins (demo).`;
    // show modal
    openModal(coins);

    // small confetti-like visual (non-intrusive)
    spawnConfetti();

    // add to balance after tiny delay
    setTimeout(()=>{
      balance += Number(coins||0);
      saveBalance();
    }, 600);
  }

  // confetti (simple)
  function spawnConfetti(){
    for(let i=0;i<12;i++){
      const d = document.createElement('div');
      d.style.position='fixed';
      d.style.left = (40 + Math.random()*20) + '%';
      d.style.top = '10%';
      const s = 8 + Math.random()*18;
      d.style.width = s + 'px'; d.style.height = s + 'px';
      d.style.background = (Math.random()>0.5)?'#ff2d6d':'#25f4ee';
      d.style.borderRadius='2px';
      d.style.opacity='0.95';
      d.style.transform = `translateY(0) rotate(0deg)`;
      d.style.zIndex = 9999;
      document.body.appendChild(d);
      requestAnimationFrame(()=> {
        d.style.transition = `transform ${1.2+Math.random()*0.8}s linear, opacity ${1.2+Math.random()*0.8}s linear`;
        d.style.transform = `translateY(${120 + Math.random()*60}vh) rotate(${Math.random()*720}deg) translateX(${(Math.random()-0.5)*200}px)`;
        d.style.opacity = '0';
      });
      setTimeout(()=> d.remove(), 2000);
    }
  }

  // init
  renderBalance();

  // accessibility: close modal on ESC
  document.addEventListener('keydown', (e)=> {
    if(e.key === 'Escape') closeModal();
  });

})();
