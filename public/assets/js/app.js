//Sign Up Function

var nameRef = document.getElementById('name');
var phoneRef = document.getElementById('phone-no');
var emailRef = document.getElementById('email');
var passwordRef = document.getElementById('password');
var userAccountRef = document.getElementById("userAccount");
var logOutRef = document.getElementById("logOut");
var registersRef = document.getElementById("registers");
var loginRef = document.getElementById("login");

var auth = firebase.auth();
var db = firebase.database();
var opponentUid;
var userObject;

function signup() {
    userObject = {
        email: emailRef.value,
        contact: phoneRef.value,
        name: nameRef.value
    }
    auth.createUserWithEmailAndPassword(emailRef.value, passwordRef.value)
        .then((success) => {
            db.ref(`users/${success.user.uid}/`).set(userObject);
            location = './index.html';
            emailRef.value = "";
            phoneRef.value = "";
            nameRef.value = "";
        })
        .catch((error) => {
            console.error('something went wrong', error);
        })


}

//Just for login

function login() {
    auth.signInWithEmailAndPassword(emailRef.value, passwordRef.value)
        .then((success) => {
            localStorage.setItem("currentUserUid", success.user.uid);

            const messaging = firebase.messaging();
            messaging.requestPermission().then(function () {
                console.log('Notification permission granted.');
                return messaging.getToken();
            }).then(function (token) {
                // Displaying user token
                userObject = {
                    token: token,
                }
                db.ref(`users/${success.user.uid}/`).push(userObject);
                console.log('token >>>> ', token);
                location = './index.html';

            }).catch(function (err) { // Happen if user deney permission
                console.log('Unable to get permission to notify.', err);
            });
            // do whatever you want on getting push notification in your front application
            messaging.onMessage(function (payload) {
                console.log('onMessage', payload);
            });



            // location = './index.html';
        })
        .catch((error) => {
            console.log('something went wrong', error)
        })
}

// Just create for location
function registration() {
    location = "register.html";
}


//for logout and clear local storage
function signoutUser() {
    auth.signOut()
        .then(() => {
            localStorage.clear();
            location = 'index.html';
        })
}


// submit an ad
var globalPathForImg;
var imgRef = document.getElementById("img");

function createAd() {
    var titleRef = document.getElementById("adTittle");
    var categoriesRef = document.getElementById("categories");
    var descriptionRef = document.getElementById("description");
    var nameRef = document.getElementById("name");
    var phoneRef = document.getElementById("phone-no");
    var addressRef = document.getElementById("address");
    var cityRef = document.getElementById("city");
    var modelRef = document.getElementById("model");
    var yearRef = document.getElementById("year");
    var brandRef = document.getElementById("brand");
    var priceRef = document.getElementById("price");

    var submitAnAd = {
        title: titleRef.value,
        // categories: categoriesRef.value,
        description: descriptionRef.value,
        name: nameRef.value,
        phone: phoneRef.value,
        address: addressRef.value,
        city: cityRef.value,
        // model: modelRef.value,
        // year: yearRef.value,
        // brand: brandRef.value,
        price: priceRef.value
    }

    submitAnAd.imgUrl = globalPathForImg;
    let currentUid = localStorage.getItem('currentUserUid');
    // console.log(submitAnAd)
    // //for image upload
    // var imgs = imgRef.files[0];
    // // console.log(imgs);
    // if (imgs) {
    //     var file = imgs;
    //     firebase.storage().ref().child('images').child(file.name).put(file)
    //         .then(function (snapshot) {
    //             // console.log(snapshot);
    //             snapshot.ref.getDownloadURL().then(function (downloadURL) {
    //                 //   console.log('File available at', downloadURL);
    //                 submitAnAd.imgUrl = downloadURL;
    //                 db.ref(`categories/${submitAnAd.categories}/${currentUid}/`).push(submitAnAd);
    //             });
    //         })
    // }
    // console.log(submitAnAd);
    db.ref(`categories/${submitAnAd.categories}/${currentUid}/`).push(submitAnAd);

    titleRef.value = "";
    // categoriesRef.value = "";
    // descriptionRef.value = "";
    imgRef.value = "";
    nameRef.value = "";
    phoneRef.value = "";
    addressRef.value = "";
    cityRef.value = "";
    // modelRef.value = "";
    // yearRef.value = "";
    // brandRef.value = "";
    priceRef.value = "";
}


