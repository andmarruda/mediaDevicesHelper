/**
 * ProgressBar for upload
 * @version 1.0.0
 * @author  Anderson Arruda < anderson@sysborg.com.br >
 * @license MIT
 */
class progressBar
{
    /**
     * Configurates the progress bar to set information on html
     * @param {*} config
     * @param {string} config.percentageBox
     * @param {string} config.progressBarId
     * @param {string} config.sizeDisplay
     */
    constructor(config)
    {
        this._percentageBox = document.getElementById(config.percentageBox);
        this._progressBar = document.getElementById(config.progressBarId);
        this._sizeDisplay = document.getElementById(config.sizeDisplay);
        this._percentage = 0;
        this._loaded = 0;
        this._total = 0;
    }

    /**
     * OnProgress event
     * @param {int} loaded
     * @param {int} total
     * @return void
     */
    onProgress({loaded, total})
    {
        this._total = total;
        this._loaded = loaded;
        this._percentage = Math.round((loaded / total) * 100);

        if(this._percentageBox !== null){
            this._percentageBox.innerHTML = `${this._percentage}%`;
        }

        if(this._progressBar !== null){
            this._progressBar.style.width = `${this._percentage}%`;
        }

        if(this._sizeDisplay !== null){
            let loadedBeauty = this._loaded < 1024 ? `${this._loaded} B` : this._loaded > 1024 && this._loaded < 1048576 ? `${Math.round(this._loaded / 1024)} KB` : `${Math.round(this._loaded / 1048576)} MB`;
            let totalBeauty = this._loaded < 1024 ? `${this._loaded} B` : this._loaded > 1024 && this._loaded < 1048576 ? `${Math.round(this._loaded / 1024)} KB` : `${Math.round(this._loaded / 1048576)} MB`;
            this._sizeDisplay.innerHTML = `${loadedBeauty} / ${totalBeauty}`;
        }
    }
}