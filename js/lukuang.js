(function(w) {
	function LuKuang() {
		this.lu = null;
		this.flag = null;
	}

	LuKuang.prototype.setlu = function(k, f) {
		this.lu = k;
	}
	LuKuang.prototype.getlu = function() {
		console.log(this.lu)
		return this.lu;
	}

	LuKuang.prototype.luDate = function(m) {
		var d = new AMap.TileLayer.Traffic({
			zIndex: 10
		});
		this.setlu(d, true);
		this.zt(m, this.flag);
	}

	LuKuang.prototype.zt = function(m, f) {
		if (f) {
			console.log('有了')
		}
	}

	w.LuKuang = LuKuang;

})(window);