function encodeImageFileAsURL() {

    // var filesSelected = document.getElementById("inputFileToLoad").files;
    var filesSelected = imgRef.files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            globalPathForImg = srcData;
            // console.log(globalPathForImg)

        }
        fileReader.readAsDataURL(fileToLoad);
    }
    filesSelected.files = '';
}


// Get data from database and print DOM

var productsRef = document.getElementById("products");
function getMyData() {
    db.ref(`categories/`).on("child_added", function (data) {
        // console.log(data.val());
        // var userUid = firebase.auth().currentUser.uid;
        var categories = data.val();
        for (var userUid in categories) {
            // console.log(userUid)
            var categoriesData = categories[userUid]
            // console.log(categoriesData)
            for (var key in categoriesData) {
                // console.log(categoriesData[key])
                // console.log(categoriesData[key].imgsUrl);
                var databaseData = createStructure("a", "li", "div", "div", "p", "p", "strong", "img", categoriesData[key].imgUrl, "br", categoriesData[key].title, key, categoriesData[key].price);
                productsRef.appendChild(databaseData);
            }
        }
    });
    justForHidden();
}

function createStructure(anchorTag, li, div1, div2, para1, para2, strongTag, imgTag, imgsUrl, lineBreak, titleText, addKey, addPrice) {
    var anchor = document.createElement(anchorTag);
    anchor.href = "product_details.html";
    anchor.onclick = function () {
        localStorage.setItem("CurrentAd", addKey);
    }
    anchor.setAttribute("id", "anchorId")
    var liEl = document.createElement(li);
    var imageDiv = document.createElement(div1);
    var textDiv = document.createElement(div2);
    var title = document.createElement(para1);
    var lineBreakTag = document.createElement(lineBreak)
    var price = document.createElement(para2);
    var priceStrong = document.createElement(strongTag);
    var img1 = document.createElement(imgTag);

    img1.src = imgsUrl;
    img1.setAttribute('alt', `imgAds `);
    img1.setAttribute('id', 'image')

    var titleTextNode = document.createTextNode(titleText);
    title.appendChild(titleTextNode);
    var priceStrongTextNode = document.createTextNode(`${addPrice} PKR`);
    priceStrong.appendChild(priceStrongTextNode);

    liEl.setAttribute("class", "span4");
    imageDiv.setAttribute("class", "thumbnail");
    imageDiv.setAttribute("id", "mainDiv");
    textDiv.setAttribute("id", "caption")
    textDiv.setAttribute("class", "caption cntr");
    title.setAttribute("id", "tittle")
    price.setAttribute("id", "prices");

    anchor.appendChild(img1);
    textDiv.appendChild(title);
    textDiv.appendChild(lineBreakTag)
    price.appendChild(priceStrong)
    textDiv.appendChild(price);
    imageDiv.appendChild(anchor);
    imageDiv.appendChild(textDiv)
    liEl.appendChild(imageDiv);
    // console.log(liEl)
    return liEl;
}

// Get click product detail from database and print DOM
function productDetails() {
    var addref = document.getElementById("single-add")
    let currentAdId = localStorage.getItem('CurrentAd');
    db.ref(`categories/`).on("child_added", function (data) {
        var categories = data.val();
        for (var userUid in categories) {
            var categoriesData = categories[userUid]
            for (var key in categoriesData) {
                if (key === currentAdId) {
                    addref.innerHTML = `                
                <div class="row-fluid">
			<div class="span5">
			<div id="myCarousel" class="carousel slide cntr">
                <div class="carousel-inner">
                  <div class="item active">
                   <a href="#"> <img src="${categoriesData[key].imgUrl}" alt="" style="width:100%"></a>
                  </div> 
            </div>
            </div>
            </div>
            <div class="span7">
                <h2>Ad Title:<h2>
				<h3>${categoriesData[key].title}</h3>
				<hr class="soft"/>
                <div class="form-horizontal qtyFrm">
                <h3>Price:<h3>
				<div class="control-group">
					<label class="control-label"><span>${categoriesData[key].price} PKR</span></label>
                </div>
				<button type="submit" class="shopBtn" onClick = "addFav()"><span class=" icon-shopping-cart"></span> Add to Fav</button>
				<button type="submit" class="shopBtn" onClick = "chat()" ><span class=" material-icons"></span> Message</button>
				</div>
				<hr class="softn clr"/>
			    <h4>Product Information</h4>
                <table class="table table-striped">
				<tbody id=singleData>
				<tr class="techSpecRow"><td class="techSpecTD1">Name:</td><td class="techSpecTD2">${categoriesData[key].name}</td></tr>
				<tr class="techSpecRow"><td class="techSpecTD1">Phone No:</td><td class="techSpecTD2">${categoriesData[key].phone}</td></tr>
				<tr class="techSpecRow"><td class="techSpecTD1">City:</td><td class="techSpecTD2">${categoriesData[key].city}</td></tr>
				<tr class="techSpecRow"><td class="techSpecTD1">Address:</td><td class="techSpecTD2">${categoriesData[key].address}</td></tr>
				</tbody>
                </table>
                <h5>Description:<h5>
				<p>${categoriesData[key].description}</p>
			    </div>`;
            }
        }
        // <tr class="techSpecRow"><td class="techSpecTD1">Brand:</td><td class="techSpecTD2">${categoriesData[key].brand}</td></tr>
        // <tr class="techSpecRow"><td class="techSpecTD1">Model:</td><td class="techSpecTD2">${categoriesData[key].model}</td></tr>
        // <tr class="techSpecRow"><td class="techSpecTD1">Year:</td><td class="techSpecTD2">${categoriesData[key].year}</td></tr>
        }
    });
    justForHidden();
}

