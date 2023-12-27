var http = require("http");

function startServer() {
  http
    .createServer(function (req, res) {
      res.writeHead(200, { "Content-Type": "text/html" });
      var htmlContent = `
            <!DOCTYPE html>
<html>
  <head>
    <link
      href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
      rel="stylesheet"
    />
    <title>Wick Studio</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background: url(https://media.discordapp.net/attachments/1182085199346008155/1189566491302055997/Server_Banner.png?ex=659ea120&is=658c2c20&hm=9d475c26895cf9f6ca0a27aaf96237d39a6ae66efc4dc87232348274825d27d9&=&format=webp&quality=lossless&width=840&height=473)
          no-repeat;
        object-fit: cover;
        background-position: center;
        background-size: cover;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        transition: background-color 0.3s;
        overflow: hidden;
      }
      .container {
        text-align: center;
        background: rgba(11, 10, 10, 0.632);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(3.5px);
        -webkit-backdrop-filter: blur(3.5px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 50px;
        border-radius: 15px;
        max-width: 600px;
        animation: fadeIn 1s ease-in-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      h1 {
        color: #e4b444;
        margin-bottom: 20px;
      }
      p {
        color: #adb5bd;
        line-height: 1.6;
      }
      .main {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        align-items: center;
      }

      .up {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
      }

      .down {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
      }

      .card1 {
        width: 90px;
        height: 90px;
        outline: none;
        border: none;
        background: white;
        border-radius: 90px 5px 5px 5px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
          rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        transition: 0.2s ease-in-out;
      }

      .youtube {
        margin-top: 0.5em;
        margin-left: 0.5em;
        color: #ff0000;
        font-size: 2rem;
      }

      .card2 {
        width: 90px;
        height: 90px;
        outline: none;
        border: none;
        background: white;
        border-radius: 5px 90px 5px 5px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
          rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        transition: 0.2s ease-in-out;
      }

      .twitter {
        margin-top: 1em;
        fill: #03a9f4;
        font-size: 1.5rem;
      }

      .card3 {
        width: 90px;
        height: 90px;
        outline: none;
        border: none;
        background: white;
        border-radius: 5px 5px 5px 90px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
          rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        transition: 0.2s ease-in-out;
      }

      .github {
        margin-top: -0.6em;
        margin-left: 1.2em;
      }

      .card4 {
        width: 90px;
        height: 90px;
        outline: none;
        border: none;
        background: white;
        border-radius: 5px 5px 90px 5px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
          rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        transition: 0.2s ease-in-out;
      }

      .discord {
        margin-left: -0.5em;
        color: #8c9eff;
        font-size: 2rem;
      }

      .card1:hover {
        cursor: pointer;
        scale: 1.1;
        background-color: #ff0000;
      }

      .card1:hover .youtube {
        color: white;
      }

      .card2:hover {
        cursor: pointer;
        scale: 1.1;
        background-color: #03a9f4;
      }

      .card2:hover .twitter {
        color: white;
      }

      .card3:hover {
        cursor: pointer;
        scale: 1.1;
        background-color: black;
      }

      .card3:hover .github {
        fill: white;
      }

      .card4:hover {
        cursor: pointer;
        scale: 1.1;
        background-color: #8c9eff;
      }

      .card4:hover .discord {
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Wick Studio!</h1>
      <p>You can reach us through the links provided in the buttons below</p>
      <div class="main">
        <div class="up">
          <a href="https://www.youtube.com/@wick_studio">
            <button class="card1">
              <i class="bx bxl-youtube youtube"></i>
            </button>
          </a>
          <button class="card2" onclick="copyLink()">
            <i class="bx bxs-copy twitter"></i>
          </button>
        </div>
        <div class="down">
          <a href="https://github.com/wickstudio">
            <button class="card3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="30px"
                height="30px"
                class="github"
              >
                <path
                  d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
                ></path>
              </svg>
            </button>
          </a>
          <a href="https://discord.gg/wicks">
            <button class="card4">
              <i class="bx bxl-discord-alt discord"></i>
            </button>
          </a>
        </div>
      </div>
    </div>
    <script>
      function copyLink() {
        const el = document.createElement("textarea");
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        alert("Link copied to clipboard!");
      }
    </script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"
      integrity="sha512-wC/cunGGDjXSl9OHUH0RuqSyW4YNLlsPwhcLxwWW1CR4OeC2E1xpcdZz2DeQkEmums41laI+eGMw95IJ15SS3g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <script>
      VanillaTilt.init(document.querySelectorAll(".container"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      });
    </script>
  </body>
</html>
        `;

      res.write(htmlContent);
      res.end();
    })
    .listen(5000, () =>
      console.log("HTTP server running on http://localhost:5000"),
    );
}

module.exports = { startServer };
