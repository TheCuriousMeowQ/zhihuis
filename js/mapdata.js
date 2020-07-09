(function(w, _$) {
	/**
	 * @param url {String 获取数据地址}
	 * @param inMap {Object 传入的地图}
	 * @param gttype {String 请求的方式} 
	 * @param inTY {String 请求对应的类型数据}
	 * @param callback {Object 调用数据的回调函数} 
	 * @param sty {Array<Object> 传入的样式} 
	 */
	var dataCont = function(url, inMap, gttype, inTY, callback, ...sty) {
		$('#loading').show();
		_$.ajax({
			url: url,
			type: gttype,
			dataType: 'JSON',
			success: function(res) {
				// debugger
				console.log(res);
				callback(inMap, res, inTY, ...sty);
				$('#loading').hide();
			},
			error: function(e) {
				console.log(new Error(), e);
			}
		});
	};

	var setSty = function(sty) {
		return sty;
	}
	w.dataCont = dataCont;
	w.setSty = setSty;
})(window, jQuery);


// // 菜单数据格式
// xxx: [{
// 	title: '菜单名',
// 	type: '类型（用于判断请求哪种数据）',
// 	child:[{
// 		title: '菜单名',
// 		type_c: '类型（用于判断请求哪种数据）',
// 	},{}]//子菜单
// }, {
// 	title: '菜单名',
// 	type: '类型（用于判断请求哪种数据）'
// }];

// // 网格员情况数据
// xxx:[{
// 	总数,
// 	在线,
// 	离线,
// 	请假
// }];//亦可直接为一个对象

// // 地图点数据
// xxx:[{
// 	id:'xxx',
// 	name:'名字',
// 	position:['经度','纬度'],
// 	type:'属于哪种分类数据，用于区分请求数据',
// 	wgyState:'如是网格员（1=在线，0反之）',
// 	icon:'url(点图标)',
// 	time:'时间',//在线？离线？
// 	// 其余补充
// }];

// // 网格描边按横栏那边的处理方式亦可
