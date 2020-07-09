var gtMap = {};
gtMap.getData = function(arrd) { //遍历数据
	var arr = [];
	for (let i = 0; i < arrd.length; i++) {
		arr.push(arrd[i]);
	}
	console.log(arr)
	return arr;
}
// 删除的marker管理
var remarker = [];

// 初始化
gtMap.init = function(url) {
	$.ajax({
		url: url,
		dataType: 'JSON',
		success: function(res) {
			console.log(res);
			var len = res.list,
				wg = res.wglist,
				bigli = res.Biglist;
			var box = $('#fnlisminBox'),
				wgBox = $('#gbFnLis'),
				bigBox = $('#fnlisbigBox');

			// 遍历菜单栏
			for (let i = 0; i < len.length; i++) {
				//console.log(len[i])
				var li = '<li data-type=' + len[i].typefn + '><span>' + len[i].name + '</span></li>';
				if (len[i].subclass.length > 0) {
					var lens = len[i].subclass;
					var p = reElement('p');
					for (let j = 0; j < lens.length; j++) {
						//console.log(lens[j]);
						$(p).append('<em data-type=' + lens[j].typefn + '>' + lens[j].name + '</em>');
					}

					$(p).find('em').on('click', ale);

					box.append($(li).append(p));
				} else {
					box.append(li);
				}
			}

			wg.forEach((item, index, arr) => {
				var li = reElement('li');
				li.innerHTML = item.name;
				li.addEventListener('click', function() {
					// dataCont('https://gdmap.com?id=1', map, 'GET', item.typefn, gtMap.getAllDataType, sty[0].icon[0]);
					layer.open({
						type: 2,
						title: ' ',
						shadeClose: true,
						maxmin: true, //开启最大化最小化按钮
						shade: 0.8,
						scrollbar: false, //屏蔽滚动
						area: ['90%', '90%'],
						content: ['shibies.html', 'no'], //iframe的url,添加no不显示iframe滚动条
						success: function(res) {
							console.log(res)
							$('.layui-layer-title').css({
								backgroundImage: 'url(img/shibies/tit.png)',
								backgroundSize: '100%',
								height: '60px',
								backgroundColor: '#0e101b'
							});

							//gtMap.getPath('http://localhost:81/center/demo/findGridList', map);
						}
					});
				}, false)
				wgBox.append(li);
				//console.log(item)
			});

			bigli.forEach((val, idx, arr) => {
				var li = '<li data-type=' + val.typefn + '><span>' + val.name + '</span></li>';
				if (val.subclass.length > 0) {
					var lens = val.subclass;
					var p = reElement('p');
					for (let j = 0; j < lens.length; j++) {
						//console.log(lens[j]);
						$(p).append('<em data-type=' + lens[j].typefn + '>' + lens[j].name + '</em>');
					}

					$(p).find('em').on('click', ale);

					bigBox.append($(li).append(p));
				} else {
					bigBox.append(li);
				}
			});

			box.children()[0].click(); //自动触发
		}
	});
}

function reElement(tyDom) {
	var dom = document.createElement(tyDom);
	return dom;
}

function ale(event) {
	let e = window.event || event;
	let itTrue = [];
	let prenData = $(this).attr('data-type');
	e.stopPropagation();
	//alert(prenData);
	$(this).parent().parent().addClass('pitch_on'); //找到祖辈元素

	if ($(this).hasClass('emActiveOn')) {
		gtMap.removeMacks(prenData);
		$(this).removeClass('emActiveOn');
		$(this).parent().parent().find('em').each(function(idx, item) {
			console.log(item)
			if (!$(item).hasClass('emActiveOn')) {
				$(this).parent().parent().removeClass('pitch_on');
				$('#typeSerech').attr('data-type', '');
				$('#typeSerech').attr('placeholder', '请先选择项目。');
			}
		});
	} else {
		$('#typeSerech').attr('data-type', $(this).attr('data-type'));
		$('#typeSerech').attr('placeholder', $(this).attr('data-type'));
		$(this).addClass('emActiveOn');
		dataCont('https://gdmap.com?id=1', map, 'GET', prenData, gtMap.getAllDataType, sty[0].icon[0]);
	}
}

