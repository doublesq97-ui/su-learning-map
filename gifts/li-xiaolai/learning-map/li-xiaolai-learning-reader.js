(function(){
  const data=window.LX_LEARNING_DATA;
  if(!data) throw new Error('Learning data is missing');
  const byId=new Map(data.concepts.map(c=>[c.id,c]));
  const route=data.chapters.flatMap(ch=>ch.ids);
  const saved=JSON.parse(localStorage.getItem('lx-reader-progress')||'{}');
  const fromHash=Number(location.hash.replace('#concept-',''));
  let current=byId.has(fromHash)?fromHash:Number(localStorage.getItem('lx-reader-last'))||route[0];
  let activeChapter=byId.get(current).chapter;
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const chapterOf=id=>data.chapters.find(ch=>ch.ids.includes(id));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();

  function setProgress(){
    const count=Object.values(saved).filter(Boolean).length;
    const percent=Math.round(count/data.concepts.length*100);
    $('#progressText').textContent=`${count} / ${data.concepts.length}`;
    $('#progressBar').style.width=`${percent}%`;
    $('#progressPercent').textContent=`${percent}%`;
    const heroPrimary=$('#heroPrimary');
    if(heroPrimary){
      const c=byId.get(current);
      heroPrimary.textContent=count?`继续学习 · ${c.name}`:`开始学习 · ${chapterOf(current).name}`;
    }
  }

  function renderChapters(){
    $('#chapterMenu').innerHTML=data.chapters.map(ch=>{
      const done=ch.ids.filter(id=>saved[id]).length;
      return `<button class="chapter-item ${ch.id===activeChapter?'active':''}" data-chapter="${ch.id}"><span class="chapter-no">${ch.no}</span><span><b>${ch.name}</b><small>${ch.promise}</small></span><em>${done}/${ch.ids.length}</em></button>`;
    }).join('');
    $$('.chapter-item').forEach(btn=>btn.addEventListener('click',()=>{
      activeChapter=btn.dataset.chapter;
      current=data.chapters.find(ch=>ch.id===activeChapter).ids[0];
      renderAll();
      closeDirectory();
    }));
  }

  function renderConceptList(query=''){
    const ch=data.chapters.find(x=>x.id===activeChapter);
    const q=query.trim().toLowerCase();
    const list=(q?data.concepts:ch.ids.map(id=>byId.get(id))).filter(c=>!q||`${c.id} ${c.name} ${c.desc} ${c.excerpt}`.toLowerCase().includes(q));
    $('#conceptList').innerHTML=list.length?list.map(c=>`<button class="concept-item ${c.id===current?'active':''} ${saved[c.id]?'done':''}" data-id="${c.id}"><span>${String(c.id).padStart(2,'0')}</span><b>${c.name}</b><i>${saved[c.id]?'✓':''}</i></button>`).join(''):`<div class="empty">没有找到相关概念，换个关键词试试。</div>`;
    $$('.concept-item').forEach(btn=>btn.addEventListener('click',()=>{current=Number(btn.dataset.id);activeChapter=byId.get(current).chapter;renderAll();closeDirectory();}));
  }

  function renderLesson(){
    const c=byId.get(current), ch=chapterOf(current), idx=route.indexOf(current);
    const siblingIds=ch.ids, siblingIndex=siblingIds.indexOf(current);
    const related=[siblingIds[siblingIndex-1],siblingIds[siblingIndex+1]].filter(Boolean).map(id=>byId.get(id));
    $('#lesson').innerHTML=`
      <header class="lesson-head">
        <div class="lesson-meta"><span>概念 ${String(c.id).padStart(2,'0')}</span><span>${ch.no} · ${ch.name}</span><span>PDF ${c.page} 页</span></div>
        <h1>${c.name}</h1>
        <p class="lesson-lede">${c.desc}</p>
      </header>
      <section class="lesson-section key-section">
        <div class="section-label">先抓住这一点</div>
        <p class="key-sentence">${c.desc}</p>
        <p>学习这个概念，不是为了记住一个新名词，而是为了在真实选择中获得一个新的判断角度：${ch.promise}。</p>
      </section>
      <section class="lesson-section source-section">
        <div class="section-label">原文节选</div>
        <blockquote>${clean(c.excerpt)}</blockquote>
        <div class="source-note">摘自《通往财富自由之路》PDF 第 ${c.page} 页。为适配阅读，仅清理了换行与异体字符；节选不是全文。</div>
      </section>
      <section class="lesson-section practice-section">
        <div class="section-label">今天怎么用</div>
        <div class="practice-question">${c.practice}</div>
        <textarea id="noteInput" rows="4" placeholder="写下你的答案或一个真实案例……"></textarea>
        <div class="note-status" id="noteStatus">答案只保存在当前浏览器</div>
      </section>
      <section class="lesson-section related-section">
        <div class="section-label">继续连接</div>
        <div class="related-links">${related.map(r=>`<button data-related="${r.id}"><small>${String(r.id).padStart(2,'0')}</small><b>${r.name}</b><span>${r.desc}</span></button>`).join('')||'<p>这是本章的边界概念，可以进入下一章继续学习。</p>'}</div>
      </section>`;
    $('#lessonIndex').textContent=`${idx+1} / ${route.length}`;
    $('#prevBtn').disabled=idx===0;
    $('#nextBtn').disabled=idx===route.length-1;
    $('#completeBtn').classList.toggle('done',!!saved[current]);
    $('#completeBtn').textContent=saved[current]?'已掌握 · 点击取消':'标记为已掌握';
    $$('.related-links button').forEach(b=>b.addEventListener('click',()=>{current=Number(b.dataset.related);activeChapter=byId.get(current).chapter;renderAll();window.scrollTo({top:$('#reader').offsetTop-20,behavior:'smooth'});}));
    const noteKey=`lx-note-${current}`, input=$('#noteInput');
    input.value=localStorage.getItem(noteKey)||'';
    input.addEventListener('input',()=>{localStorage.setItem(noteKey,input.value);$('#noteStatus').textContent='已自动保存';});
    localStorage.setItem('lx-reader-last',String(current));
    history.replaceState(null,'',`#concept-${current}`);
  }

  function renderAll(){
    activeChapter=byId.get(current).chapter;
    renderChapters();renderConceptList($('#searchInput').value);renderLesson();setProgress();
  }
  function move(step){const idx=route.indexOf(current),next=route[idx+step];if(next){current=next;renderAll();window.scrollTo({top:$('#reader').offsetTop-12,behavior:'smooth'});}}
  function openDirectory(){document.body.classList.add('directory-open');$('#directory').classList.add('open');$('#directoryScrim').classList.add('open');}
  function closeDirectory(){document.body.classList.remove('directory-open');$('#directory').classList.remove('open');$('#directoryScrim').classList.remove('open');}

  $('#prevBtn').addEventListener('click',()=>move(-1));
  $('#nextBtn').addEventListener('click',()=>move(1));
  $('#completeBtn').addEventListener('click',()=>{saved[current]=!saved[current];localStorage.setItem('lx-reader-progress',JSON.stringify(saved));renderAll();});
  $('#openDirectory').addEventListener('click',openDirectory);
  $('#closeDirectory').addEventListener('click',closeDirectory);
  $('#directoryScrim').addEventListener('click',closeDirectory);
  $('#searchInput').addEventListener('input',e=>renderConceptList(e.target.value));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDirectory();if(e.altKey&&e.key==='ArrowLeft')move(-1);if(e.altKey&&e.key==='ArrowRight')move(1);});
  const courseObserver=new IntersectionObserver(entries=>{
    document.body.classList.toggle('course-active',entries[0].isIntersecting);
  },{threshold:0});
  courseObserver.observe($('#course'));
  renderAll();
})();
