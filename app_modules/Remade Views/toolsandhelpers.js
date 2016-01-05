//========= SIDEBAR MENU ITEMS ANIMATIONS ======== 
    (function(){   
        $('.sidebar-menu-item').click(function(){
            //When: Menu is opened, 
            if($(this).hasClass('opened-menu-item')){    
                $(this).removeClass('opened-menu-item');
                    //Reset Menu-Item to default height of 20px per menu-item
                    $(this).animate({
                    height: "20px" },
                    1000, 
                                    
                    //Hide nested content
                    function(){
                        $(this).find('.sublist').css('display', 'none');
                     });
            } else {
                //When: Menu is closed
                $(this).addClass('opened-menu-item');
                $(this).find('.sublist').css('display', 'inherit');
                    //Set Menu-Item length to be the number of nested li * 35
                    var animateHeight = Number($(this).data("length")) * 35;
                    if(animateHeight != 0){
                        $(this).animate({
                        height: animateHeight + "px" },
                        1000);   
                    }
            }
        });   
    })(); //immediately invoked

//======== RESIZABLE COLUMNS (Init) ===========
    $(function () {
        $("table").resizableColumns({
            store: window.store
        });
    });


// ================================ -->
// ====== WINDOW RESIZE =========== -->
// ================================ -->
     var resizeContent = function () {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var $content = $("#content");
        var sidebarWidth = $("#sidebar").width();


        var newWidth = windowWidth - sidebarWidth;
        console.log(newWidth + "  " + windowHeight);
        $content.css("width", newWidth + "px");
        $content.css("height", (windowHeight - 80) + "px");
    }

    resizeContent();

    $(window).on('resize', function () {
        resizeContent();
    });
            