// 获取数据
/**
 * @param {Object} m 地图
 * @param {Object} d 数据
 * @param {String} t 类型
 * @param {Object} s 样式
 */
window.remarrMarker = new Array;
gtMap.getAllDataType = function(m, d, t, s) {
	console.log('类型,', t);
	var data = null;

	if (d.constructor == Array) {
		data = d;
	} else { //如果为一个对象
		data = gtMap.getData(d.list); //获取遍历后的数据
	}

	var sty = null; //存储icon与字体样式
	if (s) {
		sty = s;
	}
	var markersarr = []; //用于存储marker

	console.log('第一个数据', data[0]);
	m.setCenter(data[0].position); // 以第一个数据设置中心点

	if (data[0].position) {
		m.setCenter(data[0].position);
	} else {
		m.setCenter([data[0].jd, data[0].wd]);
	}

	for (i in data) { //循环数据，把数据放入每个marker
		//console.log(data[i])
		var corent = data[i];
		corent.extData = { //设置自定义数据
			index: i,
			d: data[i]
		};

		var marker = null;
		if (corent.jd) {
			marker = new AMap.Marker({
				position: new AMap.LngLat(corent.jd, corent.wd),
				offset: new AMap.Pixel(-10, -10),
				icon: icon, // 添加 Icon 实例
				zoom: 13,
				extData: corent
			});
		} else {
			marker = new AMap.Marker({
				position: new AMap.LngLat(corent.position[0], corent.position[1]),
				offset: new AMap.Pixel(-10, -10),
				icon: icon, // 添加 Icon 实例
				zoom: 13,
				extData: corent
			});
		}

		// 创建图标实例
		var icon = new AMap.Icon({
			size: new AMap.Size(40, 50), // 图标尺寸
			image: sty.url, // Icon的图像
			imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
			imageSize: new AMap.Size(40, 50) // 根据所设置的大小拉伸或压缩图片
		});

		// 实例化一个marker
		// var marker = new AMap.Marker({
		// 	position: new AMap.LngLat(corent.position[0], corent.position[1]),
		// 	//position: new AMap.LngLat(corent.jd, corent.wd),
		// 	offset: new AMap.Pixel(-10, -10),
		// 	icon: icon, // 添加 Icon 实例
		// 	zoom: 13,
		// 	extData: corent
		// });

		//console.log('点Marker,', marker)

		///marker.setMap(m);

		marker.setLabel({
			offset: new AMap.Pixel(-50, -35), //设置文本标注偏移量
			content: "<div>" + corent.name + "</div>", //设置文本标注内容
			direction: 'right' //设置文本标注方位
		});

		// function lnglat2container(v) {
		// 	if (!lnglatInput.value) return
		// 	var inputVal = lnglatInput.value.split(',');
		// 	var lnglat = new AMap.LngLat(inputVal[0], inputVal[1]);
		// 	var pixel = map.lngLatToContainer(lnglat);
		// 	pixelInput.value = pixel.round();
		// }
		marker.on('click', function(e) {
			m.setCenter([e.lnglat.lng, e.lnglat.lat]);
			gtMap.typeOpen(e.target.getExtData().zycy, e.target.getExtData().xq)
			//debugger
			//console.log(e.target.getExtData()); //获取自定义数据
			// console.log(e.target._position)
			// var pos = e.target.getExtData();
			// console.log(pos);
			// gtMap.openWP('http://n.163.com/?from=nietop', 'open');
			// m.setFitView();
			//gtMap.openWin([e.lnglat.getLng(), e.lnglat.getLat()], m, e.target.getExtData());

			//console.log('获取marker地址：', e.target.getPosition());
			var contents = '<div className="custom-infowindow input-card" style="width:400px;height:400px">' +
				'<div class="maxBox">' + '<div class="centerBox">' +
				'<ul class="messageBox">' +
				'<li>' +
				'<div class="pesonImg">' +
				'<img src="./img/bg.jpg">' +
				'</div>' + '<div class="pesonmessage">' +
				'<ul>' + '<li>姓名：' + e.target.getExtData().name + '</li>' + '<li>所属辖区：' + '中山市东凤镇龙头街16号' + '</li>' +
				'<li>手机：1728191232</li>' +
				'<li>职务：网格员</li>' +
				'<li class="txtColor-red">当日巡查：10件</li>' +
				'<li class="txtColor-red">当日上报：10件</li>' +
				'<li class="txtColor-red">当日工作时长：6小时</li>' +
				'</ul>' +
				'</div>' +
				'</li>' +
				'<li style="display: block;position: relative;">' +
				'<textarea style="padding: 4px 100px 5px 10px;width: 100%;height: 90px;border: none;outline: none;"></textarea>' +
				'<button type="button" style="width: 90px;position: absolute;top: 0;right: 0;height: 90px;border: none;background: #FF9800;color: #fff;font-size: 16px;outline: none;cursor: pointer;">发送</button>' +
				'<div style="display:flex;margin-top: 10px;">' +
				'<div class="layui-input-inline" style="flex: 3; margin-right: 10px;">' +
				'<input type="text" class="layui-input" id="test10" placeholder="轨迹查询时间">' +
				'</div>' +
				'<button type="button" id="guiji" class="layui-btn layui-btn-sm layui-btn-normal">轨迹查询</button>' +
				'</div>' +
				'</li>' +
				'<li>' +
				'<div class="Buts">' +
				'<button type="button" id="play" class="layui-btn layui-btn-sm layui-bg-green">播放</button>' +
				'<button type="button" id="stop" class="layui-btn layui-btn-sm layui-bg-orange">暂停</button>' +
				'<button type="button" id="pash" class="layui-btn layui-btn-sm layui-bg-red">停止</button>' +
				'<button type="button" id="guijipath" class="layui-btn layui-btn-sm layui-bg-red">清除轨迹</button>' +
				'<button type="button" id="videoTode" class="layui-btn layui-btn-sm layui-bg-green">视频</button>' +
				'</div>' +
				'</li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>';
			layer.open({
				type: 1,
				title: '<h2>' + e.target.getExtData().name + '</h2>',
				id: 'wgy', //设置唯一id，不管打开多少个都只显示唯一一个
				shadeClose: true,
				shade: false,
				maxmin: false, //开启最大化最小化按钮
				area: ['auto', 'auto'],
				// offset: [e.pixel.y - 200, e.pixel.x + 50],
				offset: ['20%', '52%'],
				content: contents, //iframe的url
				success: function(res) {
					var pa = null;
					$('#guiji').on('click', function() {
						//gtMap.getTaril(map, 'https://pathmap.com', 'GET');
						trackquery.getPath('https://pathmap.com', 'GET');
					});
					$('#play').on('click', function() {
						trackquery.startAnimation();
					});
					$('#stop').on('click', function() {
						trackquery.pauseAnimation();
					});
					$('#pash').on('click', function() {
						trackquery.stopAnimation();
					});
					$('#guijipath').on('click', function() {
						map.remove(trackquery.marker);
						map.remove([trackquery.pathAril, trackquery.passedPolyline])
						trackquery.pathArr = null;
						trackquery.marker = null;
						trackquery.pathAril = null;
						trackquery.passedPolyline = null;
					});
					$('#videoTode').on('click', function() {
						layer.msg('视频');
					});

					layui.use('laydate', function() {
						var laydate = layui.laydate;
						laydate.render({
							elem: '#test10',
							type: 'datetime',
							range: true
						});
					});
				},
				cancel: function(index) {
					//console.log(index)
					if (trackquery.pathArr !== null) {
						map.remove(trackquery.marker);
						map.remove([trackquery.pathAril, trackquery.passedPolyline])
						trackquery.pathArr = null;
						trackquery.marker = null;
						trackquery.pathAril = null;
						trackquery.passedPolyline = null;
					}

					layer.close(index);

				}
			});

		});

		markersarr.push(marker);
	}
	remarrMarker.push({
		'id': t,
		'dt': markersarr
	});

	// 获取地图中心点
	//var currentCenter = map.getCenter(); 
	//remarrMarker = markersarr;
	//m.add(markersarr);
	var cluterStyle = [{
		url: sty.url,
		size: new AMap.Size(32, 32),
		offset: new AMap.Pixel(0, 0),
		textColor: '#fff'
	}];

	var count = markersarr.length;
	var cluarr = [];
	var _renderClusterMarker = function(context) {

		//console.log(context.markers);
		// 聚合中点个数
		var clusterCount = context.count;
		var div = document.createElement('div');
		// var img = new Image();
		// img.style.position = 'absolute';
		// img.style.left = 0;
		// img.style.zIndex = -1;
		// img.style.width = '100%';
		// img.src = 'img/juhe.svg';
		var msg = document.createElement('div');
		msg.className = 'jhmessage';
		//msg.style.transform = translateX(-180%);
		// 聚合点配色
		var defaultColor = [
			'204,235,197',
			'168,221,181',
			'123,204,196',
			'78,179,211',
			'43,140,190',
		]
		if (clusterCount >= 0 && clusterCount < 10) {
			bgColor = defaultColor[0];
		} else if (clusterCount >= 10 && clusterCount < 100) {
			bgColor = defaultColor[1];
		} else if (clusterCount >= 100 && clusterCount < 1000) {
			bgColor = defaultColor[2];
		} else if (clusterCount >= 1000 && clusterCount < 10000) {
			bgColor = defaultColor[3];
		} else if (clusterCount >= 10000) {
			bgColor = defaultColor[4];
		}
		div.style.backgroundColor = 'rgba(' + bgColor + ',.5)';
		var size = Math.round(25 + Math.pow(clusterCount / count, 1 / 5) * 40);
		div.style.position = 'relative';
		div.style.width = div.style.height = size + 'px';
		div.style.border = 'solid 1px rgba(' + bgColor + ',1)';
		div.style.borderRadius = size / 2 + 'px';
		div.innerHTML = context.count;
		div.style.lineHeight = size + 'px';
		div.style.color = '#ffffff';
		div.style.fontSize = '25px';
		div.style.textAlign = 'center';
		//div.appendChild(img);
		msg.innerHTML = '(共' + context.count + ')';
		div.appendChild(msg);
		context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
		context.marker.setContent(div);
		//console.log(cluarr)
	};

	AMap.plugin('AMap.MarkerClusterer', function() { //异步加载插件
		window[t] = new AMap.MarkerClusterer(m, markersarr, {
			gridSize: 60,
			zoomOnClick: false, //点击聚合是否散开
			renderClusterMarker: _renderClusterMarker,
			averageCenter: false
		});
	});
	console.log(t)
	window[t].on('click', function(e) {
		//console.log(e)
		var INhtml = document.createElement('ul');
		if (e.markers.length >= 2) {
			var inMarkers = e.markers;
			for (var j in inMarkers) {
				console.log(inMarkers[j].Ce.extData.name)
				var li = document.createElement('li');
				li.className = 'exg';
				li.innerHTML = inMarkers[j].Ce.extData.name;
				li.setAttribute('data-type', inMarkers[j].Ce.extData.zycy);
				INhtml.appendChild(li);
			}
			//iframe窗
			var op = layer.open({
				type: 1,
				title: '人员',
				shadeClose: true,
				shade: false,
				maxmin: true, //开启最大化最小化按钮
				area: ['300px', '450px'],
				content: $(INhtml).html(),
				success: function(res) {
					//console.log(res)
					$(res).find('.exg').on('click', function() {
						//layer.close(op);
						// layer.open({
						// 	type: 2,
						// 	title: '很多时候，我们想最大化看，比如像这个页面。',
						// 	shadeClose: true,
						// 	shade: false,
						// 	maxmin: true, //开启最大化最小化按钮
						// 	area: ['893px', '600px'],
						// 	content: 'message.html'
						// });
						gtMap.typeOpen($(this).data('type'), inMarkers[j].Ce.extData.xq);
					})
				}
			});
		}
	});
	m.setFitView();
}
expath = []; //网格集合
exWgText = []; //网格文字集合
gtMap.getPath = function(url, inMap) {
	//var data = gtMap.getData(res);
	$('#loading').show();
	var pathA = [];
	var a = 0;
	$.ajax({
		url: url,
		dataType: 'JSON',
		success: function(res) {
			//console.log(res);
			var len = res.data;
			var inPath = [];
			for (var i = 0; i < len.length; i++) {
				//console.log(len[i])
				inPath = [];
				// debugger
				if (len[i].gridPointList) {
					var palen = len[i].gridPointList;
					for (var j = 0; j < palen.length; j++) {
						inPath.push([palen[j].longitude, palen[j].latitude]);
					}

					var wgText = new AMap.Text({
						text: len[i].name,
						map: map,
						position: [len[i].longitude, len[i].latitude],
						//animation: 'AMAP_ANIMATION_DROP',
					});

					wgText.setStyle({
						color: '#673AB7',
						padding: '5px 10px',
						fontSize: '16px',
						border: 'none',
						background: 'none',
						fontWeight: 600,
						textShadow: '5px 2px 6px rgb(202, 212, 222) 5px 2px 6px',
						zindex: 999
					});

					exWgText.push(wgText)

					//console.log(len[i])
					drawpolygon(inPath, {
						'background': len[i].backcolor,
						'linkeback': len[i].linecolor
					}, {
						name: '自定义数据'
					});

				}
			}
			/**
			 * @param {Object} arr 描边数组
			 * @param {Object} sty 描边样式
			 * @param {Object} exd 自定义数据
			 */
			function drawpolygon(arr, sty, exd) {
				// debugger
				//console.log(inMap)
				var pl = new Array();
				var lnglat = [];
				var sty = sty || {};
				for (var i = 0; i < arr.length; i++) {
					//console.log(arr[i])
					pl.push(new AMap.LngLat(arr[i][0], arr[i][1]));
				}

				polygon = new AMap.Polygon({
					path: pl, //设置多边形边界路径  
					strokeColor: "#0000ff", //线颜色  
					strokeOpacity: 0.2, //线透明度   
					strokeWeight: 3, //线宽   
					fillColor: sty.background, //填充色  
					fillOpacity: 0.35, //填充透明度
					text: 'huhuh'
				});

				polygon.setExtData(exd);

				polygon.on('click', function(e) {
					console.log('图层数据,', e.target.getExtData());
				});

				polygon.setMap(inMap);
				expath.push(polygon);
			}

			$('#loading').hide();

			//drawpolygon(pathA)
		}
	});
	//console.log(a)
}