// searching data get from the database and print DOM

function searchData() {
    var input, searchValue;
    input = document.getElementById("searchText");
    searchValue = input.value;
    // console.log(searchValue);
    // location = "search-data.html"
    var searchValueLower = searchValue.toLowerCase();
    searchingDivRef.style.display = "none";
    // console.log(input.value);
    db.ref(`categories/`).on("value", function (data) {
        var categories = data.val();
        // console.log(categories)
        for (var key in categories) {
            for (var childKey in categories[key]) {
                var childKeyRef = categories[key][childKey];
                for (var grandChild in childKeyRef) {
                    var categoriesObject = childKeyRef[grandChild];
                    // console.log(categoriesObject)
                    var categoriesValue = categoriesObject.title;
                    var categoriesValueLower = categoriesValue.toLowerCase();
                    var searcVal = categoriesValueLower.indexOf(searchValueLower);
                    var categoriesValueToLOwer = key.toLowerCase();
                    productsRef.style.display = "none";
                    console.log(searcVal)
                    if (searcVal !== -1) {
                        searchingDivRef.innerHTML = '';
                        searchingDivRef.style.display = "block";
                        searchingDivRef.innerHTML += `<div class="span9">
                        <div class="well well-small" id = "divSearch">
                        <div class="row-fluid" >
                        <div class="span2"  id="searchimgaeDiv">	
                        <a href="product_details.html">    
                                    <img src="${categoriesObject.imgUrl}" alt="img" id="searchimgae"> 
                                    </a>
                                </div>
                                <div class="span6">
                                    <h5>${categoriesObject.title}</h5>
                                    <p>
                                    ${categoriesObject.description}
                                    </p>
                                </div>
                                <div class="span4 alignR pull-right">
                                    <div class="form-horizontal qtyFrm">
                                        <h3>${categoriesObject.price} PKR</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    }
                    else if (searchValueLower === categoriesValueToLOwer) {
                        searchingDivRef.innerHTML = '';
                        searchingDivRef.style.display = "block";
                        searchingDivRef.innerHTML += `<div class="span9">
                        <div class="well well-small" id = "divSearch">
                        <div class="row-fluid" >
                        <div class="span2" id="searchimgaeDiv">	
                        <a href="product_details.html">    
                                    <img src="${categoriesObject.imgUrl}" alt="img" id="searchimgae"> 
                                    </a>
                                </div>
                                <div class="span6">
                                    <h5>${categoriesObject.title}</h5>
                                    <p>
                                    ${categoriesObject.description}
                                    </p>
                                </div>
                                <div class="span4 alignR pull-right">
                                    <div class="form-horizontal qtyFrm">
                                        <h3>${categoriesObject.price} PKR</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    }
                }
            }
        }
    })
}

function chat() {
    var currentUser = localStorage.getItem("currentUserUid")
    if (currentUser) {
        console.log("start chat");
        location = "chat.html"
    }
    else {
        location = "login.html"
    }
}

