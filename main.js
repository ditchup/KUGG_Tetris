enchant();

/*
TODO
�E����̕s�
FixedTetromino�̓V����P�}�X�i���Q�}�X�j��ɏグ��i��ԏ�ŉ�]�ł���悤�ɁB�E�E�E�����ŌŒ肳�ꂽ��ǂ����悤�j
�n�[�h�h���b�v�ŁA�{�^���������ςȂ����Ǝ��̃u���b�N���n�[�h�h���b�v���Ă��܂��B�i�둀��������j
���o�����琔�t���[���҂悤�ɂ���̂͂ǂ����B�܂��ϐ���������E�E�E�B
���A�����ē��͂ł��Ȃ��悤�ɂ����B����ɉ������ςȂ��͂ł��Ȃ��B
�~�F�n�[�h�h���b�v���ɉ��ړ��ł����Ⴄ�B�i��]���j
���n�[�h�h���b�v���͑�����󂯕t���Ȃ��悤�ɂ���
���F�P�t���[�����ɍő�P�u���b�N���������Ȃ��B

		
�E����UP
FallingTetromino��blocks���s��`���łȂ����X�g�`���ɂ���
�E�����K���H
FallingTetromino��rotateRight/Left�̖��O��makeRightRotatedBlocks�Ƃł��ς���
�����t�@�N�^�����O�������ł͕ʖ����E�E�E
FixedTetromino��hitDetect�̖��O��ς���Bdetect???�Ƃ��H

�E�E�E�d���Ȃ��Ă����B
*/


var watch;

var BLOCKSIZE = 16;
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
		this.ox = 3;
		this.oy = 0; // ���������ƍŏ���]�ł��Ȃ��̂����B��detectHit
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
		this.ox = 3;
		this.oy = -2; // �V��͖����H����H��hitDetect
	} else if (type == "Z") {
		this.blocks = [
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
		];
		this.ox = 3;
		this.oy = -2;
	} else if (type == "J") { // �ǂ�����ĉ�]������H������{������
		this.blocks = [
			[0,0,0,0,0],
			[0,0,0,1,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
		];
		this.ox = 3;
		this.oy = -1;
	} else if (type == "L") {
		this.blocks = [
			[0,0,0,0,0],
			[0,1,0,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
		];
		this.ox = 3;
		this.oy = -1;
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

// �V��ނ̃e�g���~�m��p�ӂ���
var TetrominoFactory = function () {
};

TetrominoFactory.prototype.makeTetromino = function (type) {
	return new Tetromino(type);
};

TetrominoFactory.prototype.makeRandomTetromino = function () {
	var types = ["I", "O", "S", "Z", "J", "L", "T"];
	return this.makeTetromino(types[Math.floor(Math.random() * 7)]); 
};


var tetrominofactory = new TetrominoFactory();

// �������̃e�g���~�m
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
		]; // �S��ޕ��p�ӂ���H
		
		// �u���b�N�̊G������
		this.drawblocks();
		*/
		this.reset();
	}
});

FallingTetromino.prototype.reset = function () {
	var tetromino = tetrominofactory.makeRandomTetromino();
	this.blocks = tetromino.blocks;
	this.type = tetromino.type;
	
	this.x = tetromino.ox * BLOCKSIZE;
	this.y = tetromino.oy * BLOCKSIZE;
	
	// �u���b�N�̊G������
	this.drawblocks();
};

FallingTetromino.prototype.drawblocks = function () {
	var ctx = this.image.context;
	var i, j;
	ctx.clearRect(0, 0, this.width, this.height);
	for (i = 0; i < this.blocks.length; i++) {
		for (j = 0; j < this.blocks[i].length; j++) {
			if (this.blocks[i][j] == 1) {
				/*if (i == 2 && j == 2)
					ctx.fillStyle = "red";
				else*/
					ctx.fillStyle = "green";
				
				ctx.fillRect(j*BLOCKSIZE, i*BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
			}
		}
	}
}

FallingTetromino.prototype.moveLeft = function () {
	// �i�����u���b�N��ǂ��Ȃ���΁j
	this.x -= BLOCKSIZE;
}

FallingTetromino.prototype.moveRight = function () {
	// �i�����u���b�N��ǂ��Ȃ���΁j
	this.x += BLOCKSIZE;
}

FallingTetromino.prototype.moveDown = function () {
	// �i�����u���b�N�⏰���Ȃ���΁j
	this.y += BLOCKSIZE;
}

FallingTetromino.prototype.rotateRight = function () {
	if (this.type == "O")
		return this.blocks; // ��]���Ȃ�

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
				// ���W�n��x�����E�����Ay���W��������
				// (0,0)�����_�Ƃ������W����A(2, 2)�𒆐S�ɂ������W��
				// (j, i) -> (x, y) = (j - 2, i - 2)
				// �u90�x�v��]������B���W�n�ɒ���
				// (x, y) -> (x', y') = (-y, x)
				// (x', y') -> (j', i') = (x' + 2, y' + 2) = (-y + 2, x + 2) = (4 - i, j)
				newblocks[j][4 - i] = 1;
			}
		}
	}
	return newblocks;
	// ������]�㑼�̃u���b�N�Əd�Ȃ�Ȃ����
	//this.blocks = newblocks;
	//this.drawblocks();
}