gtMap.openWin = function(po, mp, mkData) {
	console.log(mkData)
	var contents = '<div className="custom-infowindow input-card" style="width:400px;height:450px">' +
		'<div class="maxBox" style="width:95%;height:95%">' + '<div class="centerBox">' +
		'<ul class="messageBox">' +
		'<li>' +
		'<div class="pesonImg">' +
		'<img src="./layui-v2.5.6/layui/images/face/30.gif">' +
		'</div>' + '<div class="pesonmessage">' +
		'<ul>' + '<li>姓名：' + mkData.name + '</li>' + '<li>所属辖区：' + '发挥发货发发发哈佛哈佛哈' + '</li>' + '<li>手机</li>' + '<li>职务</li>' +
		'<li>当日巡查</li>' +
		'<li>当日上报</li>' +
		'<li>当日工作时长</li>' +
		'</ul>' +
		'</div>' +
		'</li>' +
		'<li style="display: block;position: relative;">' +
		'<textarea style="padding: 4px 100px 5px 10px;width: 100%;height: 90px;border: none;outline: none;"></textarea>' +
		'<button type="button" style="width: 90px;position: absolute;top: 0;right: 0;height: 90px;border: none;background: #FF9800;color: #fff;font-size: 16px;outline: none;cursor: pointer;">发送</button>' +
		'<div>' + '<div class="layui-input-inline">' +
		'<input type="text" class="layui-input" id="test10" placeholder=" - ">' +
		'</div>' + '</div>' +
		'</li>' +
		'<li>' +
		'<div class="">' +
		'<button onclcik=' + gtMap.openWP('http://n.163.com/?from=nietop', 'open') + '>播放</button>' +
		'<button>暂停</button>' +
		'<button>停止</button>' +
		'<button>清除轨迹</button>' +
		'<button>视频</button>' +
		'</div>' +
		'</li>' +
		'</ul>' +
		'</div>' +
		'</div>' +
		'</div>';

	// 创建一个自定义内容的 infowindow 实例
	// var infoWindow = new AMap.InfoWindow({
	// 	position: po,
	// 	offset: new AMap.Pixel(0, -20),
	// 	content: contents
	// });

	// infoWindow.open(mp);
}

