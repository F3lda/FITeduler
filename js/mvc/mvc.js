/**
 * @file mvc.js (FITeduler)
 * 
 * @brief Vytvoří aplikaci pomocí Controlleru z Modelu a View
 * @date 2021-11-16 (YYYY-MM-DD)
 * @author Karel Jirgl
 * @update 2021-12-04 (YYYY-MM-DD)
 */

const app = new Controller(new Model(), new View());
app.createApp(function(result) {
    if (result == 'OK') {
        console.log('App loaded successfully!');
    } else {
        alert("ERROR WHILE LOADING THE APP!");
        console.log(result);
    }
});
