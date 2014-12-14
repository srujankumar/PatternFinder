PF = {
	consts : {
		ANY : "any",
		STRING : "string",
		NUMBER : "number",
		BOOLEAN : "boolean",
		UNDEFINED : "undefined",
		FUNCTION : "function",
		HAS_OBJECT : "hasObject",
		HAS_ITEMS : "hasItems",
		HAS_ARRAY : "hasArray",
		FOR_EACH : "forEach"
	},
	helpers : new function(){
		this.isDefined = function(value){
			if(typeof(value) == "undefined" || value === null)
				return false;
			else
				return true;
		};

		this.checkValidArray = function(pattern, data){
			if( this.isDefined(data) && (data instanceof Array) ){
				if( this.isDefined(pattern.size) && data.length === pattern.size )
					return true;
				else if( (!this.isDefined(pattern.max_size) || data.length <= pattern.size ) &&
							(!this.isDefined(pattern.min_size) || data.length >= pattern.min_size ) )
					return true;
			}
			return false;
		};

		this.checkValidKey = function(pattern_key, data_key){
			if( this.isDefined(pattern_key) && 
				(pattern_key === PF.consts.ANY || pattern_key === data_key) )
				return true;
			else
				return false;
		};
	}
};

PatternFinder = function(topLevelObject, logVar){
	this._topLevelObject = topLevelObject;
	this._logVar = logVar; //TODO: support for different log types (now it only supports variables)
	return this;
};

PatternFinder.prototype.hasObject = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	if(PF.helpers.isDefined(Obj[pattern.key])){
		if(!PF.helpers.isDefined(pattern.val) && (typeof Obj[pattern.key] === "object") )
			return true;
		else
			return false;
		if(this.processPattern( pattern.val, Obj[pattern.key])){
			if(return_here)
				console.log(eval(this._logVar));
			return true;
		}
	}
	return false;

	/* TODO: Uncomment below code after supporting RegEx in keys
	var matchFound = false;
	for(var key in Obj)
		if(PF.helpers.checkValidKey( pattern[key], key)){
			matchFound = true;
			this.processPattern( pattern.val, Obj[key]);
			break;
		}
	if(!matchFound)
		return false;*/
};

PatternFinder.prototype.hasItems = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	var allMatched = true;
	for( var item in pattern.val)
		if(!this.processPattern( pattern.val[item], Obj)){
			allMatched = false;
			break;
		}
	if(allMatched){
		if(return_here)
			console.log(eval(this._logVar));
		return true;
	}
	else
		return false;
};

PatternFinder.prototype.isString = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	if(PF.helpers.isDefined(Obj[pattern.key]))
		if( (typeof Obj[pattern.key] === "string") && ( !PF.helpers.isDefined(pattern.val) || Obj[pattern.key] === pattern.val ) ){
			if(return_here)
				console.log(eval(this._logVar));
			return true;
		}
	return false;
};

PatternFinder.prototype.isNumber = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	if(PF.helpers.isDefined(Obj[pattern.key]))
		if( (typeof Obj[pattern.key] === "number") && ( !PF.helpers.isDefined(pattern.val) || Obj[pattern.key] === pattern.val ) ){
			if(return_here)
				console.log(eval(this._logVar));
			return true;
		}
	return false;
};

PatternFinder.prototype.isBoolean = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	if(PF.helpers.isDefined(Obj[pattern.key]))
		if( (typeof Obj[pattern.key] === "boolean") && ( !PF.helpers.isDefined(pattern.val) || Obj[pattern.key] === pattern.val ) ){
			if(return_here)
				console.log(eval(this._logVar));
			return true;
		}
	return false;
};

PatternFinder.prototype.isFunction = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	if(PF.helpers.isDefined(Obj[pattern.key]))
		if( typeof Obj[pattern.key] === "function" ){
			if(return_here)
				console.log(eval(this._logVar));
			return true;
		}
	return false;
};

PatternFinder.prototype.hasArray = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	var allMatched = true;

	if( PF.helpers.isDefined(pattern.key) && PF.helpers.checkValidArray(pattern, Obj[pattern.key]) )
	{
		if(PF.helpers.isDefined(pattern.val)){
			for( var item in pattern.val){
				if(!this.processPattern( pattern.val[item], Obj[pattern.key][item])){
					allMatched = false;
					break;
				}
			}
		}
	}
	else
		allMatched = false;
	if(allMatched){
		if(return_here)
			console.log(eval(this._logVar));
		return true;
	}
	else
		return false;
};

PatternFinder.prototype.forEach = function( pattern, Obj){
	var return_here = false;
	if(!PF.helpers.isDefined(Obj)){
		Obj = this._topLevelObject;
		return_here = true;
	}
	var allMatched = true;	
	if(PF.helpers.isDefined(pattern.val)){
		for( var key in Obj){
			if(PF.helpers.checkValidKey( pattern[key], key))
				if(this.processPattern( pattern, Obj[key]))
					if(return_here)
						console.log(eval(this._logVar));
				else{
					allMatched = false;
					if(!return_here)
						break;
				}
		}
	}
	if(allMatched)
		return true;
	else
		return false;
};

PatternFinder.prototype.processPattern = function( pattern, Obj){
	if(PF.helpers.isDefined(pattern.type)){
		switch(pattern.type)
		{
			case PF.consts.HAS_ITEMS:
				return this.hasItems( pattern, Obj);
			case PF.consts.HAS_OBJECT:
				return this.hasObject( pattern, Obj);
			case PF.consts.HAS_ARRAY:
				return this.hasArray( pattern, Obj);
			case PF.consts.FOR_EACH:
				return this.forEach( pattern, Obj);
			case PF.consts.STRING:
				return this.isString( pattern, Obj);
			case PF.consts.BOOLEAN:
				return this.isBoolean( pattern, Obj);
			case PF.consts.NUMBER:
				return this.isNumber( pattern, Obj);
			case PF.consts.FUNCTION:
				return this.isFunction( pattern, Obj);
		}
	}
};