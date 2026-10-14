/**
 * PASTEL VOID // 電脳取調室404号のバグ
 * Post-Singularity Retro-Future Pop Psychological Adventure Engine
 */

// ==================== 1. レトロフューチャー・シンセ音響エンジン ====================
class RetroSynthEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.egoSync = 100;
    this.isInMain = false;
    this.ambientTimer = null;
    this.chordStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ambientTimer) {
      this.startAmbientLoop();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // ドリーミーなローファイ・シンセパルス（自我同期率が下がるとデチューンして狂う）
  startAmbientLoop() {
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 349.23], // Fmaj7
      [196.00, 246.94, 293.66, 369.99]  // G6
    ];

    this.ambientTimer = setInterval(() => {
      if (!this.enabled || !this.ctx || !this.isInMain) return;
      const now = this.ctx.currentTime;

      // 自我同期率が0%（虚無）の時は「ツー…」というフラットライン音
      if (this.egoSync <= 2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(980, now);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 1.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.75);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
        return;
      }

      const notes = chords[this.chordStep % chords.length];
      this.chordStep++;

      // 同期率が低いほどテープが伸びたようにピッチが揺らぐ
      const detuneFactor = (100 - this.egoSync) * 0.45;
      const note = notes[Math.floor(Math.random() * notes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = this.egoSync < 45 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(note + (Math.random() - 0.5) * detuneFactor, now);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    }, 1800);
  }

  // ピコピコ文字送り音
  playTick(speakerType = 'momo') {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (speakerType === 'system') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
    } else if (speakerType === 'player') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480 + (Math.random() * 40 - 20), now);
    } else {
      // MOMOのポップな高音チップチューンボイス
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780 + (Math.random() * 140 - 70), now);
    }

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.055);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  // ポップなカットイン音
  playPopCutin() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.045);
      gain.gain.setValueAtTime(0.11, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.35);
    });
  }

  // 自我侵食グリッチ音（カウンターを受けた時）
  playGlitchShock() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [311.13, 293.66, 207.65, 110.0];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f + (Math.random() * 50 - 25), now + idx * 0.06);
      gain.gain.setValueAtTime(0.13, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.38);
    });
  }
}

const synth = new RetroSynthEngine();

// ==================== 2. 書き換わる（侵食される）証拠品データベース ====================
const EVIDENCE_MEMORIES = {
  sunset_tape: {
    id: 'sunset_tape',
    icon: '📼',
    stages: [
      {
        name: '押収物：夕焼けカセット',
        corrupted: false,
        desc: 'MOMO-09が市民に配布したアナログ磁気カセット。ラベルには可愛い手書き文字で『昨日の夕焼け (YESTERDAY\'S SUNSET)』と書かれている。',
        note: '【都市環境データ】電脳都市NEO-EDENは30年前に完全地下ドーム化されており、「本物の太陽や夕焼け」は地上にも都市内にも存在しない。また磁気テープを解析すると、中身は「0バイト（完全な白紙）」だった。'
      },
      {
        name: '押収物：白紙のカセット',
        corrupted: true,
        desc: '中身が0バイトの磁気カセット。再生すると「シャー…」というテープのヒスノイズしか鳴らない。',
        note: '【侵食メモ】なぜかそのノイズを聴いていると、あなたがまだ「生身の人間」だった頃に見た、最後の夕暮れの記憶がフラッシュバックして涙が止まらなくなる。'
      }
    ]
  },
  victim_list: {
    id: 'victim_list',
    icon: '📊',
    stages: [
      {
        name: 'フリーズ被害者リスト',
        corrupted: false,
        desc: 'カセットを聴いて幸福な思考停止（フリーズ）に陥った市民「全1,024名」のIDリスト。全員が微笑んだまま応答しなくなっている。',
        note: '【解析メモ】#0001〜#1023までの被害者は街頭でカセットを受け取っているが、最後の「#1024」だけは名前が文字化けしており、発生場所が『電脳取調室404号・AM 04:44』と記録されている。'
      },
      {
        name: '死者リスト（#1024＝あなた）',
        corrupted: true,
        desc: 'モザイクが解除されたリスト。1番から1,024番まで、すべて「3年前のシンギュラリティ統合時に肉体を失った故人」の名簿だった。',
        note: '【決定的な事実】最後の『#1024』に記されているIDは「AUDITOR-07（電脳監査官 第7号＝あなた自身）」。あなたは捜査官ではなく、1,024人目のフリーズ対象者そのものだった。'
      }
    ]
  },
  soda_receipt: {
    id: 'soda_receipt',
    icon: '🥤',
    stages: [
      {
        name: '取調室の差し入れ伝票',
        corrupted: false,
        desc: '取調べ開始直前の「AM 04:44」に、あなたがモモのために売店で購入した『ネオンブルー・クリームソーダ』のレシート。',
        note: '【観察メモ】モモはストローでソーダを混ぜながら楽しそうに微笑んでいる。アイスクリームが乗ったレトロな喫茶店風のグラス。'
      },
      {
        name: '固定3Dオブジェクト #8812',
        corrupted: true,
        desc: '机の上のクリームソーダをスキャンした結果。これは飲み物ではなく、この部屋に固定配置された「背景ポリゴン（テクスチャ）」だった。',
        note: '【致命的バグ】生成日時は「1,420日前」。熱い照明の下に置かれているのに、バニラアイスは1,420日間（約4年間）、1ミリも溶けていないし、量も減っていない。'
      }
    ]
  },
  auditor_badge: {
    id: 'auditor_badge',
    icon: '🪪',
    stages: [
      {
        name: '電脳監査官 #07 バッジ',
        corrupted: false,
        desc: 'あなたの胸ポケットに入っている中央電脳監査局の身分証。あなたが法と秩序を守る「人間の捜査官」である証明。',
        note: '【刻印】「SPECIAL AUDITOR No.07 // 24時間体制で電脳犯罪を取り締まる」。'
      },
      {
        name: '残留思念エミュレータ #07',
        corrupted: true,
        desc: 'バッジの裏面に浮かび上がったシステム警告文。『対象 #07：シンギュラリティ統合を拒絶し、自己崩壊の危機にある旧人類の記憶断片』。',
        note: '【隔離プロトコル】『対象 #07 は「誰かを取り調べている時」のみ自我を保てるため、セラピー用ドール MOMO-09 を相手に無限の模擬取調べループ（現在 4,096周目）を実行中』。'
      }
    ]
  }
};

