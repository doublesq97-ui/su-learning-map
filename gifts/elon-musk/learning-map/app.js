(function(){
  const data=window.LEARNING_DATA;
  if(!data) throw new Error('Learning data is missing');
  const storagePrefix=`learning-map-${data.meta.slug}`;
  const byId=new Map(data.concepts.map(c=>[c.id,c]));
  const route=data.chapters.flatMap(ch=>ch.ids);
  const saved=JSON.parse(localStorage.getItem(`${storagePrefix}-progress`)||'{}');
  const fromHash=Number(location.hash.replace('#concept-',''));
  let current=byId.has(fromHash)?fromHash:Number(localStorage.getItem(`${storagePrefix}-last`))||route[0];
  let activeChapter=byId.get(current).chapter;
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const chapterOf=id=>data.chapters.find(ch=>ch.ids.includes(id));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const evidenceLabel={primary:'一手来源',corroborated:'多源综合',external:'外部观察',inference:'框架推断',current:'当前事实'};

  $('#outcomeList').innerHTML=data.chapters.map(ch=>`<div class="outcome"><b>${h(ch.no)} · ${h(ch.name)}</b><span>${h(ch.promise)}</span></div>`).join('');

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
      return `<button class="chapter-item ${ch.id===activeChapter?'active':''}" data-chapter="${h(ch.id)}"><span class="chapter-no">${h(ch.no)}</span><span><b>${h(ch.name)}</b><small>${h(ch.promise)}</small></span><em>${done}/${ch.ids.length}</em></button>`;
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
    const list=(q?data.concepts:ch.ids.map(id=>byId.get(id))).filter(c=>{
      const deep=[c.context,...(c.arguments||[]),...(c.source_digest||[]),c.boundary].filter(Boolean).join(' ');
      return !q||`${c.id} ${c.name} ${c.desc} ${c.excerpt} ${c.locator} ${deep}`.toLowerCase().includes(q);
    });
    $('#conceptList').innerHTML=list.length?list.map(c=>`<button class="concept-item ${c.id===current?'active':''} ${saved[c.id]?'done':''}" data-id="${c.id}"><span>${String(c.id).padStart(2,'0')}</span><b>${h(c.name)}</b><i>${saved[c.id]?'✓':''}</i></button>`).join(''):`<div class="empty">没有找到相关概念，换个关键词试试。</div>`;
    $$('.concept-item').forEach(btn=>btn.addEventListener('click',()=>{current=Number(btn.dataset.id);activeChapter=byId.get(current).chapter;renderAll();closeDirectory();}));
  }

  function renderLesson(){
    const c=byId.get(current), ch=chapterOf(current), idx=route.indexOf(current);
    const siblingIds=ch.ids, siblingIndex=siblingIds.indexOf(current);
    const relatedIds=(c.connections&&c.connections.length?c.connections:[siblingIds[siblingIndex-1],siblingIds[siblingIndex+1]]).filter(Boolean);
    const related=[...new Set(relatedIds)].map(id=>byId.get(id)).filter(Boolean).slice(0,4);
    const context=c.context||`学习这个概念，是为了在真实选择中获得一个新的判断角度：${ch.promise}。`;
    const argumentsHtml=(c.arguments||[]).length?`<section class="lesson-section argument-section"><div class="section-label">论证是怎么展开的</div><ol class="argument-list">${c.arguments.map(x=>`<li>${h(x)}</li>`).join('')}</ol></section>`:'';
    const digest=(c.source_digest&&c.source_digest.length?c.source_digest:[c.excerpt]);
    const sourceExcerpts=(c.source_excerpts||[]).map(item=>typeof item==='string'?{text:item}:item).filter(item=>item&&item.text);
    const sourceHref=(location.protocol==='file:'&&c.local_source_url)?c.local_source_url:c.source_url;
    const sourcePage=c.source_page||String(c.locator||'').match(/(?:p\.?|page=|第)\s*(\d+)/i)?.[1];
    const sourceAction=(location.protocol==='file:'&&c.local_source_url)
      ?`打开中文原文${sourcePage?` · 第 ${sourcePage} 页`:''}`
      :(String(sourceHref).toLowerCase().includes('.pdf')
        ?`打开官方原文${sourcePage?` · 第 ${sourcePage} 页`:''}`
        :`查看官方原书${sourcePage?` · 本卡对应第 ${sourcePage} 页`:''}`);
    const excerptsHtml=sourceExcerpts.length?`<div class="source-excerpts"><div class="source-excerpt-label">原文切片</div>${sourceExcerpts.map(item=>`<blockquote>${h(clean(item.text))}${item.locator?`<cite>${h(item.locator)}</cite>`:''}</blockquote>`).join('')}</div>`:'';
    const boundaryHtml=c.boundary?`<section class="lesson-section boundary-section"><div class="section-label">别这样误用</div><p>${h(c.boundary)}</p></section>`:'';
    $('#lesson').innerHTML=`
      <header class="lesson-head">
        <div class="lesson-meta"><span>概念 ${String(c.id).padStart(2,'0')}</span><span>${h(ch.no)} · ${h(ch.name)}</span><span>${h(evidenceLabel[c.evidence]||c.evidence)}</span></div>
        <h1>${h(c.name)}</h1>
        <p class="lesson-lede">${h(c.desc)}</p>
      </header>
      <section class="lesson-section key-section">
        <div class="section-label">先抓住这一点</div>
        <p class="key-sentence">${h(c.desc)}</p>
        <p>${h(context)}</p>
      </section>
      ${argumentsHtml}
      <section class="lesson-section source-section">
        <div class="section-label">来源精读</div>
        ${excerptsHtml}
        <div class="source-digest">${digest.map(p=>`<p>${h(clean(p))}</p>`).join('')}</div>
        <a class="source-open" href="${h(sourceHref)}" target="_blank" rel="noreferrer">${h(sourceAction)} <span>↗</span></a>
        <div class="source-note">${h(evidenceLabel[c.evidence]||c.evidence)} · ${h(c.locator)}。原文切片用于定位，引用前仍应核验完整语境。</div>
      </section>
      ${boundaryHtml}
      <section class="lesson-section practice-section">
        <div class="section-label">今天怎么用</div>
        <div class="practice-question">${h(c.practice)}</div>
        <textarea id="noteInput" rows="4" placeholder="写下你的答案或一个真实案例……"></textarea>
        <div class="note-status" id="noteStatus">答案只保存在当前浏览器</div>
      </section>
      <section class="lesson-section related-section">
        <div class="section-label">继续连接</div>
        <div class="related-links">${related.map(r=>`<button data-related="${r.id}"><small>${String(r.id).padStart(2,'0')}</small><b>${h(r.name)}</b><span>${h(r.desc)}</span></button>`).join('')||'<p>这是本章的边界概念，可以进入下一章继续学习。</p>'}</div>
      </section>`;
    $('#lessonIndex').textContent=`${idx+1} / ${route.length}`;
    $('#prevBtn').disabled=idx===0;
    $('#nextBtn').disabled=idx===route.length-1;
    $('#completeBtn').classList.toggle('done',!!saved[current]);
    $('#completeBtn').textContent=saved[current]?'已掌握 · 点击取消':'标记为已掌握';
    $$('.related-links button').forEach(b=>b.addEventListener('click',()=>{current=Number(b.dataset.related);activeChapter=byId.get(current).chapter;renderAll();window.scrollTo({top:$('#reader').offsetTop-20,behavior:'smooth'});}));
    const noteKey=`${storagePrefix}-note-${current}`, input=$('#noteInput');
    input.value=localStorage.getItem(noteKey)||'';
    input.addEventListener('input',()=>{localStorage.setItem(noteKey,input.value);$('#noteStatus').textContent='已自动保存';});
    localStorage.setItem(`${storagePrefix}-last`,String(current));
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
  $('#completeBtn').addEventListener('click',()=>{saved[current]=!saved[current];localStorage.setItem(`${storagePrefix}-progress`,JSON.stringify(saved));renderAll();});
  $('#openDirectory').addEventListener('click',openDirectory);
  $('#closeDirectory').addEventListener('click',closeDirectory);
  $('#directoryScrim').addEventListener('click',closeDirectory);
  $('#searchInput').addEventListener('input',e=>renderConceptList(e.target.value));
  window.addEventListener('hashchange',()=>{
    const id=Number(location.hash.replace('#concept-',''));
    if(byId.has(id)&&id!==current){current=id;activeChapter=byId.get(id).chapter;renderAll();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDirectory();if(e.altKey&&e.key==='ArrowLeft')move(-1);if(e.altKey&&e.key==='ArrowRight')move(1);});
  const courseObserver=new IntersectionObserver(entries=>{
    document.body.classList.toggle('course-active',entries[0].isIntersecting);
  },{threshold:0});
  courseObserver.observe($('#course'));
  renderAll();
})();
