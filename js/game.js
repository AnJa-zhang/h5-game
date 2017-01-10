
// /*js moudle for the # chess game*/
(function ($) {

	'use strict';

	var _RP_TPL = '<span class="round-piece"></span>';
	var _SP_TPL = '<span class="square-piece"></span>';

	var game = function () {};

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

			for( var i = 0; i< this.chess_piece_wrapper.length; i++) {
				this.chess_piece_wrapper[i].index_x = parseInt(i / this.dimension);
				this.chess_piece_wrapper[i].index_y = parseInt(i % this.dimension);
			}

			var _self = this;
			this.chess_piece_wrapper.on('click', function () {
				var _this = this;
				var n = _self.dimension;
				_self._generate_piece(this,'first');

				if(_self._check_if_win(this.index_x, this.index_y, n, 'rp')) {
					return;
				}

				var next_target = _self._get_random_blcok();
				setTimeout(function () {
					_self._generate_piece(next_target, 'second');

					if( _self._check_if_win(next_target.index_x, next_target.index_y, n, 'sp')) {
						return;
					}

				}, 1000);

			});
		},

		_generate_piece: function (element,player) {
			
			if (player == 'first') {
				var temp = _RP_TPL;
				$(element).addClass('rp');
			}else{
				var temp = _SP_TPL;
				$(element).addClass('sp');
			}

			$(element).html(temp).removeClass('empty').off('click');		
		},

		_get_random_blcok: function () {
			var empty_block_list =  this.chess_boarder.find('.empty');

			if (empty_block_list.length !== 0) {
				var x = parseInt(Math.random() * empty_block_list.length, 10);
			}

			return empty_block_list[x];
		},

		_check_if_win: function (x, y, n,player) {
			console.log(n);

			this.piece_martrix = new Array;
			for(var i = 0; i < n; i++) {
				this.piece_martrix[i] = new Array;
				for(var j = 0; j < n; j++) {
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
 			var _self = this;
 			this.result_wrapper.css('display', 'block');
 			this.result_wrapper.html('<p>'+ player +' wins!</p><br/><a class="restart_btn" href="javascript:;">restart!</a>');
 			this.chess_piece_wrapper.off('click');
 			$('.restart_btn').on('click', function() {
 				_self._restart_game()
 			});
 		},

 		_restart_game: function() {
 			var _self = this;
 			this.chess_piece_wrapper.empty().removeClass().addClass('empty');
 			this.result_wrapper.css('display', 'none');
 			this.init(_self.options);
 		}
	});

	window.game = game;

})(jQuery);