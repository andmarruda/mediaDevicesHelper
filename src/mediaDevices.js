/**
 * This project is a helper to developers that needs to access camera and microphone, make pictore or record and send it with ajax to a server
 * @version 1.0.0
 * @author Anderson Arruda < anderson@sysborg.com.br >
 * @license MIT
 */
class mediaDevices
{
    /**
     * receives initial configuration and start media devices
     * @param {boolean} audio
     * @param {boolean} video
     * @param {object} config
     * @param {string} config.videoElementId
     * @param {string} config.audioElementId
     * @param {string} config.videoWidth
     * @param {string} config.videoWidth.min
     * @param {string} config.videoWidth.max
     * @param {string} config.videoWidth.ideal
     * @param {string} config.videoHeight
     * @param {string} config.videoHeight.min
     * @param {string} config.videoHeight.max
     * @param {string} config.videoHeight.ideal
     * @return void
     */
    constructor(audio, video, config)
    {
        this._allowedImageTypes = {
            jpg: 'image/jpeg',
            gif: 'image/gif',
            png: 'image/png',
            svg: 'image/svg+xml',
            webp: 'image/webp'
        };

        this._audio = Boolean(audio);
        this._video = Boolean(video);
        this._videoElement = document.getElementById(config.videoElementId);
        this._audioElement = document.getElementById(config.audioElementId);
        this._config = {};
        if(this._config.videoWidth !== undefined){
            this._config['video'] = {
                width: {...this._config.videoWidth}
            };
        }

        if(this._config.videoHeight !== undefined){
            this._config['video'] = {
                height: {...this._config.videoHeight}
            };
        }

        this.start();
    }

    /**
     * Start media devices with his configurations
     * @return void
     */
    async start()
    {
        this._mediaDevices = await navigator.mediaDevices.getUserMedia({audio: this._audio, video: this._config.video || this._video});
        if(this._video && this._videoElement !== null){
            this._videoElement.srcObject = this._mediaDevices;
            this._videoElement.play();
        }

        if(this._audio && this._audioElement !== null){
            this._audioElement.srcObject = this._mediaDevices;
            this._audioElement.play();
        }
    }

    /**
     * Take picture from video on media stream
     * @return {string} base64
     */
    getPicture(type='png')
    {
        this._canvas = document.createElement('canvas');
        let context = this._canvas.getContext('2d');
        this._canvas.width = this._videoElement.videoWidth;
        this._canvas.height = this._videoElement.videoHeight;
        context.drawImage(this._videoElement, 0, 0, this._canvas.width, this._canvas.height);
        return this._canvas.toDataURL(this._allowedImageTypes[type]);
    }

    /**
     * Returns last picture as Blob
     * @param {string} type
     * @param {number} quality - number betwwen 0 and 1 to quality of image
     * @return {Blob}
     */
    async getPictureBlob(type='png', quality=1)
    {
        const blob = await new Promise(resolve => this._canvas.toBlob(resolve, this._allowedImageTypes[type], quality));
        const file = new File([blob], `picture.${type}`, {type: this._allowedImageTypes[type], lastModified: Date.now()});
        return file;
    }

    /**
     * Returns the video recorder
     * @return instanceof videoRecorder
     */
    getRecorder()
    {
        return new recorder(this._mediaDevices);
    }
}