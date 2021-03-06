enchant();

/*
TODO
*/


var watch;

var BLOCKSIZE = 16
var FPS = 30;

var Tetromino = function (type) {
	this.type = type;
	if (type == "I") {
		this.blocks = [
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,0,0,0],
		];
		this.ox = 0;
		this.oy = 0;
	} else if (type == "O") {
		this.blocks = [
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
		];
		this.ox = 3;
		this.oy = -1;
	} else if (type == "S") {
		this.blocks = [
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,1,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
		];
		this.ox = 0;
		this.oy = 0;
	} else if (type == "Z") {
		this.blocks = [
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
		];
		this.ox = 0;
		this.oy = 0;
	} else if (type == "J") {
		this.blocks = [
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,1,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
		];
		this.ox = 0;
		this.oy = 0;
	} else if (type == "L") {
		this.blocks = [
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,1,0,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
		];
		this.ox = 0;
		this.oy = 0;
	} else if (type == "T") {
		this.blocks = [
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
		];
		this.ox = 3;
		this.oy = -1;
	}
}

// ７種類のテトロミノを用意する
var TetrominoFactory = function () {
};

TetrominoFactory.prototype.makeTetromino = function (type) {
	return new Tetromino(type);
};

TetrominoFactory.prototype.makeRandomTetromino = function () {
	var types = ["I", "O", "S", "Z", "J", "L", "T"];
	return this.makeTetromino(types[Math.floor(Math.random() * 7) ]); //Math.floor(Math.random() * 7) 
};


var tetrominofactory = new TetrominoFactory();

var FallingTetromino = Class.create(Sprite, {
	initialize: function () {
		Sprite.call(this, BLOCKSIZE * 5, BLOCKSIZE * 5);
		this.image = new Surface(this.width, this.height);
		/*this.blocks = [
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
		]; // 全種類分用意する？
		
		// ブロックの絵を書く
		this.drawblocks();
		*/
		this.reset();
	}
});

FallingTetromino.prototype.reset = function () {
	var tetromino = tetrominofactory.makeRandomTetromino();//makeTetromino("S");//makeRandomTetromino();
	this.blocks = tetromino.blocks; // 全種類分用意する？
	this.type = tetromino.type;
	
	this.x = tetromino.ox * BLOCKSIZE;
	this.y = tetromino.oy * BLOCKSIZE;
	
	// ブロックの絵を書く
	this.drawblocks();
};

FallingTetromino.prototype.drawblocks = function () {
	var ctx = this.image.context;
	var i, j;
	ctx.clearRect(0, 0, this.width, this.height);
	for (i = 0; i < this.blocks.length; i++) {
		for (j = 0; j < this.blocks[i].length; j++) {
			if (this.blocks[i][j] == 1) {
				if (i == 2 && j == 2)
					ctx.fillStyle = "red";
				else
					ctx.fillStyle = "green";
				
				ctx.fillRect(j*BLOCKSIZE, i*BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
			}
		}
	}
}

FallingTetromino.prototype.moveLeft = function () {
	// （もしブロックや壁がなければ）
	this.x -= BLOCKSIZE;
}

FallingTetromino.prototype.moveRight = function () {
	// （もしブロックや壁がなければ）
	this.x += BLOCKSIZE;
}

FallingTetromino.prototype.moveDown = function () {
	// （もしブロックや床がなければ）
	this.y += BLOCKSIZE;
}

FallingTetromino.prototype.rotateRight = function () {
	if (this.type == "O")
		return this.blocks; // 回転しない

	var newblocks = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];
	for (i = 0; i < this.blocks.length; i++) {
		for (j = 0; j < this.blocks[i].length; j++) {
			if (this.blocks[i][j] == 1) {
				// 座標系はx軸が右向き、y座標が下向き
				// (0,0)を原点とした座標から、(2, 2)を中心にした座標に
				// (j, i) -> (x, y) = (j - 2, i - 2)
				// 「90度」回転させる。座標系に注意
				// (x, y) -> (x', y') = (-y, x)
				// (x', y') -> (j', i') = (x' + 2, y' + 2) = (-y + 2, x + 2) = (4 - i, j)
				newblocks[j][4 - i] = 1;
			}
		}
	}
	return newblocks;
	// もし回転後他のブロックと重ならなければ
	//this.blocks = newblocks;
	//this.drawblocks();
}

