
// /*js moudle for the # chess game*/
(function ($) {

	'use strict';

	const _RP_TPL = '<span class="round-piece"></span>';
	const _SP_TPL = '<span class="square-piece"></span>';

	let game = function () {};

	game.prototype = $.extend(game.prototype, {

		init: function (options) {
			this.options = options || {
				chess_boarder: '',
				result_wrapper: '',
				dimension: 3
			};
			this.chess_boarder = $(this.options.chess_boarder);
			this.chess_piece_wrapper = this.chess_boarder.find('li');
			this.result_wrapper = $(this.options.result_wrapper);
			this.dimension = this.options.dimension;

			for( let i = 0; i< this.chess_piece_wrapper.length; i++) {
				this.chess_piece_wrapper[i].index_x = parseInt(i / this.dimension);
				this.chess_piece_wrapper[i].index_y = parseInt(i % this.dimension);
			}

			let _self = this;
			this.chess_piece_wrapper.on('click', function () {
				let n = _self.dimension;
				_self._generate_piece(this,'first');

				if(_self._check_if_win(this.index_x, this.index_y, n, 'rp')) {
					return;
				}

				let next_target = _self._get_best_move();
				setTimeout( () => {
					_self._generate_piece(next_target, 'second');

					if( _self._check_if_win(next_target.index_x, next_target.index_y, n, 'sp')) {
						return;
					}
				}, 1000);

			});
		},

		_generate_piece: function (element,player) {
			if (player == 'first') {
				$(element).html(_RP_TPL).removeClass('empty').addClass('rp').off('click');	
			}else{
				$(element).html(_SP_TPL).removeClass('empty').addClass('sp').off('click');	
			}
		},

		_get_random_blcok: function () {
			var empty_block_list =  this.chess_boarder.find('.empty');

			if (empty_block_list.length !== 0) {
				var x = parseInt( Math.random() * empty_block_list.length, 10);
			}

			return empty_block_list[x];
		},

		_get_best_move: function (x1, y1, n) {

			var self_list = $(this.chess_piece_wrapper).find('.sp');
			var empty_block_list =  this.chess_boarder.find('.empty');

			this.isEmpty(elements) => {
				for(let i in elements) {
					let x = elements[i][0], y = elements[i][1];
					if( x >= 0 && x < n && y >= 0 && y < n   && $(this.chess_piece_wrapper[x*n + y]).hasClass('empty')) {
						return [x, y] ;
					}else{
						return false;
					}
				}
			}

			this.calculate(x,y) => {

				for(let i=x-1; i<=x+1; i++) {
					let score = 0;
					for(let j=y-1; j<=y+1; j++) {
						if(!( i === x && j === y) &&(this.check(i,j,player))) {
							let elements = new Array;
							elements.push([i+(x-i)*2,j+(y-j)*2], [x+(i-x)*2, y+(j-y)*2])
							if(this.isEmpty(elements)) {
								return this.isEmpty(elements);
							}
						}
					}
				}

				for(let i=x-2; i<=x+2; i+=2) {
					let score = 0;
					for(let j=y-2; j<=y+2; j+=2) {
						if(!( i === x && j === y) &&(this.check(i,j,player))) {
							let elements = new Array;
							elements.push([(i+x)/2,(i+y)/2]);
							if(this.isEmpty(elements)) {
								return this.isEmpty(elements);
							}
						}
					}
				}
			return false;
			}

			for(let i=0; i < self_list.length; i++) {
				if(this.calculate(self_list[i].index_x, self_list[i].index_y)) {
					return empty_block_list[self_list[i].index_x * n + self_list[i].index_y]
				}
			}

			if(this.calculate(x1, y1)){
				return empty_block_list[x1 * n + y1]; 
			}else{
				return this._get_random_blcok();
			}
		},

		_check_if_win: function (x, y, n,player) {

			this.piece_martrix = new Array;

			for(let i = 0; i < n; i++) {
				this.piece_martrix[i] = new Array;
				for(let j = 0; j < n; j++) {
					this.piece_martrix[i][j] = $(this.chess_piece_wrapper[i*n + j]);
				}
			}

			this.check = function (x,y, player) {
				
				if( x >= 0 && x < n && y >= 0 && y < n ) {
					return $(this.chess_piece_wrapper[x*n + y]).hasClass(player);
				}else{
					return false;
				}
			}

			if( this.check(x-1,y, player) && this.check(x+1,y, player) || this.check(x-1,y, player) && this.check(x-2,y, player) || this.check(x+1,y, player) && this.check(x+2,y, player) ) {
				this._end_game(player);
				return true;
			}

			if( this.check(x,y-1, player) && this.check(x,y+1,player) || this.check(x,y-1,player) && this.check(x,y-2,player) || this.check(x,y+1, player) && this.check(x,y+2, player) ) {
				this._end_game(player);
				return true;
			}

			if( this.check(x-1,y+1, player) && this.check(x+1,y-1, player) || this.check(x-1,y+1, player) && this.check(x-2,y+2, player) || this.check(x+1,y-1, player) && this.check(x+2,y-2, player) ) {
				this._end_game(player);
				return true;
			}

			if( this.check(x-1,y-1,player) && this.check(x+1,y+1,player) || this.check(x-1,y-1, player) && this.check(x-2,y-2, player) || this.check(x+1,y+1, player) && this.check(x+2,y+2, player) ) {
				this._end_game(player);
				return true;
			}

			if(this.chess_boarder.find('.empty').length === 0) {
				this._end_game('No one');
				return true;
			}

			return false;
 		},

 		_end_game: function (player) {
 			this.result_wrapper.css('display', 'block');
 			this.result_wrapper.html('<p>'+ player +' wins!</p><br/><a class="restart_btn" href="javascript:;">restart!</a>');
 			this.chess_piece_wrapper.off('click');
 			$('.restart_btn').on('click', () => {
 				this._restart_game()
 			});
 		},

 		_restart_game: function() {
 			this.chess_piece_wrapper.empty().removeClass().addClass('empty');
 			this.result_wrapper.css('display', 'none');
 			this.init(this.options);
 		}
	});

	window.game = game;

})(jQuery);