
var currentPage;
var pageLength;
var noOfPages;
var allUsers;
var numberofusers;
var supportInfo;
var delayInMilliseconds = 300;
var selectedUser;
var fetchedData;

document.addEventListener("DOMContentLoaded", function (event) {
    fetch('https://reqres.in/api/users?page=1').then(response => response.json())
        .then(json => {
            fetchedData = json;
            var api_page = fetchedData.page;
            var api_per_page = fetchedData.per_page;
            var api_total = fetchedData.total;
            var api_total_pages = fetchedData.total_pages;
            var api_allUsers = fetchedData.data;
            var api_support = fetchedData.support;

            currentPage = api_page;
            pageLength = api_per_page;
            //pageLength = 3;

            noOfPages = api_total_pages;
            numberofusers = api_total;
            allUsers = api_allUsers;
            supportInfo = api_support;

            var listContent = document.getElementById("list-content");
            var infoContent = document.getElementById("info-content");
            var addContent = document.getElementById('add-content');
            listContent.style = "display:block";
            infoContent.style = "display:none";
            addContent.style = "display:none";

            loading();

            refreshList();

        })

});

function refreshList() {
    cleanContent();
    refreshPagination();

    var contents = document.getElementById('contents');
    for (var i = ((currentPage * pageLength) - pageLength); i < (currentPage * pageLength); i++) {
        try {
            var user = allUsers[i];
            var userfullname = user.first_name + " " + user.last_name;
            var userimage = user.avatar;
            var userID = user.id;

            var card = document.createElement("div");
            card.classList.add("card");
            card.id = "userID:" + JSON.stringify(userID);
            card.onclick = function () {
                selectedUser = this.id;
                detailsLoader();
                loading();
                var listContent = document.getElementById("list-content");
                var infoContent = document.getElementById("info-content");
                listContent.style = "display:none";
                infoContent.style = "display:block";
            }

            var img = document.createElement('img');
            img.setAttribute("src", userimage);

            var container = document.createElement('div');
            container.classList.add("container");

            var h4 = document.createElement('h4');
            var b = document.createElement('b');
            b.innerText = userfullname;

            h4.appendChild(b);
            container.appendChild(h4);
            card.appendChild(img);
            card.appendChild(container);
            contents.appendChild(card);
        } catch (err) {
        }
    }

}

function cleanContent() {
    var contents = document.getElementById('contents');
    while (contents.lastChild) {
        contents.removeChild(contents.lastChild);
    }
    var pagination = document.getElementById('paginations');
    while (pagination.lastChild) {
        pagination.removeChild(pagination.lastChild);
    }
}

function refreshPagination() {
    var pagination = document.getElementById('paginations');
    for (var j = 0; j <= noOfPages + 1; j++) {
        var a = document.createElement('a');
        if (j == 0) {
            a.innerText = '\u00ab'
            a.onclick = function () {
                if (currentPage != 1) {
                    currentPage--;
                    loading();
                    refreshList();

                }
            }
        }
        else if (j == currentPage) {
            a.classList.add('active');
            a.innerText = j;
        } else if (j == (noOfPages + 1)) {
            a.innerText = '\u00bb'
            a.onclick = function () {
                if (currentPage != noOfPages) {
                    currentPage++;
                    loading();

                    refreshList();

                }
            }
        }
        else {
            a.innerText = j;
            a.onclick = function () {
                currentPage = this.innerText;
                loading();
                refreshList();

            }
        }
        pagination.appendChild(a);

    }

}

function returnBack() {
    var listContent = document.getElementById("list-content");
    var infoContent = document.getElementById("info-content");
    var addContent = document.getElementById('add-content');
    listContent.style = "display:block";
    infoContent.style = "display:none";
    addContent.style = "display:none";
}

function detailsLoader() {
    var user = selectedUser;
    var id = user.split(":")[1];

    fetch('https://reqres.in/api/users/' + id).then(response => response.json())
        .then(json => {
            var user = json['data'];
            var userfullname = user.first_name + " " + user.last_name;
            var userimage = user.avatar;
            var userID = user.id;
            var usermail = user.email;

            var details = document.getElementById('details');
            while (details.lastChild) {
                details.removeChild(details.lastChild);
            }

            var card = document.createElement('div');
            card.classList.add('card');
            var img = document.createElement('img');
            img.setAttribute("src", userimage);
            img.style = "width:100%";

            var container = document.createElement('div');
            container.classList.add('container');

            var h4 = document.createElement('h4');
            var b = document.createElement('b');
            b.innerText = userfullname;
            var p = document.createElement('p');
            p.innerText = usermail;

            h4.appendChild(b);
            container.appendChild(h4);
            container.appendChild(p);
            card.appendChild(img);
            card.appendChild(container);
            details.appendChild(card);


        })
}

function loading() {
    document.getElementById("loader").style = ' style="z-index: 9999;background-color: black;width: 100%; height: 100%;position: absolute; top: 0; left: 0;"';
    setTimeout(function () {
        document.getElementById("loader").style = "display:none";
    }, delayInMilliseconds);
}

function addUserForm() {
    loading();
    var listContent = document.getElementById("list-content");
    var infoContent = document.getElementById("info-content");
    var addContent = document.getElementById('add-content');
    listContent.style = "display:none";
    infoContent.style = "display:none";
    addContent.style = "display:block";


}

function submitButton() {
    loading();
    var namex = document.getElementById("nametxt").value;
    var jobx = document.getElementById("jobtxt").value;

    var myObj = { name: namex, job: jobx };
    var myJSON = JSON.stringify(myObj);

    if (namex != "" && jobx != "") {
        fetch('https://reqres.in/api/users', {
            method: 'post',
            body: myJSON
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            document.getElementById("jobtxt").value = "";
            document.getElementById("nametxt").value= "";
            alert("User Added !");
            console.log(data);
        });
    }

}