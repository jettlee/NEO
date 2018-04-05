// define long polling to server
// var isActive = true;
// $().ready(function(){
//     pollServer();
// });
//
// function pollServer(){
//     if (isActive) {
//         window.setTimeout(function(){
//             $.ajax({
//                 url: "http://localhost:8080",
//                 type: "GET",
//                 success: function(result){
//                     //logic
//                     console.log("success");
//                     pollServer();
//                 },
//                 error: function(){
//                     console.log("error");
//                     pollServer();
//                 }
//             });
//         }, 2500);
//     };
// };
