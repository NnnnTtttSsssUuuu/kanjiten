`use strict`;
{
  let oldQuery = "";
  let queryNo = 0;
  // let kanjiShugo = JSON.parse(kanjiFile.json);
  // let kanjiShugo = JSON.parse(localStorage.getItem('kanjiLocal'));
  let kanjiShugo = [];
  // sessionStorage.setItem('checkKanji', 0);

  let sortCheck = 0;

  window.onload = function () {
    console.log("window.onload起動");
    getJson();
  }


  document.querySelector('.mainTr').addEventListener('mouseover', () => {
    if (sortCheck === 0) { toSort() }
    sortCheck = 1;
  });

  //List.js対応
  function toSort() {
    const options = {
      valueNames: [
        'menkuten_',
        'unicode_',
        'jitai1_',
        'mojigun_',
        'yomi_',
        'jitai2_',
        'jitai3_',
        'jitai4_',
        'ryakusetsu_',
      ],
    };
    const searchList = new List('mainList', options);
    // console.log("List.jS読み込み", searchList);
  };

  //JSON読み込み
  function getJson() {
    console.log("getJsonに入る");
    fetch('kanjiFile.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        return response.json();  //内部でparseされ、配列となる
        console.log("return response.json()に入る");
      })
      .then(kanjiFile => {
        console.log("kanjiFileを取得");
        kanjiShugo = kanjiFile;
        localStorage.setItem('kanjiLocal', JSON.stringify(kanjiFile));
        createKanjiTable();
      })
      .catch(error => console.error('Error loading JSON:', error));
  }




  //json村読み込み後1
  // setTimeout(() => {

  console.log("setTimeoutに入る");
  //大漢字表を作成する
  function createKanjiTable() {
    const kanjiHyo = document.querySelector('#kanjiHyo');
    console.log("kanjiHyo", kanjiHyo);
    for (let i = 0; i < kanjiShugo.length; i++) {
      // console.log("大漢字表作成に入る");
      if (kanjiShugo[i].junOfJitai < 2) {
        const kanjiRow = document.createElement('tr');
        kanjiRow.className = "kanji";
        kanjiRow.id = kanjiShugo[i].unicode;

        const kanjiMenkuten = document.createElement('td');
        kanjiMenkuten.className = "menkuten_";
        kanjiMenkuten.textContent = kanjiShugo[i].menkuten;

        const kanjiUnicode = document.createElement('td');
        kanjiUnicode.className = "unicode_";
        kanjiUnicode.textContent = kanjiShugo[i].unicode;

        const kanjiMidashi = document.createElement('td');
        kanjiMidashi.className = "jitai1_";
        // kanjiMidashi.className = "midashi_";
        kanjiMidashi.textContent = kanjiShugo[i].midashi;

        const kanjiMojigun = document.createElement('td');
        kanjiMojigun.className = "mojigun_";
        kanjiMojigun.textContent = kanjiShugo[i].mojigun;

        const kanjiJitai2 = document.createElement('td');
        if (kanjiShugo[i].jitai2glyph) {
          kanjiJitai2.setAttribute('src', kanjiShugo[i].jitai2glyph);
          let jikeiContent = `<img  src="${kanjiShugo[i].jitai2glyph}" width="42">`
          kanjiJitai2.innerHTML = jikeiContent;
        } else {
          kanjiJitai2.className = "jitai2_";
          kanjiJitai2.textContent = kanjiShugo[i].jitai2;
        }


        const kanjiJitai3 = document.createElement('td');
        if (kanjiShugo[i].jitai3glyph) {
          kanjiJitai3.setAttribute('src', kanjiShugo[i].jitai3glyph);
          let jikeiContent = `<img  src="${kanjiShugo[i].jitai3glyph}" width="42">`
          kanjiJitai3.innerHTML = jikeiContent;
        } else {
          kanjiJitai3.className = "jitai3_";
          kanjiJitai3.textContent = kanjiShugo[i].jitai3;
        }

        const kanjiJitai4 = document.createElement('td');
        if (kanjiShugo[i].jitai4glyph) {
          kanjiJitai4.setAttribute('src', kanjiShugo[i].jitai4glyph);
          let jikeiContent = `<img  src="${kanjiShugo[i].jitai4glyph}" width="42">`
          kanjiJitai4.innerHTML = jikeiContent;
        } else {
          kanjiJitai4.className = "jitai4_";
          kanjiJitai4.textContent = kanjiShugo[i].jitai4;
        }

        const kanjiJitai4over = document.createElement('td');
        // kanjiJitai4over.className = "ryakusetsu_";
        let kanjiOver = "";
        if (kanjiShugo[i].nOfJitai > 4) {
          kanjiOver = "▶";
        }
        kanjiJitai4over.textContent = kanjiOver;


        const kanjiRyakusetsu = document.createElement('td');
        kanjiRyakusetsu.className = "ryakusetsu_";
        kanjiRyakusetsu.textContent = kanjiShugo[i].ryakusetsu;

        const kanjiYomi = document.createElement('td');
        kanjiYomi.className = "yomi_";
        kanjiYomi.textContent = kanjiShugo[i].yomi;



        kanjiRow.appendChild(kanjiMenkuten);
        kanjiRow.appendChild(kanjiUnicode);
        kanjiRow.appendChild(kanjiMidashi);
        kanjiRow.appendChild(kanjiMojigun);
        kanjiRow.appendChild(kanjiJitai2);
        kanjiRow.appendChild(kanjiJitai3);
        kanjiRow.appendChild(kanjiJitai4);
        kanjiRow.appendChild(kanjiJitai4over);
        kanjiRow.appendChild(kanjiRyakusetsu);
        kanjiRow.appendChild(kanjiYomi);

        kanjiHyo.appendChild(kanjiRow);
      }
    }

  }
  // }, 200); //1秒間タイマー


  //検索する
  document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    highlightText(query);
    if (oldQuery === query) {
      queryNo = queryNo + 1;
    } else {
      oldQuery = query;
      queryNo = 0;
    }
    gotoHighlight(queryNo);
  });

  function highlightText(query) {
    document.querySelectorAll(".highlight").forEach(el => {
      el.classList.remove("highlight");
    });
    document.querySelectorAll(".biglight").forEach(el => {
      el.classList.remove("biglight");
    });

    if (!query) return;// キーワードが空なら何もしない
    const regex = new RegExp(`(${query})`, "gi"); // 検索キーワードを正規表現化

    //body内のツリー構造を探索し、テキストだけを取り出す
    const searchScope = document.getElementById("kanjiHyo");
    const walker = document.createTreeWalker(searchScope, NodeFilter.SHOW_TEXT, null, false);
    let currentNode = walker.nextNode(); // 最初のノードを取得

    while (currentNode) {
      const node = currentNode; //現在のノードを保存
      currentNode = walker.nextNode(); //探索を続ける
      if (node.nodeValue.match(regex)) {
        node.parentNode.classList.add("highlight");
        node.parentNode.parentNode.children[2].classList.add("biglight");
      }
    }
  }

  function gotoHighlight(queryNo) {
    const highlightsAll = document.querySelectorAll(".biglight");
    queryNo = queryNo % highlightsAll.length;
    if (highlightsAll.length > 0) {
      highlightsAll[queryNo].scrollIntoView({ behavior: "instant", block: "center" });
    }
  }

  // 解説へ
  document.querySelector('#toKaisetsu').addEventListener('click', () => {
    const url = 'kaisetsu.html';
    window.open(url, '_blank');
  });

  // 各文字の説明へ
  const tableClick = document.getElementById('maintableid');
  tableClick.addEventListener('click', (event) => {
    // クリックされた要素が .kanji クラスを持つか確認
    const clickedElement = event.target.closest('.kanji');

    window.open(`kanji.html?unicode=${encodeURIComponent(clickedElement.id)}`, "_blank");


    // if (clickedElement) {
    //   const checkPdf = document.getElementById('toKaisetsu').textContent;
    //   //PDF化の場合は分岐する
    //   if (checkPdf === "kai") {
    //     window.open(`kanji_pdfoutput.html?unicode=${encodeURIComponent(clickedElement.id)}`, "_blank");
    //   } else {
    //     window.open(`kanji.html?unicode=${encodeURIComponent(clickedElement.id)}`, "_blank");
    //   }
    // }
  });
}