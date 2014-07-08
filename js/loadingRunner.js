/**
 * MIT License
 * copyright 2014 https://github.com/j6k1
 */
(function () {
	var FrameRate = 12;
	var ROTATION_TIME_DEFAULT = 700;
	
	function LoadingRunner (initializer, rotation_time) {
		rotation_time = rotation_time || ROTATION_TIME_DEFAULT;
		var loading_runner = initializer();
		loading_runner = loading_runner || function (){};
		
		var currentTime = (new Date).getTime();
		var timerId;
		var degree = 0;

		var enterFrame = function () {
			degree += Math.floor(((new Date).getTime() - currentTime) * (360 / rotation_time));
			if(degree > 360) degree = degree % 360;
			loading_runner.call(loading_runner, degree);
			var timeDiff = (new Date).getTime() - currentTime - Math.ceil(rotation_time / FrameRate);
			currentTime = (new Date).getTime();
			timerId = setTimeout(enterFrame, Math.ceil((rotation_time / FrameRate) - timeDiff));
		};
		
		this.start = function () {
			timerId = setTimeout(enterFrame, Math.ceil(rotation_time / FrameRate));
		};
		
		this.stop = function () {
			clearTimeout(timerId);
		};
	}
	
	window.LoadingRunner = LoadingRunner;
	
	LoadingRunner.canvasLoaderCreator = function (canvasId, color) {
		return function () {
			var canvas = document.getElementById(canvasId);
			var ctx = canvas.getContext('2d');
			var alphas = [];
			color = color || [255, 255, 255];
			if(Object.prototype.toString.call(color) === "[object Object]") color = [ color.r, color.g, color.b ];
			
			var len = canvas.width;
			var r = len / 2;
			var w = Math.round(len * 0.1);
			var h = Math.round(len * 0.25);
			ctx.setTransform(1, 0, 0, 1, r, r);
			
			for(var i=0; i < 12; i++) alphas.push(i / 12);
			
			return function (degree) {
				// キャンバスをクリアする
				ctx.clearRect(-r, -r, (r * 2), (r * 2));
				// キャンバスのトランスフォームの状態をセーブする。
				ctx.save();
				// 与えられた確度分回転
				ctx.rotate(degree * Math.PI / 180);

				for (var i = 0; i < 12; i++) {
					// グラデーションをかけるためにcolorにアルファ値を追加する。
					ctx.fillStyle = "rgba(" + color.concat(alphas[i]).join(",") + ")";
					// strokeStyle で枠線に transparent を指定し無効化
					ctx.strokeStyle = "transparent";
					
					// 描画パスの開始
					ctx.beginPath();
					// 線を引く
					ctx.moveTo((0 - w / 4), (r - h));
					ctx.quadraticCurveTo(0, (r - h - w / 2), (0 + w / 4), (r - h));
					ctx.lineTo((0 + w / 2), (r - w / 3));
					ctx.quadraticCurveTo(0, (r + w / 3), (0 - w / 2), (r - w / 3));
					// 描画パスを閉じる
					ctx.closePath();
					// 塗りつぶす
					ctx.fill();
					ctx.stroke();
					// 次のグラデーション描画のために rotate(); で 30° 回転させておく
					ctx.rotate(30 * Math.PI / 180);
				}
				// キャンバスのトランスフォームの状態を復元
				ctx.restore();
			}
		};
	};
})();
