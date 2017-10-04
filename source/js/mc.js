var mc = window.mc || {};

mc.utils = {
    wrapper: null,
    errorsInValidateField: [],
    validateField: function(el, callback, event) {
        // console.time("validate");
        if(event == undefined){
            window.event.preventDefault();
        }else{
            event.preventDefault();
        }
        var _el = (typeof el == "object") ? el : document.querySelector(el);
        this.wrapper = _el;
        if (_el.nodeName == "FORM" || _el.tagName == "FORM") {
            var _getInputs = Array.prototype.slice.call(_el.querySelectorAll("input, select"));
            var _filterValInp = _getInputs.filter(function(input) {
                if (input.className.match("validate")) {
                    return true;
                }

            });
        } else if (_el.nodeName == "INPUT" || _el.tagName == "INPUT" || _el.nodeName == "SELECT" || _el.tagName == "SELECT") {
            var _filterValInp = [];
            _filterValInp.push(_el);

        } else {

            var _filterValInp = [];
            console.log("NOT a FORM or INPUT");
        }


        this.errorsInValidateField = [];
        var _newPass = null;

        for (var i = 0; i < _filterValInp.length; i++) {
            var _getParent = _filterValInp[i].parentElement;
            var _error = _getParent.getElementsByClassName("error");
            if (typeof _error[0] == "undefined") {
                continue;
            }
            var _getErrors = JSON.parse(_error[0].getAttribute("data-errors"));
            var _val = _filterValInp[i].value;
            var _class = _filterValInp[i].className;

            switch (true) {
                case (/not-mandatory/.test(_class) && _val == ""):
                    _error[0].innerHTML = "";
                    break;

                // case (_val == "" && event.type != "blur"):
                case (!/not-mandatory/.test(_class) && _val == ""):
                    // _error[0].style.display = "";
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.empty || "Required Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

                case /validateText/.test(_class) && !/^[a-zA-Z ]*$/.test(_val):
                    // _error[0].style.display = "";
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

                case /validateEmail/.test(_class) && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(_val):
                    // _error[0].style.display = "";
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

                case /validateTel/.test(_class) && !/^[0-9]{8}$/.test(_val):
                    // _error[0].style.display = "";
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

                    // case /validatePostal/.test(_class) && !this.validatePostal(_val):
                    //     if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    //     _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    //     this.errorsInValidateField.push('Invalid Postal');
                    //     break;


                case /validateCheckbox/.test(_class) && !_filterValInp[i].checked:
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.empty || "Required Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

                case /validateDate/.test(_class) && !/^(((((0[1-9])|(1\d)|(2[0-8]))\/((0[1-9])|(1[0-2])))|((31\/((0[13578])|(1[02])))|((29|30)\/((0[1,3-9])|(1[0-2])))))\/((20[0-9][0-9])|(19[0-9][0-9])))|((29\/02\/(19|20)(([02468][048])|([13579][26]))))$/.test(_val):
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

                case /validateNRIC/.test(_class) && !this.isValidNRIC(_val):
                    if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    this.errorsInValidateField.push(_getParent);
                    break;

				case /validateImage/.test(_class) && _filterValInp[i].files[0] && (_filterValInp[i].files[0].size / 1024) > 300:
					if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Image";
                    this.errorsInValidateField.push(_getParent);
                    break;           

                case (_filterValInp[i].name == "password" || _filterValInp[i].name == "newpassword") && _val.length < 6:
                	if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
                    this.errorsInValidateField.push(_getParent);
                    _newPass = _val;
                    break;

                case (_filterValInp[i].name == "password" || _filterValInp[i].name == "newpassword") && / /.test(_val):
                	if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
                    _error[0].innerHTML = _getErrors.notAllowed || "Not allowed characters";
                    this.errorsInValidateField.push(_getParent);
                    _newPass = _val;
                    break;

                case _filterValInp[i].name == "confirmpassword" && ((typeof _filterValInp[i].form.newpassword != "undefined" && _val != _filterValInp[i].form.newpassword.value) || (typeof _filterValInp[i].form.password != "undefined" && _val != _filterValInp[i].form.password.value)):
	                if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
	                _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
	                this.errorsInValidateField.push(_getParent);
	                break;

	            case /validateDate/.test(_class) && /^(((((0[1-9])|(1\d)|(2[0-8]))\/((0[1-9])|(1[0-2])))|((31\/((0[13578])|(1[02])))|((29|30)\/((0[1,3-9])|(1[0-2])))))\/((20[0-9][0-9])|(19[0-9][0-9])))|((29\/02\/(19|20)(([02468][048])|([13579][26]))))$/.test(_val):
	            	var _currDate = new Date();
	            	var _date = _val.split("/");
	            	var _newDate = new Date(_date[2], _date[1], _date[0]);
	            	if(_newDate > _currDate){
	            		if (!/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className += " invalid";
		                _error[0].innerHTML = _getErrors.invalid || "Invalid Field";
		                this.errorsInValidateField.push(_getParent);
		                break;
	            	}

	            case (_filterValInp[i].name == "password" || _filterValInp[i].name == "newpassword") && _val.length >= 6:
                	 _newPass = _val;

                default:
                    // _error[0].style.display = "none";
                    _error[0].innerHTML = "";
                    if (/invalid/.test(_filterValInp[i].className)) _filterValInp[i].className = _filterValInp[i].className.replace(" invalid", "").trim();
            }
        }

        if(this.errorsInValidateField.length && event.type != "blur"){
        	this.scrollToElement(this.errorsInValidateField[0]);
        }

        if (typeof callback != "undefined"&& this.errorsInValidateField.length == 0) {
            callback(_el);
        }

        //console.log(_filterValInp);
        // console.timeEnd("validate");
    },

    validatePostal: function(postal, form) {
        var that = this;
        // if (typeof form != "undefined") {
        //     form.block.value = "";
        //     form.street.value = "";
        //     form.building.value = "";
        // }

        var _postal = postal.toString();
        if (!isNaN(_postal) && _postal.length < 6) {
            this.postalErrors = "e1";
            this.renderPostalError(form, "valid");
        } else {
            $.get("/en/blueprint/servlet/toggle/postalCode", {
                value: postal
            }, "json").done(function(data) {
                if (typeof form != "undefined") {
                    that.renderPostal(data, form);
                }
            });
        }
    },
    renderPostalError: function(form, postalError){
        var _getParent = form.postalcode.parentElement;
        var _error = _getParent.getElementsByClassName("error");
        var _getErrors = JSON.parse(_error[0].getAttribute("data-errors"));
        if(postalError == "clean"){
            return _error[0].innerHTML = "";
        }else{
            return _error[0].innerHTML = _getErrors[postalError];
        }
    },

    postalErrors: null,
    lastValidPostal: null,
    renderPostal: function(data, form) {
        if (data.size) {
            var _form = form;
            this.renderPostalError(_form, "clean"); // Use "clean" to empty error text
            if (data.buildingNumber != null){
                _form.block.value = data.buildingNumber;
                if(!/notEmpty/.test(_form.block.classList)) _form.block.classList += " notEmpty";
            }

            if (data.streetName != null){
                _form.street.value = data.streetName;
                if(!/notEmpty/.test(_form.street.classList)) _form.street.classList += " notEmpty";
            }

            if (data.buildingName != null){
                _form.building.value = data.buildingName;
                if(!/notEmpty/.test(_form.building.classList)) _form.building.classList += " notEmpty";
            } 
            this.lastValidPostal = _form.postalcode.value;
        }else{
            if(this.lastValidPostal != null){
                form.postalcode.value = this.lastValidPostal;
            }
            this.renderPostalError(form, "notFound");
        }
    },

    isValidNRIC: function(n) {
        if (n) {
            n = n.toUpperCase();
            var q = [];
            q.multiples = [2, 7, 6, 5, 4, 3, 2];
            if (n.length != 9) {
                return false
            }
            var r = 0,
                t = 0,
                m;
            var o = n.charAt(0),
                l = n.charAt(n.length - 1);
            if (o != "S" && o != "T") {
                return false
            }
            m = n.substr(1, n.length - 2);
            if (isNaN(m)) {
                return false
            }
            if (m != null) {
                while (m != 0) {
                    r += (m % 10) * q.multiples[q.multiples.length - (1 + t++)];
                    m /= 10;
                    m = Math.floor(m)
                }
            }
            var p;
            if (o == "S") {
                p = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"]
            }
            if (o == "T") {
                p = ["G", "F", "E", "D", "C", "B", "A", "J", "Z", "I", "H"]
            }
            if (l != p[r % 11]) {
                return false
            }
            q.isNricValid = function(a) {
                if (!a || a == "") {
                    return false
                }
            };
            return true
        } else {
            return false
        }
    },

    scrollToElement: function(element){
    	if(typeof element != "undefined"){
    		var hasFixedEl = $(".nav--local");
    		var _elOffset = $(element).offset().top - ((hasFixedEl.length)?hasFixedEl.height() + 10: 10);

    		$('html, body').animate({scrollTop:_elOffset}, 400);

    	} else {
    		console.log("You forgot to pass element as parameter");
    	}
    },

    dobFormat: function(e, element){
    	var dobVal = element.value;
    	var key = e.keyCode || e.charCode;
        // console.dir(e);

    	if(key == 8 ||key == 46 /*|| key == 37 || key == 39*/){ return false;}//normal behavior for delete and backspace key
    	// if(!/[0-9]/.test(e.key)){ //Delete input if it's not a number
        if(!/[0-9]/.test(dobVal.slice(-1))){
            if(dobVal.slice(-1) == "/" && (dobVal.length == 3 || dobVal.length == 6)){
                return false;
            }
    		element.value = dobVal.slice(0, -1);
    		return false;
    	}

    	if(dobVal.length == 2 || dobVal.length == 5){//Add diagonal in ##/##/#### format
    		// element.value = dobVal.slice(0, -1) + '/';
    		element.value = dobVal + "/"
    	}

    	if(dobVal.length == 3 || dobVal.length == 6){//If user deletes last diagonal, add it after the input
    		element.value = dobVal.slice(0, -1) + '/' + dobVal.slice(-1);
    	}
    }

}