FallingTetromino.prototype.rotateLeft = function () {
	if (this.type == "O")
		return this.blocks; // 回転しない

	var newblocks = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];
	for (i = 0; i < this.blocks.length; i++) {
		for (j = 0; j < this.blocks[i].length; j++) {
			if (this.blocks[i][j] == 1) {
				// 座標系はx軸が右向き、y座標が下向き
				// (0,0)を原点とした座標から、(2, 2)を中心にした座標に
				// (j, i) -> (x, y) = (j - 2, i - 2)
				// 「-90度」回転させる。座標系に注意
				// (x, y) -> (x', y') = (y, -x)
				// (x', y') -> (j', i') = (x' + 2, y' + 2) = (y + 2, -x + 2) = (i, 4 - j)
				newblocks[4 - j][i] = 1;
			}
		}
	}
	return newblocks;
	// もし回転後他のブロックと重ならなければ
	//this.blocks = newblocks;
	//this.drawblocks();
} // 暇があればrotateRightとまとめる？

var FixedTetromino = Class.create(Sprite, {
	initialize: function () {
		var W = 10, H = 20;
		Sprite.call(this, W*BLOCKSIZE, H*BLOCKSIZE);
		this.W = W;
		this.H = H;
		this.image = new Surface(this.width, this.height);
		this.blocks = [
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,1,0,0,0],
			[1,1,0,0,0,1,1,0,0,0],
			[1,1,1,0,1,1,1,0,0,0]
		];
		
		this.drawblocks();
	}
});

