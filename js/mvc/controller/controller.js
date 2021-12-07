/**
 * @file controller.js (FITeduler)
 * 
 * @brief Controller aplikace - propojuje Model a View (backend a frontend)
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Karel Jirgl
 * @update 2021-12-04 (YYYY-MM-DD)
 */

class Controller {

    controllerBindsFile = './js/mvc/controller/controller_binds.js';



    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    createApp(result) {

        var _this = this;

        var asyncImportModelViewFunctions = function(handleResults, handleError) {
        
            /**************************************
            *  Code: BindToClass function
            *  Source: https://stackoverflow.com/a/62142995
            *  Timestamp: 2021-11-16 (YYYY-MM-DD)
            *  Author/s: Andrew
            *  Edited: false
            */
            var BindToClass = function(functionsObject, thisClass) {
                for (let [ functionKey, functionValue ] of Object.entries(functionsObject)) {
                    thisClass[functionKey] = functionValue.bind(thisClass);
                }
            }
            /* ******* BindToClass function - end ******* */
    
            var asyncImportFunctions = function(filePath, classObject) {
                return new Promise(function(resolve, reject) {
        
                    try {
                        require([filePath], function (importedFunctions) {
                            BindToClass(importedFunctions, classObject);
                            return resolve('OK');
                        });
                    } catch (e) {
                        return reject(e);
                    }
                    
                });
            };
    
            var promises = [];
            
            // add model functions files
            var modelFuncFiles = _this.model.getFunctionsToImport();
            for (var i = 0; i < modelFuncFiles.length; i++) {
                promises.push(asyncImportFunctions(modelFuncFiles[i], _this.model));
            }
    
            // add view functions files
            var viewFuncFiles = _this.view.getFunctionsToImport();
            for (var i = 0; i < viewFuncFiles.length; i++) {
                promises.push(asyncImportFunctions(viewFuncFiles[i], _this.view));
            }
    
            Promise.all(promises).then(function AcceptHandler(results) {
                handleResults(results);
            }, function ErrorHandler(error) {
                handleError(error);
            });
    
        }

        // load model/view functions
        asyncImportModelViewFunctions(function(results) {
            
            try {
                // load controller binds function
                require([_this.controllerBindsFile], function (importedFunction) {
                    // create controller binds
                    importedFunction(_this);
                    // call init functions
                    _this.model.init();
                    _this.view.init();
                    result('OK');
                });
            } catch (e) {
                console.log(e);
                result(e);
            }
            
        }, function(error) {
            console.log(error);
            result(error);
        });

    }

}
