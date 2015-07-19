## 一个轻量级表单验证控件
---

这是一个轻量级表单验证脚本，所有的代码封装在一个类`FormValidate`中，使用时`new`操作创建一个该类的对象，并传入两个参数：




```javascript
new FormValidate(form,formconfig);
```

### 特点
1. 使用简单，只要创建一个`FormValidate`类的对象，并传入两个参数即可；
3. 不直接改变元素的样式，而是根据验证的结果改变相关元素的类，这样用户可以更自由的定制表单样式；
4. 提供大量默认配置，全部采用默认配置的话只要传入一个选定的表单元素即可实现功能（这个前提是用户的表单HTML结构严格遵守HTML结构要求）；
5. 所有的默认配置都可以被覆盖，用户可以非常灵活的采用。如果不想采用默认配置，用户可以针对每个表单字段自定义验证规则以及验证通过或者不通过的提示信息；



******

### HTML结构要求

```html
<form id="myform">
	<div>
		<input type="text" name="username" class="fv">
		<span class="tips"></span>
	</div>
	<div>
		<input type="email" name="email" class="fv">
		<span class="tips"></span>
	</div>
	<div>
		<input type="number" name="phone" class="fv">
		<span class="tips"></span>
	</div>
	<div>
		<input type="submit"/>
	</div>
</form>
```
1. 每一个需要验证的表单字段必须设置唯一的`name`属性和`class`属性，且`class`中必须包含`fv`（意思是`form validate`）;
2. 每一个表单字段必须有一个相应的提示标签来显示验证通过或者不通过的信息，比如`span`，且其`class`属性需要包含`tips`；
3. 每一个表单字段与相应的提示标签必须在同一个父元素内，每个这样的父元素中只能放一个表单字段及其提示标签，如上述示例中的`div`标签。

---

### 参数要求

该脚本使用时只需要`new`操作创建一个`FormValidate`类型的对象即可，创建时，需要传入两个参数：`form`，`formconfig`；
#### 参数一：`form`
获取需要进行验证的表单，比如:

```javascript
var form=document.getElementById("myform");
```


#### 参数二：`formconfig`
第二个参数是一个对象，用来配置的验证选项，以下面一个例子来说明

```javascript
var formconfig={
	"username":{
		"reg":/^\w+$/,
		"fail":"用户名不符合规范。",
		"success":"<b>恭喜该用户名可用。</b>",
		"empty":"用户名不能为空。",
		"fieldtype":"username",
		"required":true,
	},
	"email":{
		
	},
	"phone":{
		"fail":"",
		"required":true
	}
};
```

这个配置对象可以用于前述html结构中的表单验证。
如上所示，需要进行表单验证的每个字段，都需要(必须)在`formconfig`对象中设定对应的属性，且属性名与该字段的`name`特性值一致。(属性名对应的属性值是空对象也可以，总之必须指定；如果是空对象则对应的表单字段全部采用脚本自动选择的验证规则。)


`formconfig`对象中每个属性名对应的值都是一个对象，这个对象可以设置如下属性：

##### "reg"
> `reg`接收一个正则表达式，可以自定义该字段的验证规则；当然，脚本内置了一些常用的验证规则，可以满足大部分常用需求，如果启用脚本内置的验证规则，不用设置该属性，在`fieldtype`属性中指定脚本内置的验证规则。



##### "fieldtype"
> `fieldtype`接收一个字符串，用于指定该字段的验证规则。脚本内置的验证规则列举如下，可以将`fieldtype`值指定为以下的任何一个。

	1. "text"，非空字符；
	2. "email"，邮件格式；
	3. "phone"，中国大陆地区的手机号；
	4. "postcode"，六位数邮政编码；
	5. "number"，任何有效数字（正、负树，0，小数）；
	6. "url"，超链接；
	7. "username"，注册用户名；
	8. "password"，一般密码规则，要求四位及以上非空字符串；
	9. "strongpassword"，更强壮的密码匹配，要求密码八位及以上且包含数字、字母及特殊字符。
	
##### "fail"
> `fail`接收一个字符串，指定验证不通过时的提示文字内容，可用html标签。如果不指定该属性，则采用默认的内容“field is not valid.”；

##### "success"
> `success`接收一个字符串，指定验证通过时的提示文字内容，可用html标签。如果不指定该属性，则采用默认的内容“field is OK.”；


##### "empty"
> `empty`接收一个字符串，指定当表单字段为空时的提示文字内容，可用html标签。如果不指定该属性，则采用默认的内容“field is required.”；

##### "required"
> `required`接收一个布尔值，指定该表单字段是否为必填项；也可以直接在标签行内指定表单字段的`required`特性。


#### 验证规则的优先级
1. 优先级最高的是用户为表单字段自定义的`reg`属性。
2. 其次，如果用户没有指定某表单字段的`reg`属性，则根据用户提供`fieldtype`值采用脚本内置的常用验证规则。
3. 最后，如果用户也没有指定`fieldtype`属性，则根据该表单字段的`type`特性自动选择最合适的验证规则。


### 后续操作
在传入参数创建了`FormValidate`对象后，传入的表单就可以实现验证的功能。
比如

```javascript
var fv=new FormValidate(form,formconfig);
form.onsubmit=function(e){
	alert(fv.result);
	e.preventDefault();
}
```

这之后，可以在任何时候访问`fv.result`属性（其值是`true`或者`false`）获取整个表单的验证结果，而且所有的表单字段值已经过滤了首位空字符。


### UI样式设定
该脚本不改变任何元素样式，只是根据不同的验证结果给相关元素设定不同的`class`值，你可以通过指定`class`的样式，来为表单建立不同外观。


1. 某表单字段获得焦点：
	+ 该字段的HTML标签添加类`active`；

	
2. 某表单字段失去焦点：
	+ 该字段的HTML标签删除类`active`；
	
	
1. 某表单字段验证通过：
	+ 该表单字段添加`success`类；
	+ 该表单对应的提示标签添加`success`类；
	
	
1. 某表单字段验证不通过：
	+ 该表单字段添加`fail`类；
	+ 该表单对应的提示标签添加`fail`类；


1. 某表单字段为空：
	+ 该表单字段添加`empty`类；
	+ 该表单对应的提示标签添加`empty`类。
	

	
 