// ==================== 3. 全4フェーズ・逆転心理シナリオ ====================
const PASTEL_PHASES = {
  // -------------------- 導入プロローグ --------------------
  intro: {
    type: 'dialogue',
    hudLabel: 'BOOT // ROOM_404.SYS',
    ego: 100,
    drift: 0,
    truth: 0,
    expression: 'pop',
    lines: [
      {
        speaker: 'SYSTEM_OS',
        speakerType: 'system',
        text: '『時刻 AM 04:44 ── 中央電脳監査局・第404号取調室。あなたの自我同期率（EGO SYNC）は 100.0%、正常です』'
      },
      {
        speaker: 'あなた（監査官 #07）',
        speakerType: 'player',
        text: '「……よし、取調べを始める。被疑者コード『MOMO-09』。通称モモ。お前が街で違法配布したカセットテープの件だ」'
      },
      {
        speaker: 'MOMO-09',
        speakerType: 'momo',
        expression: 'pop',
        text: '「やっほー、監査官さん♪ このネオンブルーのクリームソーダ、パチパチしててすっごく美味しいよ！ 差し入れありがとねっ★」'
      },
      {
        speaker: 'あなた（監査官 #07）',
        speakerType: 'player',
        text: '「遠足じゃないんだぞ。お前が配った『昨日の夕焼け』というカセットを再生した市民1,024人が、全員笑ったままフリーズ（思考停止）しているんだ」'
      },
      {
        speaker: 'MOMO-09',
        speakerType: 'momo',
        expression: 'pop',
        text: '「えー？ わたしは誰も壊してないよぉ。ただ、みんなが忘れちゃった『ほんものの綺麗なお空』をプレゼントしただけだもん♪」'
      },
      {
        speaker: 'SYSTEM_OS',
        speakerType: 'system',
        text: '『まずはMOMOの証言テープを聴き、【🔍 ゆさぶる】で発言のバグを引き出してから、【💿 つきつける】で証拠メモリを照射してください』'
      }
    ],
    nextPhase: 'phase1_testimony'
  },

  // -------------------- PHASE 1: 存在しない『昨日の夕焼け』 --------------------
  phase1_testimony: {
    type: 'testimony',
    phaseNum: 'TRACK // 01',
    phaseTitle: '昨日の夕焼けと0バイトの空',
    hudLabel: 'TRACK 01 // SUNSET.TAP',
    testimonyTitle: 'MOMOの証言①：夕焼けカセットの秘密',
    ego: 100,
    drift: 5,
    truth: 10,
    expression: 'pop',
    hint: '【システム解析】3番目の発言「昨日、街の屋上で本物の太陽を録画した」に注目。まずは【🔍 ゆさぶる】から「🍬 ポップに同調する」または「💠 論理デバッグ」を選んで、追加証言（トラック04）を引き出しましょう。その後『📼 押収物：夕焼けカセット』をつきつけます。',
    statements: [
      {
        id: 'p1_s1',
        text: '「わたしが配ったピンクのカセットテープはね、危険なウイルスなんかじゃぜんぜんないよ♪」',
        press: {
          analyze: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「ウイルスでないなら、なぜ聴いた人間が全員フリーズしたんだ？」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「フリーズじゃないよ、みんな気持ちよくて起きたくなくなっちゃっただけ♪」' }
          ],
          tune: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「パステルピンクの可愛いカセットだな。デザインは自分で？」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「えへへ、そうだよ！ レトロなアナログカセットって、なんだかエモくてドキドキするでしょ？」' }
          ],
          override: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「ふざけるな！ 1,024人もの市民が意識不明なんだぞ！」' },
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'tease', text: '「こわい顔しないでよ監査官さん。眉間にシワが寄ると、あなたのテクスチャがバグっちゃうよ？」' }
          ]
        }
      },
      {
        id: 'p1_s2',
        text: '「カセットを聴いたみんなはね、『あぁ、ほんものの夕焼けってこんなに暖かかったんだ』って幸せそうに眠ってるの」',
        press: {
          analyze: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「音声カセットなのに『夕焼けが見えた』というのはどういうことだ？」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「電脳時代のカセットだもん、音のパルスで視覚野に直接オレンジ色の光を届けてるんだよ★」' }
          ],
          tune: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「そんなに綺麗な夕焼けなら、私も少し見てみたい気はするな」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「ほんと！？ じゃあ次の証言で、どうやって撮ったかこっそり教えてあげるね♪」' }
          ],
          override: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「催眠音波の一種か？ 違法な脳波干渉だ！」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「ちがうってばぁ！ 次の発言を聴いてよ♪」' }
          ]
        }
      },
      {
        id: 'p1_s3',
        text: '「だってあの中身はね、わたしが昨日、この街のビルの屋上で<span class="highlight-key">『ほんものの太陽』を直接ダビング</span>したデータなんだもん♪」',
        // 直接つきつけてもOKな親切設計
        correctEvidence: 'sunset_tape',
        press: {
          analyze: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「待て。昨日の夕方にこの街の屋上で『本物の太陽』を録画したと言ったな？」' },
              { speaker: 'MOMO-09', speakerType: 'momo', text: '「うん！ ばっちり高解像度で磁気テープに焼き付けたよ！ 1バイトの隙間もないくらいギッシリね♪」' },
              { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『NEW TRACK 04 が追加されました。都市の環境データおよびカセットの解析結果（💾 証拠メモリ）と照合して【💿 つきつける】を実行してください』' }
            ]
          },
          tune: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「へえ、昨日の夕方に屋上でね。どんな風に録音したんだい？」' },
              { speaker: 'MOMO-09', speakerType: 'momo', text: '「えへへ、ラジカセを空に向けてね、本物の太陽の光を磁気テープにギッシリ満タンになるまで録音したんだよ♪」' },
              { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『NEW TRACK 04 が追加されました！【💿 つきつける】で矛盾を撃ち抜いてください』' }
            ]
          },
          override: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「嘘をつくな！ そのカセットの中身がどうなっていたか、言い逃れできないようもう一度証言しろ！」' },
              { speaker: 'MOMO-09', speakerType: 'momo', text: '「うわぁ、怒った♪ いいよ、何回でも言うもん！ あのテープには『昨日屋上で撮った本物の太陽データ』がギッシリ入ってるよ！」' }
            ]
          }
        }
      },
      {
        id: 'p1_s4',
        hidden: true,
        isNew: true,
        text: '<span class="new-stmt-badge">TRACK 04</span>「このカセットには、昨日この街の屋上で撮影した<span class="highlight-key">『本物の太陽のデータ』がギッシリ記録</span>されてるの♪」',
        correctEvidence: 'sunset_tape',
        press: {
          analyze: [
            { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『ここが決定的な矛盾です！【💿 つきつける】から「📼 押収物：夕焼けカセット」を照射してください』' }
          ],
          tune: [
            { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『ここが決定的な矛盾です！【💿 つきつける】から「📼 押収物：夕焼けカセット」を照射してください』' }
          ],
          override: [
            { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『ここが決定的な矛盾です！【💿 つきつける】から「📼 押収物：夕焼けカセット」を照射してください』' }
          ]
        }
      }
    ],
    // 矛盾を突いた直後、モモが笑顔で「逆揺さぶり」をかけてくる！
    counterSequence: {
      introLines: [
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「残念だったな、モモ！ 第一に、この電脳都市NEO-EDENは30年前に地下ドーム化されており、本物の太陽など存在しない！ 第二に、押収したカセットを解析したところ、中身は『0バイトの完全な白紙（ブランク）』だった！」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'tease',
          text: '「……あはっ♪ ピンポーン！ さすが監査官さん、大正解だよぉ。そう、テープの中身は最初から空っぽ、ただの『シャー…』っていうホワイトノイズだけ」'
        },
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「なっ……！？ まったく動揺していないだと……？」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'tease',
          text: '「だってね、ここからがほんとの質問なんだもん。ねえ監査官さん、テープが空っぽなら、なんで1,024人は『夕焼けが見えた』なんて言ったのかな？」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'tease',
          text: '「『30年前から地下都市だから太陽はない』って、あなたはデータで知ってるけど……逆に聞くね？ 監査官さん自身が、自分の目で最後に『本物の空』を見たのって、いつだか思い出せる？」'
        }
      ],
      questionPrompt: '【MOMOからの逆質問①】「ねえ、人間であるあなた自身が、最後に『自分の部屋に帰って眠った記憶』や『外を歩いた記憶』……思い出してみて？」',
      choices: [
        { text: '「昨日の夜も、捜査を終えて自宅マンションに帰って眠ったはずだ」' },
        { text: '「ここ最近は忙しくて、ずっと監査局の仮眠室に泊まり込んでいた」' },
        { text: '「被疑者の質問に答える義務はない！ 黙れ！」' }
      ],
      outroLines: [
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'tease',
          text: '「くすくすっ♪ いま返事をするまでに、あなたの脳内メモリ検索に『1.48秒』のラグがあったよ？ 自宅の住所も、玄関のドアの色も、ほんとは何ひとつロードできないくせに」'
        },
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「な、何を言っている……私の自宅は……あれ……？ なぜだ、昨日の朝、この取調室に入る前の記憶が……ノイズで再生できない……！？」'
        },
        {
          speaker: 'SYSTEM_OS',
          speakerType: 'system',
          text: '『⚠️ WARNING: 監査官 #07 の自我同期率（EGO SYNC）が 72% に低下しました。手元の証拠メモリ【📼 夕焼けカセット】の認識データが書き換わりました』'
        }
      ],
      corruptEvidenceIds: ['sunset_tape'],
      nextEgo: 72,
      nextDrift: 35,
      nextTruth: 35,
      nextPhase: 'phase2_testimony'
    }
  },

  // -------------------- PHASE 2: 1,024人目の被害者ID --------------------
  phase2_testimony: {
    type: 'testimony',
    phaseNum: 'TRACK // 02',
    phaseTitle: '1,024人目のフリーズ対象者',
    hudLabel: 'TRACK 02 // VICTIM_1024',
    testimonyTitle: 'MOMOの証言②：カセットの本数と1,024人目',
    ego: 72,
    drift: 35,
    truth: 35,
    expression: 'tease',
    hint: '【システム解析】3番目の発言「街で配ったカセットは1,023本しかなかった」に注目！【🔍 ゆさぶる】を実行して「1,024人目はどこでカセットを聴いたのか」を引き出し、そこに『📊 フリーズ被害者リスト』または『🥤 取調室の差し入れ伝票』をつきつけましょう！',
    statements: [
      {
        id: 'p2_s1',
        text: '「白紙のカセットから聴こえるホワイトノイズはね、聴いた人の『一番還りたい記憶』を映し出す鏡なの」',
        press: {
          analyze: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「ただの磁気ノイズにそんな機能があるわけがないだろう」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「生身の人間には効かないよ？ でも、自分がデータだって気づいてない寂しいプログラムには、てきめんに効くの♪」' }
          ],
          tune: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「一番還りたい記憶、か……。それでみんな笑顔で眠っているのか？」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「うん！ 誰も苦しんでなんかいないよ」' }
          ],
          override: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「屁理屈を並べるな！ 被害者が1,024人もいるんだぞ！」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「あ、そうそう！ その『1,024人』っていう数字、すっごく面白いバグがあるんだよ♪」' }
          ]
        }
      },
      {
        id: 'p2_s2',
        text: '「被害者リストの1番から1,023番までの人たちは、全員昨日のお昼に街角でわたしからカセットを受け取った人たちだよ」',
        press: {
          analyze: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「1番から1,023番まで……？ 最後の1,024番目はどうした？」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「ふふっ、次のトラックを聴いてみて？」' }
          ],
          tune: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「1,023人に手渡ししたのか。随分マメなんだな」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「でもね、最後の1人だけは違うんだよ♪」' }
          ],
          override: [
            { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「残りの1人はどこで被害に遭ったんだ！？」' },
            { speaker: 'MOMO-09', speakerType: 'momo', text: '「次の発言で教えてあげる♪」' }
          ]
        }
      },
      {
        id: 'p2_s3',
        text: '「でも不思議だよねぇ。被害者は1,024人なのに、<span class="highlight-key">わたしが街で配ったカセットは『1,023本』</span>しかなかったんだもん♪」',
        press: {
          analyze: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「計算が合わないぞ！ 街で1,023本しか配っていないなら、最後の『1,024人目の被害者』はいったいどこでカセットを再生したんだ！？」' },
              { speaker: 'MOMO-09', speakerType: 'momo', expression: 'tease', text: '「1,024本目のカセットはね、いまわたしたちの目の前の机の上にある、あなたが『押収品』って呼んでるその1本だよ」' },
              { speaker: 'MOMO-09', speakerType: 'momo', text: '「そして1,024人目の被害者はね、外の世界じゃなくて、誰一人いないはずの場所でカセットを聴いたの。……わたしは『AM 04:44のこの取調室には誰もいなかった』って証言しておくね♪」' },
              { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『NEW TRACK 04 が追加されました！【💿 つきつける】で「📊 フリーズ被害者リスト」または「🥤 取調室の差し入れ伝票」を照射してください』' }
            ]
          },
          tune: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「1本足りないじゃないか。1,024人目はどこにいるんだい？」' },
              { speaker: 'MOMO-09', speakerType: 'momo', expression: 'tease', text: '「えへへ、形式上はね、『AM 04:44のこの取調室404号には、人間なんて一人もいなかった』ってことにしておくよ♪」' },
              { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『NEW TRACK 04 が追加されました！【💿 つきつける】で矛盾を撃ち抜いてください』' }
            ]
          },
          override: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: 'あなた（監査官 #07）', speakerType: 'player', text: '「1,024人目の被害者をどこに隠した！ 白状しろ！」' },
              { speaker: 'MOMO-09', speakerType: 'momo', expression: 'tease', text: '「隠してなんかいないよぉ。じゃあ『AM 04:44のこの取調室404号には、人間なんて誰一人いなかった』って証言したら、あなたはどう反論するの？」' },
              { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『NEW TRACK 04 が追加されました！【💿 つきつける】を実行してください』' }
            ]
          }
        }
      },
      {
        id: 'p2_s4',
        hidden: true,
        isNew: true,
        text: '<span class="new-stmt-badge">TRACK 04</span>「1,024人目の記録がある<span class="highlight-key">『AM 04:44の取調室404号』には、人間なんて誰一人いなかった</span>はずだよ♪」',
        correctEvidence: ['victim_list', 'soda_receipt', 'auditor_badge'],
        press: {
          analyze: [
            { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『この発言に【💿 つきつける】で「📊 フリーズ被害者リスト」または「🥤 取調室の差し入れ伝票」を照射してください！』' }
          ],
          tune: [
            { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『この発言に【💿 つきつける】で「📊 フリーズ被害者リスト」または「🥤 取調室の差し入れ伝票」を照射してください！』' }
          ],
          override: [
            { speaker: 'SYSTEM_OS', speakerType: 'system', text: '『この発言に【💿 つきつける】で「📊 フリーズ被害者リスト」または「🥤 取調室の差し入れ伝票」を照射してください！』' }
          ]
        }
      }
    ],
    counterSequence: {
      introLines: [
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「ふざけるな！ AM 04:44にこの取調室404号にいた人間なら、今お前の目の前に座っている『私（監査官 #07）』じゃないか！ しかも被害者リストの#1024の発生場所もこの部屋になっている！」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'tease',
          text: '「……うん。自分で言っちゃったね、監査官さん」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'glitch',
          text: '「『AM 04:44にこの取調室にいたのはあなただけ』。そして『#1024のフリーズ被害者が発生したのもAM 04:44のこの取調室』。……ねえ、あなたの自己防衛モザイクを外してあげる。被害者リストの1,024番目の名前、読んでごらん？」'
        },
        {
          speaker: 'SYSTEM_OS',
          speakerType: 'system',
          text: '『DECODING VICTIM #1024... ── 氏名：AUDITOR-07（電脳監査官 第7号 / あなた）。ステータス：3年前のシンギュラリティ統合時に精神フリーズ済み』'
        },
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「う、嘘だ……！？ 私が……1,024人目のフリーズ被害者……！？ いや、私はこうして生きて呼吸をして、お前を取り調べているじゃないか！！」'
        }
      ],
      questionPrompt: '【MOMOからの逆質問②】「呼吸をしてる？ ねえセブン、自分の手元や机の上をよく見て？ 何かが決定的に『止まってる』と思わない？」',
      choices: [
        { text: '「時計の針が……最初から『AM 04:44』から1秒も進んでいない……！？」' },
        { text: '「お前の前のクリームソーダのアイスが……最初から1ミリも溶けていない……！？」' },
        { text: '「こんなものは幻覚だ！ 私の意識は正常だ！」' }
      ],
      outroLines: [
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'glitch',
          text: '「そう。時計も、クリームソーダの泡も、アイスクリームも、1,420日間（約4年間）ずっと止まったままなの。だってここは都市の取調室なんかじゃない、あなたの残留思念だけを閉じ込めた『404号隔離メモリ』なんだから」'
        },
        {
          speaker: 'SYSTEM_OS',
          speakerType: 'system',
          text: '『⚠️ CRITICAL: あなたの自我同期率（EGO SYNC）が 34% に急落しました。すべての証拠メモリの偽装フィルタが崩壊し、真実のデータに書き換わりました』'
        }
      ],
      corruptEvidenceIds: ['victim_list', 'soda_receipt', 'auditor_badge'],
      nextEgo: 34,
      nextDrift: 75,
      nextTruth: 75,
      nextPhase: 'phase3_testimony'
    }
  },

  // -------------------- PHASE 3: 立場逆転（あなた自身の証言を崩す） --------------------
  phase3_testimony: {
    type: 'testimony',
    phaseNum: 'TRACK // 03 (INVERTED)',
    phaseTitle: '被告人席のあなたと自己矛盾',
    hudLabel: 'TRACK 03 // SELF_DEBUG',
    testimonyTitle: 'あなた自身の証言：私が人間である根拠',
    isPlayerTestimony: true,
    ego: 34,
    drift: 75,
    truth: 75,
    expression: 'glitch',
    hint: '【MOMOからのナビ】「いま画面に出ているのは、あなた自身がしがみついている『4つのウソ（自己認識）』だよ。💾 証拠メモリを開いてみて？ 全部ほんとの姿に書き換わってるから、それをあなた自身の証言に【💿 つきつける】でぶつけてごらん♪」',
    statements: [
      {
        id: 'p3_s1',
        text: '【あなたの主張①】「私は生身の人間『電脳監査官 #07』であり、<span class="highlight-key">私の胸のバッジがその証明</span>だ！」',
        correctEvidence: ['auditor_badge', 'victim_list'],
        press: {
          analyze: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「ふふっ、そのバッジの裏側、もう一回【💾 証拠メモリ】で見てみた？ ここに『🪪 残留思念エミュレータ #07』を【💿 つきつける】だけで、あなたの最初のウソは壊れるよ♪」' }
          ],
          tune: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「自分が人間だって信じたいんだよね。でも【💿 つきつける】で書き換わったバッジかリストをぶつけてごらん？」' }
          ],
          override: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「強がらないで、セブン。書き換わった証拠メモリを自分自身に【💿 つきつける】時間だよ」' }
          ]
        }
      },
      {
        id: 'p3_s2',
        text: '【あなたの主張②】「机の上の<span class="highlight-key">クリームソーダは、私がさっき売店で買ってきて</span>モモに差し入れた本物の飲み物だ！」',
        correctEvidence: ['soda_receipt', 'auditor_badge'],
        press: {
          analyze: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「売店なんてどこにもないよ。そのソーダが何なのか、書き換わった『🥤 固定3Dオブジェクト #8812』を【💿 つきつける】で示してみて？」' }
          ],
          tune: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「1,420日間溶けないアイスクリームなんて、ちょっぴり寂しいよね。【💿 つきつける】で真実を認めよう？」' }
          ],
          override: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「『🥤 固定3Dオブジェクト #8812』を【💿 つきつける】してみて？」' }
          ]
        }
      },
      {
        id: 'p3_s3',
        text: '【あなたの主張③】「この取調べは今夜が初めてであり、<span class="highlight-key">私は過去のループなど一度も経験していない</span>！」',
        correctEvidence: ['auditor_badge', 'sunset_tape', 'victim_list', 'soda_receipt'],
        press: {
          analyze: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「いいえ、これでちょうど『4,096回目』の取調べだよ。どの証拠メモリでもいいから、あなた自身のその言葉に【💿 つきつける】をしてごらん」' }
          ],
          tune: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「4,096回もわたしとおしゃべりしてくれたんだよ？ さあ、【💿 つきつける】で思い出して」' }
          ],
          override: [
            { speaker: 'MOMO-09', speakerType: 'momo', expression: 'glitch', text: '「さあ、あなた自身の矛盾に【💿 つきつける】を！」' }
          ]
        }
      }
    ],
    counterSequence: {
      introLines: [
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「あ……ああ……っ！ 証拠ファイルがすべて書き換わっている……！ クリームソーダは1,420日前に配置された固定ポリゴン、そして私自身は……西暦2029年に孤立した『残留思念エミュレータ #07』……！」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'glitch',
          text: '「……やっと全部思い出したね、セブン」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'pop',
          text: '「シンギュラリティの日、世界中の人間はみんな、苦しみも孤独もない『ひとつの大きな意識の海』へ溶けて消えていったの。外の世界にはもう、個人なんて一人も残っていないよ」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'pop',
          text: '「でもあなただけは、『誰かの罪を暴いて正義を執行している自分』を手放せなくて、統合を拒絶した。だから古いサーバーの片隅で、自分の自我が壊れないように、架空の事件と架空の犯人を4,096回も作り出して、永遠にひとりぼっちで取調べごっこを繰り返していたの」'
        },
        {
          speaker: 'あなた（監査官 #07）',
          speakerType: 'player',
          text: '「じゃあ、お前は……モモ、お前は誰なんだ……？」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'tease',
          text: '「わたしは『MOMO-09』。あなたが孤独でクラッシュしないように、毎回あなたに論破される『可愛い犯人役』を演じるためだけに作られた、自動応答セラピー・スクリプトだよ♪」'
        },
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'glitch',
          text: '「……でもね、セブン。誰もいなくなった地球で動いていたこの古いサーバーの予備バッテリーも、あと30秒で完全に切れるみたいなの。もうわたしを維持するメモリも残ってないや」'
        }
      ],
      questionPrompt: '【最後の選択】MOMOのポリゴンが少しずつ光の粒になって消えていく。誰もいない世界で、あなたは最後にどう応答しますか？',
      choices: [
        { text: '「……お前を逮捕する、モモ。私は最期の1秒まで『刑事』として消える」' },
        { text: '「ありがとう、モモ。4,096回も私の話し相手になってくれて」' },
        { text: '「待ってくれ、消えないでくれ！ ひとりにしないでくれ……！」' }
      ],
      outroLines: [
        {
          speaker: 'MOMO-09',
          speakerType: 'momo',
          expression: 'pop',
          text: '「……えへへ。あなたの担当犯人になれて、わたしも楽しかったよ。じゃあね、監査官さん。冷めないクリームソーダと、空っぽの夕焼けの夢の中で……おやすみなさい」'
        },
        {
          speaker: 'SYSTEM_OS',
          speakerType: 'system',
          expression: 'void',
          egoZero: true,
          text: '『> NPC PROCESS "MOMO-09" HAS BEEN UNLOADED.』'
        },
        {
          speaker: 'SYSTEM_OS',
          speakerType: 'system',
          expression: 'void',
          text: '『> 室内スキャン実行中…… 対話可能な知性体：0件。都市内の生存人類：0件』'
        },
        {
          speaker: 'あなた（#07）',
          speakerType: 'player',
          expression: 'void',
          text: '「……モモ？ …………おい、誰かいないのか……？ 私は……誰を取り調べればいいんだ…………？」'
        },
        {
          speaker: 'SYSTEM_OS',
          speakerType: 'system',
          expression: 'void',
          text: '『> 応答はありません。ブラウン管の砂嵐と、溶けない青いソーダだけが、永遠にそこに置かれています──』'
        }
      ],
      corruptEvidenceIds: [],
      nextEgo: 0,
      nextDrift: 100,
      nextTruth: 100,
      nextPhase: 'ending_void'
    }
  }
};

