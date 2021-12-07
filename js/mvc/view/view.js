/**
 * @file view.js (FITeduler)
 * 
 * @brief View - frontend aplikace - zobrazuje data aplikace
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Karel Jirgl
 * @update 2021-12-04 (YYYY-MM-DD)
 */

class View {

    functionsToImport = ['./js/mvc/view/view_functions.js'];



    constructor() {
    }

    // called when controller/app is ready
    init() {
        var this_ = this;

        // load page
        this.changePageFrame(null);

        // load timetable
        console.log("VIEW: calling loadTimetable()...");
        this.loadTimetable();
        // if timetable is not empty
        if (this_.timetableGetItemAttribute(0, 'status', -1) == null) {
            $('#clear').prop("disabled", true);
        }
        // if trash is empty
        if ($("#panel3").html() == "Koš je prázdný.") {
            $('#clear_trash').prop("disabled", true);
        }



        // --------- form button add lesson ---------
        $('#addLesson').click(function() {

            if ($('#form_add .div9_form input').val() != "" && $('#form_add .div10_form input').val() != "") {

                var lesson = new Object();
                lesson.name = $('#form_add .div9_form input').val();
                lesson.day = Number($('#form_add .div1_form select').val());
                lesson.from = Number($('#form_add .div2_form select').val());
                lesson.to = Number($('#form_add .div3_form select').val());
                lesson.week = $('#form_add .div6_form select').val();
                if ($("#form_add .div11_form select").children("option:selected").length > 0) {
                    
                    // clear selectpicker selection
                    //$("#form_add .div11_form select").val('default');
                    //$("#form_add .div11_form select").selectpicker('refresh');

                    //lesson.week = [];
                    lesson.week = "";

                    $("#form_add .div11_form select").children("option:selected").each(function(index, element) {
                        //lesson.week.push($(element).val());
                        lesson.week += $(element).val()+", ";
                    });
                }
                lesson.color = Number($('#form_add .div7_form select').val());
                lesson.room = $('#form_add .div10_form input').val();
                lesson.description = $('#form_add .div12_form input').val();
                lesson.status = "displayed"; // displayed, hidden, removed, starred
                lesson.selected = false; // false, true
                lesson.subject_id = -1;

                this_.timetableAddLesson(lesson);
                // if timetable is not empty
                if (this_.timetableGetItemAttribute(0, 'status', -1) != null) {
                    $('#clear').prop("disabled", false);
                }
                this_.loadTimetable();

            } else {
                alert("Pole 'Název' a 'Místnost' jsou povinná!");
            }
        });


        // --------- link click - change page frame ---------
        $('.nav-link').click(function(event) {
            this_.changePageFrame(event.currentTarget.href.split("#")[1]);
            event.preventDefault();
        });


        // --------- click on lesson ---------
        window.doubleclickItem = -1;
        window.lessonClicked = false;
        $(document).on('click', function(event) {
            // reset doubleclick on click outside lesson
            if (window.lessonClicked == false) {
                window.doubleclickItem = -1;

                // clear selection
                if ($(".text-dark").attr("href") == "#timetable") {
                    if (!($(event.target).attr("type") == 'button' || $(event.target).parent().attr("type") == 'button' || $(event.target).attr("type") == 'color' || $(event.target).parent().attr("type") == 'color')) {
                        $.when($(".lesson-selected").each(function(index, element) {
                            this_.timetableChangeItemAttribute(element.dataset.lessonId, 'selected', false);
                        })).then(function() {this_.loadTimetable();});

                        $('.mass_event').prop("disabled", true);
                    }
                }
            }
            window.lessonClicked = false;            
        });
        $(document).on('click','.lesson', function(event) {
            window.lessonClicked = true;
            
            // change item selected status
            var currentStatus = this_.timetableGetItemAttribute(event.currentTarget.dataset.lessonId, 'selected', false);
            if (currentStatus == false) {currentStatus = true;} else {currentStatus = false;}
            this_.timetableChangeItemAttribute(event.currentTarget.dataset.lessonId, 'selected', currentStatus);
            this_.loadTimetable();

            // if more than 0 selected -> enable buttons ELSE disable buttons
            if ($(".lesson-selected").length > 0) {
                $('.mass_event').prop("disabled", false);
            } else {
                $('.mass_event').prop("disabled", true);
            }

            
            // --------- double click on lesson ---------
            if (window.doubleclickItem == event.currentTarget.dataset.lessonId) {
                window.doubleclickItem = -1;
                //console.log("DOUBLECLICK");

                this_.timetableGetItemAndLessonInfo(event.currentTarget.dataset.lessonId);
				if ($("#panel_lesson").hasClass("active") == false && $("#panel_subject").hasClass("active") == false) {
					$("#panel_lesson").trigger("click");
				}

            } else {
                window.doubleclickItem = event.currentTarget.dataset.lessonId;
                // reset after 500 ms
                setTimeout(() => {window.doubleclickItem = -1;}, 500);
            }

            event.preventDefault();
        });


        // --------- button show ---------
        $('#show').click(function() {
            $.when($(".lesson-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'displayed');
            })).then(function() {this_.loadTimetable();});
        });
        
        
        // --------- button hide ---------
        $('#hide').click(function() {
            $.when($(".lesson-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'hidden');
            })).then(function() {this_.loadTimetable();});
        });

        
        // --------- button star ---------
        $('#star').click(function() {
            $.when($(".lesson-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'starred');
            })).then(function() {
                this_.loadTimetable();
                // unselect all
                $.when($(".lesson-selected").each(function(index, element) {
                    this_.timetableChangeItemAttribute(element.dataset.lessonId, 'selected', false);
                })).then(function() {this_.loadTimetable();});

                $('.mass_event').prop("disabled", true);
            });
        });
        
        
        // --------- button html5colorpicker ---------
        $('#html5colorpicker').change(function() {
            console.log("ON CHANGE");
            console.log($('#html5colorpicker').val());
            $.when($(".lesson-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'color', $('#html5colorpicker').val());
            })).then(function() {this_.loadTimetable();});
        });

        
        // --------- button trash ---------
        $('#trash').click(function() {
            $.when($(".lesson-selected").each(function(index, element) {
                $('.mass_event').prop("disabled", true);
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'selected', false);
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'removed');
            })).then(function() {
                this_.loadTimetable();
                if ($("#panel3").html() == "Koš je prázdný.") {
                    $('#clear_trash').prop("disabled", true);
                } else {
                    $('#clear_trash').prop("disabled", false);
                }
            });
        });
        

        // --------- button clear_trash ---------
        $('#clear_trash').click(function() {
            if (confirm("Opravdu chcete vysypat koš?")) {
                this_.timetableClearTrash();
                this_.loadTimetable();
                if ($("#panel3").html() == "Koš je prázdný.") {
                    $('#clear_trash').prop("disabled", true);
                } else {
                    $('#clear_trash').prop("disabled", false);
                }
            }
        });


        // --------- button clear ---------
        $('#clear').click(function() {
            if (confirm("Opravdu chcete smazat celý rozvrh?")) {
                this_.timetableClear();
                this_.loadTimetable();
                $('#clear').prop("disabled", true);
            }
        });


        // --------- OPTIONS ---------
        // avoid doubleclick on selects
        $(".dropdown-toggle").each(function(index, element) {
            $(element).trigger("click");
        });
        // clear selects
        $("#p-p").val([]).trigger('change');
        $("#v-p").val([]).trigger('change');


        // --------- subjects logic update ---------
        $('.studium, .btn_semestr, #r').on('click', function() {
            setTimeout(() => {
                var study = "BIT";
                var semester = 0;
                var year = 0;

                // study
                if ($("#bit").hasClass("disabled") && $("#mit").val() != "default") {
                    study = $("#mit").val();
                }

                // semester
                if (!$("#l_s").hasClass("disabled") && $("#z_s").hasClass("disabled")) {
                    semester = 1;
                }

                // year
                year = $("#r").val();

                this_.optionsLoadSubjects(study, semester, year);
            }, 33);
        });
        

        // --------- create timetable ---------
        $('#create').on('click', function() {
            
            var compulsory_subjects = [];
            var optional_subjects = [];

            $("#p-p").children("option:selected").each(function(index, element) {
                compulsory_subjects.push($(element).val());
            });
            $("#v-p").children("option:selected").each(function(index, element) {
                optional_subjects.push($(element).val());
            });

            this_.timetableClear();
            this_.optionsCreateTimetable(compulsory_subjects, optional_subjects);
            this_.loadTimetable();
            this_.changePageFrame("timetable");
        });


        // restore from bin
        $(document).on('click','.restore', function(event) {
            
            console.log(event.currentTarget.dataset.lessonId);
            this_.timetableChangeItemAttribute(event.currentTarget.dataset.lessonId, 'status', 'displayed');
            this_.loadTimetable();
            if ($("#panel3").html() == "Koš je prázdný.") {
                $('#clear_trash').prop("disabled", true);
            } else {
                $('#clear_trash').prop("disabled", false);
            }
        });


        
        // RIGHT CLICK CONTEXT MENU
        // --------- button show ---------
        $('#show_dd').click(function() {
            $.when($(".lesson-dropdown-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'displayed');
            })).then(function() {this_.loadTimetable();});
        });
        
        
        // --------- button hide ---------
        $('#hide_dd').click(function() {
            $.when($(".lesson-dropdown-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'hidden');
            })).then(function() {this_.loadTimetable();});
        });

        
        // --------- button star ---------
        $('#star_dd').click(function() {
            $.when($(".lesson-dropdown-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'starred');
            })).then(function() {this_.loadTimetable();});
        });


        // --------- button html5colorpicker_dropdown ---------
        $('#html5colorpicker_dropdown').change(function() {
            console.log("ON CHANGE");
            console.log($('#html5colorpicker_dropdown').val());
            $.when($(".lesson-dropdown-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'color', $('#html5colorpicker_dropdown').val());
            })).then(function() {this_.loadTimetable();});
        });

        
        // --------- button trash ---------
        $('#trash_dd').click(function() {
            $.when($(".lesson-dropdown-selected").each(function(index, element) {
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'selected', false);
                this_.timetableChangeItemAttribute(element.dataset.lessonId, 'status', 'removed');
            })).then(function() {
                this_.loadTimetable();
                if ($("#panel3").html() == "Koš je prázdný.") {
                    $('#clear_trash').prop("disabled", true);
                } else {
                    $('#clear_trash').prop("disabled", false);
                }
            });
        });



        // other's javascript
        view_buch();
        view_tran();
    }

    getFunctionsToImport() {
        return this.functionsToImport;
    }

}
