$(function() {
    ssoFormControl();
});


function ssoFormControl(){
	// console.time("ideal");
    var _form = document.querySelector('#form') || 0;
    if (_form != 0) {

    	if(window.addEventListener) {
        // add notEmpty Class on blur
	        _form.addEventListener("blur", function(e) {
	            var currClass = e.target.className;
	            var isDropdown = (e.target.children.length)?e.target.children[0].innerText:false;

	            if (e.target.value != "" || isDropdown != "") {
	                if (!currClass.match(/notEmpty/gi)) {
	                    e.target.className += " notEmpty";
	                }
	            } else {
	                if (currClass.match(/notEmpty/gi)) {
	                    e.target.className = e.target.className.replace('notEmpty', '').trim();
	                }
	            }
	            if (/^(?=.*\bvalidate)(?=.*\bon-blur).*$/.test(currClass)) { //Add regex to find validate and on-blur
	                mc.utils.validateField(e.target, undefined, event);
	            }
 
	        }, true);
	    } else if(window.attachEvent) {

	    	window.attachEvent('onblur', function(e) {
	            var currClass = e.target.className;
	            var isDropdown = (e.target.children.length)?e.target.children[0].innerText:false;

	            if (e.target.value != "" || isDropdown != "") {
	                if (!currClass.match(/notEmpty/gi)) {
	                    e.target.className += " notEmpty";
	                }
	            } else {
	                if (currClass.match(/notEmpty/gi)) {
	                    e.target.className = e.target.className.replace('notEmpty', '').trim();
	                }
	            }
	            if (/^(?=.*\bvalidate)(?=.*\bon-blur).*$/.test(currClass)) { //Add regex to find validate and on-blur
	                mc.utils.validateField(e.target, undefined, event);
	            }

	        });

	    }
        // end - not Empty class

        // Toggle classes (.validateNRIC and .passport) to display different field, label, and validation
        var imSg = document.getElementById("iSG");
        if (imSg != null) {
            imSg.onchange = function() {
                    var _id = _form.identification_number;
                    var _country = _form.nationality;
                    if (!this.checked) {
                        _id.className = _id.className.replace("validateNRIC", "passport");
                        _country.disabled = false;
                    } else {
                        _id.className = _id.className.replace("passport", "validateNRIC");
                        _country.disabled = true;
                        _country.options[1].selected = "selected";
                    }
                }
                // end - Toggle classes
        }

        // country of residence 
        var countryResidence = _form.country;
        if(typeof countryResidence != "undefined"){
        	countryResidence.onchange = function() {
	        	var _postalBtn = document.getElementById("postal-btn");
	        	if(countryResidence.value != "195"){
	        		_postalBtn.disabled = true;
	        		this.form.block.disabled = false;
	        		this.form.street.disabled = false;
	        	}else{
	        		_postalBtn.disabled = false;
	        		this.form.block.disabled = true;
	        		this.form.street.disabled = true;
	        	}
	        }
        }

        // update the last Valid postal

        if(_form.postalcode != undefined && _form.postalcode.value != ""){
        	mc.utils.lastValidPostal = _form.postalcode.value;
        }

        // end - coutnry of residence

        // Load Avatar
    //     var avatar = document.getElementById("fileUpload");
    //     if (avatar != null) {
    //     	avatar.onchange = function() {
    //     		var avatarImg = avatar.files[0];
    //     		if(!avatarImg.type.match(/^image.*$/)) {
				// 	throw new Exception('Invalid image file');
				// } 
				// var imgTag = document.getElementById("avatar") || 0;
				// if(imgTag){
				// 	var u = URL.createObjectURL(avatarImg);
				// 	imgTag.src = u;
				// }
    //     	}
    //     }

    }
    // console.timeEnd("ideal");
}