FallingTetromino.prototype.rotateLeft = function () {
	if (this.type == "O")
		return this.blocks; // ��]���Ȃ�

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
				// ���W�n��x�����E�����Ay���W��������
				// (0,0)�����_�Ƃ������W����A(2, 2)�𒆐S�ɂ������W��
				// (j, i) -> (x, y) = (j - 2, i - 2)
				// �u-90�x�v��]������B���W�n�ɒ���
				// (x, y) -> (x', y') = (y, -x)
				// (x', y') -> (j', i') = (x' + 2, y' + 2) = (y + 2, -x + 2) = (i, 4 - j)
				newblocks[4 - j][i] = 1;
			}
		}
	}
	return newblocks;
	// ������]�㑼�̃u���b�N�Əd�Ȃ�Ȃ����
	//this.blocks = newblocks;
	//this.drawblocks();
} // �ɂ������rotateRight�Ƃ܂Ƃ߂�H

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

// �d�Ȃ�u���b�N������΁A�����blocks���̈ʒu��\���z����A�����łȂ����null��Ԃ��B
// ox, oy��falling_block��x, y���W���ABLOCKSIZE�Ŋ��������́B�i�����Ŋ���H�j
// �n���ꂽ���W�ƃu���b�N�̑g�ݍ��킹���͈͊O�ł��z���Ԃ��B
// ���E�ǁi�͈͊O�Q�}�X�ȓ��j�Ȃ�A�����Ƀu���b�N�����邩�̂悤�ɑ����blocks���̈ʒu��Ԃ��B
// ����ȏ㗣�ꂽ�ʒu�ɂ���ꍇ�A�����킩�������_�ŁA���̎��̒l�i�H�H�H�j��-1�A��������̎��̒l��0�Ƃ����z���Ԃ��B
FixedTetromino.prototype.hitDetect = function (ox, oy, target_blocks) {
	var i, j;
	for (i = 0; i < target_blocks.length; i++) {
		for (j = 0; j < target_blocks[i].length; j++) {
			if (target_blocks[i][j] == 1) {
				// this.blocks�͈̔͊O�̏ꍇ
				if (this.blocks.length <= i + oy) {
					// ���ւ̐ڐG
					if (this.blocks.length + 2 >= i + oy) {
						return [i, j]
					} else {
						console.log("hitDetect: out of range y");
						return [0, -1];
					}
				}
				
				if (this.blocks[0].length <= j + ox) {
					// �E�̕ǂւ̐ڐG
					if (this.blocks[0].length + 2 >= j + ox) {
						return [i, j]
					} else {console.log("hitDetect: out of range x");
						return [-1, 0];
					}
				}
				
				if (0 > j + ox) {
					// ���̕ǂւ̐ڐG
					if (-2 <= j + ox) {
						return [i, j]
					} else {console.log("hitDetect: out of range x");
						return [-1, 0];
					}
				}
				
				// i + oy���}�C�i�X�̎�
				// �i��ʊO�̌Œ肳�ꂽ�u���b�N���\�����Ȃ������ŁA���݂���悤�ɂ���΁A���̕���ɓ��邱�Ƃ͂Ȃ��Ȃ�H�j
				if (0 > i + oy) {
					console.log("hitDetect: out of range y minus");
					return [0, -1];
				}
				
				// this.blocks�͈͓̔��̏ꍇ
				// �d�Ȃ��Ă��瑊���blocks���̈ʒu��Ԃ��B
				if (this.blocks[i + oy][j + ox] == 1) {
					return [i, j];
				}
			}
				
		}
	}
	
	// �ǂ��ɂ��d�Ȃ�Ȃ�����
	return null;
};

// �������̃e�g���~�m���Œ肷��B
// �e�g���~�m���\������u���b�N���Œ肳�ꂽ�e�g���~�m�i�̃u���b�N�j�ɒǉ�����B�E�E�E�H�i���u�Œ肳�ꂽ�e�g���~�m�v�����O�ς���H�j
FixedTetromino.prototype.fixBlocks = function (target_tetromino) {
	var i, j;
	var ox = target_tetromino.x / BLOCKSIZE;
	var oy = target_tetromino.y / BLOCKSIZE;
	var target_blocks = target_tetromino.blocks;
	
	// ���łɂ���u���b�N�Əd�Ȃ��Ă���A�͈͊O�ɂ������肵�Ȃ����`�F�b�N����
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
	// �u���b�N�̏�Ԃ��ς�����̂ŁA�u���b�N���ĕ`�悷��B�i���̏ꏊ�������H�j
	this.drawblocks();
};

