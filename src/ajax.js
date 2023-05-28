/**
 * Creates a method ajax to send some recorded or picture files to some webservice
 * @version 1.0.0
 * @author Anderson Arruda < anderson@sysborg.com.br >
 * @license MIT
 */
class ajax{
    /**
     * Prepares environment to send to server
     * @param {*} progressBar 
     * @param {*} url 
     * @param {*} method 
     * @param {*} headers 
     */
    constructor(progressBar, url, method = 'POST', headers = {}){
        this._progressBar = progressBar;
        this._formData = new FormData();
        this._url = url;
        this._method = method;
        this._xhr = new XMLHttpRequest();

        var obj = this;
        if(this._progressBar !== null){
            this._xhr.upload.addEventListener('progress', (event) => {
                obj._progressBar.onProgress(event);
            });
        }

        this._setHeaders(headers);
    }

    /**
     * set all headers to xhr
     * @param {*} headers
     * @return void
     */
    _setHeaders(headers){
        for(let header in headers){
            if(!headers.hasOwnProperty(header))
                continue;

            this._xhr.setRequestHeader(header, headers[header]);
        }
    }

    /**
     * Add some file to formdata
     * @param {*} file
     * @param {string} name
     * @return void
     */
    addFile(file, name){
        this._formData.append(name, file, file.name);
    }

    /**
     * Send all files to server
     * @return void
     */
    send(){
        this._xhr.open(this._method, this._url);
        this._xhr.send(this._formData);
    }
}