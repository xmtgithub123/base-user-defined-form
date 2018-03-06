// destination 继承 source
Object.extend = function(destination, source) {
	for (property in source) {
		destination[property] = source[property];
	}
	return destination;
};

Object.bind = function(object, fun) {
	return function() {
		return fun.apply(object, arguments);
	}
};

Object.each = function(list, fun) {
	for (var i = 0, len = list.length; i < len; i++) { fun(list[i], i); }
};

//================================String====================================

// 产生重复字符
String.prototype.pad = function (n, char) {
    var str = this;
    var len = str.length;
    while (len < n) {
        str = char + str;
        len++;
    }
    return str;
};

// 去除左右空格
String.prototype.trim = function () {
    var str = this,
	str = str.replace(/^\s\s*/, ''),
	ws = /\s/,
	i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

// 去除左边空格
String.prototype.trimStart = function () {
    return this.replace(/(^\s*)/g, "");
};

// 去除右边空格
String.prototype.trimEnd = function () {
    return this.replace(/(\s*$)/g, "");
};

// 去除左右空格
String.prototype.clearSpaceToOne = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "").replace(/\s+/g, " ");
};

// 判断字符是否是 str 开头
String.prototype.startWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
};

// 判断字符是否是 str 结尾
String.prototype.endWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
};

// 得到字符长度，中文算2个字符
String.prototype.getByteLength = function () {
    var ch, bytenum = 0;
    var pt = /[^\x00-\xff]/;
    for (var i = 0; i < this.length; i++) {
        ch = this.substr(i, 1);
        if (ch.match(pt)) {
            bytenum += 2;
        } else {
            bytenum += 1;
        }
    }
    return bytenum;
};

// 字符截取 num 长度，并在结尾加 ostr
String.prototype.getByteLengthString = function (num, ostr) {
    var ch, bytenum = 0;
    var rs = "";
    var pt = /[^\x00-\xff]/;
    for (var i = 0; i < this.length; i++) {
        ch = this.substr(i, 1);
        if (ch.match(pt)) {
            bytenum += 2;
            if (bytenum > num) {
                return rs + ostr;
            }
        } else {
            bytenum += 1;
            if (bytenum == num) {
                return rs + ostr;
            }
        }
        rs += ch;
    }
    return rs;
};

// 仿 C# String.Format
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    });
};

//// 匹配正则表达式
//String.prototype.match = function () {

//};

// 转换为 数字 类型
String.prototype.toInt = function () {
    return parseInt(this, 10);
};