// 弹窗的形式
gtMap.openWP = function(url, type) {
	/**
	 * @param {Object} url 链接地址
	 * @param {String} type 打开的方式
	 */

	if (type == 'open') {
		console.log('形式弹窗');
		layer.open({
			type: 2,
			title: '',
			shadeClose: true,
			shade: 0.8,
			area: ['70%', '90%'],
			content: url //iframe的url
		});
	}

	if (type == 'wind') {
		console.log('新窗口');
		//window.location.href = url;
		window.open('' + url + '');
	}
}

// 删除覆盖物
gtMap.removeMacks = function(ty) {
	//debugger
	// inMap.remove(potions);
	if (remarrMarker.length > 0) {
		remarrMarker.forEach((value, index, array) => {
			if (value.id == ty) {
				console.log(value)
				window[ty].removeMarkers(value.dt);
				remarrMarker = remarrMarker.filter(item => item.id !== ty); //返回一个不包含ty的新数组
			}
		});
	}
	//inMap.setFitView();
	// cluster.removeMarkers();
}

/**
 * @param {Object} url 地址
 * @param {Object} ty 请求方式
 * @param {Object} m 地图
 */
// serchData = null;
gtMap.serchData = function(url, ty, m, tyd, ...val) { //搜索

	for (let i = 0; i < remarrMarker.length; i++) {
		if (remarrMarker[i].id === tyd && remarrMarker[i].dt.length > 0) {
			console.log(remarrMarker[i]);
			gtMap.removeMacks(remarrMarker[i].id);
			$.ajax({
				url: url,
				type: ty,
				dataType: 'JSON',
				success: function(res) {
					console.log(res);
					gtMap.getAllDataType(m, res, tyd, {});
				}
			});
		}
	}

}

