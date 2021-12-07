/**
 * @file controller_binds.js (FITeduler)
 * 
 * @brief Propojení funkcí View a Modelu v Controlleru
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Karel Jirgl
 * @update 2021-12-04 (YYYY-MM-DD)
 */

define(function (require, exports, module) {
    module.exports = function controllerCreateBinds(controller) {

        // VIEW binds
        controller.view.bindModelFunction_changePageFrame((frame) => {controller.model.changePageFrame(frame);});
        controller.view.bindModelFunction_loadTimetable(() => {controller.model.loadTimetable();});
        controller.view.bindModelFunction_timetableAddLesson((lesson) => {controller.model.timetableAddLesson(lesson);});
        controller.view.bindModelFunction_timetableClear(() => {controller.model.timetableClear();});
        controller.view.bindModelFunction_timetableGetItemAttribute((item, attribute, ifnull) => {return controller.model.timetableGetItemAttribute(item, attribute, ifnull);});
        controller.view.bindModelFunction_timetableChangeItemAttribute((item, attribute, value) => {controller.model.timetableChangeItemAttribute(item, attribute, value);});
        controller.view.bindModelFunction_timetableGetItemAndLessonInfo((item) => {controller.model.timetableGetItemAndLessonInfo(item);});
        controller.view.bindModelFunction_optionsLoadSubjects((study, semester, year) => {controller.model.optionsLoadSubjects(study, semester, year);});
        controller.view.bindModelFunction_optionsCreateTimetable((compulsory_subjects, optional_subjects) => {controller.model.optionsCreateTimetable(compulsory_subjects, optional_subjects);});
        controller.view.bindModelFunction_timetableClearTrash(() => {controller.model.timetableClearTrash();});

        // MODEL binds
        controller.model.bindViewFunction_showPageFrame((frame) => {controller.view.showPageFrame(frame);});
        controller.model.bindViewFunction_renderTimetable((table, items) => {controller.view.renderTimetable(table, items);});
        controller.model.bindViewFunction_showLessonInfo((item, lesson) => {controller.view.showLessonInfo(item, lesson);});
        controller.model.bindViewFunction_showSubjectsOptions((compulsory, optional) => {controller.view.showSubjectsOptions(compulsory, optional);});

    }
});
