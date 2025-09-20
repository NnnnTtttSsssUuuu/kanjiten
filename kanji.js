`use strict`;
{
  // URLのクエリ文字列を取得
  const params = new URLSearchParams(window.location.search);
  const unicodeValue = params.get('unicode');
  let targetKanji = 0;
  let jtarget = 0;
  let kariItaiji = [];


  //ユーザーのリファラ情報
  const ref = document.referrer;
  console.log("リファラ", ref);

  const thisUrls = [
    location.origin + "/",
    location.origin + "/index.html"
  ];

  let needJson = !thisUrls.includes(ref);


  //外部からならjsonを読み込む
  if (needJson) {
    console.log("外部として処理");
    // fetch('kanjiFile.json') 
    fetch(location.origin + '/kanjiFile.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        return response.json();  //内部でparseされ、配列となる
      })
      .then(kanjiFile => {
        kanjiShugo = kanjiFile;
        localStorage.setItem('kanjiLocal', JSON.stringify(kanjiFile));
        console.log("外部として入手", kanjiShugo);
        openKanji(unicodeValue);
      })
      .catch(error => console.error('Error loading JSON:', error));
        alert('JSONの読み込みに失敗しました: ' + error.message);
      

    // setTimeout(() => {

    //   openKanji(unicodeValue);
    // }, 200); //1秒間タイマー

  } else {

    kanjiShugo = JSON.parse(localStorage.getItem('kanjiLocal'));
    console.log("内部として処理",kanjiShugo);
    setTimeout(() => {
      openKanji(unicodeValue);
    }, 200); //1秒間タイマー
  }


  //漢字ごとの表を作る
  function openKanji(theUnicode) {
    // kanjiShugo = JSON.parse(localStorage.getItem('kanjiLocal'));

    //kanjiShugoのなかで、tKanjiと合致するものを選ぶ
    for (let i = 0; i < kanjiShugo.length; i++) {
      if (kanjiShugo[i].unicode === theUnicode) {
        targetKanji = i;
        continue;
      }
    }

    let theKanji = kanjiShugo[targetKanji];

    //親字の情報を入れる
    let title = document.querySelector('#title_');
    title.textContent = theKanji.midashi;

    let jishu = document.querySelector('#jishu_');
    jishu.textContent = theKanji.jishu;

    let midashi = document.querySelector('#midashi_');
    midashi.textContent = theKanji.midashi;

    let midashi2 = document.querySelector('#midashi2_');
    midashi2.textContent = theKanji.midashi;

    let midashi3 = document.querySelector('#midashi3_');
    midashi3.textContent = theKanji.midashi;

    let jikei = document.querySelector('#jikei_');
    jikei.setAttribute('src', theKanji.jikei);

    let mojigun = document.querySelector('#mojigun_');
    mojigun.textContent = theKanji.mojigun;

    let jislevel = document.querySelector('#jislevel_');
    jislevel.textContent = theKanji.jislevel;

    let unicode = document.querySelector('#unicode_');
    unicode.textContent = theKanji.unicode;

    let menkuten = document.querySelector('#menkuten_');
    menkuten.textContent = theKanji.menkuten;

    let jiscode = document.querySelector('#jiscode_');
    jiscode.textContent = theKanji.jiscode;

    let chuui = document.querySelector('#chuui_');
    chuui.textContent = theKanji.chuui;

    let yomi = document.querySelector('#yomi_');
    yomi.textContent = theKanji.yomi;

    let raireki = document.querySelector('#raireki_');
    raireki.innerHTML = theKanji.raireki;

    let tsukaiwake = document.querySelector('#tsukaiwake_');
    tsukaiwake.innerHTML = theKanji.tsukaiwake;

    let sanko = document.querySelector('#sanko_');
    sanko.textContent = theKanji.sanko;

    // let tsukaiwakeEdit = document.querySelector('#tsukaiwakeEdit_');
    // tsukaiwakeEdit.innerHTML = theKanji.tsukaiwake;

    // let theTargetKanji = document.querySelector('#theTargetKanji');
    // theTargetKanji.textContent = targetKanji;

    console.log("異体字の情報を得る直前",theKanji.nOfJitai);
    //異体字の情報を得る
    for (let i = 1; i < theKanji.nOfJitai; i++) {
      kariItaiji[i + 1] = theKanji.kanjiCode + "_" + (i + 1);
      for (let j = 0; j < kanjiShugo.length; j++) {
        if (kanjiShugo[j].kanjiCode === kariItaiji[i + 1]) {
          jtarget = j;
          continue;
        }
      }
      console.log("異体字の情報を入れ始める");
      theItaiji = kanjiShugo[jtarget];  //異体字はtheItaiji

      //異体字のデータを追加
      const kanjigun = document.getElementById('kanjigun_');
      const newSection = document.createElement('section');
      newSection.className = "itaiji";
      newSection.textContent = i + 1;

      const newDiv1 = document.createElement('span');
      newDiv1.className = "jishu";
      newDiv1.textContent = theItaiji.jishu;

      const newDiv2 = document.createElement('div');
      newDiv2.setAttribute('src', theItaiji.jikei);
      let jikeiContent = `<img  src="${theItaiji.jikei}" width="80">`
      newDiv2.innerHTML = jikeiContent;
      newDiv2.className = "jikei";

      const newDiv3 = document.createElement('div');
      newDiv3.className = "midashi";
      newDiv3.textContent = theItaiji.midashi;

      const newDiv3b = document.createElement('div');
      newDiv3b.className = "midashi2";
      newDiv3b.textContent = theItaiji.midashi;

      const newDiv3c = document.createElement('div');
      newDiv3c.className = "midashi3";
      newDiv3c.textContent = theItaiji.midashi;

      const newDiv4 = document.createElement('div');
      newDiv4.className = "youso";

      const newDiv5 = document.createElement('div');
      newDiv5.className = "mojigun";
      newDiv5.textContent = theItaiji.mojigun;

      const newDiv6 = document.createElement('div');
      newDiv6.className = "jislevel";
      newDiv6.textContent = theItaiji.jislevel;

      const newDiv7 = document.createElement('div');
      newDiv7.className = "unicode";
      newDiv7.textContent = theItaiji.unicode;

      if (theItaiji.unicode.length > 8) {
        newDiv7.classList.add("narrow");
      }

      const newDiv8 = document.createElement('div');
      newDiv8.className = "menkuten";
      newDiv8.textContent = theItaiji.menkuten;

      const newDiv9 = document.createElement('div');
      newDiv9.className = "jiscode";
      newDiv9.textContent = theItaiji.jiscode;

      const newDiv10 = document.createElement('div');
      newDiv10.className = "chuui";
      newDiv10.textContent = theItaiji.chuui;

      newSection.appendChild(newDiv1);
      newSection.appendChild(newDiv2);
      newSection.appendChild(newDiv3);
      newSection.appendChild(newDiv3b);
      newSection.appendChild(newDiv3c);

      newDiv4.appendChild(newDiv5);
      newDiv4.appendChild(newDiv6);
      newDiv4.appendChild(newDiv7);
      newDiv4.appendChild(newDiv8);
      newDiv4.appendChild(newDiv9);
      newDiv4.appendChild(newDiv10);
      newSection.appendChild(newDiv4);
      kanjigun.appendChild(newSection);
    }
  }

  document.getElementById('headpart').addEventListener('click', () => {
    if (needJson === 0) {
      window.close();
    } else {
      const url = 'index.html';
      window.open(url, '_blank');
    }
  });
}