var sendInputRef = document.getElementById("sendInput")
let currentAdId = localStorage.getItem('CurrentAd');
var currentName;
var ul = document.getElementById("chatRoom");
function sendNewMgs() {
    var messageObject;
    var message = sendInputRef.value;
    auth.onAuthStateChanged(function (currentuser) {
        if (currentuser) {
            db.ref(`categories/`).on("child_added", function (data) {
                var categories = data.val();
                for (var adUid in categories) {
                    detailCategories = categories[adUid];
                    for (var addKey in detailCategories) {
                        if (addKey === currentAdId) {
                            var currentuserUid = firebase.auth().currentUser.uid;
                            var date = new Date();

                            messageObject = {
                                senderId: currentuserUid,
                                reciverId: adUid,
                                message: message,
                                time: date.getTime()
                            }

                            var key = 'AAAAbR6LPiQ:APA91bGQFmI4m9SFswJKZNpTyeN-7C0dtdFlp0l_IPE8TFaiMkYvsY8QBq4S-eg91jBpLsJlvmcWxjgNxpd3pHLX9lMLRomIsxnj5We6D_VavrotJoM4sGcgyjyXGTIpG7P9E1U7QfKrG_90pJaKrFaeGO4H9ZaSjA';
                            //token
                            var to = 'eghRIUbOs9Q:APA91bFlw4jXypeVvrfZRjsq_qmxwiZBEADyBQliLPcd5R2fPMq522iKKXyBxcMuaTWwyC1XralgkfmARW24oEl2iZ0p8WWIsVuBRZiAlgbSe5KLvuUmRPtuqFJVeMZaX70p-wgihhCI';
                            var notification = {
                                'title': 'Portugal vs. Denmark',
                                'body': '5 to 1'
                            };

                            var body = {
                                to: 'eghRIUbOs9Q:APA91bFlw4jXypeVvrfZRjsq_qmxwiZBEADyBQliLPcd5R2fPMq522iKKXyBxcMuaTWwyC1XralgkfmARW24oEl2iZ0p8WWIsVuBRZiAlgbSe5KLvuUmRPtuqFJVeMZaX70p-wgihhCI',
                                data: {
                                    custom_notification: {
                                        title: "hello world",
                                        body: "Click me to go to detail",
                                    }
                                },
                            };

                            fetch('https://fcm.googleapis.com/fcm/send', {
                                'method': 'POST',
                                'headers': {
                                    'Authorization': 'key=' + key,
                                    'Content-Type': 'application/json'
                                },
                                'body': JSON.stringify(body)
                            }).then(function (response) {
                                console.log(response);
                            }).catch(function (error) {
                                console.error(error);
                            });
                            // console.log(messageObject)
                            db.ref(`users/chatRoom/`).push(messageObject);
                        }
                    }
                }
            })
            sendInputRef.value = '';
        }
    })
}








function chatData() {
    var senderName;
    var mgsSeenRef = document.getElementById("chatData")
    var nameAnchor;
    db.ref("users/chatRoom/").on("child_added", (users) => {
        var messageData = users.val();
        var currentuserUid = firebase.auth().currentUser.uid;
        // console.log(messageData.reciverId === currentuserUid);
        // console.log(currentuserUid)
        // console.log(messageData.senderId === currentuserUid);
        if (messageData.reciverId === currentuserUid) {
            opponentUid = messageData.senderId;
            db.ref("users/").once("value", (users) => {
                var userData = users.val()
                for (var key in userData) {
                    var mgsSenderDetail = userData[key];
                    if (key === messageData.senderId) {
                        // console.log(mgsSenderDetail)
                        senderName = mgsSenderDetail.name;
                        // nameAnchor = document.createElement('a');
                        // var name = document.createTextNode(senderName);
                        // // console.log(name)
                        // // console.log(nameAnchor)
                        // nameAnchor.appendChild(name);
                        // var breakLine = document.createElement('br');
                        // nameAnchor.href = 'chatBox.html';
                        // nameAnchor.appendChild(breakLine);
                        // // nameAnchor.text = senderName;
                        // nameAnchor.onclick = function () {
                        //     localStorage.setItem("opponentUid", opponentUid);
                        //     // localStorage.setItem("CurrentAd", addKey);
                        // }
                        // console.log(senderName);


                        // mgsSeenRef.innerHTML += `<a href="chatBox.html">${senderName}</a> <br/>`;
                    }
                }
                // var anchorTag = document.createElement('a');
                // anchorTag.href = "chatBox.html";
                // var TextNode = document.createTextNode(senderName);
                // anchorTag.appendChild(TextNode);
                // mgsSeenRef.appendChild(anchorTag);
                // if (senderName !== senderName) {
                // }
            })
            nameAnchor = document.createElement('a');
            var name = document.createTextNode(senderName);
            // console.log(name)
            // console.log(nameAnchor)
            nameAnchor.appendChild(name);
            var breakLine = document.createElement('br');
            nameAnchor.href = 'chatBox.html';
            nameAnchor.appendChild(breakLine);
            // nameAnchor.text = senderName;
            nameAnchor.onclick = function () {
                localStorage.setItem("opponentUid", opponentUid);
                // localStorage.setItem("CurrentAd", addKey);
            }
            mgsSeenRef.appendChild(nameAnchor)
        }
    })
    justForHidden();
}


