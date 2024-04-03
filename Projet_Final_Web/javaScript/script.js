

    // Show the initially hidden course list when clicked
    const courseList = document.querySelector(".liste_video ul");
    const courseListTitle = document.querySelector(".liste_video h2");
    courseListTitle.addEventListener("click", function () {
        courseList.style.display = (courseList.style.display === "none") ? "block" : "none";
    });
;
function initMap() {
   
    var defaultLocation = { lat: 48.8566, lng: 2.3522 };

    
    var mapOptions = {
        center: defaultLocation,
        zoom: 15, 
    };

   
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: 'Notre Emplacement'
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initMap();
   
});


$(document).ready(function() {
    
    $('#calendrier-asynchrone').fullCalendar({
      
    });
  
    
    $('#calendrier-synchrone').fullCalendar({
      
    });
  });
  