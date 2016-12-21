var images = {
    image1: "Greek background.jpg",
    image2: "http://eskipaper.com/images/girl-background-3.jpg",
    image3: "https://vsi.chem.tue.nl/images/logo-tue.png",
    image4: "http://hdwallpapersrocks.com/wp-content/uploads/2014/05/Girl-and-boy-friendship.jpg",
    image5: "http://thiswallpaper.com/cdn/hdwallpapers/1109/beautiful%20prague%20city%20widescreen%20wallpaper.jpg",
    image6: "http://dreamatico.com/data_images/lion/lion-8.jpg",
    image7: "https://www.smashingmagazine.com/wp-content/uploads/2015/06/10-dithering-opt.jpg",
    image8: "http://www.guys.nl/wp-content/uploads/2016/08/narcos-season-2.jpg",
    image9: "http://www.ox.ac.uk/sites/files/oxford/styles/ow_medium_feature/public/field/field_image_main/wave.jpg?itok=XS6D8dpD",
    image10: "http://www.blogical.in/wp-content/uploads/2015/07/5xNuy.jpg",
    image11: "https://s-media-cache-ak0.pinimg.com/originals/b6/b8/49/b6b849e650761a80c2f04bb614e019f6.jpg",
    image12: "https://www.tesla.com/sites/default/files/configurator/MODELX_20161115b/1440/UI/ui_category_battery.jpg",
    image13: "https://static.pexels.com/photos/96918/pexels-photo-96918.jpeg",
    image14: "http://www.thespecialistsltd.com/files/Replica_AK47.jpg",
    image15: "http://sf.co.ua/14/07/wallpaper-1303595.jpg",
    image16: "http://userscontent2.emaze.com/images/79aedbfd-6c65-4a84-bd3f-38c24e7d6c28/8789506b-df47-4d1e-ad47-d5cca2a81a65.jpg",
    image17: "http://www.lougsiegel.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/l/sliced_vegetable_platter_1.jpg",
};

$(document).ready(function() {
    
    $("#previousButton").on("click", function() {
       changeImage("previous");
       setTimeout(function() {
            checkFavorite(getPreviousImage());
        }, 400);
   });
    
    $("#nextButton").on("click", function() {
        changeImage("next");
        setTimeout(function() {
            checkFavorite(getNextImage());
        }, 400);
        
    });
    
    $("#favoriteButton").click(function() {
        favoriteImage();
    });
    
    checkFavorite(getActiveImage());
    
});

function changeImage(direction) {
    addImage();
}

function addImage() {
     // Clone current active image
        var clone = $(".carousel-inner div:last-child").clone();
        
        // Remove active class so it is now displayed
        clone.removeClass("active");
        
        var imgChild = clone.children(":first");
        
        // Get current image ID
        var imageID = imgChild.attr("id");
        imageID = imageID.replace("image", "");
        
        var ID = parseInt(imageID);
        // Determine next ID based on last id
        var nextID = ID + 1;
        
        // Get next image source
        var nextSource = images["image" + nextID];
        
        if (nextSource == undefined) {
            console.log("Do not append extra images");
            return;
        }
        
        // Change image source
        imgChild.attr("src", nextSource);
        imgChild.attr("id", "image" + nextID);
        
        clone.appendTo(".carousel-inner");
}

function favoriteImage() {
    var currentImage = $(".item.active");
    
    var imageID = currentImage.children(":first").attr("id");
    var cookieKey = "favoritedImages";
    
    var value = true;
    
    // Check if we already stored an image
    if (getCookie(cookieKey) == "") {
         setCookie(cookieKey, imageID, 365);
    } else {
        // This image is already stored once, so unfavorite
        if (getCookie(cookieKey).indexOf(imageID) != -1) {
            
             // Remove image from other images
            setCookie(cookieKey, getCookie(cookieKey).replace(imageID, ""), 365);
            value = false;
            
        } else {
            // Add image to other images
            setCookie(cookieKey, getCookie(cookieKey) + "," + imageID, 365);
        }
        
    }
    
   setHeartFavorited(value);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isFavorited(imageName) {
    var cookie = getCookie("favoritedImages");
    
    var indexOf = cookie.indexOf(imageName);
    
    if (indexOf < 0) {
        return false;
    } 
    
    return true;
}

function isHeartFavorited() {
    return $("#favoriteButton").hasClass("fa-heart");
}

function setHeartFavorited(boolean) {
    if (boolean) {
        $("#favoriteButton").addClass("fa-heart");
        $("#favoriteButton").removeClass("fa-heart-o");
    } else {
        $("#favoriteButton").addClass("fa-heart-o");
        $("#favoriteButton").removeClass("fa-heart");
    }
}

function getActiveImage() {
    var img = $(".item.active").children(":first");
    return img.attr("id");
}

function getNextImage() {
    var img = $(".item.next").children(":first");
    return img.attr("id");
}

function getPreviousImage() {
    var img = $(".item.prev").children(":first");
    return img.attr("id");
}

function checkFavorite(imageName) {    
    setHeartFavorited(isFavorited(imageName));
}