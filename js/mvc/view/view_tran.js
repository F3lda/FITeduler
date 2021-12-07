/**
 * @file view_tran.js (FITeduler)
 * 
 * @brief Funkce View/frontendu aplikace
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Tran Thanh Quang M.
 * @update 2021-12-04 (YYYY-MM-DD)
 */

function view_tran()
{
    // --------- show/hide add new lessson form ---------
    $('#create_lesson').on('click', function() {
        if ($('#form_add').css('display') == 'none') {
            $('.tab_panels').hide();
            $('#form_add').css({'display' : 'grid'});
            $(this).html('Přidat vlastní­ hodinu <i class="fas fa-times"></i>');
        } else {
            $('.tab_panels').show();
            $('#form_add').css({'display' : 'none'});
            $(this).html('Přidat vlastní­ hodinu <i class="fas fa-plus"></i>');
        }
    });


    // --------- lesson info panels ---------
    $('.tab_panels').show();
    $('.tab_panels .tabs li').on('click', function() {
        //this je zalozka na kterou uzivatel klikl
        var $panel = $(this).closest('.tab_panels');

        $panel.find('.tabs li.active').removeClass('active');
        $(this).addClass('active');

        //ktery panel se ukaze po kliknuti
        var panelToShow = $(this).attr('rel');

        //skryje se predchozi panel
        $('.tab_panels .panel.active').fadeOut(showNextPanel);

        //ukaze se novy panel
        function showNextPanel() {
            $(this).removeClass('active');

            $('#'+panelToShow).fadeIn(function() {
                $(this).addClass('active');
            });
        }
    });


    // --------- RIGHT CLICK CONTEXT MENU ------------
    $(document).bind("contextmenu",function(e){
        if ( $("#menu").css('display') == 'block' ){
            $(" #menu ").hide();
        }
        $('td').css('box-shadow', 'none');
    });
    $(document).bind("contextmenu", '#timetable', function(e){
        if ( $("#menu").css('display') == 'block' ){
            $(" #menu ").hide();
        }
        $('td').css('box-shadow', 'none');
        $(this).removeClass("lesson-dropdown-selected");
        return false;
    });
    $(document).on('contextmenu', ".lesson", function(e) {
        //console.log($(this).attr('id'))
        $('td').css('box-shadow', 'none');
        var top = e.pageY - 50;
        var left = e.pageX - 120;
        $(this).css('box-shadow', 'inset 2px 2px 0px 0px rgb(0, 123, 255), inset -2px -2px 0px 0px rgb(0, 123, 255)');
        $("#menu").css({
            display: "block",
            top: top,
            left: left
        });
        $(this).addClass("lesson-dropdown-selected");
        return false; //blocks default Webbrowser right click menu
    });
        
    $(document).on("click", "body", function() {
        if ( $("#menu").css('display') == 'block' ){
            $(" #menu ").hide();
        }
        $('td').css('box-shadow', 'none');
    });
    
    $(document).on("click", "#menu a", function() {
        $(this).parent().hide();
    });

    hideInputs();
    $('#bit').click(function(){
        $('.div4').show(); // nadpis semestru
        $('.div5').show();
        $('.div6').show();
    })
    $('#l_s').click(function(event){
        $('.div7').show();
        $('.div8').show(); // nadpis semestru
        $('.div9').show();
        $('.div10').show(); // Povinne predmety
        $('.div11').show(); // Volitelno predmety
        $('.div12').show(); // Voliteln predmety
        $('#create').prop("disabled", false); // Element(s) are now enabled.
    })
    $('#z_s').click(function(event){
        $('.div7').show();
        $('.div8').show(); // nadpis semestru
        $('.div9').show();
        $('.div10').show(); // Povinne predmety
        $('.div11').show(); // Volitelno predmety
        $('.div12').show(); // Voliteln predmety
        $('#create').prop("disabled", false); // Element(s) are now enabled.
    })
    $("#save_as_image").click(function(){
        const target = document.getElementById("timetable_result");
        html2canvas(target).then((canvas) => {
            const base64image = canvas.toDataURL("image/png");
            var anchor = document.createElement('a');
            anchor.setAttribute('href', base64image);
            anchor.setAttribute('download', 'rozvrh.png');
            anchor.click();
        });
    });

}

function hideInputs(){
    $('.div4').hide(); // nadpis semestru
    $('.div5').hide(); // semestr
    $('.div6').hide(); // Letni
    $('.div7').hide(); // zimni
    $('.div8').hide(); // rocnik nadpis
    $('.div9').hide(); // rocnik select  
    $('.div10').hide(); // Povinne predmety
    $('.div11').hide(); // Volitelno predmety
    $('.div12').hide(); // Voliteln predmety
    $('#create').prop("disabled",true); 
}
