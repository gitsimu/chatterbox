(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var style = document.createElement('link');
        style.rel  = 'stylesheet';
        style.type = 'text/css';
        // style.href = 'https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/chatterbox.200618.css';
        style.href = './style.css'
        style.media = 'all';
        document.head.appendChild(style);

        var script = document.createElement('script');
        // script.src = 'https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/bundle.200618.js';
        script.src = './bundle.ef4f4abeb19587e4cfa5.js';
        document.head.appendChild(script);
    }
})();
