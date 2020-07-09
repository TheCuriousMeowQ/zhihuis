(function() {
	let trackquery = {};
	trackquery.pathArr = null; //路径集合
	trackquery.marker = null;
	trackquery.pathAril = null;
	trackquery.passedPolyline = null;
	trackquery.getPath = function(url, ty) {
		$.ajax({
			url: url,
			type: ty,
			dataType: 'JSON',
			success: function(res) {
				//console.log(map, res);
				trackquery.pathArr = [];
				for (let item of res.list) {
					console.log(item.position)
					trackquery.pathArr.push([item.position[0], item.position[1]]);
				}
				trackquery.marker = new AMap.Marker({
					map: map,
					position: res.list[0].position,
					icon: "https://webapi.amap.com/images/car.png",
					offset: new AMap.Pixel(-26, -13),
					autoRotation: true,
					angle: -90
				});

				trackquery.pathAril = new AMap.Polyline({
					map: map,
					path: trackquery.pathArr,
					showDir: true, //显示路标样式
					strokeWeight: 6,
					strokeColor: '#28f'
				});

				trackquery.passedPolyline = new AMap.Polyline({
					map: map,
					// path: lineArr,
					strokeColor: "#AF5", //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6, //线宽
					// strokeStyle: "solid"  //线样式
				});

				trackquery.marker.on('moving', function(e) {
					trackquery.passedPolyline.setPath(e.passedPath);
				});

				map.setFitView();

				trackquery.startAnimation = function() {
					trackquery.marker.moveAlong(trackquery.pathArr, 200);
				}

				trackquery.pauseAnimation = function() {
					trackquery.marker.pauseMove();
				}

				trackquery.resumeAnimation = function() {
					trackquery.marker.resumeMove();
				}

				trackquery.stopAnimation = function() {
					trackquery.marker.stopMove();
				}
			}
		});
	}
	window.trackquery = trackquery;
})();
