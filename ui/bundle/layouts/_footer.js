module.exports = (uiModel) => {
  let disqusHTML = ''
  if (uiModel.enableDisqus) {
    disqusHTML = `<section class="section">
    <div class="container">
      <div id="disqus_thread"></div>
    </div>
  </section>
  <script>
    var disqus_config = function () {
      this.page.url = '${uiModel.page.canonicalUrl}';
      this.page.identifier = '${uiModel.page.url}';
    };
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://blog-yuzutech.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  </script>
  <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>`
  }
  return `${disqusHTML}
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="content has-text-centered">
            <h3 id="contact">Contact</h3>
            <p>
              <strong>Yuzu tech</strong><br/>
              69100 Villeurbanne<br/>
              <br/>
              <a href="tel:+33673910445">06 73 91 04 45</a><br/>
              <a href="mailto:info@yuzutech.fr">info@yuzutech.fr</a>
            </p>
          </div>
        </div>
        <div class="column">
          <div class="content has-text-centered">
            <h3>Social</h3>
            <div class="social-link">
              <a href="https://twitter.com/yuzutechfr" class="social-twitter">
                <i class="fab fa-twitter-square"></i> Twitter
              </a>
            </div>
            <div class="social-link">
              <a href="https://google.com/+YuzutechFr" class="social-google-plus">
                <i class="fab fa-google-plus-square"></i> Google +
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <script async defer src="${uiModel.uiRootPath}/javascripts/main.js"></script>`
}
