/**
 * @file model.js (FITeduler)
 * 
 * @brief Model - backend aplikace - spravuje a ukládá data aplikace
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Karel Jirgl
 * @update 2021-12-04 (YYYY-MM-DD)
 */

 class Model {

    functionsToImport = ['./js/mvc/model/model_functions.js'];



    constructor() {
        // pageFrame
        if (localStorage.getItem('frame') == null) {
            localStorage.setItem('frame', "timetable");
        }
        // table = 5 * 14 * []
        if (localStorage.getItem('table') == null) {
            localStorage.setItem('table', JSON.stringify([Array(14).fill([]), Array(14).fill([]), Array(14).fill([]), Array(14).fill([]), Array(14).fill([])]));
        }
        // items = []
        if (localStorage.getItem('items') == null) {
            localStorage.setItem('items', JSON.stringify([]));
        }
    }

    // called when controller/app is ready
    init() {
    }
  
    getFunctionsToImport() {
        return this.functionsToImport;
    }

    getSubjectsJSON() {
        // in file './js/data.js'
        return jsonData;
    }
  
}
