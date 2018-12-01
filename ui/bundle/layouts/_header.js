const dom = require('@fortawesome/fontawesome-svg-core').dom

module.exports = (title, uiModel) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="${uiModel.uiRootPath}/stylesheets/main.min.css">
  <style>
    ${dom.css()}
  </style>
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-42107476-2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-42107476-2');
  </script>
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://www.yuzutech.fr">
        <img src="${uiModel.uiRootPath}/images/logo_100.png" alt="Yuzu tech">
      </a>
      <a role="button" class="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <a class="navbar-item" href="https://www.yuzutech.fr/#metier">
          Notre métier
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#offres">
          Nos offres
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#clients">
          Nos clients
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#contact">
          Contact
        </a>
        <a class="navbar-item" href="${uiModel.siteRootPath}/">
          Blog
        </a>
      </div>
    </div>
  </nav>`
}
