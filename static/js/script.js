// Deklarasi
const customAlert = new CustomAlert();

$(document).ready(function () {
  // alert("Hello!")
  cekTheme();
  listing();
  bsCustomFileInput.init();
  // Theme Toggle
  $("#theme-toggle").click(function () {
    // Get the current theme state
    const isDarkThemeEnabled = $("body").hasClass("dark");

    // Toggle the theme state
    $("body").toggleClass("dark");

    // Update the local storage preference
    localStorage.setItem("pref-theme", isDarkThemeEnabled ? "dark" : "light");
  });


  // Initialize tooltips
  $('[data-bs-toggle="tooltip"]').tooltip();
});

// Function API
const listing = () => {
  $.ajax({
    type: "GET",
    url: "/diary",
    success: function (response) {
      const id = $("#cards-box");
      const { articles } = response;
      console.log(articles);
      articles.forEach((element) => {
        const { img, profile, author,title, description } = element;
        const temp_html = `
        <div class="col">
        <div class="card h-100" title="${author}">
        <div class="pt-2 px-2 ">
        <img src="../${img}" class="card-img-top img-frame" alt="${author}">
        </div>
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
          </div>
          <div class="card-footer">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
          <small class="text-time">Last updated 3 mins ago</small>
          <img src="../${profile}" class="image" alt="adam">
          </div>
          </div>
        </div>
      </div>

        `;
        id.append(temp_html);
      });
    },
  });
};

function posting() {
  const getTitle = $("#img-title").val();
  const getProfile = $("#images-profile").prop("files")[0];
  const getAuthors = $("#author").val();
  const getfile = $("#images").prop("files")[0];
  const getDescription = $("#img-description").val();
  if (!getTitle || !getDescription || !getProfile || !getfile || !getAuthors)
    return customAlert.alert("Your data is not complete", "Hi There");


  let form_data = new FormData();
  form_data.append("file_give", getfile);
  form_data.append("profile_give", getProfile);
  form_data.append("author_give", getAuthors);
  form_data.append("title_give", getTitle);
  form_data.append("description_give", getDescription);

  $.ajax({
    type: "POST",
    url: "/diary",
    data: form_data,
    contentType: false,
    processData: false,
    success: function (response) {
      console.log(response);
      window.location.reload();
    },
  });
}

// Komponents
const cekTheme = () => {
  // Get the preferred theme from local storage
  const prefTheme = localStorage.getItem("pref-theme");

  // Apply the preferred theme
  if (prefTheme === "dark") {
    $("body").addClass("dark");
  } else if (prefTheme === "light") {
    $("body").removeClass("dark");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    $("body").addClass("dark");
  }

};

function CustomAlert() {
  this.alert = function (message, title) {
    $("#content-alert").html(`
      <div id="dialogoverlay"></div>
      <div id="dialogbox" class="slit-in-vertical">
        <div>
          <div id="dialogboxhead"></div>
          <div id="dialogboxbody"></div>
          <div id="dialogboxfoot">
            <button id="btn-ok" class="pure-material-button-contained active">OK</button>
          </div>
        </div>
      </div>
    `);

    let dialogoverlay = $("#dialogoverlay");
    let dialogbox = $("#dialogbox");

    let winH = window.innerHeight;
    dialogoverlay.css("height", winH + "px");

    dialogbox.css("top", "100px");

    dialogoverlay.css("display", "block");
    dialogbox.css("display", "block");

    $("#dialogboxhead").css("display", "block");

    if (!title) {
      $("#dialogboxhead").css("display", "none");
    } else {
      $("#dialogboxhead").html(
        '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title
      );
    }
    $("#dialogboxbody").html(message);
    $("#dialogboxfoot").html(
      '<button class="pure-material-button-contained active" id="btn-ok">OK</button>'
    );

    // Add an event listener to the "OK" button with ID "btn-ok"
    $("#btn-ok").click(
      function () {
        this.ok(); // Call the ok function when the "OK" button is clicked
      }.bind(this)
    );
  };

  this.ok = function () {
    $("#dialogbox, #dialogoverlay").remove();
  };
}