FixedTetromino.prototype.drawblocks = function () {
	var ctx = this.image.context;
	var i, j;
	ctx.clearRect(0, 0, this.width, this.height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, this.width, this.height);
	for (i = 0; i < this.blocks.length; i++) {
		for (j = 0; j < this.blocks[i].length; j++) {
			if (this.blocks[i][j] == 1) {
				ctx.fillStyle = "blue";
				ctx.fillRect(j*BLOCKSIZE, i*BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
			}
		}
	}
};

// 重なるブロックがあれば、相手のblocks内の位置を表す配列を、そうでなければnullを返す。
// o_x, o_yはfalling_blockのx, y座標を、BLOCKSIZEで割ったもの。（ここで割る？）
// 渡された座標とブロックの組み合わせが範囲外でも配列を返す。
// 床・壁（範囲外２マス以内）なら、そこにブロックがあるかのように相手のblocks内の位置を返す。
// それ以上離れた位置にある場合、そうわかった時点で、その軸の値（？？？）を-1、もう一方の軸の値を0とした配列を返す。
FixedTetromino.prototype.hitDetect = function (ox, oy, target_blocks) {
	var i, j;
	for (i = 0; i < target_blocks.length; i++) {
		for (j = 0; j < target_blocks[i].length; j++) {
			if (target_blocks[i][j] == 1) {
				// this.blocksの範囲外の場合
				if (this.blocks.length <= i + oy) {
					// 床への接触
					if (this.blocks.length + 2 >= i + oy) {
						return [i, j]
					} else {
						console.log("hitDetect: out of range y");
						return [0, -1];
					}
				}
				
				if (this.blocks[0].length <= j + ox) {
					// 右の壁への接触
					if (this.blocks[0].length + 2 >= j + ox) {
						return [i, j]
					} else {console.log("hitDetect: out of range x");
						return [-1, 0];
					}
				}
				
				if (0 > j + ox) {
					// 左の壁への接触
					if (-2 <= j + ox) {
						return [i, j]
					} else {console.log("hitDetect: out of range x");
						return [-1, 0];
					}
				}
				
				// i + oyがマイナスの時
				// （画面外の固定されたブロックが表示しないだけで、存在するようにすれば、この分岐に入ることはなくなる？）
				if (0 > i + oy) {
					console.log("hitDetect: out of range y minus");
					return [0, -1];
				}
				
				// this.blocksの範囲内の場合
				// 重なってたら相手のblocks内の位置を返す。
				if (this.blocks[i + oy][j + ox] == 1) {
					return [i, j];
				}
			}
				
		}
	}
	
	// どこにも重ならなかった
	return null;
};

// 落下中のテトロミノを固定する。
// テトロミノを構成するブロックを固定されたテトロミノ（のブロック）に追加する。・・・？（★「固定されたテトロミノ」→名前変える？）
FixedTetromino.prototype.fixBlocks = function (target_tetromino) {
	var i, j;
	var ox = target_tetromino.x / BLOCKSIZE;
	var oy = target_tetromino.y / BLOCKSIZE;
	var target_blocks = target_tetromino.blocks;
	
	// すでにあるブロックと重なってたり、範囲外にあったりしないかチェックする
	if (this.hitDetect(ox, oy, target_blocks) != null) {
		console.log("fixBlocks: Wrong position or Wrong blocks")
		return;
	}
	
	for (i = 0; i < target_blocks.length; i++) {
		for (j = 0; j < target_blocks[i].length; j++) {
			if (target_blocks[i][j] == 1) {
				this.blocks[i + oy][j + ox] = 1;
			}
		}
	}
	// ブロックの状態が変わったので、ブロックを再描画する。（他の場所がいい？）
	this.drawblocks();
};

// 揃った段の番号を入れた配列を昇順で返す。（なければ空配列を返す）
// ★全部走査しなくてもいいかもね？
FixedTetromino.prototype.getPerfectLine = function () {
	var i, j;
	var perfectlines = [];
	for (i = 0; i < this.blocks.length; i++) {
		for (j = 0; j < this.blocks[i].length; j++) {
			if (this.blocks[i][j] == 0) {
				break;
			}
		}
		if (j == this.blocks[i].length) {
			perfectlines.push(i);
		}
	}
	return perfectlines;
};

// 揃った段を消す
// 消した段の数だけ新しい段が上から追加される。
// これはひどい
FixedTetromino.prototype.removeLines = function (lines) {
	var newblocks = [];
	var i, j, k;
		
	for (i = 0; i < this.blocks.length; i++) {
		if (lines.length != 0) {
			for (k = 0; k < lines.length; k++) {
				if (i == lines[k]) {
					break;
				}
			}
			if (k != lines.length) {
				continue; // linesに含まれてたら飛ばす
			}
		}
		newblocks.push(this.blocks[i]);
	}
	
	// 段を上から追加
	for (i = 0; i < lines.length; i++) {
		var line = [];
		for (j = 0; j < this.W; j++) { // [0,0,...,0]を作る。
			line.push(0);
		}
		newblocks.unshift(line);
	}
	
	this.blocks = newblocks;
};


window.onload = function () {
	var game = new Core(320, 320);
	game.fps = FPS;
	//game.preload("chara1.png");
	game.onload = function(){
		var falling_tetromino = new FallingTetromino();//new Sprite(32, 32);
		game.rootScene.addChild(falling_tetromino);
		
		var fixed_tetromino = new FixedTetromino();
		game.rootScene.addChild(fixed_tetromino);
		
		// 異なるオブジェクトを一緒に扱うとき、うまい書き方がわかんない・・・
		falling_tetromino.addEventListener("enterframe", function () {
			// ユーザからの操作を受け付ける
			var newblocks;
			if (game.input.left) {
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE - 1, this.y/BLOCKSIZE, this.blocks) == null) {
					this.moveLeft();
				}
			}
			if (game.input.right) {
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE + 1, this.y/BLOCKSIZE, this.blocks) == null) {
					this.moveRight();
				}
			}
			if (game.input.down) {
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE + 1, this.blocks) == null) {
					this.moveDown();
				}
			}
			if (game.input.up) {
				newblocks = this.rotateRight();
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE, newblocks) == null) {
					this.blocks = newblocks;
					this.drawblocks();
				}
			}
			
			// 時間経過で落ちる（★工夫がいる？）
			if (this.age % 20 == 0) {
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE + 1, this.blocks) == null) {
					this.moveDown();
				} else {
					// ブロックを固定する（fixed_blockにブロックを追加する）
					fixed_tetromino.fixBlocks(this);
					
					// 揃った段を探す
					var perfectlines = fixed_tetromino.getPerfectLine();
					// 揃った段を消す
					if (perfectlines.length != 0) {
						console.log(perfectlines);
						fixed_tetromino.removeLines(perfectlines);
					}
					fixed_tetromino.drawblocks();
					
					// 新しい落下中のブロックを出現させる。
					this.reset();
					
					if (fixed_tetromino.hitDetect(
						this.x / BLOCKSIZE,
						this.y / BLOCKSIZE,
						this.blocks
					) != null) {
						// 終了したヨ！
						var ctx = fixed_tetromino.image.context;
						ctx.fillStyle = "red";
						function dr(x, y) {
							ctx.fillRect(x*BLOCKSIZE, y*BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
						};
						dr(0,8);dr(1,8);dr(2,8);	
						dr(0,9);
						dr(0,10);dr(1,10);dr(2,10);
						dr(0,11);
						dr(0,12);
						
						dr(4, 9);
						dr(4, 10);
						dr(4, 11);
						dr(4, 12);
						
						dr(6,9);dr(7,9);	dr(9,9);
						dr(6,10);dr(7,10);	dr(9,10);
						dr(6,11);	dr(8,11);dr(9,11);
						dr(6,12);	dr(8,12);dr(9,12);
						
						
						game.stop();
					}
				}
			}
		});
	};
	game.start();
};