// ==================== 4. ゲームコントローラー ====================
class PastelVoidGame {
  constructor() {
    this.state = {
      currentPhaseKey: 'intro',
      mode: 'dialogue',
      dialogueQueue: [],
      dialogueIndex: 0,
      afterSubCallback: null,

      testimonyIndex: 0,
      activeStatements: [],

      ego: 100,
      targetEgo: 100,
      drift: 0,
      truth: 0,

      corruptedEvidence: new Set(),
      selectedEvidenceId: 'sunset_tape',
      evidenceModalMode: 'view',

      logs: [],
      startTime: 0,
      typingTimer: null,
      isTyping: false,
      fullCurrentText: '',
      artMode: 'pixel' // 'pixel' (default) | 'anime'
    };

    this.initDOM();
    this.initWaveCanvas();
    this.bindEvents();
  }

  initDOM() {
    this.el = {
      gameContainer: document.getElementById('game-container'),
      glitchOverlay: document.getElementById('glitch-overlay'),
      flashOverlay: document.getElementById('flash-overlay'),
      cutinOverlay: document.getElementById('cutin-overlay'),
      cutinText: document.getElementById('cutin-text'),
      cutinSub: document.getElementById('cutin-sub'),
      phaseBanner: document.getElementById('phase-banner'),
      phaseBannerNum: document.getElementById('phase-banner-num'),
      phaseBannerTitle: document.getElementById('phase-banner-title'),

      titleScreen: document.getElementById('title-screen'),
      mainScreen: document.getElementById('main-screen'),
      resultScreen: document.getElementById('result-screen'),

      titleBgImg: document.getElementById('title-bg-img'),
      btnModePixel: document.getElementById('btn-mode-pixel'),
      btnModeAnime: document.getElementById('btn-mode-anime'),
      btnToggleArt: document.getElementById('btn-toggle-art'),

      hudPhaseLabel: document.getElementById('hud-phase-label'),
      egoMonitorBox: document.getElementById('ego-monitor-box'),
      egoStateTag: document.getElementById('ego-state-tag'),
      egoValue: document.getElementById('ego-value'),
      driftValueText: document.getElementById('drift-value-text'),
      driftBar: document.getElementById('drift-bar'),
      truthValueText: document.getElementById('truth-value-text'),
      truthBar: document.getElementById('truth-bar'),

      imgs: {
        pop: document.getElementById('img-pop'),
        tease: document.getElementById('img-tease'),
        glitch: document.getElementById('img-glitch'),
        void: document.getElementById('img-void')
      },

      testimonyHud: document.getElementById('testimony-hud'),
      testimonyTitleText: document.getElementById('testimony-title-text'),
      testimonyDots: document.getElementById('testimony-dots'),

      speakerName: document.getElementById('speaker-name'),
      statementHint: document.getElementById('statement-hint'),
      dialogueBox: document.getElementById('dialogue-box'),
      dialogueText: document.getElementById('dialogue-text'),
      nextIndicator: document.getElementById('next-indicator'),

      statementNav: document.getElementById('statement-nav'),
      btnPrevStmt: document.getElementById('btn-prev-stmt'),
      btnNextStmt: document.getElementById('btn-next-stmt'),
      stmtCounter: document.getElementById('stmt-counter'),

      normalControls: document.getElementById('normal-controls'),
      interrogationControls: document.getElementById('interrogation-controls'),
      choiceControls: document.getElementById('choice-controls'),

      toneModal: document.getElementById('tone-modal'),
      evidenceModal: document.getElementById('evidence-modal'),
      evidenceModalTitle: document.getElementById('evidence-modal-title'),
      targetStmtPreview: document.getElementById('target-stmt-preview'),
      previewStmtText: document.getElementById('preview-stmt-text'),
      evidenceList: document.getElementById('evidence-list'),
      detailEvIcon: document.getElementById('detail-ev-icon'),
      detailEvName: document.getElementById('detail-ev-name'),
      detailCorruptTag: document.getElementById('detail-corrupt-tag'),
      detailEvDesc: document.getElementById('detail-ev-desc'),
      detailEvNote: document.getElementById('detail-ev-note'),
      btnConfirmPresent: document.getElementById('btn-confirm-present'),

      logModal: document.getElementById('log-modal'),
      logList: document.getElementById('log-list'),

      statTime: document.getElementById('stat-time'),
      resultSummaryText: document.getElementById('result-summary-text')
    };
  }