function completeMgs() {
    var currentUid = localStorage.getItem("currentUserUid");
    var opponentUid = localStorage.getItem("opponentUid")
    var showMgsRef = document.getElementById("showMgs");
    db.ref("users/chatRoom/").on("child_added", (users) => {
        var messages = users.val();
        // senderUid = messages.senderId
        // console.log(messages.reciverId);
        // console.log(messages.senderId);
        // console.log(currentUid);
        console.log(currentUid)
        if ((messages.senderId === currentUid && messages.reciverId === opponentUid) || (messages.senderId === opponentUid && messages.reciverId === currentUid)) {
            // console.log("condition true")
            // if(messages.senderId ==)
            showMgsRef.innerHTML += `<div class = "pull-right">${messages.message}</div>`;
        }
    })
    // console.log("function resolve")
    justForHidden();
}

function replyMgs() {
    var messageObj;
    var message = sendInputRef.value;
    db.ref("users/chatRoom/").on("child_added", (users) => {
        var currentuserUid = firebase.auth().currentUser.uid;
        mgsArrFr = users.val();
        var date = new Date();
        // console.log(currentuserUid);
        // console.log( mgsArrFr.reciverId)
        if (currentuserUid == mgsArrFr.reciverId) {
            messageObj = {
                senderId: currentuserUid,
                reciverId: mgsArrFr.senderId,
                message: message,
                time: date.getTime()
            }
            // console.log(messageObj)
        }
    })
    // fetch("https://us-central1-pwapushnotification-633e2.cloudfunctions.net/helloWorld", {
    //     method: 'POST',
    //     body: {
    //         token: "ewD5MHBousU:APA91bEuIz1bS4E1U9bgZdgO3YBe2Uk9LLhvbzQC_YMtfKNoBHW6lpbXFM-_kqc6PGOXDs63s_5ujhArq32Aq7Q6kQ0ZIirLZxIt630fB5rIc-MZ2rjeiGKfiw1MWS1f2C83zDsViZb075P6lh4tJOqMPcI_y-dgNA",
    //         title: "my title",
    //         message: "my body message"
    //     },
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then((res) =>res)


    sendInputRef.value = '';
    db.ref(`users/chatRoom/`).push(messageObj);
}


var favProductsRef = document.getElementById("fav-products");
function addFav() {
    var currentAdId = localStorage.getItem("CurrentAd");
    var currentUserUid = localStorage.getItem("currentUserUid");
    firebase.database().ref('categories/').on("child_added", (data) => {
        var categories = data.val();
        for (var key in categories) {
            var categoriesData = categories[key]
            for (var childKey in categoriesData) {
                // console.log(childKey)
                var childKeyRef = categoriesData[childKey];
                if (childKey === currentAdId) {
                    var favObject = childKeyRef;
                    favObject.key = childKey;
                    console.log(favObject)
                    db.ref(`/users/${currentUserUid}/fav-Ads/${childKey}/`).set(childKeyRef)
                }
            }
        }
    })
}


