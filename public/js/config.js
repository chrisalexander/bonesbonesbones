function Config() {

    var getParams = query => {
        if (!query) {
            return { };
        }

        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                let [ key, value ] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, { });
    };

    this.current = getParams(window.location.search);
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
var config = new Config();