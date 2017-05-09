function $(selector){
	return new Robin(selector) 
}

function Robin (selector){
	this.ele = [] ;//设置空数组，保存变量值
	if('object' === typeof(selector)){
		this.ele.push(selector)
	}else{
		if ('#' == selector.charAt(0)) {
			var t = document.getElementById(selector.substr(1));
			this.ele.push(t);
		}else if ('.' == selector.charAt(0)){
			var t = document.getElementsByClassName(selector.substr(1));
			for (var i = 0; i < t.length; i++) {
				this.ele.push(t[i]);
			}
		}else{
			var t = document.getElementsByTagName(selector);
			for (var i = 0; i < t.length; i++) {
				this.ele.push(t[i]);
			}
		}
	}
}

Robin.prototype.attr = function(name , val){
	//如果只有一个参数且为字符串则为查询
	if (1 == arguments.length && typeof(arguments[0]) === 'string'){
		return this.ele[0].getAttribute(name); 
	} else if(1 == arguments.length && typeof(arguments[0]) === 'object'){
		//如果只有一个参数且为对象时为批量添加属性
		for (var i = 0; i < this.ele.length; i++) {
			for (var j in arguments[0]) {
				this.ele[i].setAttribute(j ,arguments[0][j])
			}
		}
		
		return this;
	} else if(2 == arguments.length){
		//如果有两个参数为单个添加
		for (var i = 0; i < this.ele.length; i++) {
			this.ele[i].setAttribute(name ,val)
		}		
		return this;
	} else {
		//否则报错
		console.log('参数错误') ;
	}
}
Robin.prototype.css = function(name , val){
	//一个参数且未字符串时 查询
	if (1 == arguments.length && typeof(arguments[0]) === 'string') {
		if(window.getComputedStyle){
			return window.getComputedStyle(this.ele[0],false)[name]
		}else if(this.ele[0].currentStyle){
			return this.ele[0].currentStyle[name]
		}
	} else if (1 == arguments.length && typeof(arguments[0]) === 'object') {//一个参数且为对象时 批量添加
		for (var i = 0; i < this.ele.length; i++) {
			for(var j in arguments[0]){
				this.ele[i].style[j] = arguments[0][j]
			}
		}
		
		return this
	} else if (2 == arguments.length) {//两个参数且为字符串时 单独添加
		for (var i = 0; i < this.ele.length; i++) {
			this.ele[i].style[name] = val;
		}
		return this
	}else {
		//否则报错
		console.log('参数错误') ;
	} 
}
Robin.prototype.addClass = function(className){
	var oldName = this.attr('class');
	var newName = oldName +' '+ className;
	//for (var i = 0 ; i < this.length ; i++){
		this.attr("class" , newName ) ;
	//}
	return this;
}

Robin.prototype.removeClass = function(className){
	//获取当前类名
	var oldName = this.attr('class'),
	//筛选出指定类名
		p1 = RegExp("\\b"+className+"\\b" , "g"),
	//删除指定类名
		newName = oldName.replace(p1 , "");
	//添加新类名
	//for (var i = 0 ; i < this.length ; i++){
		this.attr("class" , newName ) ;
//	}
	return this;
}

Robin.prototype.animate = function(cssName, target){
	this.timer = null ;
	that = this ; 
	if (2 == arguments.length ) {
		for (var i = 0; i < this.ele.length; i++) {
			var t = this.ele[i];
			//console.log(t);
			run(t,cssName,target)
		}
		return this ;
	} else if(1 == arguments.length && 'object' === typeof(arguments)){
		for( var i in arguments[0]){
			for (var j = 0; j < this.ele.length; j++) {
				x = i ;
				y  = arguments[0][i];
				//console.log(cssNmae , target);
				var t = this.ele[j];
				//console.log(t);
				run(t,x,y)
			}
		}
		return this ;
	}
	

	function run(t,x,y){
		that.timer = setInterval(function(){
			//console.log(cssName);
			if ("opacity" === x){
				console.log(t);
				alert(1);
				var current = t.css(t)*100;
			}else{
				//console.log(x);
				var firstCode = x.charAt(0).toUpperCase(),
				newCssName = firstCode + x.substr(1),
				current = t["offset"+newCssName];	//获取当前位置
				//console.log(that.ele,ddd) 
			}
			var dis = y - current ,	
				step = Math.ceil(Math.abs(dis) /10); 				//每次变化量
			
			if(dis - step > 0){
				step = step ;
			} else if(dis - step < 0 ){
				step = -1*step
			} else {
				clearInterval(that.timer)
				//console.log('over')
			}	
			if (Math.abs(dis) < step) {
				dis = step;
				//clearInterval(timer);
			}
			if ('opacity' === x) {
				t.style.opacity = newPos/100;
			} else {
				//console.log(that.ele,cssName)
				var newPos = current + step ;
				t.style[x] = newPos +'px'; 
				//console.log(current , newPos , step )
			}
		},50)
	}
	//console.log(ele,cssName);
	
}

Robin.prototype.on = function(eve , fn){
	if(window.addEventListener){
		for (var i = 0; i < this.ele.length; i++) {
			this.ele[i].addEventListener(eve , fn)
		}
		
	}else if (window.attachEvent){
		for (var i = 0; i < this.ele.length; i++) {
			this.ele[i].attachEvent("on"+eve , fn)
		}
		
	}
	return this ;
}

Robin.prototype.off = function(eve , fn){
	if(window.removeEventListener){
		for (var i = 0; i < this.ele.length; i++) {
			this.ele[i].removeEventListener(eve , fn)
		}
	}else if (window.detachEvent){
		for (var i = 0; i < this.ele.length; i++) {
			this.ele[i].detachEvent("on"+eve , fn)
		}
	}
	return this ;
}

Robin.prototype.html = function(val){
	if ("" == arguments[0]) {
		return this.ele[0].innerHTML;
	} else {
		this.ele.innerHTML = val ;
		return this;
	}
}