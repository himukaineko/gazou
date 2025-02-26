import React, { useState, useEffect } from 'react';

// イケメンお兄さんのセリフ集
const IkemenLines = {
  start: [
    "お？オセロ勝負か？面白ぇじゃん、相手してやるよ！",
    "俺に勝てると思ってんの？まぁ、試してみなって！",
    "楽しくやろうぜ？でも、手加減はしねーけどな！",
    "オセロってのは頭脳戦だからな？ほら、かかってこいよ！",
    "ま、サクッと終わらせるか。そっちが泣く前にな？"
  ],
  playerMove: [
    "おっ、いい手じゃん。でも、俺の方が上手いけどな！",
    "へぇ、そうくる？まぁまぁ、面白くなってきた！",
    "うんうん、悪くないね。でも、甘いよ？",
    "ふーん、なるほどね？じゃあ俺も本気出すか！",
    "へへっ、その程度で俺に勝てると思ってんの？"
  ],
  cpuMove: [
    "ほらよ、一手目って大事なんだぜ？",
    "んー、これでどうだ？読めるか？",
    "ふっ、こっちの番な？まぁ、見とけって",
    "お前の手、全部見えてんだよなぁ",
    "そろそろ俺のターン、いっちゃうよ？"
  ],
  playerGoodMove: [
    "おっ、いい手じゃん。でも、俺の方が上手いけどな！",
    "へぇ、そうくる？まぁまぁ、面白くなってきた！",
    "うんうん、悪くないね。でも、甘いよ？",
    "ふーん、なるほどね？じゃあ俺も本気出すか！",
    "へへっ、その程度で俺に勝てると思ってんの？"
  ],
  cpuGoodMove: [
    "ほらよ、一手目って大事なんだぜ？",
    "んー、これでどうだ？読めるか？",
    "ふっ、こっちの番な？まぁ、見とけって",
    "お前の手、全部見えてんだよなぁ",
    "そろそろ俺のターン、いっちゃうよ？"
  ],
  playerGreatMove: [
    "お、おいおい…なかなかやるじゃん！？",
    "マジか、ちょっと調子乗りすぎじゃね？笑",
    "おー、そうきたか。でも、これで勝てると思うなよ？",
    "クッ…やるな。でも、俺はまだ負けねぇぜ！",
    "お前、隠れてオセロの特訓でもしてた？"
  ],
  cpuGreatMove: [
    "ほいっと！これが実力の差ってやつだよ",
    "一気にいかせてもらうぜ？…あー、気持ちいー！",
    "ほら、これでどうよ？逆転は無理っしょ？",
    "お？ビビった？まだまだいくぜ？",
    "これが俺の本気…そろそろギブアップする？"
  ],
  cpuWin: [
    "ほーら、やっぱり俺が勝っちまったな？悪いな！",
    "ま、当然の結果ってやつだよな？オセロは俺の庭だし？",
    "おっと、圧勝すぎてゴメンな？次はもうちょい頑張れよ！",
    "ははっ、俺に勝とうなんて100年早いぜ？",
    "いやー、オセロって楽しいな！…あ、俺が勝つから？"
  ],
  cpuLose: [
    "ちっ…お前、意外とやるじゃん…悔しいわ！",
    "ぐぬぬ…負けちまった…くそ、次は負けねぇ！",
    "ま、まぁ今日はこんくらいにしといてやるわ！",
    "お前、まさかオセロのプロか？次は本気出す！",
    "ぐはっ…まじかよ！よし、リベンジマッチだ！"
  ]
};

// イケメンお兄さんの表情状態
const IkemenExpressions = {
  NORMAL: "normal",
  SMILE: "smile",
  SURPRISED: "surprised",
  PROUD: "proud",
  SHOCKED: "shocked",
  HAPPY: "happy",
  SAD: "sad"
};