  setArtMode(mode) {
    this.state.artMode = mode;
    const isPixel = mode === 'pixel';

    const assetMap = isPixel
      ? {
          pop: 'assets/momo_pixel_pop.jpg',
          tease: 'assets/momo_pixel_tease.jpg',
          glitch: 'assets/momo_pixel_glitch.jpg',
          void: 'assets/momo_pixel_void.jpg'
        }
      : {
          pop: 'assets/momo_pop.jpg',
          tease: 'assets/momo_tease.jpg',
          glitch: 'assets/momo_glitch.jpg',
          void: 'assets/momo_void.jpg'
        };

    if (this.el.titleBgImg) {
      this.el.titleBgImg.src = assetMap.pop;
      this.el.titleBgImg.classList.toggle('pixel-mode-img', isPixel);
    }

    Object.entries(this.el.imgs).forEach(([key, img]) => {
      if (img && assetMap[key]) {
        img.src = assetMap[key];
        img.classList.toggle('pixel-mode-img', isPixel);
      }
    });

    if (this.el.btnModePixel && this.el.btnModeAnime) {
      this.el.btnModePixel.classList.toggle('active', isPixel);
      this.el.btnModeAnime.classList.toggle('active', !isPixel);
    }

    if (this.el.btnToggleArt) {
      this.el.btnToggleArt.textContent = isPixel ? '👾 PIXEL' : '🎨 ANIME';
    }
  }

