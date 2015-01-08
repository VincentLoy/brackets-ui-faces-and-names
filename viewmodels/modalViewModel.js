define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        fs = require('../services/filesystem'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        nodeConnection = new NodeConnection();
    
        //generate country list
        var countryList = $(".uifn_country");
        var countries '<option value="all">All</option>';
        var nameDB = "https://raw.githubusercontent.com/thm/uinames/master/names.json";
        $.get(nameDB, function($data){

            var obj = JSON.parse($data);
            var country;
            console.log("LENGTHHHHHH --> "+obj.length);
            for(var i=0; i<obj.length; i++){
                console.log("++++++++++++");
                console.log(countries);
               countries = countries+'<option value="'+obj[i].country+'">'+obj[i].country+'</option>';
            }
        });

    /*function chain() {
        var functions = Array.prototype.slice.call(arguments, 0);
        if (functions.length > 0) {
            var firstFunction = functions.shift();
            var firstPromise = firstFunction.call();
            firstPromise.done(function () {
                chain.apply(null, functions);
            });
        }
    }

    function connect() {
        var connectionPromise = nodeConnection.connect(true);
        connectionPromise.fail(function () {
            console.error("[brackets-simple-node] failed to connect to node");
        });
        return connectionPromise;
    }


    function loadClipboard() {
        var path = ExtensionUtils.getModulePath(module, "node/clipboard");
        var loadPromise = nodeConnection.loadDomains([path], true);
        loadPromise.fail(function (e) {
            console.log(e);
            console.log("[brackets-simple-node] failed to load clipboard");
        });
        return loadPromise;
    }


    function clipboardLoad() {
        var loadPromise = nodeConnection.domains.clipboard.load();
        loadPromise.fail(function (err) {
            console.error("[brackets-simple-node] failed to run clipboard.load", err);
        });
        loadPromise.done(function (err) {
            //loaded

        });
        return loadPromise;
    }*/
    //chain(connect, loadClipboard, clipboardLoad);

    function ModalViewModel(){
        var previewBox = $(".uifn_user_picture_box"),
            img,
            $urlInput = $(".urlInput"),
            img128,
            img73,
            img48,
            img24,
            currentUsername;

        $urlInput.on("click", function(){
            $(this).select();
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
            console.log("image set");
            
            var imgSize = $('input[name=img-size]:checked').val();
            switch(imgSize){
                
                case "128":
                    img = img128;
                    $("#uifn_picture").attr("src", img128);
                    $urlInput.val(function(){
                        return img;
                    });
                    console.log(img128);
                    break;
                case "73":
                    img = img73;
                    $("#uifn_picture").attr("src", img73);
                    $urlInput.val(function(){
                        return img;
                    });
                    console.log("73");
                    break;
                case "48":
                    img = img48;
                    $("#uifn_picture").attr("src", img48);
                    $urlInput.val(function(){
                        return img;
                    });
                    console.log("48");
                    break;
                case "24":
                    img = img24;
                    $("#uifn_picture").attr("src", img24);
                    $urlInput.val(function(){
                        return img;
                    });
                    console.log("24");
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
        
        //Set countries list
        
        countryList.html(countries);
    }

    module.exports = ModalViewModel;
});