const OthelloGame = () => {
  // ゲーム状態
  const [board, setBoard] = useState([]);
  const [playerColor, setPlayerColor] = useState('');
  const [cpuColor, setCpuColor] = useState('');
  const [currentTurn, setCurrentTurn] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ white: 2, black: 2 });
  const [message, setMessage] = useState('');
  const [specialEffectActive, setSpecialEffectActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [availableMoves, setAvailableMoves] = useState([]);
  const [ikemenExpression, setIkemenExpression] = useState(IkemenExpressions.NORMAL);
  
  // 新しいゲームの初期化
  const initializeGame = () => {
    // 8x8のボードを作成
    const newBoard = Array(8).fill().map(() => Array(8).fill(null));
    
    // 初期配置
    newBoard[3][3] = 'white';
    newBoard[3][4] = 'black';
    newBoard[4][3] = 'black';
    newBoard[4][4] = 'white';
    
    // プレイヤーの色をランダムに決定
    const colors = ['black', 'white'];
    const randomIndex = Math.floor(Math.random() * 2);
    const playerCol = colors[randomIndex];
    const cpuCol = colors[1 - randomIndex];
    
    setBoard(newBoard);
    setPlayerColor(playerCol);
    setCpuColor(cpuCol);
    setCurrentTurn('black'); // 黒が先手
    setGameStarted(true);
    setGameOver(false);
    setScores({ white: 2, black: 2 });
    setWinner(null);
    setIkemenExpression(IkemenExpressions.NORMAL);
    
    // スタート時のメッセージをランダムに選択
    const startMessage = IkemenLines.start[Math.floor(Math.random() * IkemenLines.start.length)];
    setMessage(startMessage);
    
    // 先手がCPUの場合は、CPUの手番を実行
    if (cpuCol === 'black') {
      setTimeout(() => cpuMove(newBoard, 'black', playerCol), 1000);
    } else {
      // 先手がプレイヤーの場合は、有効な手を計算
      const moves = getValidMoves(newBoard, playerCol);
      setAvailableMoves(moves);
    }
  };

  // 有効な手を取得する関数
  const getValidMoves = (board, color) => {
    const moves = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(board, row, col, color)) {
          moves.push({ row, col });
        }
      }
    }
    
    return moves;
  };

  // 手が有効かどうかチェックする関数
  const isValidMove = (board, row, col, color) => {
    // すでにコマがある場所には置けない
    if (board[row][col] !== null) {
      return false;
    }
    
    const oppositeColor = color === 'black' ? 'white' : 'black';
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    let valid = false;
    
    // 8方向すべてをチェック
    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let foundOpposite = false;
      
      // ボード外にならないようにチェック
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) {
          // 空のセルに到達した場合、この方向は無効
          break;
        }
        
        if (board[r][c] === oppositeColor) {
          // 相手の色のコマを見つけた
          foundOpposite = true;
        } else if (board[r][c] === color && foundOpposite) {
          // 自分の色のコマを見つけ、その間に相手の色のコマがある
          valid = true;
          break;
        } else {
          // 自分の色のコマを見つけたが、間に相手の色のコマがない
          break;
        }
        
        r += dx;
        c += dy;
      }
      
      if (valid) {
        break;
      }
    }
    
    return valid;
  };

  // コマをひっくり返す数を計算する関数（実際にはひっくり返さない）
  const getFlippedCount = (board, row, col, color) => {
    const oppositeColor = color === 'black' ? 'white' : 'black';
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    let totalFlipped = 0;
    
    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let flippable = [];
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === oppositeColor) {
        flippable.push({ row: r, col: c });
        r += dx;
        c += dy;
      }
      
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === color && flippable.length > 0) {
        totalFlipped += flippable.length;
      }
    }
    
    return totalFlipped;
  };

  // コマを置く関数
  const placeDisc = (row, col, color) => {
    if (!gameStarted || gameOver || currentTurn !== color || !isValidMove(board, row, col, color)) {
      return;
    }
    
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = color;
    
    // ひっくり返す処理
    const flippedCount = flipDiscs(newBoard, row, col, color);
    
    // 特別な効果（5つ以上ひっくり返した場合）
    if (color === playerColor && flippedCount >= 5) {
      const greatMoveMessage = IkemenLines.playerGreatMove[Math.floor(Math.random() * IkemenLines.playerGreatMove.length)];
      setMessage(greatMoveMessage);
      setSpecialEffectActive(true);
      setIkemenExpression(IkemenExpressions.SHOCKED);
      setTimeout(() => setSpecialEffectActive(false), 2000);
    } else if (color === playerColor) {
      // プレイヤーの通常の手
      const goodMove = flippedCount >= 3;
      const messagePool = goodMove ? IkemenLines.playerGoodMove : IkemenLines.playerMove;
      const moveMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
      setMessage(moveMessage);
      setIkemenExpression(goodMove ? IkemenExpressions.SURPRISED : IkemenExpressions.NORMAL);
    }
    
    // スコア更新
    updateScores(newBoard);
    
    // ボード更新
    setBoard(newBoard);
    
    // 次のターンへ
    const nextColor = color === 'black' ? 'white' : 'black';
    setCurrentTurn(nextColor);
    
    // 次のプレイヤーの有効な手があるかチェック
    const nextMoves = getValidMoves(newBoard, nextColor);
    setAvailableMoves(nextMoves);
    
    if (nextMoves.length === 0) {
      // 次のプレイヤーが打つ場所がない場合、さらに次のプレイヤーへ
      const nextNextColor = nextColor === 'black' ? 'white' : 'black';
      const nextNextMoves = getValidMoves(newBoard, nextNextColor);
      
      if (nextNextMoves.length === 0) {
        // ゲーム終了
        endGame(newBoard);
      } else {
        setMessage(`${nextColor === 'black' ? '黒' : '白'}はパスです。${nextNextColor === 'black' ? '黒' : '白'}の番です。`);
        setCurrentTurn(nextNextColor);
        setAvailableMoves(nextNextMoves);
        
        if (nextNextColor === cpuColor) {
          setTimeout(() => cpuMove(newBoard, nextNextColor, playerColor), 1000);
        }
      }
    } else if (nextColor === cpuColor) {
      // CPU の手番
      setTimeout(() => cpuMove(newBoard, nextColor, playerColor), 1000);
    }
  };

  // コマをひっくり返す関数
  const flipDiscs = (board, row, col, color) => {
    const oppositeColor = color === 'black' ? 'white' : 'black';
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    let totalFlipped = 0;
    
    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let flippable = [];
      
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === oppositeColor) {
        flippable.push({ row: r, col: c });
        r += dx;
        c += dy;
      }
      
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === color && flippable.length > 0) {
        for (const { row: fr, col: fc } of flippable) {
          board[fr][fc] = color;
          totalFlipped++;
        }
      }
    }
    
    return totalFlipped;
  };

  // スコア更新関数
  const updateScores = (board) => {
    let white = 0;
    let black = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 'white') {
          white++;
        } else if (board[row][col] === 'black') {
          black++;
        }
      }
    }
    
    setScores({ white, black });
  };

  // ゲーム終了判定
  const endGame = (board) => {
    const { white, black } = scores;
    let winner;
    
    if (white > black) {
      winner = 'white';
    } else if (black > white) {
      winner = 'black';
    } else {
      winner = 'draw';
    }
    
    setWinner(winner);
    setGameOver(true);
    
    // 勝敗メッセージと表情
    if (winner === cpuColor) {
      const winMessage = IkemenLines.cpuWin[Math.floor(Math.random() * IkemenLines.cpuWin.length)];
      setMessage(winMessage);
      setIkemenExpression(IkemenExpressions.HAPPY);
    } else if (winner === playerColor) {
      const loseMessage = IkemenLines.cpuLose[Math.floor(Math.random() * IkemenLines.cpuLose.length)];
      setMessage(loseMessage);
      setIkemenExpression(IkemenExpressions.SAD);
    } else {
      setMessage('引き分けだね！なかなか面白い勝負だったよ！');
      setIkemenExpression(IkemenExpressions.SMILE);
    }
  };

  // CPU の動き
  const cpuMove = (currentBoard, color, playerCol) => {
    const validMoves = getValidMoves(currentBoard, color);
    
    if (validMoves.length === 0) {
      // 打つ場所がない場合はパス
      const nextColor = color === 'black' ? 'white' : 'black';
      const nextMoves = getValidMoves(currentBoard, nextColor);
      
      if (nextMoves.length === 0) {
        // ゲーム終了
        endGame(currentBoard);
      } else {
        setMessage(`${color === 'black' ? '黒' : '白'}はパスです。${nextColor === 'black' ? '黒' : '白'}の番です。`);
        setCurrentTurn(nextColor);
        setAvailableMoves(nextMoves);
      }
      return;
    }
    
    // 簡易的なAI: 最もたくさんコマをひっくり返せる場所を選ぶ
    let bestMove = validMoves[0];
    let maxFlipped = -1;
    
    for (const move of validMoves) {
      const testBoard = JSON.parse(JSON.stringify(currentBoard));
      testBoard[move.row][move.col] = color;
      const flippedCount = getFlippedCount(testBoard, move.row, move.col, color);
      
      if (flippedCount > maxFlipped) {
        maxFlipped = flippedCount;
        bestMove = move;
      }
    }
    
    // CPUのメッセージを選択
    let cpuMessage;
    if (maxFlipped >= 5) {
      cpuMessage = IkemenLines.cpuGreatMove[Math.floor(Math.random() * IkemenLines.cpuGreatMove.length)];
      setIkemenExpression(IkemenExpressions.PROUD);
      setSpecialEffectActive(true);
      setTimeout(() => setSpecialEffectActive(false), 2000);
    } else if (maxFlipped >= 3) {
      cpuMessage = IkemenLines.cpuGoodMove[Math.floor(Math.random() * IkemenLines.cpuGoodMove.length)];
      setIkemenExpression(IkemenExpressions.PROUD);
    } else {
      cpuMessage = IkemenLines.cpuMove[Math.floor(Math.random() * IkemenLines.cpuMove.length)];
      setIkemenExpression(IkemenExpressions.NORMAL);
    }
    setMessage(cpuMessage);
    
    // 選んだ場所にコマを置く
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    newBoard[bestMove.row][bestMove.col] = color;
    
    // ひっくり返す処理
    flipDiscs(newBoard, bestMove.row, bestMove.col, color);
    
    // スコア更新
    updateScores(newBoard);
    
    // ボード更新
    setBoard(newBoard);
    
    // 次のターンへ
    const nextColor = color === 'black' ? 'white' : 'black';
    setCurrentTurn(nextColor);
    
    // 次のプレイヤーの有効な手があるかチェック
    const nextMoves = getValidMoves(newBoard, nextColor);
    setAvailableMoves(nextMoves);
    
    if (nextMoves.length === 0) {
      // 次のプレイヤーが打つ場所がない場合、さらに次のプレイヤーへ
      const nextNextColor = nextColor === 'black' ? 'white' : 'black';
      const nextNextMoves = getValidMoves(newBoard, nextNextColor);
      
      if (nextNextMoves.length === 0) {
        // ゲーム終了
        endGame(newBoard);
      } else {
        setMessage(`${nextColor === 'black' ? '黒' : '白'}はパスです。${nextNextColor === 'black' ? '黒' : '白'}の番です。`);
        setCurrentTurn(nextNextColor);
        setAvailableMoves(nextNextMoves);
        
        if (nextNextColor === cpuColor) {
          setTimeout(() => cpuMove(newBoard, nextNextColor, playerColor), 1000);
        }
      }
    }
  };

  // クリック処理
  const handleCellClick = (row, col) => {
    if (currentTurn === playerColor) {
      placeDisc(row, col, playerColor);
    }
  };

  // ゲーム開始
  useEffect(() => {
    initializeGame();
  }, []);

  // イケメンお兄さんの表情に対応する画像URLを取得
  const getIkemenImageUrl = () => {
    // 同じディレクトリにある画像ファイルの名前をマッピング
    const imageMap = {
      [IkemenExpressions.NORMAL]: "通常.png",
      [IkemenExpressions.SMILE]: "笑顔.png",
      [IkemenExpressions.SURPRISED]: "驚き.png", 
      [IkemenExpressions.PROUD]: "ドヤ顔.png",
      [IkemenExpressions.SHOCKED]: "ショック.png",
      [IkemenExpressions.HAPPY]: "喜び.png",
      [IkemenExpressions.SAD]: "悲しみ.png"
    };
    
    // 現在の表情に合った画像を返す
    return imageMap[ikemenExpression] || "通常.png";
  };

  // セルのレンダリング
  const renderCell = (row, col) => {
    const isValid = availableMoves.some(move => move.row === row && move.col === col);
    
    return (
      <div 
        key={`${row}-${col}`} 
        className={`w-12 h-12 border border-green-800 flex items-center justify-center bg-green-700 relative
          ${isValid && currentTurn === playerColor ? 'cursor-pointer hover:bg-green-600' : ''}`}
        onClick={() => isValid && handleCellClick(row, col)}
      >
        {board[row] && board[row][col] && (
          <div className={`w-10 h-10 rounded-full ${board[row][col] === 'black' ? 'bg-black' : 'bg-white'}`}></div>
        )}
        {isValid && currentTurn === playerColor && (
          <div className="absolute w-4 h-4 rounded-full bg-green-500 opacity-60"></div>
        )}
      </div>
    );
  };

  return (
    <div className={`p-4 flex flex-col items-center ${specialEffectActive ? 'animate-pulse' : ''}`}>
      <h1 className="text-2xl font-bold mb-4">オセロゲーム</h1>
      
      <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
        {/* 左側：スコアとメッセージ */}
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-8 mb-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-black mr-2"></div>
              <span>{scores.black}</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white border border-gray-400 mr-2"></div>
              <span>{scores.white}</span>
            </div>
          </div>
          
          <div className="mt-2 mb-2">
            <span>あなたの色: </span>
            <span className={`inline-block w-4 h-4 rounded-full ${playerColor === 'black' ? 'bg-black' : 'bg-white border border-gray-400'}`}></span>
            <span> / 現在の手番: </span>
            <span className={`inline-block w-4 h-4 rounded-full ${currentTurn === 'black' ? 'bg-black' : 'bg-white border border-gray-400'}`}></span>
          </div>
          
          <div className="border-4 border-green-900 bg-green-800 grid grid-cols-8 gap-0">
            {Array(8).fill().map((_, row) => (
              <React.Fragment key={`row-${row}`}>
                {Array(8).fill().map((_, col) => renderCell(row, col))}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* 右側：イケメンお兄さんのイラストとセリフ */}
        <div className="flex flex-col items-center max-w-xs">
          {/* イケメンお兄さんのイラスト */}
          <div className="w-40 h-40 mb-2 flex items-center justify-center">
            <img 
              src={getIkemenImageUrl()} 
              alt={`イケメンお兄さん (${ikemenExpression})`}
              className="max-w-full max-h-full"
            />
          </div>
          
          {/* セリフ */}
          <div className={`p-3 rounded-lg border-2 border-gray-300 bg-white min-h-16 flex items-center justify-center w-full ${specialEffectActive ? 'bg-yellow-100 font-bold text-lg' : ''}`}>
            {message}
          </div>
        </div>
      </div>
      
      {gameOver && (
        <div className="mt-4">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={initializeGame}
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  );
};

export default OthelloGame;