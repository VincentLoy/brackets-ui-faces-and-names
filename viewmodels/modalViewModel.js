define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        fs = require('../services/filesystem'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        nodeConnection = new NodeConnection();

    function chain() {
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
    }
    //chain(connect, loadClipboard, clipboardLoad);

    function ModalViewModel(){
        var previewBox = $(".uifn_user_picture_box"),
            imgSize = $('input[name=img-size]:checked').val(),
            img,
            $urlInput = $(".urlInput");

        $(".uifn_generate_pict").on("click", function(e){
            $.getJSON("http://uifaces.com/api/v1/random", function($picture){

                switch(imgSize){
                    case "128":
                        img = $picture.image_urls.epic;
                        break;
                    
                    case "73":
                        img = $picture.image_urls.bigger;
                        break;
                        
                    case "48":
                        img = $picture.image_urls.normal;
                        break;
                    
                    case "24":
                        img = $picture.image_urls.mini;
                        break;
                        
                    default:
                        img = "http://placehold.it/128x128&text=ERROR";
                }
                
                previewBox.children("img").attr("src", img);
                
                $urlInput.val(function(){
                    return img;
                }).on("click", function(){
                    $(this).select();
                });
                
                $(".uifn_user_name")
                    .attr("href", "http://uifaces.com/"+$picture.username)
                    .text($picture.username);
                 
            });
        });
        
        /*this.onGeneratePicture = function(model, event){
            console.log("onGeneratePicture");
            
            $.getJSON("http://uifaces.com/api/v1/random", function($picture){
                
                this.pictUrl = ko.computed(function(){
                
                    $(".uifn_user_name").text($picture.username);
                    
                   return $picture.epic;
                }, this);
                 
            });
        });*/

        /*this.url = ko.computed(function(){
            var url = 'http://lorempicsum.com/' +
                (this.theme() != 0? this.theme() : '')+ '/'+
                this.width() + '/' +
                this.height() + '/' +
                this.image();
            return url;
        }, this);*/
        

        /*this.onPreview = _.bind(function(model, event){
            var previewBox = $('.preview-box');

            previewBox.empty();
            previewBox.append('<img class="placeholder-preview" src="'+ this.url() +'" />');
            
            $('.placeholder-preview').error(function(){
               previewBox.empty();
                previewBox.append('<p class="placeholder-error">This placeholder is not available for this size :(</p>');
            });

            event.stopPropagation();
        }, this);

        this.select = function(model, event){
            $(event.target).select();
            return true;
        }*/

        this.onUrlCopy = _.bind(function(model, event){
            nodeConnection.domains.clipboard.callCopy(this.url());
        }, this);

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
        
    }

    module.exports = ModalViewModel;
});
