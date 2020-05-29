(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/bundle.020529.js';
        document.head.appendChild(script);
    }
})();