// 仿 C# String.Format
String.format = function () {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

/**
* 过滤字符串里面的html标记，类似于 innerText
*/
String.prototype.stripTags = function () {
    return this.replace(/<\/?[^>]+>/gi, '');
};

/**
* 类似 escape，转换 " & < > 为 &quot; &amp; %lt; &gt;
*/
String.prototype.escapeHTML = function () {
    var div = document.createElement('div');
    var text = document.createTextNode(this);
    div.appendChild(text);
    return div.innerHTML;
};

/**
* 和上面相反
*/
String.prototype.unescapeHTML = function () {
    var div = document.createElement('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
};

// 生成重复字符串
String.prototype.times = function (n) {
    if (n == 1) {
        return this;
    }
    var s = this.times(Math.floor(n / 2));
    s += s;
    if (n % 2) {
        s += this;
    }
    return s;
}

// 得到安全字符串（用于搜索）
String.prototype.getSafeText = function () {
    var _regSafeText = /(\'|\-{2,2})+/;
    return this.replace(_regSafeText, "");
};

// 反序列化提交参数对象 如把 name=aa&sex=1 转换为 {name:"aaa",sex="1"}
String.prototype.deserialize = function (separator) {
    var hash = {};
    var match = this.trim().match(/([^?#]*)(#.*)?$/);
    if (!match) return {};
    var querys = match[1].split(separator || '&');
    for (var i = 0; i < querys.length; i++) {
        var pair = querys[i].split('=')
        if (pair[0]) {
            var key = decodeURIComponent(pair.shift());
            var value = pair.length > 1 ? pair.join('=') : pair[0];
            if (value != undefined) value = decodeURIComponent(value);
            hash[key] = value;
        }
    }
    return hash;
};

// 转换Json对象为url参数 如把 {name:"aaa",sex="1"} 转换为 name=aa&sex=1
String.serialize = function(oSender, sSeparator) {
	var stringBuilder = [];
	for (var p in oSender) {
		try {
			if (typeof (oSender[p]) != "function") {
				if (oSender[p] == null || oSender[p] == undefined) {
					stringBuilder.push(p + "=");
				} else if (oSender[p] instanceof Array) {
					stringBuilder.push(p + "=" + oSender[p].join(','));
				} else {
					stringBuilder.push(p + "=" + encodeURIComponent(oSender[p].toString()));
				}
			}
		} catch (e) {

		}
	}
	return stringBuilder.join(sSeparator);
};

//================================Data====================================

var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
//                      1        2       3         4          5          6          7          8  9     10      11
Date.jsonStringToDate = function (string) {
    var match;
    if (string == undefined) return new Date(0);
    if (match = string.match(R_ISO8601_STR)) { //
        var date = new Date(0),
            tzHour = 0,
            tzMin = 0,
            dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
            timeSetter = match[8] ? date.setUTCHours : date.setHours;

        if (match[9]) {
            tzHour = (match[9] + match[10]).toInt();
            tzMin = (match[9] + match[11]).toInt();
        }
        dateSetter.call(date, (match[1]).toInt(), (match[2]).toInt() - 1, (match[3]).toInt());
        var h = (match[4] || "0").toInt() - tzHour;
        var m = (match[5] || "0").toInt() - tzMin;
        var s = (match[6] || "0").toInt();
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
    }
    return new Date(0);
};
//把时间字符串转换为时间字符串,替换'/'为'-',替换1900,0001等时间为空
Date.jsonStringToDateString = function (string, formatString) {
    if (string == undefined) return "";
    string = string.replace('/','-');
    var match;
    if (match = string.match(R_ISO8601_STR)) { //
        var date = new Date(0),
            tzHour = 0,
            tzMin = 0,
            dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
            timeSetter = match[8] ? date.setUTCHours : date.setHours;

        if (match[9]) {
            tzHour = (match[9] + match[10]).toInt();
            tzMin = (match[9] + match[11]).toInt();
        }
        dateSetter.call(date, (match[1]).toInt(), (match[2]).toInt() - 1, (match[3]).toInt());
        var h = (match[4] || "0").toInt() - tzHour;
        var m = (match[5] || "0").toInt() - tzMin;
        var s = (match[6] || "0").toInt();
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        if(date.getFullYear()=="1" || date.getFullYear()=="1900")
        {
            return "";
        }
        return date.format(formatString);
    }
    return "";
};

Date.prototype.format = function (format) {
    // 时间格式化
    var o = {
        "M+": this.getMonth() + 1,                      //month 
        "d+": this.getDate(),                           //day 
        "h+": this.getHours(),                          //hour 
        "m+": this.getMinutes(),                        //minute 
        "s+": this.getSeconds(),                        //second 
        "q+": Math.floor((this.getMonth() + 3) / 3),    //quarter 
        "S": this.getMilliseconds()                     //millisecond 
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//日期增加 "2000/12/31".dateAdd('d',1,);
Date.prototype.dateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};

//+---------------------------------------------------  
//| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串  
//+---------------------------------------------------
Date.prototype.dateDiff = function (strInterval, dtEnd) {
    var dtStart = this;
    if (typeof dtEnd == 'string')//如果是字符串转换为日期型  
    {
        dtEnd = new Date(dtEnd);
    }
    switch (strInterval) {
        case 's': return parseInt((dtEnd - dtStart) / 1000);
        case 'n': return parseInt((dtEnd - dtStart) / 60000);
        case 'h': return parseInt((dtEnd - dtStart) / 3600000);
        case 'd': return parseInt((dtEnd - dtStart) / 86400000);
        case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
        case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
        case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
    }
};

//+---------------------------------------------------  
//| 把日期分割成数组  
//+---------------------------------------------------
Date.prototype.toArray = function () {
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth();
    myArray[2] = myDate.getDate();
    myArray[3] = myDate.getHours();
    myArray[4] = myDate.getMinutes();
    myArray[5] = myDate.getSeconds();
    return myArray;
};

//+---------------------------------------------------  
//| 取得日期数据信息  
//| 参数 interval 表示数据类型  
//| y 年 m月 d日 w星期 ww周 h时 n分 s秒  
//+---------------------------------------------------
Date.prototype.datePart = function (interval) {
    var myDate = this;
    var partStr = '';
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    switch (interval) {
        case 'y': partStr = myDate.getFullYear(); break;
        case 'm': partStr = myDate.getMonth() + 1; break;
        case 'd': partStr = myDate.getDate(); break;
        case 'w': partStr = week[myDate.getDay()]; break;
        case 'ww': partStr = myDate.WeekNumOfYear(); break;
        case 'h': partStr = myDate.getHours(); break;
        case 'n': partStr = myDate.getMinutes(); break;
        case 's': partStr = myDate.getSeconds(); break;
    }
    return partStr;
};

//+---------------------------------------------------  
//| 取得当前日期所在月的最大天数  
//+---------------------------------------------------
Date.prototype.maxDayOfDate = function () {
    var myDate = this;
    var ary = myDate.toArray();
    var date1 = (new Date(ary[0], ary[1] + 1, 1));
    var date2 = date1.dateAdd(1, 'm', 1);
    var result = dateDiff(date1.format('yyyy-MM-dd'), date2.format('yyyy-MM-dd'));
    return result;
};


//================================Array====================================

if (typeof Array.prototype['max'] == 'undefined') {
    Array.prototype.map = function (fn, thisObj) {
        var scope = thisObj || window;
        var a = [];
        for (var i = 0, j = this.length; i < j; ++i) {
            a.push(fn.call(scope, this[i], i, this));
        }
        return a;
    };
    Array.prototype.max = function () {
        return Math.max.apply({}, this)
    };
    Array.prototype.min = function () {
        return Math.min.apply({}, this)
    };
}

Array.prototype.indexOf = function (oValue) {
    /// <summary>在数组中查找对应值，返回所在位置</summary>
    /// <param name="oValue" type="Object">要进行匹配的对象</param>
    var n = -1;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == oValue) {
            n = i;
            break;
        }
    }
    return n;
};

Array.prototype.isIndexOf = function (oValue) {
    /// <summary>在数组中查找有无对应值</summary>
    /// <param name="oValue" type="Object">要进行匹配的对象</param>
    return this.indexOf(oValue) == -1 ? false : true;
};

Array.prototype.each = function (fn) {
    if (typeof Array.prototype.forEach === "function") {
        this.forEach(fn)
    } else {
        var scope = arguments[1] || window;
        for (var i = 0, j = this.length; i < j; ++i) {
            fn.call(scope, this[i], i, this);
        }
    }
};

Array.range = function (start, end) {
    var _range = []
    for (var i = start, l = end - start; i < l; i++) {
        _range.push(i)
    }
    return _range
};

Array.indexOf = function (args, value) {
    /// <summary>在数组中查找对应值，返回所在位置</summary>
    /// <param name="oValue" type="Object">要进行匹配的对象</param>
    var n = -1;
    for (var i = 0; i < args.length; i++) {
        if (args[i] == value) {
            n = i;
            break;
        }
    }
    return n;
};

Array.isIndexOf = function (argso, value) {
    /// <summary>在数组中查找有无对应值</summary>
    /// <param name="oValue" type="Object">要进行匹配的对象</param>
    if (value != "") {
        for (var i = 0; i < argso.length; i++) {
            if (argso[i] == value) {
                return true;
            }
        }
    }
    return false;
};


/*------------------------------------------CheckBox---------------------------------------------------*/

function CheckBoxUtil() { }

CheckBoxUtil.setValue = function (name, value) {
	/// <summary>设置 checkbox 的默认选中值</summary>
	var inputs = document.getElementsByName(name);
	value = value || "";
	var values = value.split(",");
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (values.isIndexOf(input.value)) {
			input.checked = true;
		} else {
			input.checked = false;
		}
	}
};

CheckBoxUtil.getValue = function (name) {
	/// <summary>设置 checkbox 的默认选中值</summary>
	var values = [];
	var inputs = document.getElementsByName(name);
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.checked && input.value != "") {
			values.push(input.value);
		}
	}
	return values.join(",");
};

CheckBoxUtil.hasValue = function (name) {
	/// <summary>设置 checkbox 的默认选中值</summary>
	var values = [];
	var inputs = document.getElementsByName(name);
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		values.push(input.value);
	}
	return values.join(",");
};

CheckBoxUtil.selectedAll = function (name, checked) {
	/// <summary>全选或反选 checkbox</summary>
	var inputs = document.getElementsByName(name);
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (checked == null) {
			input.checked = !input.checked;
		} else {
			input.checked = checked;
		}
	}
};

