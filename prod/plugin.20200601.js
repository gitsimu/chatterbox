(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var style = document.createElement('link');
        style.rel  = 'stylesheet';
        style.type = 'text/css';
        style.href = 'https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/chatterbox.20200601.css';
        style.media = 'all';
        document.head.appendChild(style);

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/bundle.20200601.js';
        document.head.appendChild(script);
    }
})();