//根据类型弹出信息窗
gtMap.typeOpen = function(ty, data) {
	var d = data;
	// console.log(data)
	switch (ty) {
		case '农业':
			console.log('所属农业');
			gtMap.typeOpenCont(1, '农业', d, ['90%', '90%']);
			break;
		case '网格员':
			gtMap.typeOpenCont(1, '网格员', d, ['90%', '90%']);
			break;
		case '楼栋':
			gtMap.typeOpenCont(1, '楼栋', d, ['90%', '90%']);
			break;
		default:
			break;
	}
}
/**
 * @param { Number } ty 弹窗的类型，依赖layer
 * @param { String } tit 弹窗头部标题文字
 * @param { Object } cent 信息窗内容
 * @param { Object } option 可选参数  
 */
gtMap.typeOpenCont = function(ty, tit, cent, ...option) {
	var op = option.constructor == Array ? option[0] : ['90%', '90%'];
	layer.open({
		type: ty,
		title: tit,
		shadeClose: true,
		maxmin: true, //开启最大化最小化按钮
		shade: 0.8,
		scrollbar: false, //屏蔽滚动
		area: op,
		content: cent, //iframe的url,添加no不显示iframe滚动条
		success: function(res) {
			console.log(res)

			//gtMap.getPath('http://localhost:81/center/demo/findGridList', map);
		}
	});
}

// 海量点插件
gtMap.hailiang = function(m, d) {
	debugger
	AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {

		if (!PointSimplifier.supportCanvas) {
			alert('当前环境不支持 Canvas！');
			return;
		}

		var PointSimplifier = new PointSimplifier({
			map: m, //关联地图
			getPosition: function(item) {
				console.log(item);
			},
			renderOptions: {
				//点的样式
				pointStyle: {
					width: 6,
					height: 6
				},
				//鼠标hover时的title信息
				hoverTitleStyle: {
					position: 'top'
				}
			}
		});


		PointSimplifier.setData(d)
	});
}
