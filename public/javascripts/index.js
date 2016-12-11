$(function(){
	var app = {
		init:function(){
			var _this = this;
			$('#sumbit').click(function(){
				_this.getSubmitData(function(result){
					_this.sendResult(result);
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
				list.title = $('.select-many-title').eq(index).text();
				$('.select-many').eq(index).find('input').each(function(i,v){
					if($(this).is(":checked")){
						var obj = {};
						obj.text = $('.select-many').eq(index).find('label').eq(i).text();
						obj.index = Number(i) + 1;
						list.answer.push(obj);
					}
				});

				data.selectMany.push(list);
			});
			$('.select-single').each(function(index,value){
				var list = {};
				list.answer = {};
				list.title = $('.select-single-title').eq(index).text();
				$('.select-single').eq(index).find('input').each(function(i,v){
					if($(this).context.checked == true){
						var obj = {};
						obj.text = $('.select-single').eq(index).find('label').eq(i).text();
						obj.index = Number(i) + 1;
						list.answer = obj;
					}
				});

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
						alert('提交成功');
					}else{
						alert(data.message);
					}
				}
			});
		}
	}

	app.init();
});