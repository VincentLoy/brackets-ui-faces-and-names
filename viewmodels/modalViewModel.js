define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        fs = require('../services/filesystem'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        nodeConnection = new NodeConnection();

    function ModalViewModel(){
        var previewBox = $(".uifn_user_picture_box"),
            img,
            $urlInput = $(".urlInput"),
            $nameInput = $(".nameInput"),
            $uifnInputs = $(".uifn_input"),
            $countries = $(".uifn_country"),
            $nameContainer = $(".uifn_name"),
            img128,
            img73,
            img48,
            img24,
            name,
            surname,
            fullName,
            gender = "",
            country = "",
            currentUsername;
        
         //generate country list
        $.get("https://raw.githubusercontent.com/thm/uinames/master/names.json", function($data){

            var obj = JSON.parse($data);
            var country;

            for(var i=0; i<obj.length; i++){
               $countries.append('<option value="'+obj[i].country.toLowerCase()+'">'+obj[i].country+'</option>');
            }
        });
        
        $('input[name=gender]').on("change", function(e){
            gender = $('input[name=gender]:checked').val();
            if(gender == "both"){
                gender = "";
            }
            else{
                gender = "&gender="+gender;
            }
            console.log("http://api.uinames.com/?"+country+gender);
        });
        
        $('.uifn_country').on("change", function(e){
            country = $('.uifn_country').val();
            console.log(country);
            if(country == "all"){
                country = "";
            }
            else{
                country = "&country="+country;
            }
            console.log("http://api.uinames.com/?"+country+gender);
        });
        
        $(".uifn_generate_name").on("click",function(){
           $.getJSON("http://api.uinames.com/?"+country+gender, function($name){
               name = $name.name;
               surname = $name.surname;
               fullName = $name.name+" "+$name.surname;
               $(".uifn_name").text(fullName);
               $(".uifn_current_country").text("Country : "+$name.country+" - Gender : "+$name.gender);
               $nameInput.val(function(){
                        return fullName;
                    });
                });
        });
        
        $(".uifn_generate_pict").on("click", function(e){
            
            
            $.getJSON("http://uifaces.com/api/v1/random", function($picture){

                img128 = $picture.image_urls.epic;
                img73 = $picture.image_urls.bigger;
                img48 = $picture.image_urls.normal;
                img24 = $picture.image_urls.mini;
                currentUsername = $picture.username;
                
                previewBox.children("img").attr("src", img);
                
                $(".uifn_user_name")
                    .attr("href", "http://uifaces.com/"+currentUsername)
                    .text(currentUsername);
                
                setImg();
                 
            });
        });
        
        $('input[name=img-size]').on("change", function(e){
            setImg();
        });
        
        function setImg(){
            
            var imgSize = $('input[name=img-size]:checked').val();
            switch(imgSize){
                
                case "128":
                    img = img128;
                    $("#uifn_picture").attr("src", img128);
                    $urlInput.val(function(){
                        return img;
                    });
                    break;
                case "73":
                    img = img73;
                    $("#uifn_picture").attr("src", img73);
                    $urlInput.val(function(){
                        return img;
                    });
                    break;
                case "48":
                    img = img48;
                    $("#uifn_picture").attr("src", img48);
                    $urlInput.val(function(){
                        return img;
                    });
                    break;
                case "24":
                    img = img24;
                    $("#uifn_picture").attr("src", img24);
                    $urlInput.val(function(){
                        return img;
                    });
                    break;
                default:
                    console.log("ERROR charging img size");
            }
        }


        //Insert on current document
        this.onPictInsert = _.bind(function(model, event){
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
        
        this.onNameInsert = _.bind(function(model, event){
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
        
        $uifnInputs.on("click", function(){
            $(this).select();
        });
        
    }

    module.exports = ModalViewModel;
});
