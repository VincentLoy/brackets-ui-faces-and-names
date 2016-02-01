/*globals define, $, console, brackets, alert*/

define(function (require, exports, module) {
    'use strict';

    var lodash = require('../vendor/lodash'),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager");

    function ModalViewModel() {
        var previewBox = $(".uifn_user_picture_box"),
            img,
            $urlInput = $(".urlInput"),
            $nameInput = $(".nameInput"),
            $uifnInputs = $(".uifn_input"),
            $countries = $(".uifn_country"),
            $nameContainer = $(".uifn_name"),
            $uifnGenerateName = $('.uifn_generate_name'),
            img128,
            img73,
            img48,
            img24,
            fullName,
            gender = "",
            country = "",
            currentUsername,

        //functions
            setImg,
            raiseError;


        raiseError = function (message, jqxhr, textStatus, error) {
            var resp = message + ' : ' + error + '\n' + textStatus +
                '\nError ' + jqxhr.status + ' - ' + jqxhr.statusText +
                '\n please try again later';
            alert(resp);
        };

        //generate country list
        $.getJSON("https://raw.githubusercontent.com/thm/uinames/master/names.json", function ($data) {
            var i;

            for (i = 0; i < $data.length; i += 1) {
                $countries.append('<option value="' + $data[i].region.toLowerCase() + '">' + $data[i].region + '</option>');
            }
        }).fail(function (jqxhr, textStatus, error) {
            raiseError('Error generating country list', jqxhr, textStatus, error);
        });

        $('input[name=gender]').on("change", function () {
            gender = $('input[name=gender]:checked').val();
            if (gender === "both") {
                gender = "";

            } else {
                gender = "&gender=" + gender;
            }
        });

        $(".uifn_country").on("change", function (e) {
            /*jslint unparam: true */
            country = $countries.val();
            console.log(country);
            if (country === "all") {
                country = "";
            } else {
                country = "&region=" + country;
            }
            console.log("http://api.uinames.com/?" + country + gender);
        });

        $uifnGenerateName.on("click", function () {
            $.getJSON("http://api.uinames.com/?" + country + gender, function ($name) {
                fullName = $name.name + " " + $name.surname;

                $nameContainer.text(fullName);
                $(".uifn_current_country").text("Country : " + $name.region + " - Gender : " + $name.gender);
                $nameInput.val(function () {
                    return fullName;
                });

            }).fail(function (jqxhr, textStatus, error) {
                raiseError('UI Names Error', jqxhr, textStatus, error);
            });
        });

        setImg = function () {
            var imgSize = $('input[name=img-size]:checked').val(),
                $uifnPicture = $("#uifn_picture");

            switch (imgSize) {

            case "128":
                img = img128;
                $uifnPicture.attr("src", img128);
                $urlInput.val(function () {
                    return img;
                });
                break;
            case "73":
                img = img73;
                $uifnPicture.attr("src", img73);
                $urlInput.val(function () {
                    return img;
                });
                break;
            case "48":
                img = img48;
                $uifnPicture.attr("src", img48);
                $urlInput.val(function () {
                    return img;
                });
                break;
            case "24":
                img = img24;
                $uifnPicture.attr("src", img24);
                $urlInput.val(function () {
                    return img;
                });
                break;
            default:
                console.log("ERROR loading img size");
            }
        };

        $(".uifn_generate_pict").on("click", function (e) {
            /*jslint unparam: true*/
            $.getJSON("http://uifaces.com/api/v1/random", function ($picture) {
                img128 = $picture.image_urls.epic;
                img73 = $picture.image_urls.bigger;
                img48 = $picture.image_urls.normal;
                img24 = $picture.image_urls.mini;
                currentUsername = $picture.username;

                previewBox.children("img").attr("src", img);

                $(".uifn_user_name")
                    .attr("href", "http://uifaces.com/" + currentUsername)
                    .text(currentUsername);

                setImg();
            }).fail(function (jqxhr, textStatus, error) {
                raiseError('UI Faces Error', jqxhr, textStatus, error);
            });
        });

        $('input[name=img-size]').on("change", function (e) {
            /*jslint unparam: true */
            setImg();
        });


        //Insert on current document
        this.onPictInsert = lodash.bind(function (model, event) {
            /*jslint unparam: true */
            var currentDoc = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                pos = editor.getCursorPos(),
                posEnd;

            currentDoc.replaceRange(img, pos);
            posEnd = $.extend({}, pos);
            posEnd.ch += img.length;

            editor.focus();
            editor.setSelection(pos, posEnd);
        }, this);

        this.onNameInsert = lodash.bind(function (model, event) {
            /*jslint unparam: true */
            var currentDoc = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                pos = editor.getCursorPos(),
                posEnd;

            currentDoc.replaceRange(fullName, pos);
            posEnd = $.extend({}, pos);
            posEnd.ch += fullName.length;

            editor.focus();
            editor.setSelection(pos, posEnd);
        }, this);

        $uifnInputs.on("click", function () {
            $(this).select();
        });

    }

    module.exports = ModalViewModel;
});