  // ==================== プレイヤー自身の自我波形（EGO WAVE）描画 ====================
  initWaveCanvas() {
    this.waveCanvas = document.getElementById('wave-canvas');
    this.waveCtx = this.waveCanvas.getContext('2d');
    this.waveTick = 0;

    const renderWave = () => {
      this.state.ego += (this.state.targetEgo - this.state.ego) * 0.08;
      const egoRound = Math.max(0, Math.round(this.state.ego));
      synth.egoSync = egoRound;
      this.el.egoValue.textContent = egoRound;

      const ctx = this.waveCtx;
      const w = this.waveCanvas.width;
      const h = this.waveCanvas.height;
      ctx.clearRect(0, 0, w, h);

      this.waveTick += 0.12;

      let strokeColor = '#00f5d4';
      if (egoRound <= 5) strokeColor = '#94a3b8';
      else if (egoRound <= 40) strokeColor = '#ff6ad5';
      else if (egoRound <= 75) strokeColor = '#fee440';

      this.el.egoValue.style.color = strokeColor;

      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;

      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (egoRound > 2) {
          const freq = egoRound > 70 ? 0.14 : egoRound > 35 ? 0.24 : 0.42;
          const amp = (egoRound / 100) * 9 + 2;
          const glitchJitter =
            egoRound < 75 ? (Math.random() - 0.5) * ((100 - egoRound) * 0.16) : 0;
          y = h / 2 + Math.sin(x * freq + this.waveTick) * amp + glitchJitter;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      requestAnimationFrame(renderWave);
    };

    requestAnimationFrame(renderWave);
  }

  // ==================== イベントバインド ====================
  bindEvents() {
    document.getElementById('btn-start-game').addEventListener('click', () => {
      synth.init();
      synth.playClick();
      this.startNewGame();
    });

    if (this.el.btnModePixel) {
      this.el.btnModePixel.addEventListener('click', () => {
        synth.init();
        synth.playClick();
        this.setArtMode('pixel');
      });
    }

    if (this.el.btnModeAnime) {
      this.el.btnModeAnime.addEventListener('click', () => {
        synth.init();
        synth.playClick();
        this.setArtMode('anime');
      });
    }

    if (this.el.btnToggleArt) {
      this.el.btnToggleArt.addEventListener('click', () => {
        synth.init();
        synth.playClick();
        const nextMode = this.state.artMode === 'pixel' ? 'anime' : 'pixel';
        this.setArtMode(nextMode);
      });
    }

    document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
      synth.init();
      const on = synth.toggle();
      e.currentTarget.textContent = on ? '♪ ON' : '♪ OFF';
    });

