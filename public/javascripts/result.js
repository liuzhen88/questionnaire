$(function(){
	var main = document.getElementById('main');
	var main1 = document.getElementById('main1');
	var widths = document.body.clientWidth*.8;
	$("#main,#main1").css({width:widths});
	$("#main,#main1").css({height:widths});	
	var myChart = echarts.init(main);
	var myChart1 = echarts.init(main1);

	drawTool(myChart,['选项1','选项2','选项3','选项4','选项5'],'问题1',
		[
						{value:335, name:'选项1'},//option可以公用，这边需要传回来选项名称，和选的个数
						{value:310, name:'选项2'},
						{value:234, name:'选项3'},
						{value:135, name:'选项4'},
						{value:1548, name:'选项5'}
					]
					);

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
					name:name,
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