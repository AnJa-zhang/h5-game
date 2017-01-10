
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
				result_wrapper: ''
			};
			this.chess_boarder = $(this.options.chess_boarder);
			this.chess_piece_wrapper = this.chess_boarder.find('li');
			this.empty_piece_wrapper = this.chess_piece_wrapper;
			this.result_wrapper = $(this.options.result_wrapper);
			for( var i = 0; i< this.chess_piece_wrapper.length; i++) {
				this.chess_piece_wrapper[i].index = i;
			}

			var _self = this;
			this.chess_piece_wrapper.on('click', function () {
				_self._generate_piece(this,'first');
				if(_self._check_if_win(this.index,'rp')) {
					return;
				}
				var next_target = _self._get_random_blcok();
				setTimeout(function () {
					_self._generate_piece(next_target, 'second');
					if( _self._check_if_win(this.index,'sp')) {
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

		_check_if_win: function (x, player) {
			
			var result = false;

			this.prev = function (x) {
				return x - 1;
			}
			this.next = function (x) {
				return x + 1;
			}
			this.above = function (x) {
				return x - 3;
			}
			this.below = function (x) {
				return x + 3;
			}

			this.check = function (x, player) {
				return $(this.chess_piece_wrapper[x]).hasClass(player);
			}

			if( x % 3 === 1){
				
				if(this.check(this.prev(x), player) && this.check(this.next(x), player)) {
					result = true;
				}

				if(parseInt(x / 3, 10) === 1 && this.check(this.above(x), player) && this.check(this.below(x), player)) {
					result = true;
				}

				if(parseInt(x / 3, 10) === 1 && this.check(this.above(x) - 1, player) && this.check(this.below(x) + 1, player)) {
					result = true;
				}

				if(parseInt(x / 3, 10) === 1 && this.check(this.above(x) + 1, player) && this.check(this.below(x) - 1, player)) {
					result = true;
				}

				if(parseInt(x / 3, 10) !== 1 && this.check(4, player) && this.check(4 - (x - 4), player)){
					result = true;
				}

			}else{

				if( x % 3 === 0 && this.check(x + 1, player) && this.check(x + 2, player)){
					result = true;
				}

				if( x % 3 === 0 && this.check(3, player) && this.check(3 - (x - 3), player)){
					result = true;
				}

				if( x % 3 === 2 && this.check(x - 1, player) && this.check(x - 2, player)){
					result = true;
				}

				if( x % 3 === 2 && this.check(5, player) && this.check(5 - (x - 5), player)){
					result = true;
				}

				if( parseInt(x / 3, 10) === 1 && this.check(x + 3, player) && this.check(x - 3, player)){
					result = true;
				}

				if( parseInt(x / 3, 10) !== 1 && this.check(4, player) && this.check(4 - (x - 4), player)){
					result = true;
				}
			}

			if(result) {
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