/*------------------------------------------Radio---------------------------------------------------*/

function RadioUtil() { }

RadioUtil.setValue = function (name, value) {
	/// <summary>设置 radio 的默认选中值</summary>
	var inputs = document.getElementsByName(name);	
	value = value || "";
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		input.checked = (input.value == value);
	}
};

RadioUtil.getValue = function (name) {
	/// <summary>设置 radio 的默认选中值</summary>
	var rtvalue = "";
	var inputs = document.getElementsByName(name);
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.checked) {
			rtvalue = input.value;
			break;
		}
	}
	return rtvalue;
};

/* ------------------------针对select操作的实用Select类------------------- */

function SelectUtil() { };

/* 
* 根据指定的JSON对象来生成指定的select的options项（清除原来的options）.  
*/
SelectUtil.getData = function (/*string*/selectId, /*json object*/jsonData, /*bool*/doClear) {
	var _bclear = doClear || false;
	if (_bclear) {
		SelectUtil.clear(selectId);
	}
	try {
		if (!jsonData) return;
		for (var i = 0; i < jsonData.length; i++) {
			SelectUtil.addOption(selectId, jsonData[i].Text, jsonData[i].Value);
		}
	} catch (ex) {
		alert('设置select错误：指定的JSON对象不符合Select对象的解析要求！');
	}
};
/* 
* 根据指定的JSON对象来生成指定的select的options项（清除原来的options）.  
*/
//搜索页面专用,用于添加一个全部,初始化默认选择
SelectUtil.getDataAddAll = function (/*string*/selectId, /*json object*/jsonData, /*bool*/doClear) {
    var _bclear = doClear || false;
    if (_bclear) {
        SelectUtil.clear(selectId);
    }
    try {
        SelectUtil.addOption(selectId, "全部", 0);
        if (!jsonData) return;
        for (var i = 0; i < jsonData.length; i++) {
            SelectUtil.addOption(selectId, jsonData[i].Text, jsonData[i].Value);
        }
    } catch (ex) {
        alert('设置select错误：指定的JSON对象不符合Select对象的解析要求！');
    }
};

