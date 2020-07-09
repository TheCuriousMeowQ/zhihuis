class paths {
	constructor(url, gtTy) {
		this.url = url;
		this.gtTy = gtTy;
		this.pathArr = null;
		this.marker = null;
		this.pathAril = null;
		this.passedPolyline = null;
	}

	getData() {
		$.ajax({
			url: this.url,
			type: this.gtTy,
			dataType: 'JSON',
			success: function(res) {
				console.log(map)
				console.log(res)
				this.pathArr = [];
				for (let item of res.list) {
					console.log(item.position)
					this.pathArr.push([item.position[0], item.position[1]]);
				}
				//console.log('路径数据', this.pathArr);

				this.marker = new AMap.Marker({
					map: map,
					position: res.list[0].position,
					icon: "https://webapi.amap.com/images/car.png",
					offset: new AMap.Pixel(-26, -13),
					autoRotation: true,
					angle: -90
				});

				this.pathAril = new AMap.Polyline({
					map: map,
					path: this.pathArr,
					showDir: true, //显示路标样式
					strokeWeight: 6,
					strokeColor: '#28f'
				});

				this.passedPolyline = new AMap.Polyline({
					map: map,
					// path: lineArr,
					strokeColor: "#AF5", //线颜色
					// strokeOpacity: 1,     //线透明度
					strokeWeight: 6, //线宽
					// strokeStyle: "solid"  //线样式
				});

				// this.marker.on('moving', function(e) {
				// 	console.log(e);
				// 	this.passedPolyline.setPath(e.passedPath);
				// });

				map.setFitView();
				// 开始绘制
				this.marker.moveAlong(this.pathArr, 100);

				// 轨迹清除  map.remove(路径对象)
			}
		});
	}

	// getData.prototype.startAnimation() {
	// 	this.marker.moveAlong(this.pathArr, 200);
	// }

	// getData.prototype.pauseAnimation() {
	// 	this.marker.pauseMove();
	// }

	// getData.prototype.resumeAnimation() {
	// 	this.marker.resumeMove();
	// }

	// getData.prototype.stopAnimation() {
	// 	this.marker.stopMove();
	// }
}
