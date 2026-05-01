var scene = world.children[0].scenes.asArray().find(
            s => s.globalVariables.names(true).includes('__module__geometryBlocks__')),
    moduleUrl, baseUrl;

if (scene) {
    moduleUrl = scene.globalVariables.getVar('__module__geometryBlocks__');
    baseUrl = moduleUrl.substring(0, moduleUrl.lastIndexOf('/') + 1);

    function loadSrc (url) {
        var url = baseUrl + url;
        return new Promise((resolve, reject) => {
            if (contains(SnapExtensions.scripts, url)) {
                reject();
            }
            scriptElement = document.createElement('script');
            scriptElement.onload = () => {
                SnapExtensions.scripts.push(url);
                resolve();
            };
            document.head.appendChild(scriptElement);
            scriptElement.src = url;
        });
    };

	loadSrc('embroidGeometry.js')
		.then(()=> loadSrc('font.js'));
}