/*
* 创建一个options并返回  
*/
SelectUtil.createOption = function (/*string*/text, /*string*/value) {
	var opt = document.createElement('option');
	opt.setAttribute('value', value);
	opt.innerHTML = text;
	return opt;
};

/*
* 给指定的select添加一个option,并返回当前option对象  
*/
SelectUtil.addOption = function (/*string*/selectId, /*string*/text, /*string*/value) {
	var opt = SelectUtil.createOption(text, value);
	document.getElementById(selectId).appendChild(opt);
	return opt;
};

/*
* 获取指定select的当前被选中的options对象数组.  
*/
SelectUtil.getSelected = function (/*string*/selectId) {
	var slt = document.getElementById(selectId);
	if (!slt) {
		return [];
	}
	var result = [];
	if (slt.type.toLowerCase() == "select-multiple") {
		var len = SelectUtil.len(selectId);
		for (var i = 0; i < len; i++) {
			if (slt.options[i].selected) result.push(slt.options[i]);
		}
	} else {
		var index = slt.selectedIndex;
		if (index > -1) {
			result.push(slt.options[index]);
		}
	}
	return result;
};

/*
* 获取指定select的当前被选中的options对象的值数组.  
*/
SelectUtil.getSelectedValue = function (/*string*/selectId) {
	var result = [];
	var items = SelectUtil.getSelected(selectId);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		result.push(item.value);
	};
	return result;
};

/*
* 使指定索引位置的option被选中.从0开始.  
*/
SelectUtil.setSelected = function (/*string*/selectId, /*int*/index) {
	var slt = document.getElementById(selectId);
	if (!slt) return false;
	for (var i = 0; i < slt.options.length; i++) {
		if (index == i) {
			slt.options[i].selected = true;
			return true;
		}
	}
	return false;
};

