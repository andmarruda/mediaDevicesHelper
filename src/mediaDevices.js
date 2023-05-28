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
        this.allowedImageTypes = {
            jpg: 'image/jpeg',
            gif: 'image/gif',
            png: 'image/png',
            svg: 'image/svg+xml',
            webp: 'image/webp'
        };

        this.audio = Boolean(audio);
        this.video = Boolean(video);
        this.videoElement = document.getElementById(config.videoElementId);
        this.audioElement = document.getElementById(config.audioElementId);
        this.config = {};
        if(this.config.videoWidth !== undefined){
            this.config['video'] = {
                width: {...this.config.videoWidth}
            };
        }

        if(this.config.videoHeight !== undefined){
            this.config['video'] = {
                ...this.config.video,
                height: {...this.config.videoHeight}
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
        this.mediaDevices = await navigator.mediaDevices.getUserMedia({audio: this.audio, video: this.config.video || this.video});
        if(this.video && this.videoElement !== null){
            this.videoElement.srcObject = this.mediaDevices;
            this.videoElement.play();
        }

        if(this.audio && this.audioElement !== null){
            this.audioElement.srcObject = this.mediaDevices;
            this.audioElement.play();
        }
    }

    /**
     * Take picture from video on media stream
     * @return {string} base64
     */
    getPicture(type='png')
    {
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');
        this.canvas.width = this.videoElement.videoWidth;
        this.canvas.height = this.videoElement.videoHeight;
        context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
        return this.canvas.toDataURL(this.allowedImageTypes[type]);
    }

    /**
     * Returns last picture as Blob
     * @param {string} type
     * @param {number} quality - number betwwen 0 and 1 to quality of image
     * @return {Blob}
     */
    async getPictureBlob(type='png', quality=1)
    {
        const blob = await new Promise(resolve => this.canvas.toBlob(resolve, this.allowedImageTypes[type], quality));
        const file = new File([blob], 'picture.png', {type: this.allowedImageTypes[type], lastModified: Date.now()});
        return file;
    }
}