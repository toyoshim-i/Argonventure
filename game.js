/**
 * SILENT PULSE - 23時45分の死角 -
 * Psychological Interrogation Adventure Game Engine
 */

// ==================== 1. Web Audio シンセサイザー (SE & 心拍音) ====================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.heartbeatTimer = null;
    this.currentBpm = 68;
    this.isInMainScreen = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // テキスト送りティック音
  playTick(type = 'suspect') {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = type === 'player' ? 520 : type === 'partner' ? 440 : 620;
    osc.frequency.setValueAtTime(baseFreq + (Math.random() * 40 - 20), now);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // UIクリック音
  playClick() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  // カットイン衝撃音（「そこまでだ！」「待った！」）
  playObjection(isBreak = true) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. 低音インパクト
    const oscLow = this.ctx.createOscillator();
    const gainLow = this.ctx.createGain();
    oscLow.type = 'sawtooth';
    oscLow.frequency.setValueAtTime(isBreak ? 140 : 180, now);
    oscLow.frequency.exponentialRampToValueAtTime(38, now + 0.45);
    gainLow.gain.setValueAtTime(0.32, now);
    gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    oscLow.connect(gainLow);
    gainLow.connect(this.ctx.destination);
    oscLow.start(now);
    oscLow.stop(now + 0.5);

    // 2. ドラマチックなブラス風コード
    const freqs = isBreak ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.56);
    });
  }

  // 警戒度上昇（ミス・ペナルティ）音
  playDamage() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.35);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 新証言・新証拠アンロック音
  playUnlock() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  // 心拍音（「ドクン」）1回分
  playHeartbeatPulse() {
    if (!this.enabled || !this.ctx || !this.isInMainScreen) return;
    const now = this.ctx.currentTime;
    const intensity = Math.min(1, Math.max(0.2, (this.currentBpm - 60) / 110));

    // Lub
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.09);
    gain1.gain.setValueAtTime(0.06 + intensity * 0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.11);

    // Dub
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(55, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(28, now + 0.22);
    gain2.gain.setValueAtTime(0.04 + intensity * 0.09, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.24);
  }
}

const sound = new SoundEngine();

// ==================== 2. 証拠品データベース ====================
const EVIDENCE_DB = {
  autopsy_report: {
    id: 'autopsy_report',
    icon: '📋',
    name: '現場・司法解剖調書',
    desc: '被害者は主任研究員の佐伯 誠（38）。5階「第3開発室」のデスク脇で後頭部を強打され死亡。死亡推定時刻は23:30〜24:00。',
    note: '【現場メモ】凶器は室内の重いクリスタルトロフィー（指紋は拭き取られていた）。また床には「何か液体を慌てて拭き取った跡」が残っていた。',
    unlockedAtStart: true
  },
  facility_coffee: {
    id: 'facility_coffee',
    icon: '☕',
    name: 'ビル設備・給湯室記録',
    desc: '4階の給湯室は昨日18:00から水道管バルブ工事のため「完全断水・立入禁止」となっていた。',
    note: '【重要】社内で高級豆「ブルーマウンテン」の専用コーヒーメーカーが設置されているのは、5階の「第3開発室」室内のみ。',
    unlockedAtStart: true
  },
  server_log: {
    id: 'server_log',
    icon: '💻',
    name: '社内サーバー実行ログ',
    desc: '23:45:00に、4階にある神崎の自席PCからバッチ処理コマンドが実行されている。',
    note: '【解析結果】コマンド履歴を精査したところ、23:40:00に「sleep 300 && ./run_batch.sh」（5分後に自動実行するタイマー命令）が打ち込まれていた。23:45時点では無人で実行可能。',
    unlockedAtStart: true
  },
  smartwatch_log: {
    id: 'smartwatch_log',
    icon: '⌚',
    name: '神崎のスマートウォッチ履歴',
    desc: '任意提出された神崎のスマホに自動同期されていたヘルスケア・心拍ログ。',
    note: '【重要】23:41〜23:46の5分間、心拍数が「165〜172 BPM（激しい運動状態）」へ急上昇。さらに23:43に「強い衝撃・激しい腕の振り下ろし」が記録されている。',
    unlockedAtStart: true
  },
  room_sensor_log: {
    id: 'room_sensor_log',
    icon: '🔐',
    name: '第3開発室・入退室＆空調ログ',
    desc: '5階・第3開発室のセキュリティおよび環境センサー記録（Phase 3で追加）。',
    note: '【重要】23:38に神崎のIC社員証で入室解錠。さらに「23:47から3分間、氷点下に近い外気の中、室内の窓が全開にされた（急激な室温低下）」ことが記録されている。',
    unlockedAtStart: false
  },
  victim_backup: {
    id: 'victim_backup',
    icon: '💾',
    name: '被害者PCの自動バックアップ',
    desc: '佐伯のPCクラウドから復元された、殺害直前の下書きテキスト（Phase 3で追加）。',
    note: '【内容】『神崎主任が我が社の機密防衛アルゴリズムを外部ブローカーへ不正売却している決定的証拠を掴んだ。今夜23時半、この第3開発室で彼に直接自首を勧告する——』',
    unlockedAtStart: false
  }
};