/*
* 根据value设置select的选中状态  
*/
SelectUtil.setSelectedValue = function (/*string*/selectId, /*string*/value) {
	var slt = document.getElementById(selectId);
	if (!slt) return false;
	value = value || "";
	for (var i = 0; i < slt.options.length; i++) {
		if (value.toString() == slt.options[i].value) {
			slt.options[i].selected = true;
			return true;
		}
	}
	return false;
};


/*
* 选中指定的select的所有option选项，如果支持多选的话  
*/
SelectUtil.selectAll = function (/*string*/selectId) {
	var len = SelectUtil.len(selectId);
	for (var i = 0; i < len; i++) SelectUtil.setSelected(selectId, i);
};

/*
* 获取指定select的总的options个数  
*/
SelectUtil.len = function (/*string*/selectId) {
	return document.getElementById(selectId).options.length;
};

/* 
* 清除select中满足条件的options，如果没有指定处理方法则清除所有options项  
*/
SelectUtil.clear = function (/*string*/selectId, /*function*/iterator) {
	if (typeof (iterator) != 'function') {
		document.getElementById(selectId).length = 0;
	} else {
		var slt = document.getElementById(selectId);
		for (var i = slt.options.length - 1; i >= 0; i--) {
			if (iterator(slt.options[i]) == true) slt.removeChild(slt.options[i]);
		}
	}
};

/*
* 复制指定的select的option对象到另外一指定的select对象上.如果指定了处理  
* 函数，那么只有返回true时才会copy.  
* 函数iterator参数：当前处理的option对象、目标select的options数组  
*/
SelectUtil.copy = function (/*string*/srcSlt, /*string*/targetSlt, /*function*/iterator) {
	var s = document.getElementById(srcSlt), t = document.getElementById(targetSlt);
	for (var i = 0; i < s.options.length; i++) {
		if (typeof (iterator) == 'function') {
			if (iterator(s.options[i], t.options) == true) {
				t.appendChild(s.options[i].cloneNode(true));
			}
		} else {
			t.appendChild(s.options[i].cloneNode(true));
		}
	}
};

/*------------------------------------------KeyboardUnit---------------------------------------------------*/

function KeyboardUnit() { }

/*
37 按左键
38 按上键
39 按右键
40 按下键
13 按回车键
27 按ESC键

demo: onkeypress="KeyboardUnit.CheckKeyCode(event, 13, btnLogin_onclick);"
*/
KeyboardUnit.CheckKeyCode = function (event, keycode, backcall) {
	var ev = EventUtil.getEvent();
	if (ev.keyCode == keycode) {
		backcall();
	}
};


/*------------------------------------------DomUtil---------------------------------------------------*/

function DomUtil() { }

DomUtil.reflect = function (oSender, sSeparator) {
	// 反射对象属性
	var stringBuilder = new Array();
	for (var p in oSender) {
		try {
			if (typeof (oSender[p]) != "function") {
				if (oSender[p] == null || oSender[p] == undefined) {
					stringBuilder.push(p + "=");
				} else if (oSender[p] instanceof Array) {
					stringBuilder.push(p + "=" + oSender[p]);
				} else {
					stringBuilder.push(p + "=" + oSender[p].toString().escapeHTML());
				}
			}
		} catch (e) {

		}
	}
	return stringBuilder.join(sSeparator);
};

DomUtil.loadJSCSSFile = function (url, type, id, callback) {
	// 动态载入js或css
	// url: 要载入的js或css路径
	// type: 文件类型（script 或 css）
	// id: <script>标签的id，不填则新建一个
	// callback: 载入完成后执行的操作
	var head = document.getElementsByTagName("head").item(0);
	var targetelement = (type && type.toLowerCase() == "css") ? "link" : "script";
	var targettype = (type && type.toLowerCase() == "css") ? "text/css" : "text/javascript";
	var targeturl = (type && type.toLowerCase() == "css") ? "href" : "src";
	var script = null;
	if (id) {
		script = $IdSel(id);
	} else {
		script = document.createElement(targetelement);
		script.type = targettype;
	}
	if (script) {
		script.setAttribute(targeturl, url);
		script.onload = script.onreadystatechange = function () {
			if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete') return;
			script.onload = script.onreadystatechange = null;
			if (callback) callback();
		};
		if (!id) head.appendChild(script);
	}
};

