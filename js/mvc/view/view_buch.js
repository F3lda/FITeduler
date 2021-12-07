/**
 * @file view_tran.js (FITeduler)
 * 
 * @brief Funkce View/frontendu aplikace
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Tereza Buchníčková
 * @update 2021-12-04 (YYYY-MM-DD)
 */

function view_buch()
{
    // if more than 0 selected -> enable buttons ELSE disable buttons
    if ($(".lesson-selected").length > 0) {
        $('.mass_event').prop("disabled", false);
    } else {
        $('.mass_event').prop("disabled", true);
    }

    // --------- OPTIONS ---------
    // --------- disable items ---------
    $('.btn_semestr').on('click', function() {
        $(this).removeClass('disabled');
        if (this.id === 'l_s'){
            $('#z_s').addClass('disabled');
        } else {
            $('#l_s').addClass('disabled');
        }
    });

    $('.studium').on('click', function() {
        $(this).removeClass('disabled');
        $('#mit').css({'opacity': '1'});
        if (this.id === 'bit'){
            $('#mit').css({'opacity': '0.5'});
            $('#year3').show();
        } else {
            if ($('#mit').val() !== 'default') {
                $('#bit').addClass('disabled');
            }
            $('#year3').hide();
        }
    });
}