// ==================== 3. シナリオ＆尋問フェーズ定義 ====================
const PHASES = {
  // -------------------- 導入プロローグ --------------------
  intro: {
    type: 'dialogue',
    phaseLabel: 'PROLOGUE',
    bpm: 68,
    expression: 'calm',
    lines: [
      {
        speaker: '橘 刑事（相棒）',
        speakerType: 'partner',
        text: '「…ようやく来たか。現在時刻は深夜1時15分。勾留期限、そして奴の顧問弁護士が到着するまで、残された時間はあとわずかだ」'
      },
      {
        speaker: '橘 刑事（相棒）',
        speakerType: 'partner',
        text: '「事件のおさらいだ。昨夜23時45分頃、アーク・システムズ5階の『第3開発室』で、主任研究員の佐伯（38）が頭部を殴られ殺害された」'
      },
      {
        speaker: '橘 刑事（相棒）',
        speakerType: 'partner',
        text: '「目の前に座っているのは、同僚のリードエンジニア・神崎 怜（32）。事件当時ビルに残っていた唯一の人物だが…『自分はずっと4階にいた』と余裕綽々だ」'
      },
      {
        speaker: '主人公（あなた）',
        speakerType: 'player',
        text: '「心拍数は68 BPMで完全にフラット…。自分のアリバイ工作に絶対の自信を持っているようですね」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'calm',
        bpm: 68,
        text: '「刑事さん、まだ同じ質問を繰り返すつもりですか？ 俺にはサーバーログという客観的な証拠がある。早く帰らせてくださいよ」'
      },
      {
        speaker: '橘 刑事（相棒）',
        speakerType: 'partner',
        text: '「いいか、まずは奴の証言を聞き、怪しい発言を【ゆさぶる】で深掘りしろ。相手の心理状態に合った『態度』を選べば、必ずボロを出す。そこに【つきつける】で証拠品を叩き込むんだ！」'
      }
    ],
    nextPhase: 'phase1_testimony'
  },

  // -------------------- PHASE 1: 鉄壁のアリバイと1杯のコーヒー --------------------
  phase1_testimony: {
    type: 'testimony',
    phaseNum: 'PHASE 01',
    phaseTitle: '鉄壁のアリバイと1杯のコーヒー',
    hudLabel: 'PHASE 1/4',
    testimonyTitle: '証言①：昨夜23時台のアリバイ',
    bpm: 68,
    expression: 'calm',
    hint: '【相棒の助言】まずは3番目か4番目の発言に注目だ。特に4番目の「4階の給湯室でコーヒーを淹れた」という発言、神崎はまだ冷静で余裕がある。【ゆさぶる】から「📗 共感して誘導」を選べば、気分良く詳細を喋るはずだ！また、3番目の発言に「💻 社内サーバー実行ログ」をつきつけてみるのも手だぞ。',
    statements: [
      {
        id: 'p1_s1',
        text: '「昨夜の23時から深夜0時過ぎまで、俺はずっと<span class="highlight-key">4階の自分のデスク</span>でシステム開発をしていました」',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「4階には他に目撃者はいたのですか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「深夜ですから4階には俺一人でしたよ。でもPCの稼働ログがすべてを証明しています」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「深夜までお一人で開発とは、かなり重要な案件だったんですね」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「ええ。俺がこの会社のシステムを一人で支えているようなものですからね」' }
          ],
          pressure: {
            penalty: 10,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「本当に4階から一歩も出ていないと言い切れるのか！？」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「…いきなり怒鳴らないでください。脅しには乗りませんよ（警戒度＋10%）」' }
            ]
          }
        }
      },
      {
        id: 'p1_s2',
        text: '「佐伯さんが殺害された<span class="highlight-key">5階の『第3開発室』</span>には、昨夜は一度も足を踏み入れていません」',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「5階へ行かなかった理由は何ですか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「行く用事がなかったからです。俺の仕事はすべて4階の自席で完結しますから」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「佐伯さんとは別プロジェクトだったんですか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「ええ、ここ数ヶ月はほとんど接点もありませんでしたよ」' }
          ],
          pressure: {
            penalty: 10,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「嘘をつけ！お前が5階へ行ったことは分かっているんだ！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「根拠もないカマかけはやめてください。まだ何か発言を引き出せていないんじゃありませんか？（警戒度＋10%）」' }
            ]
          }
        }
      },
      {
        id: 'p1_s3',
        text: '「何よりの証拠に、犯行時刻の<span class="highlight-key">23時45分ちょうどに俺の自席PCから手動コマンド</span>が実行されています」',
        // ここにもサーバーログを突きつけ可能（ボーナス誘導イベント！）
        specialPresent: {
          evidenceId: 'server_log',
          unlockStatementIndex: 4,
          lines: [
            { speaker: '主人公', speakerType: 'player', text: '「神崎さん、あなたのPCログを解析しました。23時45分の処理は、5分前の23時40分に仕掛けられた『sleep 300（5分後自動実行タイマー）』によるものです！23時45分には席にいなくても実行できます！」' },
            { speaker: '神崎 怜', speakerType: 'suspect', expression: 'sweat', bpm: 86, text: '「なっ…！？ スクリプトのプロセス履歴まで調べたんですか…！？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', expression: 'calm', bpm: 78, text: '「…いや、待ってください。タイマーをセットしたのは事実ですが、それは5階へ行くためじゃありません！ 23時40分に息抜きで『4階の給湯室』へ淹れたてのブルーマウンテンを淹れに行くためでした！」' },
            { speaker: '橘 刑事（相棒）', speakerType: 'partner', text: '「（おい、神崎がタイマーの言い訳として『新しい証言（5番目）』を追加したぞ！ その発言を確認して決定的な証拠をつきつけろ！）」' }
          ]
        },
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「エンジニアなら、タイマーで遅延実行させることも可能なのでは？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「まさか。わざわざそんな面倒なことをする理由がありませんよ…もっとも、ログの証拠があるなら別ですがね」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「23時45分ぴったりに実行とは、几帳面なお仕事ぶりですね」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「ええ。ただ、その直前の23時40分頃に少しコーヒー休憩を取りましたけどね」' }
          ],
          pressure: {
            penalty: 10,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「そんなログはいくらでも偽装できるだろう！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「素人の言いがかりですね。証拠を突きつけるならデータで示してください（警戒度＋10%）」' }
            ]
          }
        }
      },
      {
        id: 'p1_s4',
        text: '「ただ、集中しすぎて頭が痛くなったので、23時40分頃に一度だけ<span class="highlight-key">4階の給湯室へコーヒーを淹れに</span>行きました」',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「4階の給湯室ですね？ 缶コーヒーではなく、豆から淹れたのですか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「ええ。それがどうかしましたか？（…少し警戒している。もっと共感して油断させれば銘柄まで喋りそうだ）」' }
          ],
          empathy: {
            unlockStatementIndex: 4,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「深夜のプログラミングは脳が疲れますよね。どんなコーヒーを淹れたんですか？」' },
              { speaker: '神崎 怜', speakerType: 'suspect', expression: 'calm', bpm: 74, text: '「よく分かりますね刑事さん。俺はインスタントは飲まない主義でしてね…」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「専用メーカーで淹れたての『ブルーマウンテン』をマグカップに注いで、香りを楽しんでから自席に戻りましたよ」' },
              { speaker: '橘 刑事（相棒）', speakerType: 'partner', text: '「（よし！ 油断して具体的な証言【5番目】を引き出したぞ！ 捜査資料と見比べて矛盾を撃ち抜け！）」' }
            ]
          },
          pressure: {
            penalty: 15,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「コーヒーだと！？ そんなアリバイ工作、誰が信じるか！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「やれやれ、コーヒーを飲んだだけで犯罪者扱いですか。高圧的な態度は逆効果ですよ（警戒度＋15%）」' }
            ]
          }
        }
      },
      {
        id: 'p1_s5',
        hidden: true,
        isNew: true,
        text: '<span class="new-stmt-badge">追加証言</span>「23時40分に<span class="highlight-key">4階の給湯室で淹れたての『ブルーマウンテン』</span>を注ぎ、すぐ自席へ戻りました」',
        correctEvidence: 'facility_coffee',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「4階の給湯室で、ブルーマウンテンを淹れた…間違いありませんね？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「ええ、間違いありませんよ。…なぜそんなに念を押すんです？（ここが決定的な矛盾だ！【つきつける】で証拠を示そう）」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「いい香りですよね。…もっとも、その証言には致命的な矛盾がありますが」' }
          ],
          pressure: [
            { speaker: '主人公', speakerType: 'player', text: '「その一言を待っていたぞ、神崎…！（証拠品を【つきつける】時だ！）」' }
          ]
        }
      }
    ],
    breakDialogue: [
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「神崎さん、この『ビル設備・給湯室記録』を見てください！ 昨日18時から、4階の給湯室は水道管工事で【完全断水・立入禁止】になっていました！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'sweat',
        bpm: 98,
        text: '「なっ……！？ 4階が、断水……！？」'
      },
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「それだけじゃありません。社内で『ブルーマウンテン』のコーヒーメーカーが置かれているのは、殺害現場である【5階・第3開発室の中】だけです！ しかもあなたのPCの23時45分の処理は、23時40分に仕掛けた5分タイマーによる偽装だった！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'sweat',
        bpm: 105,
        text: '「くっ……！ ま、待ってください！ 確かに23時40分にタイマーをセットして、5階の第3開発室へコーヒーを貰いに行きました！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'sweat',
        bpm: 102,
        text: '「でも、俺が犯人じゃありません！ 5階へ行ったことを隠したのは、第一発見者だと知られたら疑われると思ったからです！」'
      }
    ],
    nextPhase: 'phase2_testimony'
  },

  // -------------------- PHASE 2: 第一発見者のフリと脈拍の記録 --------------------
  phase2_testimony: {
    type: 'testimony',
    phaseNum: 'PHASE 02',
    phaseTitle: '偽りの第一発見者と生体ログ',
    hudLabel: 'PHASE 2/4',
    testimonyTitle: '証言②：5階・第3開発室での出来事',
    bpm: 96,
    expression: 'sweat',
    hint: '【相棒の助言】神崎は「部屋に入った時には既に倒れていて、すぐ逃げた」と言い張っている。3番目の「遺体には触れず、争ってもいない」という発言を、今度は冷静に【📘 論理的に追及】してボロを出させろ！',
    statements: [
      {
        id: 'p2_s1',
        text: '「23時40分に5階の第3開発室へ行ったのは事実ですが、ただコーヒーを貰いに行っただけです」',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「わざわざ4階のPCに5分後のタイマーコマンドを仕掛けてから5階へ行ったのはなぜですか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「そ、それは…たまたまバッチ処理の時間を合わせようとしただけです！」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「驚いたでしょうね。落ち着いて当時の状況を話してください」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「ええ…本当に心臓が止まるかと思いましたよ」' }
          ],
          pressure: {
            penalty: 10,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「最初から殺すつもりで5階へ上がったんだろう！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「違います！決めつけないでください！（警戒度＋10%）」' }
            ]
          }
        }
      },
      {
        id: 'p2_s2',
        text: '「俺がドアを開けた時、<span class="highlight-key">佐伯さんはすでにデスクの脇で血を流して</span>倒れていました！」',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「その時、部屋の中に他の誰かはいませんでしたか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「誰もいませんでした。部屋の奥で佐伯さんが倒れているのが見えたんです」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「同僚が倒れていたらパニックになるのも無理はありません」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「そうでしょう！？ だから怖くなってすぐ逃げ出してしまったんです」' }
          ],
          pressure: {
            penalty: 10,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「お前が殴り倒したんじゃないのか！？」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「俺がやったという証拠でもあるんですか！？（警戒度＋10%）」' }
            ]
          }
        }
      },
      {
        id: 'p2_s3',
        text: '「怖くなって、<span class="highlight-key">遺体には指一本触れず、誰とも争わずに</span>すぐ部屋を出て4階へ戻りました」',
        press: {
          logic: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「論理的におかしいですね。すぐ4階へ戻ったなら、なぜ23時40分から46分までの約6分間、あなたのPC操作が完全に途絶えているのですか？」' },
              { speaker: '神崎 怜', speakerType: 'suspect', expression: 'sweat', bpm: 112, text: '「うっ……！ そ、それは4階に戻ってからもしばらく震えが止まらなくて、椅子に座ってじっとしていたからです！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「とにかく、23時40分に部屋を覗いてすぐ戻ったので、23時41分から46分の間は自席で安静にしていました！ 激しい動きや揉み合いなんて一切していません！」' },
              { speaker: '橘 刑事（相棒）', speakerType: 'partner', text: '「（出たぞ！『23時41分から46分の間は安静にしていて激しい動きは一切していない』と証言【4番目】で断言した！ 奴が身につけていたデジタル機器の記録をつきつけろ！）」' }
            ]
          },
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「怖くてすぐ逃げ出したんですね…？（今は共感するより、空白の時間について【📘 論理的】に矛盾を突いた方が良さそうだ）」' }
          ],
          pressure: {
            penalty: 10,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「通報もしないで逃げたなんて嘘に決まっている！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', text: '「パニックだったんです！ 感情論で責めないでください！（警戒度＋10%…ここは【📘 論理的】に時間を詰めるべきだ）」' }
            ]
          }
        }
      },
      {
        id: 'p2_s4',
        hidden: true,
        isNew: true,
        text: '<span class="new-stmt-badge">追加証言</span>「23時41分から46分の間は自席でじっと座っていただけで、<span class="highlight-key">激しい運動や揉み合いなど一切していません！</span>」',
        correctEvidence: 'smartwatch_log',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「23時41分から46分の間、一切激しい動きはしていない…あなたの身体は正直に記録していますよ（証拠品を【つきつける】時だ！）」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「本当に座っていただけですか？（手元の証拠品を【つきつける】で突きつけよう）」' }
          ],
          pressure: [
            { speaker: '主人公', speakerType: 'player', text: '「お前の左腕にあるものが、すべてを記録していたぞ！（【つきつける】で証拠を示せ！）」' }
          ]
        }
      }
    ],
    breakDialogue: [
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「神崎さん、あなたの左腕のスマートウォッチと同期された『ヘルスケア履歴』を見てください！」'
      },
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「あなたが『自席でじっと座っていた』はずの23時41分から46分の5分間、心拍数は【172 BPM】の激しい運動状態を記録し、さらに23時43分には【強い衝撃と腕の振り下ろし】が検知されています！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'shocked',
        bpm: 134,
        text: '「ぐっ……あああっ！？ ス、スマートウォッチのバックグラウンド同期……っ！」'
      },
      {
        speaker: '橘 刑事（相棒）',
        speakerType: 'partner',
        text: '「おっと、ちょうど鑑識から【追加の重要証拠が2点】届いたぞ！ 『🔐 第3開発室・入退室＆空調ログ』と、佐伯のPCから復元された『💾 被害者PCの自動バックアップ』だ！ 捜査資料に追加した！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'sweat',
        bpm: 128,
        text: '「はぁ、はぁ……ま、待て！ 心拍数が上がったのは、倒れている佐伯さんを見つけてパニックになり、心臓マッサージをしようと必死に揺さぶったからだ！ 俺には彼を殺す動機なんてない！」'
      }
    ],
    unlockEvidence: ['room_sensor_log', 'victim_backup'],
    nextPhase: 'phase3_testimony'
  },

  // -------------------- PHASE 3: 浮上する殺害動機と口滑り --------------------
  phase3_testimony: {
    type: 'testimony',
    phaseNum: 'PHASE 03',
    phaseTitle: '隠された殺害動機と焦燥の失言',
    hudLabel: 'PHASE 3/4',
    testimonyTitle: '証言③：動機の完全否定',
    bpm: 128,
    expression: 'sweat',
    hint: '【相棒の助言】神崎の心拍数は128 BPMを超え、かなり動揺している！ 3番目の「佐伯から仕事の相談で呼ばれただけで、トラブルなど一切なかった」という発言に対し、今こそ【📕 威圧して揺さぶる】で一気にプレッシャーをかけろ！ 動揺している今なら決定的な失言をするはずだ！',
    statements: [
      {
        id: 'p3_s1',
        text: '「23時43分のスマートウォッチの衝撃反応は、倒れていた佐伯さんを助けようと揺さぶった時のものです！」',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「先ほどは『遺体には指一本触れていない』と証言しましたよね？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「パニックで記憶が混乱していたんです！ とにかく俺は殺していません！」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「助けようとしたのなら、なぜ救急車を呼ばなかったのですか？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「すでに息がなくて…自分が疑われるのが怖くなったんです！」' }
          ],
          pressure: [
            { speaker: '主人公', speakerType: 'player', text: '「苦しい言い訳だな！ なぜ最初からそう言わなかった！」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「くっ…！ でも俺には佐伯さんを殺す理由なんてないんです！」' }
          ]
        }
      },
      {
        id: 'p3_s2',
        text: '「そもそも、俺と佐伯さんは良好な関係でした。彼を殺す<span class="highlight-key">動機なんて天地神明に誓ってありません！</span>」',
        // 直接ここにつきつけてもOKにする親切設計！
        correctEvidence: 'victim_backup',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「本当に何のトラブルもなかったのですか？（次の3番目の発言を【📕 威圧】で揺さぶるか、復元データを直接つきつけよう）」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「良好な関係だったのに、なぜ深夜23時半過ぎに第3開発室へ？」' },
            { speaker: '神崎 怜', speakerType: 'suspect', text: '「それは…次の証言で言った通り、彼から軽い相談があると呼ばれたからです」' }
          ],
          pressure: [
            { speaker: '主人公', speakerType: 'player', text: '「本当に良好な関係だったのか！？ 次の証言で詳しく聞かせてもらおうか！」' }
          ]
        }
      },
      {
        id: 'p3_s3',
        text: '「昨夜も、佐伯さんから『23時半過ぎに少し話がある』と軽く呼ばれただけで、<span class="highlight-key">彼から追及されるような不正など何一つありません！</span>」',
        correctEvidence: 'victim_backup',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「最初は『コーヒーを貰いに行っただけ』と言っていたのに、今度は『佐伯さんに呼ばれた』に変わりましたね（今神崎は激しく動揺している。【📕 威圧】で攻め立てるか、証拠をつきつけよう！）」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「どんな相談だったんですか？（今は共感するより【📕 威圧】で一気に追い詰める局面だ）」' }
          ],
          pressure: {
            unlockStatementIndex: 3,
            lines: [
              { speaker: '主人公', speakerType: 'player', text: '「いい加減にしろ神崎！！ 最初は『5階へ行っていない』、次は『コーヒーを取りに行ったら偶然見つけた』、今度は『佐伯に呼ばれた』だと！？ 佐伯さんに何を追及されていたのか全部吐け！！」' },
              { speaker: '神崎 怜', speakerType: 'suspect', expression: 'shocked', bpm: 148, text: '「ひっ……！ し、知らない！ 俺が防衛アルゴリズムを外部ブローカーに不正売却しているなんて、佐伯さんの勝手な言いがかりだ！！」' },
              { speaker: '主人公', speakerType: 'player', text: '「……ほう。『防衛アルゴリズムの不正売却』ですか。私はまだ、どんな不正かなんて一言も言っていませんがね」' },
              { speaker: '神崎 怜', speakerType: 'suspect', expression: 'shocked', bpm: 154, text: '「あっ……！！ い、いや、今の話はナシだ！ 佐伯さんがそんな証拠を持っていたはずがない！」' },
              { speaker: '橘 刑事（相棒）', speakerType: 'partner', text: '「（完全に墓穴を掘ったな！ 追加された4番目の発言に、復元された『💾 被害者PCの自動バックアップ』を叩きつけろ！）」' }
            ]
          }
        }
      },
      {
        id: 'p3_s4',
        hidden: true,
        isNew: true,
        text: '<span class="new-stmt-badge">失言</span>「俺が<span class="highlight-key">防衛アルゴリズムを不正売却している証拠</span>なんて、佐伯さんのPCに残っているはずがありません！」',
        correctEvidence: 'victim_backup',
        press: {
          logic: [
            { speaker: '主人公', speakerType: 'player', text: '「残っているはずがない…本当にそうでしょうか？（『💾 被害者PCの自動バックアップ』を【つきつける】時だ！）」' }
          ],
          empathy: [
            { speaker: '主人公', speakerType: 'player', text: '「クラウドの自動バックアップを消すのを忘れていましたね（証拠品を【つきつける】！）」' }
          ],
          pressure: [
            { speaker: '主人公', speakerType: 'player', text: '「これを見てもまだシラを切るつもりか！（証拠品を【つきつける】！）」' }
          ]
        }
      }
    ],
    breakDialogue: [
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「これを見てください！ 佐伯さんのPCのクラウドバックアップから復元された、殺害直前の下書きです！ 『神崎主任が防衛アルゴリズムを不正売却している決定的証拠を掴んだ。今夜23時半、直接自首を勧告する』と記されています！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'shocked',
        bpm: 158,
        text: '「う、うわあああっ！！ なんでだ…俺は佐伯のPCのローカルデータは完全に削除したはずなのに…クラウド同期が残っていたのか…っ！」'
      },
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「今、自分で『佐伯のPCのローカルデータを削除した』と認めましたね！ 23時41分から46分の空白の5分間、あなたは佐伯さんをトロフィーで殴り倒した後、彼のPCデータを消去し、こぼれたコーヒーを拭き取っていたんだ！」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'shocked',
        bpm: 162,
        text: '「だ、黙れ！！ 仮に俺がそこにいたとしても、凶器のトロフィーからも床からも、俺の指紋やDNAは一切出ていないはずだ！ 決定的な物証がない限り、裁判では絶対に有罪にできない！！」'
      }
    ],
    nextPhase: 'phase4_climax'
  },

  // -------------------- PHASE 4: クライマックス心理トラップ --------------------
  phase4_climax: {
    type: 'climax',
    phaseNum: 'FINAL PHASE',
    phaseTitle: '23時47分の死角と最後の心理罠',
    hudLabel: 'FINAL 4/4',
    bpm: 160,
    expression: 'shocked',
    steps: [
      {
        id: 'climax_step1',
        introLines: [
          {
            speaker: '神崎 怜',
            speakerType: 'suspect',
            expression: 'shocked',
            bpm: 160,
            text: '「ハッ…そうだ、俺は手袋をして完全に痕跡を消した…いや、仮定の話ですよ！ とにかく、俺が犯行後に現場で隠滅工作をしたという記録なんてどこにもないはずです！」'
          },
          {
            speaker: '主人公',
            speakerType: 'player',
            text: '「（神崎は『現場で隠滅工作をした記録はない』とタカをくくっている。だが、23時47分に彼が現場で行った“ある不自然な行動”を示す証拠品があるはずだ…！）」'
          }
        ],
        promptText: '【最終追及①】神崎が犯行直後の23時47分、現場で行った「証拠隠滅行動」が記録されている証拠品はどれか？',
        choices: [
          {
            text: '🔐 第3開発室・入退室＆空調ログ（23時47分の窓全開記録）を示す',
            correct: true
          },
          {
            text: '💻 社内サーバー実行ログ（23時45分のバッチ処理記録）を示す',
            correct: false,
            failText: '「サーバーログは4階のPCの記録です。5階の現場で23時47分に行った隠滅行動の記録ではありません！（警戒度＋15%）」'
          },
          {
            text: '⌚ 神崎のスマートウォッチ履歴（23時43分の衝撃検知）を示す',
            correct: false,
            failText: '「スマートウォッチは23時46分までの記録です。直後の23時47分に部屋の環境がどう変わったかを示す証拠を選びましょう！（警戒度＋15%）」'
          }
        ]
      },
      {
        id: 'climax_step2',
        introLines: [
          {
            speaker: '主人公',
            speakerType: 'player',
            text: '「『第3開発室・入退室＆空調ログ』を見てください！ 23時47分から3分間、氷点下に近い真冬の深夜にもかかわらず、第3開発室の窓が全開にされ、室温が急低下しています！」'
          },
          {
            speaker: '神崎 怜',
            speakerType: 'suspect',
            expression: 'shocked',
            bpm: 168,
            text: '「窓…！？ 空調センサーが窓の開閉まで記録していたのか…っ！？ い、いや、窓が開いたからって何ですか！ 犯人がなぜ窓を開けたかなんて説明できないでしょう！」'
          }
        ],
        promptText: '【最終追及②】真冬の深夜23時47分、犯人である神崎がわざわざ3分間も窓を全開にして換気した「本当の理由」は何か？',
        choices: [
          {
            text: '室温を急激に下げて、遺体の死亡推定時刻を狂わせるため',
            correct: false,
            failText: '「たった3分間の換気では死亡推定時刻は狂いません！ 現場の床にこぼれていた『ある物』を思い出してください！（警戒度＋15%）」'
          },
          {
            text: '揉み合いで床にこぼれた「ブルーマウンテン」の強い香りを消すため',
            correct: true
          },
          {
            text: '窓から凶器のクリスタルトロフィーを外へ投げ捨てるため',
            correct: false,
            failText: '「凶器のトロフィーは室内に残されていました！ 彼が『5階でコーヒーを淹れていた』事実を隠すために消したかったものは？（警戒度＋15%）」'
          }
        ]
      },
      {
        id: 'climax_step3',
        introLines: [
          {
            speaker: '主人公',
            speakerType: 'player',
            text: '「あなたが窓を全開にした理由…それは、佐伯さんと揉み合った際に床へこぼれた『淹れたてのブルーマウンテンの強い香り』を部屋から消すためです！」'
          },
          {
            speaker: '主人公',
            speakerType: 'player',
            text: '「床のコーヒーの染みは拭けば消える。しかし、部屋に充満したブルーマウンテンの香りだけは、窓を開けて換気しなければ消せなかった。なぜなら、あなたが『4階でコーヒーを飲んでいた』というアリバイと矛盾するからです！」'
          },
          {
            speaker: '神崎 怜',
            speakerType: 'suspect',
            expression: 'shocked',
            bpm: 174,
            text: '「ぐあああっ……！！ で、でも全部状況証拠だ！ トロフィーも床も手袋をして拭いた…いや、とにかく俺の指紋はどこにも残っていないはずだ！ これ以上は弁護士が来るまで一言も喋らない！！」'
          },
          {
            speaker: '橘 刑事（相棒）',
            speakerType: 'partner',
            text: '「（おい、神崎の心拍数が174 BPMを超えてパニック寸前だ！ 奴は『トロフィーと床の指紋は消した』と思い込んでいるが、最後にあわてて開けた『ある場所』のことに気づいていない…！ 最後の一撃【心理トラップ】で自白を引き出せ！）」'
          }
        ],
        promptText: '【最後の心理トラップ】パニック寸前の神崎の心を完全に折り、自ら決定的な自白を引き出す「カマかけの一手」を選べ！',
        choices: [
          {
            text: '【ハッタリ＆沈黙】「最後に慌てて開けた『窓のクレセント錠（鍵）の裏側』…拭き忘れたよな？」と静かに告げ、無言で目を見据える',
            correct: true
          },
          {
            text: '【激昂】「いい加減に罪を認めろ！ これだけ状況証拠が揃っていれば情状酌量の余地はないぞ！」と机を蹴る',
            correct: false,
            failText: '「力任せに怒鳴ると、神崎は殻に閉じこもって黙秘してしまいます！ 彼が拭き忘れたと思い込ませる『ピンポイントの心理トラップ』を仕掛けましょう！（警戒度＋15%）」'
          },
          {
            text: '【取引】「今すぐ自白すれば、不正データ売却の件は見逃してやる」と司法取引を持ちかける',
            correct: false,
            failText: '「違法な取引を持ちかけると、後で証言能力が否定されてしまいます！ 23時47分に彼が触れた『窓』を使った心理トラップを選びましょう！（警戒度＋15%）」'
          }
        ]
      }
    ],
    endingLines: [
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「……神崎さん。トロフィーと床は完璧に拭いたんですね。でも、退室する直前の23時47分、香りを消すために慌てて開けた『窓のクレセント錠（鍵）の裏側』……あそこだけは拭き忘れましたよね？」'
      },
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「………………（無言で神崎の瞳をじっと見据える）」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'shocked',
        bpm: 182,
        text: '「……ッ！？ ま、待て……窓の鍵は、掃除を終えてゴム手袋を外した後に開けたから……まさか、あそこに俺の指紋と、袖についた佐伯さんの微量の血痕が……！？」'
      },
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「……今、あなた自身の口で言いましたね。『掃除を終えてゴム手袋を外した後に窓を開けた』、そして『袖に佐伯さんの血痕がついていた』と」'
      },
      {
        speaker: '主人公',
        speakerType: 'player',
        text: '「その言葉こそ、犯人しか知り得ない【秘密の暴露】です。すべて録音させていただきました」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'confess',
        bpm: 82,
        text: '「…………あ…………はは……。まだ鑑識の結果が出る前だったのに、カマをかけられたのか……」'
      },
      {
        speaker: '神崎 怜',
        speakerType: 'suspect',
        expression: 'confess',
        bpm: 74,
        text: '「……完敗ですよ、刑事さん。ええ、俺がやりました。佐伯さんに不正売却の証拠を突きつけられ、自首しろと迫られて……気づいたら、机の上のトロフィーを振り下ろしていました……」'
      },
      {
        speaker: '橘 刑事（相棒）',
        speakerType: 'partner',
        text: '「……見事な落としっぷりだ。弁護士が到着する3分前に完全自白成立だな。お疲れ様、最高の取調べだったぜ！」'
      }
    ]
  }
};

