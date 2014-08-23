// reference a lot to KISSY https://github.com/kissyteam/kissy

var toString = Object.prototype.toString;

var helper = {

	isObject: function(obj){
		return toString.call(obj) === '[object Object]';
	},
	isFunction: function(fun){
		return toString.call(fun) === '[object Function]';
	},
	isArray: function(arr){
		return toString.call(arr) == '[object Array]';
	},
	isNumber: function(num){
		return toString.call(num) === '[object Number]';
	},
	isString: function(str){
		return toString.call(str) === '[object String]';
	},
	isBoolean: function(bool){
		return toString.call(bool) === '[object Boolean]';
	},
	isRegExp: function(reg){
		return toString.call(reg) == '[object RegExp]';
	},
	isDate: function(date){
		return toString.call(date) === '[object Date]';
	},
	isMath: function(math){
		return toString.call(math) === '[object Math]';
	},

	isEmptyObject: function(obj){
		var i;
		for (i in obj){
			return false;
		}
		return true;
	},

	/**
	 * return a deep clone of given Object or Array
	 * @param  {Object | Array} obj Object or Array to be cloned
	 * @return {Object | Array}     the cloned Object or Array
	 */
	clone: function(obj){
		var ret, prop, i;
		if (helper.isArray(obj)){
			ret = [];
			for (i = 0; i < obj.length; i++){
				ret.push(helper.clone(obj[i]));
			}
		}
		else if (helper.isObject(obj)){
			ret = {};
			for (i in obj){
				ret[i] = helper.clone(obj[i]);
			}
		}
		else {
			ret = obj;
			return ret;
		}

		return ret;

	},

	/**
	 * merge all the objects together given to it
	 * former properties and methods will be overwritten by the latters
	 * @params {[Objects]} objects to be merged
	 * @return {Object} object that contains all properties and method from the providers in arguments
	 */
	merge: function(){

		var	i, prop,
			ret = {};

		for (i = 0; i < arguments.length; i++){
			if (helper.isObject(arguments[i])){
				for (prop in arguments[i]){
					if (ret[prop] === undefined){
						ret[prop] = helper.clone(arguments[i][prop]);
					}
					else {
						if (helper.isObject(ret[prop])){
							ret[prop] = helper.merge(ret[prop], arguments[i][prop]);
						}
						else {
							ret[prop] = helper.clone(arguments[i][prop]);
						}
					}
				}
			}
			else {
				throw 'arguments must be instances of Object!'
			}
		}

		return ret;

	}
}

module.exports = helper;