// �������i�̔ԍ�����ꂽ�z��������ŕԂ��B�i�Ȃ���΋�z���Ԃ��j
// ���S���������Ȃ��Ă����������ˁH
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

// �������i������
// �������i�̐������V�����i���ォ��ǉ������B
// ����͂Ђǂ�
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
				continue; // lines�Ɋ܂܂�Ă����΂�
			}
		}
		newblocks.push(this.blocks[i]);
	}
	
	// �i���ォ��ǉ�
	for (i = 0; i < lines.length; i++) {
		var line = [];
		for (j = 0; j < this.W; j++) { // [0,0,...,0]�����B
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
		
		//var previous_input = {left: false, right: false, up: false, down: false};
		game.keybind('Z'.charCodeAt(0), 'a');
        	game.keybind('X'.charCodeAt(0), 'b');
		
		var moveLR_interval = 3;
		var key_count = {left: 0, right: 0, up: 0, down: 0, a: 0, b: 0};
		
		var fall_wait = 4 * 64 / FPS;
		var fall_timer = fall_wait;
		var hard_drop_flag = false;
		
		// �قȂ�I�u�W�F�N�g���ꏏ�Ɉ����Ƃ��A���܂����������킩��Ȃ��E�E�E
		// rootScene�̃C�x���g���X�i�ɂ��ׂ�����Ȃ��H
		falling_tetromino.addEventListener("enterframe", function () {
			// ���[�U����̑�����󂯕t����
			var newblocks;
			if (!hard_drop_flag && game.input.left && (key_count.left % moveLR_interval) == 0) {
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE - 1, this.y/BLOCKSIZE, this.blocks) == null) {
					this.moveLeft();
				}
			}
			if (!hard_drop_flag && game.input.right && (key_count.right % moveLR_interval) == 0) {
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE + 1, this.y/BLOCKSIZE, this.blocks) == null) {
					this.moveRight();
				}
			}
			/*if (game.input.down && (key_count.down % 4) == 0) { // �����ŗ�����^�C�~���O�ƁA���ˍ������E�E�E�Ȃɂ��ʂ̃p�����[�^�����L���āA���肷��H
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE + 1, this.blocks) == null) {
					this.moveDown();
				}
			}*/
			
			if (!hard_drop_flag && game.input.a && key_count.a == 0) {
				newblocks = this.rotateLeft();
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE, newblocks) == null) {
					this.blocks = newblocks;
					this.drawblocks();
				}
			}
			if (!hard_drop_flag && game.input.b && key_count.b == 0) {
				newblocks = this.rotateRight();
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE, newblocks) == null) {
					this.blocks = newblocks;
					this.drawblocks();
				}
			}
			
			// �n�[�h�h���b�v
			// �~�F�������ςȂ����Ǝ��̃u���b�N���n�[�h�h���b�v���Ă��܂��B
			// ���o�����琔�t���[���҂悤�ɂ���̂͂ǂ����B�i�܂��ϐ���������E�E�E�j
			if (game.input.up && key_count.up == 0) { //�@&& key_count.up == 0
				hard_drop_flag = true;
			}
			
			// ��������
			if (game.input.down) {
				fall_timer -= 4;
			} else {
				fall_timer -= 1;
			}
			
			// �L�[����̋L�^
			if (game.input.left) {
				key_count.left++;
			} else {
				key_count.left = 0
			}
			if (game.input.right) {
				key_count.right++;
			} else {
				key_count.right = 0
			}
			/*
			if (game.input.down) {
				key_count.down++;
			} else {
				key_count.down = 0
			}*/
			if (game.input.up) {
				key_count.up++;
			} else {
				key_count.up = 0
			}
			if (game.input.a) {
				key_count.a++;
			} else {
				key_count.a = 0
			}
			if (game.input.b) {
				key_count.b++;
			} else {
				key_count.b = 0
			}
			
			// ���Ԍo�߂ŗ�����i���H�v������H�j
			if (hard_drop_flag || fall_timer <= 0) { // this.age % 20 == 0
				fall_timer = fall_wait;
				if (fixed_tetromino.hitDetect(this.x/BLOCKSIZE, this.y/BLOCKSIZE + 1, this.blocks) == null) {
					this.moveDown();
				} else {
					hard_drop_flag = false;
					// �u���b�N���Œ肷��ifixed_block�Ƀu���b�N��ǉ�����j
					fixed_tetromino.fixBlocks(this);
					
					// �������i��T��
					var perfectlines = fixed_tetromino.getPerfectLine();
					// �������i������
					if (perfectlines.length != 0) {
						console.log(perfectlines);
						fixed_tetromino.removeLines(perfectlines);
					}
					fixed_tetromino.drawblocks();
					
					// �V�����������̃u���b�N���o��������B
					this.reset();
					
					if (fixed_tetromino.hitDetect(
						this.x / BLOCKSIZE,
						this.y / BLOCKSIZE,
						this.blocks
					) != null) {
						// �I���������I
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
	//game.debug();
	game.start();
};