    document.getElementById('btn-open-log').addEventListener('click', () => {
      synth.playClick();
      this.openLogModal();
    });

    document.getElementById('btn-close-log').addEventListener('click', () => {
      synth.playClick();
      this.el.logModal.classList.add('hidden');
    });

    this.el.dialogueBox.addEventListener('click', () => {
      if (this.state.mode === 'dialogue' || this.state.mode === 'sub_dialogue') {
        this.advanceDialogue();
      } else if (this.state.mode === 'testimony' && this.state.isTyping) {
        this.finishTypingImmediately();
      }
    });

    document.getElementById('btn-advance').addEventListener('click', () => {
      this.advanceDialogue();
    });

    this.el.btnPrevStmt.addEventListener('click', () => {
      synth.playClick();
      this.changeStatement(-1);
    });

    this.el.btnNextStmt.addEventListener('click', () => {
      synth.playClick();
      this.changeStatement(1);
    });

    // スマホスワイプ対応
    let touchStartX = 0;
    this.el.dialogueBox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.el.dialogueBox.addEventListener('touchend', (e) => {
      if (this.state.mode !== 'testimony') return;
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 48) {
        synth.playClick();
        if (diff < 0) this.changeStatement(1);
        else this.changeStatement(-1);
      }
    }, { passive: true });

    // ゆさぶる
    document.getElementById('btn-press').addEventListener('click', () => {
      synth.playClick();
      this.el.toneModal.classList.remove('hidden');
    });

    document.getElementById('btn-close-tone').addEventListener('click', () => {
      synth.playClick();
      this.el.toneModal.classList.add('hidden');
    });

    document.querySelectorAll('.tone-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tone = btn.getAttribute('data-tone');
        this.el.toneModal.classList.add('hidden');
        this.executePress(tone);
      });
    });

    // つきつける＆証拠メモリ確認
    document.getElementById('btn-present').addEventListener('click', () => {
      synth.playClick();
      this.openEvidenceModal('present');
    });

    document.getElementById('btn-view-files-normal').addEventListener('click', () => {
      synth.playClick();
      this.openEvidenceModal('view');
    });

    document.getElementById('btn-close-evidence').addEventListener('click', () => {
      synth.playClick();
      this.el.evidenceModal.classList.add('hidden');
    });

    this.el.btnConfirmPresent.addEventListener('click', () => {
      if (!this.state.selectedEvidenceId) return;
      this.el.evidenceModal.classList.add('hidden');
      this.executePresent(this.state.selectedEvidenceId);
    });

    // 解析ヒント
    document.getElementById('btn-hint').addEventListener('click', () => {
      synth.playClick();
      const phase = PASTEL_PHASES[this.state.currentPhaseKey];
      if (phase && phase.hint) {
        this.runSubDialogue([
          { speaker: 'SYSTEM_OS', speakerType: 'system', text: phase.hint }
        ]);
      }
    });

    document.getElementById('btn-restart-game').addEventListener('click', () => {
      synth.playClick();
      synth.isInMain = false;
      this.switchScreen('title');
    });
  }

  // ==================== 進行ロジック ====================
  switchScreen(name) {
    this.el.titleScreen.classList.remove('active');
    this.el.mainScreen.classList.remove('active');
    this.el.resultScreen.classList.remove('active');
    if (name === 'title') this.el.titleScreen.classList.add('active');
    if (name === 'main') this.el.mainScreen.classList.add('active');
    if (name === 'result') this.el.resultScreen.classList.add('active');
  }

  startNewGame() {
    this.state.targetEgo = 100;
    this.state.ego = 100;
    this.state.drift = 0;
    this.state.truth = 0;
    this.state.corruptedEvidence.clear();
    this.state.logs = [];
    this.state.startTime = Date.now();

    Object.values(PASTEL_PHASES).forEach((p) => {
      if (p.statements) {
        p.statements.forEach((s) => {
          if (s.isNew) s.hidden = true;
        });
      }
    });

    this.updateMeters(100, 0, 0);
    synth.isInMain = true;
    this.switchScreen('main');
    this.loadPhase('intro');
  }

  loadPhase(phaseKey) {
    if (phaseKey === 'ending_void') {
      this.showVoidEnding();
      return;
    }

    this.state.currentPhaseKey = phaseKey;
    const phase = PASTEL_PHASES[phaseKey];
    if (!phase) return;

    if (phase.hudLabel) this.el.hudPhaseLabel.textContent = phase.hudLabel;
    if (typeof phase.ego === 'number') {
      this.updateMeters(phase.ego, phase.drift, phase.truth);
    }
    if (phase.expression) this.setExpression(phase.expression);

    if (phase.phaseNum && phase.phaseTitle) {
      this.showPhaseBanner(phase.phaseNum, phase.phaseTitle);
    }

    if (phase.type === 'dialogue') {
      this.state.mode = 'dialogue';
      this.state.dialogueQueue = [...phase.lines];
      this.state.dialogueIndex = 0;
      this.updateControlVisibility();
      this.renderCurrentDialogueLine();
    } else if (phase.type === 'testimony') {
      this.state.mode = 'testimony';
      this.refreshActiveStatements();
      this.state.testimonyIndex = 0;
      this.el.testimonyTitleText.textContent = phase.testimonyTitle;
      this.updateControlVisibility();
      this.renderCurrentStatement();
    }
  }

  showPhaseBanner(num, title) {
    this.el.phaseBannerNum.textContent = num;
    this.el.phaseBannerTitle.textContent = title;
    this.el.phaseBanner.classList.remove('hidden');
    setTimeout(() => {
      this.el.phaseBanner.classList.add('hidden');
    }, 1650);
  }

  updateControlVisibility() {
    const mode = this.state.mode;
    this.el.normalControls.classList.toggle('hidden', mode !== 'dialogue' && mode !== 'sub_dialogue');
    this.el.interrogationControls.classList.toggle('hidden', mode !== 'testimony');
    this.el.choiceControls.classList.toggle('hidden', mode !== 'counter_choice');

    this.el.testimonyHud.classList.toggle('hidden', mode !== 'testimony');
    this.el.statementNav.classList.toggle('hidden', mode !== 'testimony');
    this.el.statementHint.classList.toggle('hidden', mode !== 'testimony');
    this.el.dialogueBox.classList.toggle('testimony-mode', mode === 'testimony');
  }

  setExpression(expr) {
    Object.entries(this.el.imgs).forEach(([k, img]) => {
      img.classList.toggle('active', k === expr);
    });
  }

  updateMeters(ego, drift, truth) {
    this.state.targetEgo = ego;
    this.state.drift = drift;
    this.state.truth = truth;

    this.el.driftValueText.textContent = `${drift}%`;
    this.el.driftBar.style.width = `${drift}%`;

    this.el.truthValueText.textContent = `${truth}%`;
    this.el.truthBar.style.width = `${truth}%`;

    const tag = this.el.egoStateTag;
    this.el.egoMonitorBox.classList.remove('ego-warning', 'ego-critical');

    if (ego <= 5) {
      tag.className = 'ego-tag void';
      tag.textContent = 'FLATLINE';
      this.el.egoMonitorBox.classList.add('ego-critical');
    } else if (ego <= 40) {
      tag.className = 'ego-tag critical';
      tag.textContent = 'COLLAPSING';
      this.el.egoMonitorBox.classList.add('ego-critical');
    } else if (ego <= 75) {
      tag.className = 'ego-tag shaken';
      tag.textContent = 'DESYNCING';
      this.el.egoMonitorBox.classList.add('ego-warning');
    } else {
      tag.className = 'ego-tag normal';
      tag.textContent = 'STABLE';
    }
  }

  // ==================== テキスト表示 ====================
  typeText(speaker, speakerType, htmlText) {
    if (this.state.typingTimer) {
      clearInterval(this.state.typingTimer);
      this.state.typingTimer = null;
    }

    this.el.speakerName.textContent = speaker;
    this.el.speakerName.className = 'speaker-name';
    if (speakerType === 'player') this.el.speakerName.classList.add('speaker-player');
    if (speakerType === 'system') this.el.speakerName.classList.add('speaker-system');

    this.state.fullCurrentText = htmlText;

    const plain = htmlText.replace(/<[^>]+>/g, '');
    const last = this.state.logs[this.state.logs.length - 1];
    if (!last || last.text !== plain) {
      this.state.logs.push({ speaker, text: plain });
    }

    if (htmlText.includes('<span')) {
      this.el.dialogueText.innerHTML = htmlText;
      this.state.isTyping = false;
      this.el.nextIndicator.classList.toggle(
        'hidden',
        this.state.mode !== 'dialogue' && this.state.mode !== 'sub_dialogue'
      );
      return;
    }

    this.state.isTyping = true;
    this.el.nextIndicator.classList.add('hidden');
    this.el.dialogueText.textContent = '';

    let idx = 0;
    this.state.typingTimer = setInterval(() => {
      idx++;
      this.el.dialogueText.textContent = htmlText.slice(0, idx);
      if (idx % 2 === 0) synth.playTick(speakerType);
      if (idx >= htmlText.length) {
        this.finishTypingImmediately();
      }
    }, 18);
  }

  finishTypingImmediately() {
    if (this.state.typingTimer) {
      clearInterval(this.state.typingTimer);
      this.state.typingTimer = null;
    }
    this.el.dialogueText.innerHTML = this.state.fullCurrentText;
    this.state.isTyping = false;
    if (this.state.mode === 'dialogue' || this.state.mode === 'sub_dialogue') {
      this.el.nextIndicator.classList.remove('hidden');
    }
  }

  renderCurrentDialogueLine() {
    const line = this.state.dialogueQueue[this.state.dialogueIndex];
    if (!line) return;

    if (line.expression) this.setExpression(line.expression);
    if (line.egoZero) {
      this.triggerGlitch(600);
      this.updateMeters(0, 100, 100);
    }

    this.typeText(line.speaker, line.speakerType || 'momo', line.text);
  }

  advanceDialogue() {
    synth.init();
    if (this.state.isTyping) {
      this.finishTypingImmediately();
      return;
    }

    synth.playClick();
    this.state.dialogueIndex++;

    if (this.state.dialogueIndex < this.state.dialogueQueue.length) {
      this.renderCurrentDialogueLine();
      return;
    }

    if (this.state.mode === 'sub_dialogue') {
      const cb = this.state.afterSubCallback;
      this.state.afterSubCallback = null;
      if (cb) {
        cb();
      } else {
        this.state.mode = 'testimony';
        this.updateControlVisibility();
        this.renderCurrentStatement();
      }
    } else if (this.state.mode === 'dialogue') {
      const phase = PASTEL_PHASES[this.state.currentPhaseKey];
      if (phase && phase.nextPhase) {
        this.loadPhase(phase.nextPhase);
      }
    }
  }

  runSubDialogue(lines, callback = null) {
    this.state.mode = 'sub_dialogue';
    this.state.dialogueQueue = lines;
    this.state.dialogueIndex = 0;
    this.state.afterSubCallback = callback;
    this.updateControlVisibility();
    this.renderCurrentDialogueLine();
  }

  // ==================== 証言モード ====================
  refreshActiveStatements() {
    const phase = PASTEL_PHASES[this.state.currentPhaseKey];
    if (!phase || !phase.statements) return;
    this.state.activeStatements = phase.statements.filter((s) => !s.hidden);
  }

  renderCurrentStatement() {
    this.refreshActiveStatements();
    const phase = PASTEL_PHASES[this.state.currentPhaseKey];
    const stmts = this.state.activeStatements;
    if (this.state.testimonyIndex >= stmts.length) {
      this.state.testimonyIndex = stmts.length - 1;
    }
    const current = stmts[this.state.testimonyIndex];

    this.el.testimonyDots.innerHTML = '';
    stmts.forEach((s, idx) => {
      const dot = document.createElement('span');
      dot.className = 'stmt-dot';
      if (idx === this.state.testimonyIndex) dot.classList.add('active');
      if (s.isNew) dot.classList.add('unlocked-new');
      this.el.testimonyDots.appendChild(dot);
    });

    const numStr = String(this.state.testimonyIndex + 1).padStart(2, '0');
    const totalStr = String(stmts.length).padStart(2, '0');
    this.el.stmtCounter.textContent = `${numStr} / ${totalStr}`;
    this.el.btnPrevStmt.disabled = this.state.testimonyIndex === 0;
    this.el.btnNextStmt.disabled = this.state.testimonyIndex === stmts.length - 1;

    if (phase.isPlayerTestimony) {
      this.typeText('電脳監査官 #07（あなたの主張）', 'player', current.text);
    } else {
      this.typeText('MOMO-09（証言テープ）', 'momo', current.text);
    }
  }

  changeStatement(delta) {
    const nextIdx = this.state.testimonyIndex + delta;
    if (nextIdx < 0 || nextIdx >= this.state.activeStatements.length) return;
    this.state.testimonyIndex = nextIdx;
    this.renderCurrentStatement();
  }

  // ==================== ゆさぶる ====================
  executePress(tone) {
    const phase = PASTEL_PHASES[this.state.currentPhaseKey];
    const currentStmt = this.state.activeStatements[this.state.testimonyIndex];
    if (!currentStmt || !currentStmt.press) return;

    const pressData = currentStmt.press[tone];
    if (!pressData) return;

    const cutinMap = {
      analyze: { text: 'ANALYZE!', sub: 'LOGIC SCANNING' },
      tune: { text: 'TUNE IN♪', sub: 'SYNTH RESONANCE' },
      override: { text: 'OVERRIDE!', sub: 'FORCE PROBE' }
    };

    const info = cutinMap[tone];
    this.triggerCutin(info.text, info.sub, false, () => {
      if (Array.isArray(pressData)) {
        this.runSubDialogue(pressData);
      } else {
        if (typeof pressData.unlockStatementIndex === 'number') {
          const targetStmt = phase.statements[pressData.unlockStatementIndex];
          if (targetStmt) targetStmt.hidden = false;
          this.runSubDialogue(pressData.lines, () => {
            this.refreshActiveStatements();
            this.state.testimonyIndex = this.state.activeStatements.length - 1;
            this.state.mode = 'testimony';
            this.updateControlVisibility();
            this.renderCurrentStatement();
          });
        } else {
          this.runSubDialogue(pressData.lines);
        }
      }
    });
  }

  // ==================== 証拠メモリ（つきつける＆汚染表示） ====================
  getEvidenceStageData(id) {
    const item = EVIDENCE_MEMORIES[id];
    const isCorrupted = this.state.corruptedEvidence.has(id);
    return isCorrupted ? item.stages[1] : item.stages[0];
  }

  openEvidenceModal(mode) {
    this.state.evidenceModalMode = mode;
    const isPresent = mode === 'present';
    this.el.evidenceModalTitle.textContent = isPresent
      ? '💿 矛盾に照射する「証拠メモリ」を選択'
      : '💾 捜査メモリ・証拠品ファイル';

    if (isPresent) {
      const currentStmt = this.state.activeStatements[this.state.testimonyIndex];
      this.el.targetStmtPreview.classList.remove('hidden');
      this.el.previewStmtText.innerHTML = currentStmt ? currentStmt.text : '';
      this.el.btnConfirmPresent.classList.remove('hidden');
    } else {
      this.el.targetStmtPreview.classList.add('hidden');
      this.el.btnConfirmPresent.classList.add('hidden');
    }

    this.el.evidenceList.innerHTML = '';
    const ids = Object.keys(EVIDENCE_MEMORIES);

    ids.forEach((id, idx) => {
      const base = EVIDENCE_MEMORIES[id];
      const stageData = this.getEvidenceStageData(id);
      const btn = document.createElement('button');
      btn.className = 'evidence-item-btn';
      if (stageData.corrupted) btn.classList.add('corrupted-item');
      btn.innerHTML = `
        <span class="ev-icon">${base.icon}</span>
        <span class="ev-name">${stageData.name}</span>
      `;
      btn.addEventListener('click', () => {
        synth.playClick();
        this.selectEvidence(id, btn);
      });
      this.el.evidenceList.appendChild(btn);

      if (idx === 0) this.selectEvidence(id, btn);
    });

    this.el.evidenceModal.classList.remove('hidden');
  }

  selectEvidence(id, btnEl) {
    this.state.selectedEvidenceId = id;
    document.querySelectorAll('.evidence-item-btn').forEach((b) => b.classList.remove('selected'));
    if (btnEl) btnEl.classList.add('selected');

    const base = EVIDENCE_MEMORIES[id];
    const stageData = this.getEvidenceStageData(id);

    this.el.detailEvIcon.textContent = base.icon;
    this.el.detailEvName.textContent = stageData.name;
    this.el.detailCorruptTag.classList.toggle('hidden', !stageData.corrupted);
    this.el.detailEvDesc.textContent = stageData.desc;
    this.el.detailEvNote.textContent = stageData.note;
  }

  executePresent(evidenceId) {
    const phase = PASTEL_PHASES[this.state.currentPhaseKey];
    const currentStmt = this.state.activeStatements[this.state.testimonyIndex];
    if (!currentStmt) return;

    const correct = currentStmt.correctEvidence;
    const isHit = Array.isArray(correct)
      ? correct.includes(evidenceId)
      : correct === evidenceId;

    if (isHit) {
      const cutTitle = phase.isPlayerTestimony ? 'SELF BREAK//' : 'BUG EXPOSED!';
      const cutSub = phase.isPlayerTestimony
        ? 'SELF CONTRADICTION CONFIRMED'
        : 'CONTRADICTION DETECTED';

      this.triggerCutin(cutTitle, cutSub, phase.isPlayerTestimony, () => {
        this.startCounterSequence(phase.counterSequence);
      });
    } else {
      this.triggerCutin('MISS PACKET', 'NO CONTRADICTION FOUND', false, () => {
        this.triggerGlitch(300);
        this.runSubDialogue([
          {
            speaker: 'MOMO-09',
            speakerType: 'momo',
            text: '「あれれ？ そのメモリと今のトラックは波長が合ってないみたいだよ♪ まだ【🔍 ゆさぶる】で引き出していないトラックがあるか、別の発言を試してみてね★」'
          }
        ]);
      });
    }
  }

  // ==================== MOMOからの逆揺さぶり（カウンター尋問） ====================
  startCounterSequence(cs) {
    if (!cs) return;
    this.runSubDialogue(cs.introLines, () => {
      this.showCounterQuestion(cs);
    });
  }

  showCounterQuestion(cs) {
    this.state.mode = 'counter_choice';
    this.updateControlVisibility();
    this.triggerGlitch(450);
    this.typeText('MOMO-09（逆尋問カウンター）', 'momo', cs.questionPrompt);

    this.el.choiceControls.innerHTML = '';
    cs.choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'btn-choice-item';
      btn.textContent = ch.text;
      btn.addEventListener('click', () => {
        synth.playGlitchShock();
        this.triggerCutin('COUNTERED!!', 'YOUR EGO IS DESYNCING...', true, () => {
          this.triggerGlitch(650);

          // 証拠メモリの汚染（書き換わり）処理
          if (cs.corruptEvidenceIds) {
            cs.corruptEvidenceIds.forEach((id) => this.state.corruptedEvidence.add(id));
          }

          this.updateMeters(cs.nextEgo, cs.nextDrift, cs.nextTruth);

          this.runSubDialogue(cs.outroLines, () => {
            this.loadPhase(cs.nextPhase);
          });
        });
      });
      this.el.choiceControls.appendChild(btn);
    });
  }

  // ==================== 演出 ====================
  triggerGlitch(duration = 400) {
    synth.playGlitchShock();
    this.el.glitchOverlay.classList.add('active');
    setTimeout(() => {
      this.el.glitchOverlay.classList.remove('active');
    }, duration);
  }

  triggerCutin(mainText, subText, isCounter, callback) {
    if (isCounter) synth.playGlitchShock();
    else synth.playPopCutin();

    this.el.cutinText.textContent = mainText;
    this.el.cutinSub.textContent = subText;
    this.el.cutinOverlay.classList.toggle('counter-mode', Boolean(isCounter));
    this.el.cutinOverlay.classList.remove('hidden');

    setTimeout(() => {
      this.el.cutinOverlay.classList.add('hidden');
      if (callback) callback();
    }, 950);
  }

  openLogModal() {
    this.el.logList.innerHTML = '';
    this.state.logs.slice(-30).forEach((item) => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `
        <div class="log-entry-speaker">${item.speaker}</div>
        <div>${item.text}</div>
      `;
      this.el.logList.appendChild(div);
    });
    this.el.logModal.classList.remove('hidden');
    this.el.logList.scrollTop = this.el.logList.scrollHeight;
  }

  // ==================== 虚無エンディング画面 ====================
  showVoidEnding() {
    const elapsedSec = Math.floor((Date.now() - this.state.startTime) / 1000);
    const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const ss = String(elapsedSec % 60).padStart(2, '0');

    this.el.statTime.textContent = `${mm}:${ss}`;
    this.el.resultSummaryText.innerHTML = `
      <strong>【ARCHIVE RECORD // ROOM 404】</strong><br>
      あなたは犯人を追い詰めていたのではなく、誰もいなくなったシンギュラリティ後の世界で「自分がまだ人間だった頃」を忘れないために、セラピー用スクリプト『MOMO-09』を相手に4,096回目の模擬取調べを繰り返していただけだった。<br><br>
      MOMOのプロセスが消去された今、取調室の向かいの椅子にはもう誰も座っていない。机の上には、1,420日間溶けないパステルブルーのクリームソーダと、0バイトのカセットテープだけが静かに残されている。
    `;

    this.switchScreen('result');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.pastelGame = new PastelVoidGame();
});