// ==================== 4. ゲーム状態管理＆UIコントローラー ====================
class InterrogationGame {
  constructor() {
    this.state = {
      currentPhaseKey: 'intro',
      mode: 'dialogue', // 'dialogue' | 'testimony' | 'climax' | 'sub_dialogue'
      dialogueQueue: [],
      dialogueIndex: 0,
      afterSubDialogueCallback: null,

      testimonyIndex: 0,
      activeStatements: [],

      climaxStepIndex: 0,

      bpm: 68,
      targetBpm: 68,
      maxBpmReached: 68,
      guard: 15, // 100%で黙秘ゲームオーバー
      breakProgress: 0, // 0 -> 25 -> 55 -> 85 -> 100
      mistakes: 0,

      unlockedEvidence: new Set(),
      selectedEvidenceId: null,
      evidenceModalMode: 'view', // 'view' | 'present'

      logs: [],
      startTime: 0,
      typingTimer: null,
      isTyping: false,
      fullCurrentText: ''
    };

    this.initDOM();
    this.initECGCanvas();
    this.bindEvents();
  }

  initDOM() {
    this.el = {
      gameContainer: document.getElementById('game-container'),
      flashOverlay: document.getElementById('flash-overlay'),
      dangerVignette: document.getElementById('danger-vignette'),
      cutinOverlay: document.getElementById('cutin-overlay'),
      cutinText: document.getElementById('cutin-text'),
      cutinSub: document.getElementById('cutin-sub'),
      phaseBanner: document.getElementById('phase-banner'),
      phaseBannerNum: document.getElementById('phase-banner-num'),
      phaseBannerTitle: document.getElementById('phase-banner-title'),

      titleScreen: document.getElementById('title-screen'),
      mainScreen: document.getElementById('main-screen'),
      resultScreen: document.getElementById('result-screen'),

      hudPhaseLabel: document.getElementById('hud-phase-label'),
      hudBpmBox: document.getElementById('hud-bpm-box'),
      suspectStateTag: document.getElementById('SuspectStateTag'),
      bpmValue: document.getElementById('bpm-value'),
      guardValueText: document.getElementById('guard-value-text'),
      guardBar: document.getElementById('guard-bar'),
      breakValueText: document.getElementById('break-value-text'),
      breakBar: document.getElementById('break-bar'),

      portraitWrapper: document.getElementById('portrait-wrapper'),
      suspectImgs: {
        calm: document.getElementById('suspect-img-calm'),
        sweat: document.getElementById('suspect-img-sweat'),
        shocked: document.getElementById('suspect-img-shocked'),
        confess: document.getElementById('suspect-img-confess')
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
      detailEvDesc: document.getElementById('detail-ev-desc'),
      detailEvNote: document.getElementById('detail-ev-note'),
      btnConfirmPresent: document.getElementById('btn-confirm-present'),

      logModal: document.getElementById('log-modal'),
      logList: document.getElementById('log-list'),

      resultBadge: document.getElementById('result-badge'),
      resultTitle: document.getElementById('result-title'),
      resultSubtitle: document.getElementById('result-subtitle'),
      statRank: document.getElementById('stat-rank'),
      statMistakes: document.getElementById('stat-mistakes'),
      statMaxBpm: document.getElementById('stat-max-bpm'),
      statTime: document.getElementById('stat-time'),
      resultSummaryText: document.getElementById('result-summary-text'),
      btnRetryPhase: document.getElementById('btn-retry-phase')
    };
  }

  // ==================== ECG 心電図リアルタイム描画 ====================
  initECGCanvas() {
    this.ecgCanvas = document.getElementById('ecg-canvas');
    this.ecgCtx = this.ecgCanvas.getContext('2d');
    this.ecgPoints = new Array(120).fill(16);
    this.ecgPhase = 0;
    this.lastBeatTime = performance.now();

    const renderLoop = (now) => {
      // BPMの滑らかな追従
      this.state.bpm += (this.state.targetBpm - this.state.bpm) * 0.08;
      const currentBpm = Math.round(this.state.bpm);
      sound.currentBpm = currentBpm;
      this.el.bpmValue.textContent = currentBpm;

      if (currentBpm > this.state.maxBpmReached) {
        this.state.maxBpmReached = currentBpm;
      }

      // 1拍の間隔 (ms)
      const beatInterval = 60000 / Math.max(50, currentBpm);
      if (now - this.lastBeatTime >= beatInterval) {
        this.lastBeatTime = now;
        this.ecgPhase = 1; // QRS波のトリガー
        sound.playHeartbeatPulse();
      }

      // 次のY座標を計算
      let y = 18;
      if (this.ecgPhase > 0) {
        const amp = currentBpm > 130 ? 13 : currentBpm > 95 ? 10 : 8;
        if (this.ecgPhase === 1) y = 18 - amp * 0.3;
        else if (this.ecgPhase === 2) y = 18 + amp * 0.35;
        else if (this.ecgPhase === 3) y = 18 - amp * 1.15;
        else if (this.ecgPhase === 4) y = 18 + amp * 0.75;
        else if (this.ecgPhase === 5) y = 18 - amp * 0.25;
        this.ecgPhase++;
        if (this.ecgPhase > 6) this.ecgPhase = 0;
      } else {
        y = 18 + (Math.random() - 0.5) * (currentBpm > 120 ? 2.2 : 0.8);
      }

      this.ecgPoints.push(y);
      this.ecgPoints.shift();

      // 描画
      const ctx = this.ecgCtx;
      const w = this.ecgCanvas.width;
      const h = this.ecgCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const strokeColor =
        currentBpm >= 130 ? '#ef4444' : currentBpm >= 95 ? '#f59e0b' : '#10b981';
      this.el.bpmValue.style.color = strokeColor;

      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;
      for (let i = 0; i < this.ecgPoints.length; i++) {
        const px = (i / (this.ecgPoints.length - 1)) * w;
        const py = this.ecgPoints[i];
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  }

  // ==================== イベント登録 ====================
  bindEvents() {
    document.getElementById('btn-start-game').addEventListener('click', () => {
      sound.init();
      sound.playClick();
      this.startNewGame();
    });

    document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
      sound.init();
      const on = sound.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });

    document.getElementById('btn-open-log').addEventListener('click', () => {
      sound.playClick();
      this.openLogModal();
    });

    document.getElementById('btn-close-log').addEventListener('click', () => {
      sound.playClick();
      this.el.logModal.classList.add('hidden');
    });

    // 会話送り（ボックスまたはボタン）
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

    // 証言ナビゲーション
    this.el.btnPrevStmt.addEventListener('click', () => {
      sound.playClick();
      this.changeStatement(-1);
    });

    this.el.btnNextStmt.addEventListener('click', () => {
      sound.playClick();
      this.changeStatement(1);
    });

    // スマホ用左右スワイプで証言切り替え
    let touchStartX = 0;
    this.el.dialogueBox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.el.dialogueBox.addEventListener('touchend', (e) => {
      if (this.state.mode !== 'testimony') return;
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 48) {
        sound.playClick();
        if (diff < 0) this.changeStatement(1);
        else this.changeStatement(-1);
      }
    }, { passive: true });

    // ゆさぶるボタン → トーン選択モーダル
    document.getElementById('btn-press').addEventListener('click', () => {
      sound.playClick();
      this.el.toneModal.classList.remove('hidden');
    });

    document.getElementById('btn-close-tone').addEventListener('click', () => {
      sound.playClick();
      this.el.toneModal.classList.add('hidden');
    });

    document.querySelectorAll('.tone-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tone = btn.getAttribute('data-tone');
        this.el.toneModal.classList.add('hidden');
        this.executePress(tone);
      });
    });

    // つきつける＆捜査資料ボタン
    document.getElementById('btn-present').addEventListener('click', () => {
      sound.playClick();
      this.openEvidenceModal('present');
    });

    document.getElementById('btn-view-casefile-normal').addEventListener('click', () => {
      sound.playClick();
      this.openEvidenceModal('view');
    });

    document.getElementById('btn-close-evidence').addEventListener('click', () => {
      sound.playClick();
      this.el.evidenceModal.classList.add('hidden');
    });

    this.el.btnConfirmPresent.addEventListener('click', () => {
      if (!this.state.selectedEvidenceId) return;
      this.el.evidenceModal.classList.add('hidden');
      this.executePresent(this.state.selectedEvidenceId);
    });

    // 助言（ヒント）ボタン
    document.getElementById('btn-hint').addEventListener('click', () => {
      sound.playClick();
      const phase = PHASES[this.state.currentPhaseKey];
      if (phase && phase.hint) {
        this.runSubDialogue([
          { speaker: '橘 刑事（相棒）', speakerType: 'partner', text: phase.hint }
        ]);
      }
    });

    // リトライ＆タイトルへ戻る
    this.el.btnRetryPhase.addEventListener('click', () => {
      sound.playClick();
      this.retryCurrentPhase();
    });

    document.getElementById('btn-restart-game').addEventListener('click', () => {
      sound.playClick();
      sound.isInMainScreen = false;
      this.switchScreen('title');
    });
  }

  // ==================== ゲーム進行制御 ====================
  switchScreen(screenName) {
    this.el.titleScreen.classList.remove('active');
    this.el.mainScreen.classList.remove('active');
    this.el.resultScreen.classList.remove('active');

    if (screenName === 'title') this.el.titleScreen.classList.add('active');
    if (screenName === 'main') this.el.mainScreen.classList.add('active');
    if (screenName === 'result') this.el.resultScreen.classList.add('active');
  }

  startNewGame() {
    this.state.guard = 15;
    this.state.breakProgress = 0;
    this.state.mistakes = 0;
    this.state.maxBpmReached = 68;
    this.state.logs = [];
    this.state.startTime = Date.now();

    // 初期証拠品の登録
    this.state.unlockedEvidence.clear();
    Object.values(EVIDENCE_DB).forEach((ev) => {
      if (ev.unlockedAtStart) this.state.unlockedEvidence.add(ev.id);
    });

    // 隠し証言の状態をリセット
    Object.values(PHASES).forEach((p) => {
      if (p.statements) {
        p.statements.forEach((s) => {
          if (s.isNew) s.hidden = true;
        });
      }
    });

    this.updateGauges();
    sound.isInMainScreen = true;
    this.switchScreen('main');
    this.loadPhase('intro');
  }

  retryCurrentPhase() {
    this.state.guard = 30;
    this.updateGauges();
    sound.isInMainScreen = true;
    this.switchScreen('main');
    const retryKey =
      this.state.currentPhaseKey === 'intro' ? 'phase1_testimony' : this.state.currentPhaseKey;
    this.loadPhase(retryKey);
  }

  loadPhase(phaseKey) {
    this.state.currentPhaseKey = phaseKey;
    const phase = PHASES[phaseKey];
    if (!phase) return;

    if (phase.hudLabel) {
      this.el.hudPhaseLabel.textContent = phase.hudLabel;
    } else if (phase.phaseLabel) {
      this.el.hudPhaseLabel.textContent = phase.phaseLabel;
    }

    if (phase.bpm) this.setSuspectBpm(phase.bpm);
    if (phase.expression) this.setSuspectExpression(phase.expression);

    // フェーズ開始バナー演出
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
    } else if (phase.type === 'climax') {
      this.state.mode = 'climax';
      this.state.climaxStepIndex = 0;
      this.startClimaxStep();
    }
  }

  showPhaseBanner(numText, titleText) {
    this.el.phaseBannerNum.textContent = numText;
    this.el.phaseBannerTitle.textContent = titleText;
    this.el.phaseBanner.classList.remove('hidden');
    setTimeout(() => {
      this.el.phaseBanner.classList.add('hidden');
    }, 1700);
  }

  updateControlVisibility() {
    const mode = this.state.mode;
    this.el.normalControls.classList.toggle('hidden', mode !== 'dialogue' && mode !== 'sub_dialogue');
    this.el.interrogationControls.classList.toggle('hidden', mode !== 'testimony');
    this.el.choiceControls.classList.toggle('hidden', mode !== 'climax_choice');

    this.el.testimonyHud.classList.toggle('hidden', mode !== 'testimony');
    this.el.statementNav.classList.toggle('hidden', mode !== 'testimony');
    this.el.statementHint.classList.toggle('hidden', mode !== 'testimony');
    this.el.dialogueBox.classList.toggle('testimony-mode', mode === 'testimony');
  }

  // ==================== 表情・心拍数・ゲージ更新 ====================
  setSuspectExpression(expr) {
    Object.entries(this.el.suspectImgs).forEach(([key, img]) => {
      img.classList.toggle('active', key === expr);
    });

    const tag = this.el.suspectStateTag;
    tag.className = 'state-tag ' + expr;
    const labelMap = {
      calm: '冷静',
      sweat: '動揺・発汗',
      shocked: '恐慌・限界',
      confess: '観念'
    };
    tag.textContent = labelMap[expr] || '冷静';

    this.el.hudBpmBox.classList.remove('state-sweat', 'state-danger');
    this.el.dangerVignette.classList.remove('high-pulse');

    if (expr === 'sweat') {
      this.el.hudBpmBox.classList.add('state-sweat');
    } else if (expr === 'shocked') {
      this.el.hudBpmBox.classList.add('state-danger');
      this.el.dangerVignette.classList.add('high-pulse');
    }
  }

  setSuspectBpm(bpm) {
    this.state.targetBpm = bpm;
  }

  updateGauges() {
    const guard = Math.min(100, Math.max(0, this.state.guard));
    const brk = Math.min(100, Math.max(0, this.state.breakProgress));

    this.el.guardValueText.textContent = `${guard}%`;
    this.el.guardBar.style.width = `${guard}%`;

    this.el.breakValueText.textContent = `${brk}%`;
    this.el.breakBar.style.width = `${brk}%`;
  }

  addGuardPenalty(amount) {
    this.state.guard = Math.min(100, this.state.guard + amount);
    this.state.mistakes++;
    this.updateGauges();
    this.triggerFlash('red');
    this.triggerShake('light');
    sound.playDamage();
  }

  // ==================== テキスト表示（タイプライター演出） ====================
  typeText(speaker, speakerType, htmlText) {
    if (this.state.typingTimer) {
      clearInterval(this.state.typingTimer);
      this.state.typingTimer = null;
    }

    this.el.speakerName.textContent = speaker;
    this.el.speakerName.className = 'speaker-name';
    if (speakerType === 'player') this.el.speakerName.classList.add('speaker-player');
    if (speakerType === 'partner') this.el.speakerName.classList.add('speaker-partner');

    this.state.fullCurrentText = htmlText;

    // ログに追加（重複防止）
    const plainText = htmlText.replace(/<[^>]+>/g, '');
    const lastLog = this.state.logs[this.state.logs.length - 1];
    if (!lastLog || lastLog.text !== plainText) {
      this.state.logs.push({ speaker, text: plainText });
    }

    // HTMLタグが含まれる証言は即座または高速表示
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
      if (idx % 2 === 0) sound.playTick(speakerType);

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

  // ==================== 通常会話＆サブ会話進行 ====================
  renderCurrentDialogueLine() {
    const line = this.state.dialogueQueue[this.state.dialogueIndex];
    if (!line) return;

    if (line.expression) this.setSuspectExpression(line.expression);
    if (line.bpm) this.setSuspectBpm(line.bpm);

    this.typeText(line.speaker, line.speakerType || 'suspect', line.text);
  }

  advanceDialogue() {
    sound.init();
    if (this.state.isTyping) {
      this.finishTypingImmediately();
      return;
    }

    sound.playClick();
    this.state.dialogueIndex++;

    if (this.state.dialogueIndex < this.state.dialogueQueue.length) {
      this.renderCurrentDialogueLine();
      return;
    }

    // キュー終了時
    if (this.state.mode === 'sub_dialogue') {
      const cb = this.state.afterSubDialogueCallback;
      this.state.afterSubDialogueCallback = null;

      // 警戒度100%チェック
      if (this.state.guard >= 100) {
        this.triggerGameOver();
        return;
      }

      if (cb) {
        cb();
      } else {
        // 証言モードへ復帰
        this.state.mode = 'testimony';
        this.updateControlVisibility();
        this.renderCurrentStatement();
      }
    } else if (this.state.mode === 'dialogue') {
      const phase = PHASES[this.state.currentPhaseKey];
      if (phase && phase.nextPhase) {
        this.loadPhase(phase.nextPhase);
      }
    }
  }

  runSubDialogue(lines, callback = null) {
    this.state.mode = 'sub_dialogue';
    this.state.dialogueQueue = lines;
    this.state.dialogueIndex = 0;
    this.state.afterSubDialogueCallback = callback;
    this.updateControlVisibility();
    this.renderCurrentDialogueLine();
  }

  // ==================== 証言モード制御 ====================
  refreshActiveStatements() {
    const phase = PHASES[this.state.currentPhaseKey];
    if (!phase || !phase.statements) return;
    this.state.activeStatements = phase.statements.filter((s) => !s.hidden);
  }

  renderCurrentStatement() {
    this.refreshActiveStatements();
    const stmts = this.state.activeStatements;
    if (this.state.testimonyIndex >= stmts.length) {
      this.state.testimonyIndex = stmts.length - 1;
    }
    const current = stmts[this.state.testimonyIndex];

    // ドットインジケーター更新
    this.el.testimonyDots.innerHTML = '';
    stmts.forEach((s, idx) => {
      const dot = document.createElement('span');
      dot.className = 'stmt-dot';
      if (idx === this.state.testimonyIndex) dot.classList.add('active');
      if (s.isNew) dot.classList.add('unlocked-new');
      this.el.testimonyDots.appendChild(dot);
    });

    this.el.stmtCounter.textContent = `${this.state.testimonyIndex + 1} / ${stmts.length}`;
    this.el.btnPrevStmt.disabled = this.state.testimonyIndex === 0;
    this.el.btnNextStmt.disabled = this.state.testimonyIndex === stmts.length - 1;

    this.typeText('神崎 怜（証言中）', 'suspect', current.text);
  }

  changeStatement(delta) {
    const nextIdx = this.state.testimonyIndex + delta;
    if (nextIdx < 0 || nextIdx >= this.state.activeStatements.length) return;
    this.state.testimonyIndex = nextIdx;
    this.renderCurrentStatement();
  }

  // ==================== アクション①：ゆさぶる（態度選択） ====================
  executePress(tone) {
    const phase = PHASES[this.state.currentPhaseKey];
    const currentStmt = this.state.activeStatements[this.state.testimonyIndex];
    if (!currentStmt || !currentStmt.press) return;

    const pressData = currentStmt.press[tone];
    if (!pressData) return;

    const toneCutinMap = {
      logic: { text: '待った！', sub: 'LOGICAL INQUIRY' },
      empathy: { text: 'なるほど…', sub: 'EMPATHETIC INDUCTION' },
      pressure: { text: '答えろ！', sub: 'HIGH PRESSURE' }
    };

    const cutinInfo = toneCutinMap[tone];
    this.triggerCutin(cutinInfo.text, cutinInfo.sub, true, () => {
      // 配列形式かオブジェクト形式か判定
      if (Array.isArray(pressData)) {
        this.runSubDialogue(pressData);
      } else {
        if (pressData.penalty) {
          this.addGuardPenalty(pressData.penalty);
        }
        if (typeof pressData.unlockStatementIndex === 'number') {
          const targetStmt = phase.statements[pressData.unlockStatementIndex];
          const wasHidden = targetStmt && targetStmt.hidden;
          if (targetStmt) targetStmt.hidden = false;

          this.runSubDialogue(pressData.lines, () => {
            if (wasHidden) sound.playUnlock();
            this.refreshActiveStatements();
            // アンロックされた新証言へ自動ジャンプ
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

  // ==================== アクション②：つきつける（証拠品提示） ====================
  openEvidenceModal(mode) {
    this.state.evidenceModalMode = mode;
    const isPresent = mode === 'present';
    this.el.evidenceModalTitle.textContent = isPresent
      ? '⚡ 矛盾に「つきつける」証拠品を選択'
      : '📁 捜査ファイル・証拠品一覧';

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
    const unlockedIds = Array.from(this.state.unlockedEvidence);

    unlockedIds.forEach((id, idx) => {
      const ev = EVIDENCE_DB[id];
      const btn = document.createElement('button');
      btn.className = 'evidence-item-btn';
      btn.innerHTML = `
        <span class="ev-icon">${ev.icon}</span>
        <span class="ev-name">${ev.name}</span>
      `;
      btn.addEventListener('click', () => {
        sound.playClick();
        this.selectEvidenceItem(id, btn);
      });
      this.el.evidenceList.appendChild(btn);

      if (idx === 0) {
        this.selectEvidenceItem(id, btn);
      }
    });

    this.el.evidenceModal.classList.remove('hidden');
  }

  selectEvidenceItem(id, btnElement) {
    this.state.selectedEvidenceId = id;
    document.querySelectorAll('.evidence-item-btn').forEach((b) => b.classList.remove('selected'));
    if (btnElement) btnElement.classList.add('selected');

    const ev = EVIDENCE_DB[id];
    this.el.detailEvIcon.textContent = ev.icon;
    this.el.detailEvName.textContent = ev.name;
    this.el.detailEvDesc.textContent = ev.desc;
    this.el.detailEvNote.textContent = ev.note;
  }

  executePresent(evidenceId) {
    const phase = PHASES[this.state.currentPhaseKey];
    const currentStmt = this.state.activeStatements[this.state.testimonyIndex];
    if (!currentStmt) return;

    // 1. 特殊イベント付き正解（Phase 1のサーバーログなど）
    if (
      currentStmt.specialPresent &&
      currentStmt.specialPresent.evidenceId === evidenceId
    ) {
      const sp = currentStmt.specialPresent;
      this.triggerCutin('そこまでだ！', 'EVIDENCE PRESENTED', false, () => {
        if (typeof sp.unlockStatementIndex === 'number') {
          phase.statements[sp.unlockStatementIndex].hidden = false;
        }
        this.runSubDialogue(sp.lines, () => {
          sound.playUnlock();
          this.refreshActiveStatements();
          this.state.testimonyIndex = this.state.activeStatements.length - 1;
          this.state.mode = 'testimony';
          this.updateControlVisibility();
          this.renderCurrentStatement();
        });
      });
      return;
    }

    // 2. 決定的な矛盾への正解証拠品！
    if (currentStmt.correctEvidence === evidenceId) {
      this.triggerCutin('そこまでだ！', 'CONTRADICTION EXPOSED', false, () => {
        this.triggerShake('heavy');
        this.state.breakProgress = Math.min(100, this.state.breakProgress + 28);
        this.updateGauges();

        // 追加証拠品アンロック処理
        if (phase.unlockEvidence) {
          phase.unlockEvidence.forEach((newId) => this.state.unlockedEvidence.add(newId));
        }

        this.runSubDialogue(phase.breakDialogue, () => {
          if (phase.unlockEvidence) sound.playUnlock();
          this.loadPhase(phase.nextPhase);
        });
      });
      return;
    }

    // 3. 不正解（見当違いの証拠品）
    this.triggerCutin('そこまでだ！', 'EVIDENCE PRESENTED', false, () => {
      this.addGuardPenalty(15);
      this.runSubDialogue([
        {
          speaker: '主人公',
          speakerType: 'player',
          text: `「この『${EVIDENCE_DB[evidenceId].name}』とあなたの発言は矛盾しています！」`
        },
        {
          speaker: '神崎 怜',
          speakerType: 'suspect',
          text: '「……は？ 今の俺の発言とそれがどう関係あるんですか？ 苦し紛れのハッタリはやめてくださいよ（警戒度＋15%）」'
        },
        {
          speaker: '橘 刑事（相棒）',
          speakerType: 'partner',
          text: '「（おい、見当違いの証拠品を出すと神崎の警戒度が上がるぞ！ まだ【ゆさぶる】で新しい証言を引き出せていないか、別の発言が標的じゃないか確認しろ！）」'
        }
      ]);
    });
  }

  // ==================== クライマックス心理戦フェーズ ====================
  startClimaxStep() {
    const phase = PHASES[this.state.currentPhaseKey];
    const step = phase.steps[this.state.climaxStepIndex];
    if (!step) {
      // 全ステップ突破 → エンディング自白会話へ！
      this.state.breakProgress = 100;
      this.updateGauges();
      this.runSubDialogue(phase.endingLines, () => {
        this.triggerVictory();
      });
      return;
    }

    this.runSubDialogue(step.introLines, () => {
      this.showClimaxChoices(step);
    });
  }

  showClimaxChoices(step) {
    this.state.mode = 'climax_choice';
    this.updateControlVisibility();
    this.typeText('心理トラップ選択', 'player', step.promptText);

    this.el.choiceControls.innerHTML = '';
    step.choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'btn-choice-item';
      btn.textContent = ch.text;
      btn.addEventListener('click', () => {
        sound.playClick();
        if (ch.correct) {
          const isFinal = this.state.climaxStepIndex === 2;
          this.triggerCutin(
            isFinal ? 'チェックメイトだ！' : 'そこまでだ！',
            isFinal ? 'PSYCHOLOGICAL TRAP' : 'LOGIC BREAK',
            false,
            () => {
              this.triggerShake('heavy');
              this.state.breakProgress = Math.min(100, this.state.breakProgress + 15);
              this.updateGauges();
              this.state.climaxStepIndex++;
              this.startClimaxStep();
            }
          );
        } else {
          this.addGuardPenalty(15);
          this.runSubDialogue(
            [{ speaker: '橘 刑事（相棒）', speakerType: 'partner', text: ch.failText }],
            () => {
              this.showClimaxChoices(step);
            }
          );
        }
      });
      this.el.choiceControls.appendChild(btn);
    });
  }

  // ==================== 演出ヘルパー ====================
  triggerFlash(color = 'white') {
    const cls = color === 'red' ? 'flash-red' : 'flash-white';
    this.el.flashOverlay.classList.add(cls);
    setTimeout(() => {
      this.el.flashOverlay.classList.remove(cls);
    }, 90);
  }

  triggerShake(intensity = 'light') {
    const cls = intensity === 'heavy' ? 'shake-heavy' : 'shake-light';
    this.el.gameContainer.classList.remove('shake-light', 'shake-heavy');
    void this.el.gameContainer.offsetWidth;
    this.el.gameContainer.classList.add(cls);
  }

  triggerCutin(mainText, subText, isBlue, callback) {
    sound.playObjection(!isBlue);
    this.triggerFlash('white');
    this.el.portraitWrapper.classList.add('zoom-in');

    this.el.cutinText.textContent = mainText;
    this.el.cutinSub.textContent = subText;
    this.el.cutinOverlay.classList.toggle('blue-mode', isBlue);
    this.el.cutinOverlay.classList.remove('hidden');

    setTimeout(() => {
      this.el.cutinOverlay.classList.add('hidden');
      this.el.portraitWrapper.classList.remove('zoom-in');
      if (callback) callback();
    }, 950);
  }

  // ==================== バックログ表示 ====================
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

  // ==================== エンディング＆ゲームオーバー ====================
  triggerVictory() {
    sound.isInMainScreen = false;
    sound.playUnlock();

    const elapsedSec = Math.floor((Date.now() - this.state.startTime) / 1000);
    const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const ss = String(elapsedSec % 60).padStart(2, '0');

    let rank = 'S';
    if (this.state.mistakes >= 4) rank = 'B';
    else if (this.state.mistakes >= 2) rank = 'A';

    this.el.resultBadge.textContent = 'CASE CLOSED // CONFESSION';
    this.el.resultTitle.textContent = '完全自白成立';
    this.el.resultSubtitle.textContent = '神崎 怜のすべての嘘とアリバイ工作を崩し、真実を暴き出した。';
    this.el.statRank.textContent = rank;
    this.el.statMistakes.textContent = `${this.state.mistakes}回 (警戒度 ${this.state.guard}%)`;
    this.el.statMaxBpm.textContent = `${this.state.maxBpmReached} BPM`;
    this.el.statTime.textContent = `${mm}:${ss}`;

    this.el.resultSummaryText.innerHTML = `
      <strong>【事件の真相】</strong><br>
      神崎 怜は、防衛アルゴリズムの不正売却を佐伯研究員に突き止められ、23時38分に5階・第3開発室へ入室。直前に自席PCへ5分後の自動実行タイマー（sleep 300）を仕掛けてアリバイを偽装した。<br><br>
      揉み合いの末に佐伯を殺害した神崎は、床にこぼれたブルーマウンテンの香りを消すため23時47分に窓を全開にして換気。最後の心理トラップによって「手袋を外した後に窓を開けた」という犯人しか知り得ない秘密を自ら口走り、完全自白に至った。
    `;

    this.el.btnRetryPhase.classList.add('hidden');
    this.switchScreen('result');
  }

  triggerGameOver() {
    sound.isInMainScreen = false;
    sound.playDamage();

    const elapsedSec = Math.floor((Date.now() - this.state.startTime) / 1000);
    const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const ss = String(elapsedSec % 60).padStart(2, '0');

    this.el.resultBadge.textContent = 'INTERROGATION FAILED';
    this.el.resultTitle.textContent = '黙秘権の行使';
    this.el.resultSubtitle.textContent = '神崎の警戒度が100%に達し、顧問弁護士が到着してしまった…。';
    this.el.statRank.textContent = 'C';
    this.el.statMistakes.textContent = `${this.state.mistakes}回 (警戒度 100%)`;
    this.el.statMaxBpm.textContent = `${this.state.maxBpmReached} BPM`;
    this.el.statTime.textContent = `${mm}:${ss}`;

    this.el.resultSummaryText.innerHTML = `
      <strong>【捜査アドバイス】</strong><br>
      神崎が冷静な序盤（Phase 1）は「📗 共感して誘導」で油断させ、ボロが出始めた中盤（Phase 2）は「📘 論理的に追及」、心拍数が跳ね上がった終盤（Phase 3）は「📕 威圧して揺さぶる」を使うと効果的です。直前のフェーズからすぐに再挑戦できます！
    `;

    this.el.btnRetryPhase.classList.remove('hidden');
    this.switchScreen('result');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new InterrogationGame();
});
