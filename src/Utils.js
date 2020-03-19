define([], function() {

	//---------------------------------------------------  
	// 日期格式化  
	// 格式 YYYY/yyyy/YY/yy 表示年份  
	// MM/M 月份  
	// W/w 星期  
	// dd/DD/d/D 日期  
	// hh/HH/h/H 时间  
	// mm/m 分钟  
	// ss/SS/s/S 秒  
	//---------------------------------------------------  
	Date.prototype.Format = function(formatStr) {
		var str = formatStr;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, this.getFullYear());
		str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this
				.getYear() % 100).toString() : '0' +
			(this.getYear() % 100));

		str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth()
			.toString() : '0' + this.getMonth());
		str = str.replace(/M/g, this.getMonth());

		str = str.replace(/w|W/g, Week[this.getDay()]);

		str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate()
			.toString() : '0' + this.getDate());
		str = str.replace(/d|D/g, this.getDate());

		str = str.replace(/hh|HH/, this.getHours() > 9 ? this
			.getHours().toString() : '0' + this.getHours());
		str = str.replace(/h|H/g, this.getHours());
		str = str.replace(/mm/, this.getMinutes() > 9 ? this
			.getMinutes().toString() : '0' + this.getMinutes());
		str = str.replace(/m/g, this.getMinutes());

		str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this
			.getSeconds().toString() : '0' + this.getSeconds());
		str = str.replace(/s|S/g, this.getSeconds());
		str = str.replace(/u|U/g, (this.getMilliseconds() / 1000 + "00000").substring(2, 5));
		return str;
	}
	// in Simple {'prefix_name':int_value}
	// Get id by name 
	// Get name by id
	// Type , Prefix ,Map
	return {
		enumMap: {},
		EnumMapRegister: function(collection, prefix) {
			this.enumMap[prefix] = {
				'collection': collection, // keyName => IntValue
				'reverse': [], // IntValue => keyName
			};
			for(var key in collection) {
				this.enumMap[prefix]['reverse'][collection[key]] = key;
			}
		},
		EnumGetKey: function(prefix, ID) {
			var ret = this.enumMap[prefix]['reverse'][ID];
			if(undefined === ret) {
				return ret;
			}
			return ret.replace(prefix, '');
		},
		EnumGetValue: function(prefix, key) {
			return this.enumMap[prefix]['collection'][(prefix + key).toUpperCase()];
		},
		now: function() {
			//					return (new Date()).Format('yyyy-MM-dd HH:mm:ss');
			return(new Date()).Format('HH:mm:ss.u');
		},
		containGetKey: function(collection, value) {
			for(var key in collection) {
				if(collection[key] == value) {
					return key;
				}
			}
			return false;
		},
		extend: function(Child, Parent) {
			var F = function() {};
			F.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.prototype.constructor = Child;
			Child.uber = Parent.prototype;
		},
		extendOptions: function(defaultOptions, options) {
			for(var i in options) {
				if(typeof options[i] == 'function') {
					defaultOptions[i] = options[i];
					continue;
				}
				if(options[i] instanceof Object) {
					for(var j in options[i]) {
						if(typeof options[i][j] == 'function') {
							defaultOptions[i][j] = options[i][j];
							continue;
						}
						if(options[i][j] instanceof Object) {
							for(var k in options[i][j]) {
								defaultOptions[i] = defaultOptions[i] ? defaultOptions[i] : {};
								defaultOptions[i][j] = defaultOptions[i][j] ? defaultOptions[i][j] : {};
								defaultOptions[i][j][k] = options[i][j][k];
							}
						} else {
							defaultOptions[i] = defaultOptions[i] ? defaultOptions[i] : {};
							defaultOptions[i][j] = options[i][j];
						}
					}
				} else {
					defaultOptions[i] = options[i];
				}
			}
			return defaultOptions;
		},
		getRandomNum4: function() {
			var rnd = '' + Math.floor(Math.random() * 10000);
			while(rnd.length < 4) rnd = '0' + rnd;
			return rnd;
		},
		getSequence: function() {
			var rnd = '' + Math.floor(Math.random() * 1000);
			while(rnd.length < 3) rnd = '0' + rnd;
			var st = this.timestamp() + '';
			//					console.log(st);
			return st.substring(0, 3) + st.substring(6) + rnd;
		},
		timestamp: function() {
			return parseInt((new Date()).valueOf() / 1000);
		},
		loadProtoFile: function(filename) {
			var builder = ProtoBuf.loadProtoFile(filename);
			return builder.build();
		},
		loadProtoString: function(string) {
			var builder = ProtoBuf.loadProto(string);
			return builder.build();
		},
		ten2sixteen: function(d) {
			return [d >> 8, d & 0xff];
		},
		hex2IntArray: function(hexStr) {
			if(hexStr.length % 2) {
				hexStr = hexStr + '0';
			}
			var intArray = [];
			for(var i = 0; i < hexStr.length; i += 2) {
				var s = hexStr.substr(i, 2);
				intArray[i / 2] = parseInt(s, 16);
			}
			return intArray;
		},
		intArray2HexStr: function(intArray) {
			var sss = '';
			for(var i = 0; i < intArray.length; i++) {
				var s = parseInt(intArray[i]).toString(16);
				if(s.length == 1) {
					s = '0' + s;
				}
				sss += s;
			}
			return sss;
		},
		getOptionOrDefault: function(options, key, defaultValue) {
			if(!options) {
				return defaultValue;
			}
			return options[key] === undefined ? defaultValue : options[key];
		},
		HOTP: function(K, C) {
			var key = sjcl.codec.base32.toBits(K);
			// Count is 64 bits long. Note that JavaScript bitwise
			// operations
			// make
			// the MSB effectively 0 in this case.
			var count = [((C & 0xffffffff00000000) >> 32),
				C & 0xffffffff
			];
			var otplength = 6;

			var hmacsha1 = new sjcl.misc.hmac(key, sjcl.hash.sha1);
			var code = hmacsha1.encrypt(count);

			var offset = sjcl.bitArray.extract(code, 152, 8) & 0x0f;
			var startBits = offset * 8;
			var endBits = startBits + 4 * 8;
			var slice = sjcl.bitArray
				.bitSlice(code, startBits, endBits);
			var dbc1 = slice[0];
			var dbc2 = dbc1 & 0x7fffffff;
			var otp = dbc2 % Math.pow(10, otplength);
			var result = otp.toString();
			while(result.length < otplength) {
				result = '0' + result;
			}
			return result;
		},
		base32_encode: function(str) {
			var base32Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
				len = str.length,
				b32 = '',
				rest = 0,
				restLen = 0;
			for(var i = 0; i < len; i++) {
				var chrCode = str.charCodeAt(i),
					thisByte = rest << 8 |
					chrCode,
					thisByteLen = restLen + 8;
				while(thisByteLen >= 5) {
					b32 += base32Map
						.charAt(thisByte >> (thisByteLen - 5));
					thisByteLen -= 5;
					thisByte = thisByte &
						(Math.pow(2, thisByteLen) - 1);
				}
				rest = thisByte;
				restLen = thisByteLen;
			}
			if(restLen > 0) {
				rest = rest << (5 - restLen);
				b32 += base32Map.charAt(rest);
			}
			return b32;
		},
		array_reverse: function(data) {
			var map = [];
			for(var key in data) {
				map[data[key]] = key;
			}
			return map
		},
		ajax: function(options) {
			options = options || {};
			options.method = (options.method || "GET").toUpperCase();
			options.dataType = options.dataType || "json";
			options.async = options.async === undefined ? true : options.async;
			var params = this.formatParams(options.data);
			//创建 - 非IE6 - 第一步
			if(window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
			} else { //IE6及其以下版本浏览器
				var xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}
			//接收 - 第三步
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var status = xhr.status;
					if(status >= 200 && status < 300) {
						if('json' == options.dataType) {
							// validate json
							var jsonObj = false;
							try {
								var jsonObj = JSON.parse(xhr.responseText);
							} catch(e) {
								jsonObj = false;
							}
							if(false === jsonObj) {
								options.success && options.success(xhr.responseText, xhr.responseXML);
							} else {
								options.success && options.success(jsonObj, xhr);
							}
						} else {
							options.success && options.success(xhr.responseText, xhr.responseXML);
						}
					} else {
						options.fail && options.fail(status);
					}
				}
			}
			//连接 和 发送 - 第二步
			if(options.method == "GET") {
				xhr.open("GET", options.url + "?" + params, options.async);
				xhr.send(null);
			} else if(options.method == "POST") {
				xhr.open("POST", options.url, options.async);
				//设置表单提交时的内容类型
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(params);
			}
		},
		formatParamsRecursively: function(object, prefix) {
			var ret = [],
				pre = '';
			for(var i in object) {
				if(typeof object[i] == 'object') {
					if(prefix) {
						pre = prefix + '[' + i + ']';
					} else {
						pre = i;
					}
					ret = ret.concat(this.formatParamsRecursively(object[i], pre));
				} else {
					if(prefix) {
						ret.push(encodeURIComponent(prefix + '[' + i + ']') + "=" + encodeURIComponent(object[i]));
					} else {
						ret.push(encodeURIComponent(i) + "=" + encodeURIComponent(object[i]));
					}
				}
			}
			return ret;
		},
		//格式化参数
		formatParams: function(data) {
			var arr = [];
			arr = this.formatParamsRecursively(data, '');
			arr.push(("v=" + Math.random()).replace(".", ""));
			return arr.join("&");
			for(var name in data) {
				if(typeof data[name] == 'object') {
					for(var n1 in data[name]) {
						if(typeof data[name][n1] == 'object') {
							for(var n2 in data[name][n1]) {
								arr.push(name + '[' + n1 + '][' + n1 + ']=' + encodeURIComponent(data[name][n1][n2]));
							}
						} else {
							arr.push(name + "[" + n1 + "]=" + encodeURIComponent(data[name][n1]));
						}
					}
				} else {
					arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
				}
			}
			arr.push(("v=" + Math.random()).replace(".", ""));
			return arr.join("&");
		},
		validateCallback: function(func) {
			return(undefined !== func && typeof func == 'function');
		},
		isFunction: function(obj) {
			return Object.prototype.toString.call(obj) === '[object Function]'
		},
		fireFunction: function(func, params) {
			if(func && this.isFunction(func)) {
				return func.apply('', params);
			}
			return false;
		},
		array_get: function(array, key, defaultValue) {
			var config = array,
				keys;
			if(typeof key == 'object' && key instanceof Array) {
				keys = key;
			} else {
				if(key.indexOf('.') != -1) {
					keys = key.split('.');
				} else {
					keys = [key];
				}
			}
			for(var i in keys) {
				if(undefined == config[keys[i]]) {
					return defaultValue;
				} else {
					config = config[keys[i]];
				}
			}
			return config;
		}
	};
});