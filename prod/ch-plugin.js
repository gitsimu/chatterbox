(function() {
    if (!document.getElementById('chatterbox-root')) {
        var node = document.createElement('div');
        node.id = 'chatterbox-root';
        document.body.appendChild(node);

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/bundle.js';
        document.head.appendChild(script);
    }
})();