DomUtil.removeJSCSSFile = function (filename, filetype) {
	// 移除现有js和css文件
	var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
	var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
	var allsuspects = document.getElementsByTagName(targetelement);
	for (var i = allsuspects.length; i >= 0; i--) {
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
	}
};

// 转换表单值为 {xxx=xxx,zzz=zzz} 的json对象形式
DomUtil.serialize = function (element) {
	var ser = {};
	var arr = {};
	var inputs = element.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		switch (input.type.toLowerCase()) {
			case "hidden":
			case "password":
		    case "text":
		    case "number":
            case "tel":
			case "date":
				ser[input.name == "" ? input.id : input.name] =(input.value);
				break;
			case "checkbox":
			case "radio":
				if (arr[input.name] == null) { arr[input.name] = []; }
				if (input.checked && input.value != "") {
					arr[input.name].push(input.value);
				}
				break;
		}

	}
	for (var a in arr) {
		if (arr[a] instanceof Array) {
			ser[a] = (arr[a].join(","));
		}
	}
	var textareas = element.getElementsByTagName("textarea");
	for (var k = 0; k < textareas.length; k++) {
		var textarea = textareas[k];
		ser[textarea.name == "" ? textarea.id : textarea.name] = (textarea.value);
	}
	var selects = element.getElementsByTagName("select");
	for (var j = 0; j < selects.length; j++) {
		var sel = selects[j];
		var sid = sel.name == "" ? sel.id : sel.name;
		ser[sid] = (SelectUtil.getSelectedValue(sid).join(","));
	}
	return ser;
};

// 将 json对象 {xxx=xxx,zzz=zzz} 自动填充到表单
DomUtil.deserialize = function(data) {
	for (var p in data) {
		var ctl = document.getElementById(p);
		if (ctl) {
			switch (ctl.tagName.toLowerCase()) {
				case "input":
					switch (ctl.type.toLowerCase()) {
						case "hidden":
						case "text":
							ctl.value = data[p]; // .escapeHTML()
							break;
                        case "tel":
                            ctl.value = data[p]; // .escapeHTML()
                            break;
						case "date":
							ctl.value = (Date.jsonStringToDate(data[p])).format("yyyy-MM-dd");
							break;
                        case "datetime":
                        case "datetime-local":
                            ctl.value = (Date.jsonStringToDate(data[p])).format("yyyy-MM-dd");
                            break;
						default:
                            ctl.value = data[p]; // .escapeHTML()
							break;
					}
					break;
				case "textarea":
					ctl.value = data[p];
					break;
                case "select":
                	SelectUtil.setSelectedValue(ctl.id, data[p]);
                    break;
				default:
                    ctl.innerHTML = data[p];
					break;
			}
		}
	}
};

