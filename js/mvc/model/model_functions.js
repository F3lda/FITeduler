/**
 * @file model_functions.js (FITeduler)
 * 
 * @brief Funkce Modelu/backendu aplikace
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Karel Jirgl
 * @update 2021-12-04 (YYYY-MM-DD)
 */

define(function (require, exports, module) {
    module.exports = {

        /********** BINDS - bind functions from VIEW **********/
        bindViewFunction_showPageFrame(showPageFrame)
        {
            this.showPageFrame = showPageFrame;
        },

        bindViewFunction_renderTimetable(renderTimetable)
        {
            console.log("MODEL: binding view function renderTimetable()");
            this.renderTimetable = renderTimetable;
        },

        bindViewFunction_showLessonInfo(showLessonInfo)
        {
            this.showLessonInfo = showLessonInfo;
        },

        bindViewFunction_showSubjectsOptions(showSubjectsOptions)
        {
            this.showSubjectsOptions = showSubjectsOptions;
        },



        /********** MODEL FUNCTIONS **********/
        changePageFrame: function(frame)
        {
            if (frame == null) {
                frame = localStorage.getItem('frame');
            } else {
                localStorage.setItem('frame', frame);
            }
            this.showPageFrame(frame);
        },

        loadTimetable: function()
        {
            console.log("MODEL: calling renderTimetable()...");
            this.renderTimetable(JSON.parse(localStorage.getItem('table')), JSON.parse(localStorage.getItem('items')));
        },

        timetableAddLesson: function(lesson)
        {
            if (lesson.from > lesson.to) {
                return;
            }

            // get data from DB
            var table = JSON.parse(localStorage.getItem('table'));
            var items = JSON.parse(localStorage.getItem('items'));
            

            // add new item
            var newItemId = items.length;
            items.push(lesson);
            

            // add lesson to table[day][hour][row]
            var newItemRow = 0-1; // přidá hodinu co nejníže -> //var newItemRow = table[lesson.day][lesson.from].length-1;

            do {
                // find empty place
                newItemRow++;
                var rowEmpty = true;
                for (var i = lesson.from; i <= lesson.to; i++) {
                    if (table[lesson.day][i][newItemRow] != null) {
                        rowEmpty = false;
                        break;
                    }
                }
            } while(rowEmpty == false);

            for (var i = lesson.from; i <= lesson.to; i++) {
                // add new item to empty row
                table[lesson.day][i][newItemRow] = newItemId;
            }
            

            // save data to DB
            localStorage.setItem('table', JSON.stringify(table));
            localStorage.setItem('items', JSON.stringify(items));
        },

        timetableClear: function()
        {
            // table = 5 * 14 * []
            localStorage.setItem('table', JSON.stringify([Array(14).fill([]), Array(14).fill([]), Array(14).fill([]), Array(14).fill([]), Array(14).fill([])]));
            // items = []
            localStorage.setItem('items', JSON.stringify([]));
        },

        timetableGetItemAttribute: function(item, attribute, ifnull)
        {
            if (JSON.parse(localStorage.getItem('items'))[item] == null) {
                return null;
            }
            if (JSON.parse(localStorage.getItem('items'))[item][attribute] == null) {
                return ifnull;
            }
            return JSON.parse(localStorage.getItem('items'))[item][attribute];
        },

        timetableChangeItemAttribute: function(item, attribute, value)
        {
            var items = JSON.parse(localStorage.getItem('items'));
            items[item][attribute] = value;
            localStorage.setItem('items', JSON.stringify(items));
        },

        timetableGetItemAndLessonInfo: function(item)
        {
            var json = this.getSubjectsJSON();

            json = JSON.parse(json);
            
            var lessonInfo = {};
            if (JSON.parse(localStorage.getItem('items'))[item]["subject_id"] != -1) {
                lessonInfo = json[JSON.parse(localStorage.getItem('items'))[item]["subject_id"]];
            }

            this.showLessonInfo(JSON.parse(localStorage.getItem('items'))[item], lessonInfo);
        },

        optionsLoadSubjects: function(study, semester, year)
        {
            var json = this.getSubjectsJSON();

            var compulsory_subjects = [];
            var optional_subjects = [];

            json = JSON.parse(json);
            $(json).each(function(index, element) {
                if (element["study"] == study && Number(element["semester"]) == Number(semester) && Number(element["year"]) == Number(year)) {
                    if (Number(element["compulsory"]) == 1) {
                        if (compulsory_subjects.indexOf(element["nickname"]) == -1) {
                            compulsory_subjects.push(element["nickname"]);
                        }
                    } else {
                        if (optional_subjects.indexOf(element["nickname"]) == -1) {
                            optional_subjects.push(element["nickname"]);
                        }
                    }
                }
            });

            this.showSubjectsOptions(compulsory_subjects, optional_subjects);
        },

        optionsCreateTimetable: function(compulsory_subjects, optional_subjects)
        {
            var this_ = this;

            var json = this.getSubjectsJSON();

            json = JSON.parse(json);
            $(json).each(function(index, element) {
                if (compulsory_subjects.indexOf(element["nickname"]) != -1 || optional_subjects.indexOf(element["nickname"]) != -1) {
                    var colors = {"přednáška": 1, "cvičení": 2};
                    
                    var lesson = new Object();
                    lesson.fullname = element["name"];
                    lesson.day = Number(element["day"]);
                    lesson.from = Number(element["from_time"]);
                    lesson.to = Number(element["to_time"]);
                    lesson.week = element["week"];
                    lesson.color = 0;
                    if (colors[element["type"]] !== undefined) {lesson.color = colors[element["type"]];}
                    lesson.name = element["nickname"];
                    lesson.room = element["room"];
                    //lesson.description = element["name"]+'<br /><a href='+element["link"]+'>Karta předmětu</a>';
                    lesson.description = '';
                    lesson.type = element["type"];
                    lesson.status = "displayed"; // displayed, hidden, removed, starred
                    lesson.selected = false; // false, true
                    lesson.subject_id = index;

                    this_.timetableAddLesson(lesson);
                }
            });
        },

        timetableClearTrash: function()
        {
            // get data from DB
            var table = JSON.parse(localStorage.getItem('table'));
            var items = JSON.parse(localStorage.getItem('items'));

            $(items).each(function(index, element) {
                if (element != null && element.status == "removed") {
                    
                    // remove lesson from timetable
                    // day
                    for (var i = 0; i < 5; i++) {
                        
                        // hour
                        for (var j = 0; j < 14; j++) {
                            
                            // row
                            for (var k = 0; k < table[i][j].length; k++) {

                                if (table[i][j][k] == index) {
                                    console.log(index);
                                    table[i][j].splice(k, 1);
                                    k--;
                                }

                            }
                        }
                    }

                    // remove lesson from items
                    items[index] = -1;
                }
            });

            // save data to DB
            localStorage.setItem('table', JSON.stringify(table));
            localStorage.setItem('items', JSON.stringify(items));
        }

    };
});
