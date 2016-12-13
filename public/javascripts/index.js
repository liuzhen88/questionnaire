$(function(){
	var app = {
		init:function(){
			var _this = this;
			$('#sumbit').click(function(){
				_this.comfirmSubmit(function(){
					_this.getSubmitData(function(result){
						_this.sendResult(result);
					});
				});
			});
		},
		getSubmitData:function(cb){
			var data = {
				selectMany:[],
				selectSingle:[],
				selectContent:[]
			};
			$('.select-many').each(function(index,value){
				var list = {};
				list.answer = [];
				list.selects = [];
				list.title = $('.select-many-title').eq(index).text();
				$('.select-many').eq(index).find('input').each(function(i,v){
					if($(this).is(":checked")){
						var obj = {};
						obj.text = $('.select-many').eq(index).find('label').eq(i).text();
						obj.index = Number(i) + 1;
						list.answer.push(obj);
					}
					list.selects.push($('.select-many').eq(index).find('label').eq(i).text());
				});
				list.total = $('.select-many').eq(index).find('input').length;
				data.selectMany.push(list);
			});
			$('.select-single').each(function(index,value){
				var list = {};
				list.answer = {};
				list.selects = [];
				list.title = $('.select-single-title').eq(index).text();
				$('.select-single').eq(index).find('input').each(function(i,v){
					if($(this).context.checked == true){
						var obj = {};
						obj.text = $('.select-single').eq(index).find('label').eq(i).text();
						obj.index = Number(i) + 1;
						list.answer = obj;
					}
					list.selects.push($('.select-single').eq(index).find('label').eq(i).text());
				});
				list.total = $('.select-single').eq(index).find('input').length;
				data.selectSingle.push(list);
			});
			$(".select-content").each(function(index,value){
				var list = {};
				list.title = $('.select-content-title').eq(index).text();
				list.answer = $('.select-content').eq(index).find('textarea').val();
				data.selectContent.push(list);
			});
			cb(data);
		},
		sendResult:function(data){
			$.ajax({
				url:'http://120.25.152.42:9000/users/saveQuestionnaire',
				type:'post',
				dataType:'json',
				data:{
					sendData:JSON.stringify(data)
				},
				success:function(data){
					if(data.code == '200'){
						alerts('提交成功');
					}else{
						alerts(data.message);
					}
				}
			});
		},
		comfirmSubmit:function(cb){
			var userInfoId = this.request('userinfoid');
			if(!userInfoId){
				alerts('用户id错误');
				return;
			}else{
				$.ajax({
					url:'http://120.25.152.42:9000/users/validate?userInfoId='+userInfoId,
					type:'get',
					dataType:'json',
					success:function(data){
						if(data.code == '200'){
							cb();
						}else{
							alerts(data.message);
						}
					}
				});
			}

		},
		request:function(paras) {
		    var url = location.href;
		    url = decodeURI(url);
		    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		    var paraObj = {};
		    for (var i = 0; j = paraString[i]; i++) {
		        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		    }
		    var returnValue = paraObj[paras.toLowerCase()];
		    if (typeof(returnValue) == "undefined") {
		        return "";
		    } else {
		        return returnValue;
		    }
		}
	}

	app.init();
});
function alerts(obj){
	$(".phonecall").fadeIn("200");
	$(".shoa").text(obj);
}
$(".disnone").click(function(){
	$(".phonecall").fadeOut("200");
})
