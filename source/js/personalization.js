var objPersonalization = [{
        nameOfNode: 'declanguage',
        elementToMap: '.personalization-lang-btn',
        section: null,
    },
    {
        nameOfNode: 'decgenre',
        elementToMap: '.personalization-genres-btn',
        section: null,
    }
];

function initPersonalization() {
    $.featherlight('<div>Loading...</div>', {
        variant: 'personalization',
        closeIcon: 'Skip',
        beforeOpen: function () {
            document.body.style.overflow = 'hidden';
        },
        closeOnEsc: function () {
            skipPersonalization();
        },
        afterClose: function () {
            document.body.style.overflow = '';
        }
    });
    createPersonalizationContent('getUserPersonalizationSelection');
}

function createPersonalizationContent(api) {
    var pzlAPI = '/en/blueprint/servlet/toggle/' + api;
    $.getJSON(pzlAPI, {
            format: 'json'
        })
        .done(function (data) {

            // Store the data object in their respective section
            objPersonalization[0].section = data.personalization.groups.sections[0];
            objPersonalization[1].section = data.personalization.groups.sections[1];

            var _personaliz = document.createElement('form');
            _personaliz.className = 'personalization-form';
            // _personaliz.innerHTML = JSON.stringify(data);

            // Title
            var _title = document.createElement('h1');
            _title.className = 'personalization-title';
            _title.textContent = 'Select the following options to help us customised your content';


            // console.log(data.personalization.groups.sections[0].items)
            // Language buttons
            var _wrapLang = document.createElement('fieldset');
            _wrapLang.className = 'personalization-lang-group';

            // language title
            var _langTitle = document.createElement('legend');
            _langTitle.className = 'personalization-lang-title';
            _langTitle.textContent = 'Choose ' + objPersonalization[0].section.selectionLimit + ' or more languages';
            _wrapLang.innerHTML = _langTitle.outerHTML;

            for (var langIndex in objPersonalization[0].section.items) {
                var _btn = document.createElement('input');
                _btn.type = 'checkbox';
                _btn.name = 'decLanguage';
                _btn.className = 'personalization-lang-btn';
                _btn.id = 'lang' + langIndex;
                _btn.value = objPersonalization[0].section.items[langIndex].shortKey;

                var _labelWrap = document.createElement('div');
                _labelWrap.className = 'label-wrap';

                var _label = document.createElement('label');
                _label.htmlFor = 'lang' + langIndex;

                var _labelText = document.createElement('span');
                _labelText.textContent = objPersonalization[0].section.items[langIndex].labelId;

                _label.innerHTML = _labelText.outerHTML;
                _labelWrap.innerHTML = _btn.outerHTML + _label.outerHTML;
                _wrapLang.innerHTML += _labelWrap.outerHTML;

                console.log(_wrapLang);
            }

            // Genre buttons
            var _wrapGenres = document.createElement('fieldset');
            _wrapGenres.className = 'personalization-genres-group';

            // language title
            var _genresTitle = document.createElement('legend');
            _genresTitle.className = 'personalization-genres-title';
            _genresTitle.textContent = 'Choose ' + objPersonalization[1].section.selectionLimit + ' or more genres';
            _wrapGenres.innerHTML = _genresTitle.outerHTML;

            for (var genresIndex in objPersonalization[1].section.items) {
                var _btnG = document.createElement('input');
                _btnG.type = 'checkbox';
                _btnG.name = 'decGenre';
                _btnG.className = 'personalization-genres-btn';
                _btnG.id = 'genre' + genresIndex;
                _btnG.value = objPersonalization[1].section.items[genresIndex].shortKey;

                var _labelWrapG = document.createElement('div');
                _labelWrapG.className = 'label-wrap';

                var _labelG = document.createElement('label');
                _labelG.htmlFor = 'genre' + genresIndex;

                var _labelTextG = document.createElement('span');
                _labelTextG.textContent = objPersonalization[1].section.items[genresIndex].labelId;

                var _labelImgG = document.createElement('img');
                _labelImgG.src = objPersonalization[1].section.items[genresIndex].imageUrl;

                _labelG.innerHTML = _labelTextG.outerHTML + _labelImgG.outerHTML;
                _labelWrapG.innerHTML = _btnG.outerHTML + _labelG.outerHTML;
                _wrapGenres.innerHTML += _labelWrapG.outerHTML;
            }

            var hint = document.createElement('div');
            hint.className = 'personalization-hint';
            hint.style.visibility = 'hidden';

            var submitBtn = document.createElement('button');
            submitBtn.className = 'personalization-submit-btn';
            submitBtn.textContent = 'Done';
            submitBtn.style.visibility = 'hidden';

            // append dom
            _personaliz.innerHTML = _title.outerHTML + _wrapLang.outerHTML + _wrapGenres.outerHTML + hint.outerHTML + submitBtn.outerHTML;

            updateDom(_personaliz.outerHTML, '.featherlight-inner');

            $('.personalization-lang-btn, .personalization-genres-btn').click(function () {
                personalizationValidation();
            });

            $('.personalization-submit-btn').click(function (e) {
                e.preventDefault();
                submitPersonalization();
            });

            $('.featherlight.personalization .featherlight-close').click(function (e) {
                e.preventDefault();
                skipPersonalization();
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        });

}

function updateDom(markup, toEl) {
    var _el = document.querySelector(toEl);
    _el.innerHTML = markup;
}

function retrieveCheckboxValues(nameOfContainer, el) {
    var colCheckboxes = '';
    var count = 0;
    $(el + ':checked').each(function () {
        count += 1;
        colCheckboxes += ((count > 1) ? ' ' : '') + $(this).val();
    });

    return {
        name: nameOfContainer,
        values: colCheckboxes,
        count: count
    };
}

function createPersonalizationObject(arrOfElements) {
    var objInner = '';
    for (var i in arrOfElements) {
        var _selection = retrieveCheckboxValues(arrOfElements[i].nameOfNode, arrOfElements[i].elementToMap);
        objInner += '"' + _selection.name + '":"' + _selection.values + '",';
    }
    var _createObj = '{' + objInner.replace(/,$/, '') + '}';

    return JSON.parse(_createObj);
}

function personalizationValidation() {
    var message = '';

    var countLanguageMin = objPersonalization[0].section.selectionLimit;
    var countGenresMin = objPersonalization[1].section.selectionLimit;

    var countLanguage = $('.personalization-lang-btn:checked').length;
    if (countLanguage < countLanguageMin) {
        var countOutstandingLanguages = countLanguageMin - countLanguage;
        message += countOutstandingLanguages;
        message += countOutstandingLanguages > 1 ? ' languages' : ' language';
    }

    var countGenres = $('.personalization-genres-btn:checked').length;
    if (countGenres < countGenresMin) {
        if (message.length > 0) {
            message += ' & ';
        }

        var countOutstandingGenres = countGenresMin - countGenres;
        message += countOutstandingGenres;
        message += countOutstandingGenres > 1 ? ' genres' : ' genre';
    }

    if (message.length > 0) {
        message += ' to go';
        $('.personalization-hint').html(message);
        $('.personalization-hint').css('visibility', 'visible');
        $('.personalization-submit-btn:visible').css('visibility', 'hidden');
    } else {
        $('.personalization-hint:visible').css('visibility', 'hidden');
        $('.personalization-submit-btn').css('visibility', 'visible');
    }

    console.log(message);
}

function submitPersonalization() {
    var submitAPI = '/en/blueprint/servlet/toggle/setUserPersonalizationSelection';

    $.post(submitAPI, createPersonalizationObject(objPersonalization))
        .done(function (data) {
            if (data.status === true) {
                // $('.featherlight.personalization .featherlight-close').click();
            }
            alert('Data: ' + data);
        }).fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        });
}

function skipPrompt() {
    $.featherlight('<div>You can do this later in Settings > Personalisation</div>', {
        variant: 'skipPrompt',
        closeIcon: 'OK',
        beforeOpen: function () {
            document.body.style.overflow = 'hidden';
        },
        closeOnEsc: function () {
            skipPersonalization();
        },
        afterClose: function () {
            document.body.style.overflow = '';
        }
    });
}

function skipPersonalization() {
    var skipAPI = '/en/blueprint/servlet/toggle/skipUserPersonalizationSelection';

    // We can ignore the skip personalization response
    $.post(skipAPI, {});
    $.featherlight.close();
}