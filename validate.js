function FormValidate(form,config){
	this.form=form;
	this.config=config;
	this.fields=this.getByClass("fv",form);
	var _this=this;
	
	// 循环给每个表单字段绑定事件；
	for(var i=0;i<this.fields.length;i++){
		
		// 初始化：读取表单是否为必填项。
		this.fields[i].must= (this.fields[i].required) ||  (this.config[this.fields[i]['name']]['required']);
		// 初始默认所有的表单都不通过验证。
		this.fields[i].passValidate=false;
		
		// 获取焦点时增加类active
		this.fields[i].onfocus=function(){
			_this.addClass(this,"active");
		};
		
		// 失去焦点时删除类active，删除首尾空格，并验证；
		this.fields[i].onblur=function(){
			_this.removeClass(this,"active");
			this.value=this.value.trim();
			_this.validate(this);
		};
		
		// 每一次keyup事件都进行验证
		this.fields[i].onkeyup=function(){
			var result=_this.validate(this);
			switch(result){
				case "fail":
					_this.addClass(this,"fail");
					break;
				case "success":
					_this.addClass(this,"success");
					break;
				case "empty":
					_this.addClass(this,"empty");
					break;
				default:
					_this.addClass(this,"default");
					break;
			}
		};
	}
}


FormValidate.prototype.getReg=function(ele){
	//这个方法根据表单字段选择合适的验证正则。
	var reg=null;
	
	//针对一些常用的表单类型设定的验证规则，可以用表单配置中的fieldtype属性来选择。
	var defaultReg={
		"text":/^[^\s]+$/,
		"email":/^[a-z0-9][-a-z0-9]*@\w+(\.[a-z]+)+$/i,
		"phone":/^((\+)?86)?\d{11}$/,
		"postcode":/^\d{6}$/,
		"number":/^[-+]?(\d|[1-9]\d+)(\.\d*)?\d+$/,
		"url":/^https?:\/\/[-a-z0-9]+(\.[-a-z0-9]+)+(\.*)?$/i,
		"username":/^[-_a-zA-Z0-9]{4,}$/,
		"password":/^[^\s]{4,}$/,
		"strongpassword":/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W])[\da-zA-Z\W]{8,}$/
	};
	
	var fieldName=this.config[ele.name];
	if(fieldName['reg']){
		reg=fieldName['reg'];
	}else if(fieldName['fieldtype'].toLowerCase() || defaultReg[fieldName['fieldtype'].toLowerCase()]){
			reg=defaultReg[fieldName['fieldtype']];
	}else{
		var eleType=ele.type;
		switch(eleType){
			case "number":
				reg=defaultReg["number"];
				break;
			case "text":
				reg=defaultReg['text'];
				break;
			case "email":
				reg=defaultReg['email'];
				break;
			case "url":
				reg=defaultReg['url'];
				break;
			case "password":
				reg=defaultReg['password'];
				break;
			default:
				reg=defaultReg['text'];
		};	
	}
	return reg;
};
	
	
FormValidate.prototype.validate=function(ele){
	var value=ele.value.trim();
	//根据ele的type类型选择一个默认的正则匹配，常用的类型有邮箱，手机号，邮编，用户名，密码，
	//用户可以指定一些常用的验证类型，fieldType
	var reg=this.getReg(ele);	
	if(value===""){
		ele.passValidate=false;
		this.showTip(ele,"empty");
		return "empty";
	}else if(!reg.test(value)){
		ele.passValidate=false;
		this.showTip(ele,"fail");
		return "fail";
	}else{
		ele.passValidate=true;
		//如果当前验证的是密码框，则进行特殊的处理，如果总共存在两个密码框，则要求两个相等且满足密码验证正则
		if(ele.type == "password"){
			var pswd=[];
			for(var i=0;i<this.fields.length;i++){
				if(this.fields[i].type == "password"){
					pswd[pswd.length]=this.fields[i];
				}
			}
			if(pswd.length>2){
				throw new Error("A little strange, too much password field. ");
			}else if(pswd.length==2){
				if(pswd[0].value != pswd[1].value && pswd[1].value!=""){
					 this.showTip(ele,"fail");
			 		 ele.passValidate=false;
					 return "fail";
				}
			}
		}		
		this.showTip(ele,"success");
		return "success";
	}
};
FormValidate.prototype.showTip=function(ele,action){
	var span=ele.parentNode.getElementsByClassName("tips")[0];
	var defaultTips={
		"empty":" is required. ",
		"fail":" is not valid. ",
		"success":" is OK. "
	};
	if(this.config[ele.name][action]){
		span.innerHTML=this.config[ele.name][action];		
	}else{
		span.innerHTML=ele.name+defaultTips[action];
	}
	var actionList=["empty","fail","success"];
	for(var i=0;i<actionList.length;i++){
		if(action==actionList[i]){
			this.addClass(ele,action);
			this.addClass(span,action);
		}else{
			this.removeClass(ele,actionList[i]);
			this.removeClass(span,actionList[i]);
		}
	}
};
//一些工具方法
FormValidate.prototype.getByClass=function(cls,context){
	var _this=this;
	context=context || document;
	if(document.getElementsByClassName){
		return context.getElementsByClassName(cls);
	}
	var all=context.getElementsByTagName("*");
	return [].filter.call(all,function(e,i,a){
		return _this.hasClass(e,cls);
	});
};
FormValidate.prototype.hasClass=function(ele,cls){
	var reg=new RegExp("(^|\\s+)"+cls+"(\\s+|$)");
	return reg.test(ele.className);
};

FormValidate.prototype.addClass=function(ele,cls){
	if(!this.hasClass(ele,cls)){
		ele.className=ele.className+" "+cls;
	}	
};

FormValidate.prototype.removeClass=function(ele,cls){
	var clist=ele.className;
	var reg=new RegExp("(^|\\s+)"+cls+"($|\\s+)");
	clist=clist.replace(reg,function(){
		return " ";
	});
	ele.className=clist;
};
Object.defineProperty(FormValidate.prototype,"result",{
	get:function(){
		var flag=true;
		for(var i=0;i<this.fields.length;i++){
			if(this.fields[i].must){
				flag = flag && this.fields[i].passValidate;
			}
		}
		return flag;
	}
});