// 设置控件可编辑
DomUtil.setCtrlsReadonly = function (data, div) {
    //所有控件全部可写
    var objs;
    if (data == "{}") {
        objs = div.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            var ctl = objs[i];
            switch (ctl.tagName.toLowerCase()) {
                case "input":
                    switch (ctl.type.toLowerCase()) {
                        case "text":
                            ctl.readOnly = false;
                            ctl.className = ctl.className.replace('jq-text-disabled', '');
                            //如果为lCalendar日期控件
                            if (ctl.getAttribute("data-type") == "lCalendar") {
                                ctl.disabled = false;
                                ctl.readOnly = true;
                            }
                            if (ctl.getAttribute("data-type") == "DatePicker") {
                                ctl.disabled = false;
                                ctl.readOnly = true;
                            }
                            if (ctl.getAttribute("data-type") == "TimePicker") {
                                ctl.disabled = false;
                                ctl.readOnly = true;
                            }
                            break;
                        case "radio":
                            ctl.onclick = function () { };
                            ctl.className = ctl.className.replace('jq-radio-disabled', '');
                            break;
                        default:
                            ctl.readOnly = false;
                            ctl.className = ctl.className.replace('jq-text-disabled', '');
                            break;
                    }
                    break;
                case "select":
                    ctl.disabled = false;
                    ctl.className = ctl.className.replace('jq-text-disabled', '');
                    break;
                case "a":
                    //如果为附件控件
                    if (ctl.getAttribute("data-type") == "UploadFile") {

                        document.getElementById("UploadFileVisible").value = 1;
                    }
                    break;
                default:
                    ctl.readOnly = false;
                    ctl.className = ctl.className.replace('jq-text-disabled', '');
                    break;
            }
        }
    } else {
        objs = data.split(";");
        for (var i = 0; i < objs.length; i++) {
            var ctl = document.getElementById(objs[i]);
            if (ctl) {
                switch (ctl.tagName.toLowerCase()) {
                    case "input":
                        switch (ctl.type.toLowerCase()) {
                            case "text":
                                ctl.readOnly = false;
                                ctl.className = ctl.className.replace('jq-text-disabled', '');
                                //如果为lCalendar日期控件
                                if (ctl.getAttribute("data-type") == "lCalendar") {
                                    ctl.disabled = false;
                                    ctl.readOnly = true;
                                }
                                if (ctl.getAttribute("data-type") == "DatePicker") {
                                    ctl.onclick = function (e) {
                                        api.openPicker({
                                            type: 'date',
                                            date: $(e).attr("value"),
                                            title: '选择日期'
                                        }, function (ret, err) {
                                            if (ret) {
                                                $(e).val(ret.year + "-" + fromatInt(ret.month) + "-" + fromatInt(ret.day));
                                            } else {
                                            }
                                        });
                                    };
                                    ctl.readOnly = true;
                                }
                                if (ctl.getAttribute("data-type") == "TimePicker") {
                                    // ctl.onclick =  function(e){
                                    //     api.openPicker({
                                    //         type: 'time',
                                    //         date: $(e).attr("value"),
                                    //         title: '选择时间'
                                    //     }, function(ret, err){
                                    //         if( ret ){
                                    //             $(e).val(fromatInt(ret.hour)+":"+fromatInt(ret.minute));
                                    //         }else{
                                    //         }
                                    //     });
                                    // };
                                    ctl.onclick = openTimePicker(this);
                                    ctl.readOnly = true;
                                }
                                break;
                            case "radio":
                                ctl.onclick = function () { };
                                ctl.className = ctl.className.replace('jq-radio-disabled', '');
                                break;
                        
                            default:
                                ctl.readOnly = false;
                                ctl.className = ctl.className.replace('jq-text-disabled', '');
                                break;
                        }
                        break;
                    case "select":
                        ctl.disabled = false;
                        ctl.className = ctl.className.replace('jq-text-disabled', '');
                        break;
                    case "a":
                        //如果为附件控件
                        //如果为附件控件
                        if (ctl.getAttribute("data-type") == "UploadFile") {

                            document.getElementById("UploadFileVisible").value = 1;
                        }
                        break;
                    default:
                        ctl.readOnly = false;
                        ctl.className = ctl.className.replace('jq-text-disabled', '');
                        break;
                }
            }
        }
    }
};

/*------------------------------------------JSON Tools---------------------------------------------------*/

// function to return a JSON object form a JSON.NET serialized object with $id/$ref key-values
// obj: the obj of interest.
// parentObj: the top level object containing all child objects as serialized by JSON.NET.
function getJsonNetObject(obj, parentObj) {
    // check if obj has $id key.
    var objId = obj["$id"];
    if (typeof (objId) !== "undefined" && objId != null) {
        // $id key exists, so you have the actual object... return it
        return obj;
    }
    // $id did not exist, so check if $ref key exists.
    objId = obj["$ref"];
    if (typeof (objId) !== "undefined" && objId != null) {
        // $ref exists, we need to get the actual object by searching the parent object for $id
        return getJsonNetObjectById(parentObj, objId);
    }
    // $id and $ref did not exist... return null
    return null;
}

// function to return a JSON object by $id
// parentObj: the top level object containing all child objects as serialized by JSON.NET.
// id: the $id value of interest
function getJsonNetObjectById(parentObj, id) {
    // check if $id key exists.
    var objId = parentObj["$id"];
    if (typeof (objId) !== "undefined" && objId != null && objId == id) {
        // $id key exists, and the id matches the id of interest, so you have the object... return it
        return parentObj;
    }
    for (var i in parentObj) {
        if (typeof (parentObj[i]) == "object" && parentObj[i] != null) {
            //going one step down in the object tree
            var result = getJsonNetObjectById(parentObj[i], id);
            if (result != null) {
                // return found object
                return result;
            }
        }
    }
    return null;
}