var flagShow = false;
var favAdsobj = {};
var num = 0;
function fetchFavAds() {
    num = 0;
    var favAdsOfflineShow = [];
    var currentUid = localStorage.getItem("currentUserUid");
    firebase.database().ref(`/users/${currentUid}/fav-Ads/`).once("value", (data) => {
        var favAd = data.val();
        for (var key in favAd) {
            var favData = favAd[key];
            favAdsOfflineShow[num] = favData;
            num++;
        }
        localStorage.setItem('favouritAds', JSON.stringify(favAdsOfflineShow));
    })
    var favAdData = JSON.parse(localStorage.getItem("favouritAds"));
    for (var i = 0; i < favAdData.length; i++) {
        // console.log(favAdData[i].name)
        var databaseData = favAdStructure("a", "li", "div", "div", "p", "p", "strong", "img", favAdData[i].imgUrl, "br", favAdData[i].title, favAdData[i].key, favAdData[i].price, "h4", "a");
        favProductsRef.appendChild(databaseData);
    }
    justForHidden();
}

function favAdStructure(anchorTag, li, div1, div2, para1, para2, strongTag, imgTag, imgsUrl, lineBreak, titleText, addKey, addPrice, h4Tag, buttonAnchor) {
    var anchor = document.createElement(anchorTag);
    anchor.href = "product_details.html";
    anchor.onclick = function () {
        localStorage.setItem("CurrentAd", addKey);
    }
    var liEl = document.createElement(li);
    var imageDiv = document.createElement(div1);
    var textDiv = document.createElement(div2);
    var title = document.createElement(para1);
    var lineBreakTag = document.createElement(lineBreak)
    var price = document.createElement(para2);
    var priceStrong = document.createElement(strongTag);
    var img1 = document.createElement(imgTag);
    var anchorbtn = document.createElement(buttonAnchor);
    var h4TagAnchorBtn = document.createElement(h4Tag);


    img1.src = imgsUrl;
    var titleTextNode = document.createTextNode(titleText);
    title.appendChild(titleTextNode);
    var priceStrongTextNode = document.createTextNode(`${addPrice} PKR`);
    priceStrong.appendChild(priceStrongTextNode);


    img1.setAttribute('alt', `imgAds `);
    img1.setAttribute('id', 'FavImage')
    anchorbtn.innerHTML = "Remove From Fav";
    anchorbtn.setAttribute("class", "shopBtn")
    anchorbtn.setAttribute("onclick", `removeFav(${addKey})`)
    liEl.setAttribute("class", "span3");
    imageDiv.setAttribute("class", "thumbnail");
    imageDiv.setAttribute("id", "mainDivFav");
    textDiv.setAttribute("id", "captionFav")
    textDiv.setAttribute("class", "caption cntr");
    title.setAttribute("id", "favTittle")
    price.setAttribute("id", "favPrices");

    anchor.appendChild(img1);
    textDiv.appendChild(title);
    textDiv.appendChild(lineBreakTag)
    price.appendChild(priceStrong)
    textDiv.appendChild(price);
    h4TagAnchorBtn.appendChild(anchorbtn)
    textDiv.appendChild(h4TagAnchorBtn)
    imageDiv.appendChild(anchor);
    imageDiv.appendChild(textDiv)
    liEl.appendChild(imageDiv);
    return liEl;
}

// function removeFav(key) {
//     var currentUserUid = firebase.auth().currentUser.uid;
//     console.log("remove",key )
//     // firebase.database().ref(`/users/${currentUserUid}/fav-Ads/${key}`).remove();
// }

function justForHidden() {
    var currentUser = localStorage.getItem("currentUserUid")
    if (currentUser) {
        userAccountRef.style.display = 'block-inline';
        logOutRef.style.display = 'block-inline';
        registersRef.style.display = 'none';
        loginRef.style.display = 'none';
    }
    else {
        userAccountRef.style.display = 'none';
        logOutRef.style.display = 'none';
        registersRef.style.display = 'block-inline';
        loginRef.style.display = 'block-inline';
    }
}



if ("serviceWorker" in navigator) {
    console.log("Service Worker is supported");

    // if service worker supported then register my service worker
    navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(function (reg) {
            console.log("Successfully Register :^)", reg);

            reg.pushManager
                .subscribe({
                    userVisibleOnly: true
                })
                .then(function (subscription) {
                    console.log("subscription:", subscription.toJSON());
                    // GCM were used this endpoint
                    console.log("endpoint:", subscription.endpoint);
                });
        })
        .catch(function (error) {
            console.log("SW Registration Failed: :^(", error);
        });
}



// curl - H "Content-Type: application/json" - H "Authorization: key=<enter your server key>" - X POST - d 
// '{"notification": {"title": "Yo Yo PWA Singh", "body": "Push notification works!!"}, "to": "<enter device token>"}' 
// https://fcm.googleapis.com/fcm/send