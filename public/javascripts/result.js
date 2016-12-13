$(function(){
	var widths = document.body.clientWidth*.8;
	$(".many,.single").css({width:widths});
	$(".many,.single").css({height:widths});	

	$.ajax({
		url:'http://120.25.152.42:9000/users/countQuestionResult',
		type:'get',
		dataType:'json',
		success:function(data){
			var data = data.data;
			$('.many').each(function(index,value){
				var main = document.getElementById('main'+index);
				var charts = echarts.init(main);
				drawTool(
					charts,
					data.selectMany[index].selects,
					data.selectMany[index].title,
					data.selectMany[index].data
				)
			});
			$('.single').each(function(index,value){
				var main = document.getElementById('single'+index);
				var charts = echarts.init(main);
				drawTool(
					charts,
					data.selectSingle[index].selects,
					data.selectSingle[index].title,
					data.selectSingle[index].data
				)
			});
		}
	});

	function drawTool(element, legend, name, data){
		var option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				x: 'left',
				data:legend
			},
			series: [
				{
					name:'',
					type:'pie',
					radius: ['40%', '50%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '30',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:data
				}
			]
		};
		element.setOption(option);
	}
});